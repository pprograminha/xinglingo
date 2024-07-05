import { db } from '@/lib/db/drizzle/query'
import {
  customers,
  prices,
  products,
  subscriptions,
  users,
} from '@/lib/db/drizzle/schema'
import { Price, Product, Subscription, User } from '@/lib/db/drizzle/types'
import { stripe } from '@/lib/stripe/config'
import { eq } from 'drizzle-orm'
import { Stripe } from 'stripe'

const TRIAL_PERIOD_DAYS = 0

const upsertProductRecord = async (product: Stripe.Product) => {
  try {
    const productData: Product = {
      id: product.id,
      active: product.active,
      name: product.name,
      description: product.description ?? null,
      image: product.images?.[0] ?? null,
      metadata: product.metadata,
    }

    const foundProduct = await db.query.products.findFirst({
      where: (products, { eq }) => eq(products.id, product.id),
    })

    if (foundProduct) {
      await db
        .update(products)
        .set(productData)
        .where(eq(products.id, product.id))
    } else {
      await db.insert(products).values([productData])
    }

    console.log(`Product inserted/updated: ${product.id}`)
  } catch (error) {
    if (error instanceof Error)
      throw new Error(`Product insert/update failed: ${error.message}`)
  }
}

const upsertPriceRecord = async (
  price: Stripe.Price,
  retryCount = 0,
  maxRetries = 3,
) => {
  try {
    const priceData: Omit<Price, 'description' | 'metadata'> = {
      id: price.id,
      productId: typeof price.product === 'string' ? price.product : '',
      active: price.active,
      currency: price.currency,
      type: price.type,
      unitAmount: price.unit_amount !== null ? BigInt(price.unit_amount) : null,
      intervalVariant: price.recurring?.interval ?? null,
      intervalCount: price.recurring?.interval_count ?? null,
      trialPeriodDays: price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS,
    }

    const foundPrice = await db.query.prices.findFirst({
      where: (prices, { eq }) => eq(prices.id, price.id),
    })

    if (foundPrice) {
      await db.update(prices).set(priceData).where(eq(prices.id, price.id))
    } else {
      await db.insert(prices).values([priceData])
    }

    console.log(`Price inserted/updated: ${price.id}`)
  } catch (error) {
    if (!(error instanceof Error)) return

    if (error.message.toLowerCase().includes('foreign key constraint')) {
      if (retryCount < maxRetries) {
        console.log(`Retry attempt ${retryCount + 1} for price ID: ${price.id}`)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        await upsertPriceRecord(price, retryCount + 1, maxRetries)
      } else {
        throw new Error(
          `Price insert/update failed after ${maxRetries} retries: ${error.message}`,
        )
      }
    }

    throw new Error(`Price insert/update failed: ${error.message}`)
  }
}

const deleteProductRecord = async (product: Stripe.Product) => {
  try {
    await db.delete(products).where(eq(products.id, product.id))

    console.log(`Product deleted: ${product.id}`)
  } catch (error) {
    if (error instanceof Error)
      throw new Error(`Product deletion failed: ${error.message}`)
  }
}

const deletePriceRecord = async (price: Stripe.Price) => {
  try {
    await db.delete(prices).where(eq(prices.id, price.id))

    console.log(`Price deleted: ${price.id}`)
  } catch (error) {
    if (error instanceof Error)
      throw new Error(`Price deletion failed: ${error.message}`)
  }
}

const upsertCustomerToDatabase = async (
  user: User,
  stripeCustomerId: string,
) => {
  try {
    const dbUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, user.id),
      with: {
        customer: true,
      },
    })

    if (!dbUser) {
      throw new Error('User does not exist')
    }

    if (dbUser.customer) {
      await db
        .update(customers)
        .set({
          stripeCustomerId,
        })
        .where(eq(customers.id, user.id))
    } else {
      await db.insert(customers).values([
        {
          id: user.id,
          stripeCustomerId,
        },
      ])
    }
  } catch (error) {
    if (error instanceof Error)
      throw new Error(
        `Database customer record creation failed: ${error.message}`,
      )
  }
}

const createCustomerInStripe = async (user: User) => {
  const customerData = { metadata: { userId: user.id }, email: user.email }
  const newCustomer = await stripe.customers.create(customerData)

  if (!newCustomer) throw new Error('Stripe customer creation failed.')

  return newCustomer.id
}

