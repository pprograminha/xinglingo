'use client'
import { checkoutWithStripe } from '@/actions/stripe/checkout-with-stripe'
import { getProducts } from '@/actions/stripe/get-products'
import { getServerAuth } from '@/actions/users/get-server-auth'
import { env } from '@/env'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { getStripe } from '@/lib/stripe/client'
import { cn } from '@/lib/utils'
import { AlertCircleIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { HtmlHTMLAttributes, useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog'
import { Subscription } from './subscription'
import { User } from '@/lib/db/drizzle/types'
import { retrieveActiveSubscription } from '@/lib/subscription'
import { lingos } from '@/lib/storage/local'

export type Product = Awaited<ReturnType<typeof getProducts>>[number]

type SubscriptionsProps = HtmlHTMLAttributes<HTMLDivElement> & {
  variant: 'dialog' | 'list'
}

export const Subscriptions = ({
  className,
  variant,
  ...props
}: SubscriptionsProps) => {
  const [products, setProducts] = useState<Product[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [isPending, startTransition] = useTransition()
  const t = useTranslations()

  async function stripeCheckoutHandler(product: Product) {
    if (!user) {
      return toast(t('You do not have permission'), {
        description: t('Please try again later'),
      })
    }

    const { sessionId, error } = await checkoutWithStripe(
      user,
      product.prices[0],
      lingos.storage.get('coupon-code') || env.NEXT_PUBLIC_COUPON,
    )

    if (!sessionId || error) {
      return toast(error?.message || t('An unknown error occurred'), {
        description: t(
          'Please try again later or contact a system administrator',
        ),
      })
    }

    const stripe = await getStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

    await stripe?.redirectToCheckout({
      sessionId,
    })
  }

  useEffect(() => {
    startTransition(() => {
      getServerAuth().then(({ user }) => setUser(user))
      getProducts().then((products) =>
        setProducts([
          ...products,
          {
            id: 'shorly',
            active: true,
            description: null,
            image: null,
            metadata: null,
            name: 'Shorly',
            prices: [],
          },
        ]),
      )
    })
  }, [])

  const hasActiveSubscription = retrieveActiveSubscription(user)

  if ((variant === 'dialog' && isPending) || hasActiveSubscription) return null

  return (
    <Dialog defaultOpen>
      <DialogContent className="max-w-max ">
        <DialogTitle
          className={`text-4xl ${pixelatedFont()} text-zinc-300 tracking-wide flex gap-2 items-center animate-pulse`}
        >
          {t('{days} days free trial', {
            days: env.NEXT_PUBLIC_TRIAL_PERIOD_DAYS,
          })}
          !
          <AlertCircleIcon />
        </DialogTitle>
        <DialogDescription className="max-w-md mb-6">
          {t('Sign up for our personalized plan to learn a foreign language!')}
        </DialogDescription>
        <div
          className={cn(`flex gap-4 items-center max-w-[655px]`, className)}
          {...props}
        >
          {products.map((product) => (
            <Subscription
              key={product.id}
              product={product}
              onSubscribe={() => {
                stripeCheckoutHandler(product)
              }}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
