import { env } from '@/env'
import { db } from '@/lib/db/drizzle/query'
import {
  coupons,
  customers,
  prices,
  products,
  promotionCodes,
  subscriptions,
  users,
} from '@/lib/db/drizzle/schema'
import {
  Coupon,
  Price,
  Product,
  PromotionCode,
  Subscription,
  User,
} from '@/lib/db/drizzle/types'
import { stripe } from '@/lib/stripe/config'
import { eq } from 'drizzle-orm'
import { Stripe } from 'stripe'

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
const upsertCouponRecord = async (coupon: Stripe.Coupon) => {
  try {
    const couponData: Coupon = {
      id: coupon.id,
      amount_off: coupon.amount_off,
      created: coupon.created,
      currency: coupon.currency,
      deleted: coupon.deleted || false,
      duration: coupon.duration,
      duration_in_months: coupon.duration_in_months,
      livemode: coupon.livemode,
      max_redemptions: coupon.max_redemptions,
      name: coupon.name,
      percent_off: coupon.percent_off,
      redeem_by: coupon.redeem_by,
      times_redeemed: coupon.times_redeemed,
      valid: coupon.valid,
      metadata: coupon.metadata,
    }

    const foundCoupon = await db.query.coupons.findFirst({
      where: (coupons, { eq }) => eq(coupons.id, coupon.id),
    })

    if (foundCoupon) {
      await db.update(coupons).set(couponData).where(eq(coupons.id, coupon.id))
    } else {
      await db.insert(coupons).values([couponData])
    }

    console.log(`Coupon inserted/updated: ${coupon.id}`)
  } catch (error) {
    if (error instanceof Error)
      throw new Error(`Coupon insert/update failed: ${error.message}`)
  }
}
const upsertPromotionCodeRecord = async (
  promotionCode: Stripe.PromotionCode,
) => {
  try {
    const promotionCodeData: PromotionCode = {
      id: promotionCode.id,
      created: promotionCode.created,
      livemode: promotionCode.livemode,
      max_redemptions: promotionCode.max_redemptions,
      times_redeemed: promotionCode.times_redeemed,
      metadata: promotionCode.metadata,
      active: promotionCode.active,
      code: promotionCode.code,
      coupon: promotionCode.coupon.id,
      expires_at: promotionCode.expires_at,
    }

    const foundPromotionCode = await db.query.promotionCodes.findFirst({
      where: (promotionCodes, { eq }) =>
        eq(promotionCodes.id, promotionCode.id),
    })

    if (foundPromotionCode) {
      await db
        .update(promotionCodes)
        .set(promotionCodeData)
        .where(eq(promotionCodes.id, promotionCode.id))
    } else {
      await db.insert(promotionCodes).values([promotionCodeData])
    }

    console.log(`Promotion code inserted/updated: ${promotionCode.id}`)
  } catch (error) {
    if (error instanceof Error)
      throw new Error(`Promotion code insert/update failed: ${error.message}`)
  }
}

const deletePromotionCodeRecord = async (couponId: string) => {
  try {
    await db.delete(promotionCodes).where(eq(promotionCodes.coupon, couponId))

    console.log(`Promotion code deleted: ${couponId}`)
  } catch (error) {
    if (error instanceof Error)
      throw new Error(`Promotion code deletion failed: ${error.message}`)
  }
}
const deleteCouponRecord = async (coupon: Stripe.Coupon) => {
  try {
    await db.delete(coupons).where(eq(coupons.id, coupon.id))

    console.log(`Coupon deleted: ${coupon.id}`)
  } catch (error) {
    if (error instanceof Error)
      throw new Error(`Coupon deletion failed: ${error.message}`)
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
      trialPeriodDays:
        price.recurring?.trial_period_days ??
        env.NEXT_PUBLIC_TRIAL_PERIOD_DAYS ??
        0,
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
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['default_payment_method'],
    })
    const { id: uuid } = customer || {}

    const subscriptionData: Omit<Subscription, 'userId' | 'priceId'> & {
      userId?: string
      priceId?: string
    } = {
      id: subscription.id,
      userId: uuid,
      coupons: subscription.discount?.coupon.id
        ? [subscription.discount.coupon.id]
        : [],
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

    const existingSubscription = await db.query.subscriptions.findFirst({
      where: (subscriptions, { eq }) => eq(subscriptions.id, subscription.id),
    })

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
      const { ...updateSubscriptionData } = subscriptionData

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
  manageSubscriptionStatusChange,
  deletePriceRecord,
  deleteCouponRecord,
  deletePromotionCodeRecord,
  deleteProductRecord,
  upsertCouponRecord,
  upsertPriceRecord,
  upsertProductRecord,
  upsertPromotionCodeRecord,
}
