import { env } from '@/env'
import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>

export const getStripe = (key?: string) => {
  if (!stripePromise) {
    stripePromise = loadStripe(key || env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  }

  return stripePromise
}
