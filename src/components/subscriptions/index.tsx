'use client'
import { checkoutWithStripe } from '@/actions/stripe/checkout-with-stripe'
import { getProducts } from '@/actions/stripe/get-products'
import { getServerAuth } from '@/actions/users/get-server-auth'
import { env } from '@/env'
import { getStripe } from '@/lib/stripe/client'
import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Subscription } from './subscription'

export type Product = Awaited<ReturnType<typeof getProducts>>[number]

export const Subscriptions = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isPending, startTransition] = useTransition()

  async function stripeCheckoutHandler(product: Product) {
    const { user } = await getServerAuth()

    if (!user) {
      return toast('You do not have permission.', {
        description: 'Please try again later',
      })
    }

    const { sessionId, error } = await checkoutWithStripe(
      user,
      product.prices[0],
    )

    if (!sessionId || error) {
      return toast(error?.message || 'An unknown error occurred.', {
        description:
          'Please try again later or contact a system administrator.',
      })
    }

    const stripe = await getStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

    await stripe?.redirectToCheckout({
      sessionId,
    })
  }

  useEffect(() => {
    startTransition(() => {
      getProducts().then((products) => setProducts(products))
    })
  }, [])

  return (
    <div className="flex gap-4">
      {isPending
        ? 'loading..'
        : products.map((product) => (
            <Subscription
              key={product.id}
              product={product}
              onSubscribe={() => {
                stripeCheckoutHandler(product)
              }}
            />
          ))}
    </div>
  )
}
