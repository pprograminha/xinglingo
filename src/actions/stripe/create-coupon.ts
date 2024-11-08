'use server'
import { stripe } from '@/lib/stripe/config'
import { cache } from 'react'
import Stripe from 'stripe'

type CreateCouponData = Partial<{
  percentOff: number
  code: string
  duration: Stripe.CouponCreateParams.Duration
}>

export const createCoupon = cache(
  async ({ code, ...data }: CreateCouponData) => {
    const coupon = await stripe.coupons.create({
      ...data,
    })

    const promotionCodes = await stripe.promotionCodes.list()

    const existingCode = promotionCodes.data.find((pc) => pc.code === code)
    if (existingCode) {
      throw new Error('Promotion code already exists')
    }

    const promotionCode = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code,
    })
    return promotionCode
  },
)
