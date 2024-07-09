'use server'
import { stripe } from '@/lib/stripe/config'

export const cancelSubscription = async (subscriptionId: string) => {
  await stripe.subscriptions.cancel(subscriptionId)
}
