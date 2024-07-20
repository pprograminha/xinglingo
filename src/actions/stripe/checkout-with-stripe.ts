'use server'

import { env } from '@/env'
import { Price, User } from '@/lib/db/drizzle/types'
import { stripe } from '@/lib/stripe/config'
import { cookies } from 'next/headers'
import Stripe from 'stripe'
import { createOrRetrieveCustomer } from './stripe-records'
import { getCurrency, Locale, stripeLocales } from '@/lib/intl/locales'
import { db } from '@/lib/db/drizzle/query'

type CheckoutResponse = {
  error?: {
    message: string
  }
  sessionId?: string
}
const calculateTrialEndUnixTimestamp = (
  trialPeriodDays: number | null | undefined,
) => {
  // Check if trialPeriodDays is null, undefined, or less than 2 days
  if (
    trialPeriodDays === null ||
    trialPeriodDays === undefined ||
    trialPeriodDays < 2
  ) {
    return undefined
  }

  const currentDate = new Date() // Current date and time
  const trialEnd = new Date(
    currentDate.getTime() + (trialPeriodDays + 1) * 24 * 60 * 60 * 1000,
  ) // Add trial days
  return Math.floor(trialEnd.getTime() / 1000) // Convert to Unix timestamp in seconds
}
export async function checkoutWithStripe(
  user: User,
  price: Price,
  couponCode: string,
): Promise<CheckoutResponse> {
  try {
    let customerId: string = ''
    try {
      customerId = await createOrRetrieveCustomer(user)
    } catch (err) {
      console.error(err)
      throw new Error('Unable to access customer record.')
    }

    const locale = (cookies().get('NEXT_LOCALE')?.value || 'en') as Locale

    let promotionCode = await db.query.promotionCodes.findFirst({
      where: (tablePromotionCodes, { eq }) =>
        eq(tablePromotionCodes.code, couponCode),
    })

    if (!promotionCode)
      promotionCode = await db.query.promotionCodes.findFirst({
        where: (tablePromotionCodes, { eq }) =>
          eq(tablePromotionCodes.code, env.NEXT_PUBLIC_COUPON),
      })

    let params: Stripe.Checkout.SessionCreateParams = {
      // allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer: customerId,
      metadata: {
        coupon_code: couponCode,
      },

      locale: stripeLocales[locale],
      customer_update: {
        address: 'auto',
        name: 'auto',
      },

      ...(promotionCode && promotionCode.coupon
        ? {
            discounts: [
              {
                coupon: promotionCode.coupon,
              },
            ],
          }
        : {}),

      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],

      currency: getCurrency(locale),
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/${locale}/subscriptions`,
      success_url: `${env.NEXT_PUBLIC_APP_URL}/${locale}/subscriptions`,
    }

    params = {
      ...params,
      mode: 'subscription',
      subscription_data: {
        // trial_settings: {
        //   end_behavior: {
        //     missing_payment_method: 'cancel',
        //   },
        // },
        // NEXT_PUBLIC_TRIAL_PERIOD_DAYS: 7,
        trial_end: calculateTrialEndUnixTimestamp(
          env.NEXT_PUBLIC_TRIAL_PERIOD_DAYS ?? price.trialPeriodDays,
        ),
      },
      // payment_method_collection: 'if_required',
    }

    let session: Stripe.Response<Stripe.Checkout.Session>

    try {
      session = await stripe.checkout.sessions.create(params)
    } catch (err) {
      console.error(err)
      throw new Error('Unable to create checkout session.')
    }

    if (session) {
      return { sessionId: session.id }
    } else {
      throw new Error('Unable to create checkout session.')
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: {
          message: error.message || 'An unknown error occurred.',
        },
      }
    } else {
      return {
        error: {
          message: 'An unknown error occurred.',
        },
      }
    }
  }
}