const createOrRetrieveCustomer = async (user: User) => {
  const userStripeCustomerId = (
    await db.query.customers.findFirst({
      where: (customers, { eq }) => eq(customers.id, user.id),
    })
  )?.stripeCustomerId

  let stripeCustomerId: string | undefined

  if (userStripeCustomerId) {
    const existingStripeCustomer =
      await stripe.customers.retrieve(userStripeCustomerId)
    stripeCustomerId = existingStripeCustomer.id
  } else {
    const stripeCustomers = await stripe.customers.list({
      email: user.email,
    })
    stripeCustomerId =
      stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined
  }

  const stripeIdToInsert =
    stripeCustomerId || (await createCustomerInStripe(user))
  if (!stripeIdToInsert) throw new Error('Stripe customer creation failed.')

  await upsertCustomerToDatabase(user, stripeIdToInsert)

  return stripeIdToInsert
}

const copyBillingDetailsToCustomer = async (
  uuid: string,
  paymentMethod: Stripe.PaymentMethod,
) => {
  try {
    const customer = paymentMethod.customer as string
    const { name, phone, address } = paymentMethod.billing_details

    if (!name || !phone || !address) return

    await stripe.customers.update(customer, {
      name,
      phone,
      address: {
        city: address.city || undefined,
        country: address.country || undefined,
        line1: address.line1 || undefined,
        line2: address.line2 || undefined,
        postal_code: address.postal_code || undefined,
        state: address.state || undefined,
      },
    })

    await db
      .update(users)
      .set({
        billingAddress: { ...address },
        paymentMethod: { ...paymentMethod[paymentMethod.type] },
      })
      .where(eq(users.id, uuid))
  } catch (error) {
    if (error instanceof Error)
      throw new Error(`Customer update failed: ${error.message}`)
  }
}

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false,
) => {
  try {
    const customer = await db.query.customers.findFirst({
      where: (customers, { eq }) => eq(customers.stripeCustomerId, customerId),
    })

    if (!customer) throw new Error(`Customer lookup failed`)

    const { id: uuid } = customer!

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['default_payment_method'],
    })
    const existingSubscription = await db.query.subscriptions.findFirst({
      where: (subscriptions, { eq }) => eq(subscriptions.id, subscription.id),
    })
    const subscriptionData: Omit<Subscription, 'userId' | 'priceId'> & {
      userId?: string
      priceId?: string
    } = {
      id: subscription.id,
      userId: uuid,
      metadata: subscription.metadata,
      status: subscription.status,
      priceId: subscription.items.data[0]?.price.id,
      quantity: 1, // subscription.quantity
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      cancelAt: subscription.cancel_at
        ? new Date(subscription.cancel_at)
        : null,
      canceledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at)
        : null,
      currentPeriodStart: new Date(subscription.current_period_start),
      currentPeriodEnd: new Date(subscription.current_period_end),
      created: new Date(subscription.created),
      endedAt: subscription.ended_at ? new Date(subscription.ended_at) : null,
      trialStart: subscription.trial_start
        ? new Date(subscription.trial_start)
        : null,
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end)
        : null,
    }

    if (subscriptionData.priceId) {
      const existingPrice = await db.query.prices.findFirst({
        where: (prices, { eq }) => eq(prices.id, subscriptionData.priceId!),
      })

      if (!existingPrice) {
        subscriptionData.priceId = undefined
      }
    }

    if (subscriptionData.userId) {
      const existingUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, subscriptionData.userId!),
      })

      if (!existingUser) {
        subscriptionData.userId = undefined
      }
    }

    if (existingSubscription) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _, ...updateSubscriptionData } = subscriptionData
      await db
        .update(subscriptions)
        .set(updateSubscriptionData)
        .where(eq(subscriptions.id, existingSubscription.id))
    } else {
      await db.insert(subscriptions).values([subscriptionData])
    }
    console.log(
      `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`,
    )

    if (createAction && subscription.default_payment_method && uuid)
      await copyBillingDetailsToCustomer(
        uuid,
        subscription.default_payment_method as Stripe.PaymentMethod,
      )
  } catch (error) {
    if (error instanceof Error)
      throw new Error(`Subscription insert/update failed: ${error.message}`)
  }
}

export {
  createOrRetrieveCustomer,
  deletePriceRecord,
  deleteProductRecord,
  manageSubscriptionStatusChange,
  upsertPriceRecord,
  upsertProductRecord,
}
