'use client'
import { checkoutWithStripe } from '@/actions/stripe/checkout-with-stripe'
import { getProducts } from '@/actions/stripe/get-products'
import { getServerAuth } from '@/actions/users/get-server-auth'
import { env } from '@/env'
import { User } from '@/lib/db/drizzle/types'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { getCurrency, Locale } from '@/lib/intl/locales'
import { lingos } from '@/lib/storage/local'
import { getStripe } from '@/lib/stripe/client'
import { retrieveActiveSubscription } from '@/lib/subscription'
import { cn } from '@/lib/utils'
import BigNumber from 'bignumber.js'
import { AlertCircleIcon } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import {
  HtmlHTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog'
import { Subscription } from './subscription'
import { SubscriptionList } from './subscription-list'
import { SubscriptionListSkeleton } from './subscription-list-skeleton'

type Benefit = {
  color: string
  description?: string | null
  benefits: {
    id: number
    message: string
    question?: string | null
  }[]
}

export type Product = Awaited<ReturnType<typeof getProducts>>[number] &
  Partial<
    Benefit & {
      priceAmount: string
      priceAmountWithoutDiscount: string
      intervalVariant?: 'day' | 'week' | 'month' | 'year' | null
    }
  >
type SubscriptionsProps = HtmlHTMLAttributes<HTMLDivElement> & {
  variant: 'dialog' | 'list'
  user?: User | null
  onOpenChange?: (open: boolean) => void
  products?: Product[]
}

export const Subscriptions = ({
  className,
  variant,
  onOpenChange,
  products: defaultProducts,
  user: defaultUser,
  ...props
}: SubscriptionsProps) => {
  const [user, setUser] = useState<User | null>(defaultUser || null)
  const [isPending, startTransition] = useTransition()
  const locale = useLocale()
  const t = useTranslations()

  const benefits: Record<string, Benefit> = useMemo(
    () => ({
      Standart: {
        color: 'slate',
        description: t(
          'Explore our trained LLM models to test your pronunciation and receive accurate answer feedback',
        ),
        benefits: [
          {
            id: 1,
            message: t('{count} advanced voices', {
              count: 6,
            }),
          },
          {
            id: 2,
            message: t('{count} trained LLM models', {
              count: 3,
            }),
            question: t('Large Language Model'),
          },
          {
            id: 3,
            message: t('Test your pronunciation with NLP'),
            question: t('Natural Language Processing'),
          },
          {
            id: 4,
            message: t('Answer correction with LLM'),
          },
        ],
      },
      Shorly: {
        color: 'red',
        description: null,
        benefits: [],
      },
    }),
    [t],
  )

  const parseProducts = useCallback(
    (products: Product[]) => {
      return [
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
      ].map((product) => {
        const price = product.prices[0]

        const currency = getCurrency(locale as Locale)

        const priceAmountWithoutDiscount = (() => {
          if (!price || price.unitAmount === null) return 0

          if (currency === 'BRL') {
            return new BigNumber(price.unitAmount.toString())
              .div(100)
              .toNumber()
          }

          return 17.84 // tmp
        })()

        const priceAmount = Number(
          (
            priceAmountWithoutDiscount -
            priceAmountWithoutDiscount * (env.NEXT_PUBLIC_DISCOUNT / 100)
          ).toFixed(2),
        )

        const formatPrice = (priceAmount: number) =>
          new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency!,
          }).format(priceAmount)

        return {
          ...product,
          ...(benefits[product.name as keyof typeof benefits] || {}),
          priceAmount: formatPrice(priceAmount),
          priceAmountWithoutDiscount: formatPrice(priceAmountWithoutDiscount),
          intervalVariant: price?.intervalVariant,
        }
      })
    },
    [benefits, locale],
  )

  const [products, setProducts] = useState<Product[]>(
    defaultProducts ? parseProducts(defaultProducts) : [],
  )

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
    if (!defaultUser && !defaultProducts) {
      return
    }
    startTransition(() => {
      if (!defaultUser) getServerAuth().then(({ user }) => setUser(user))

      if (!defaultProducts)
        getProducts().then((products) => {
          setProducts(parseProducts(products))
        })
    })
  }, [defaultUser, defaultProducts, parseProducts])

  const hasActiveSubscription = retrieveActiveSubscription(user)

  if (variant === 'dialog' && isPending) return null

  if (variant === 'list')
    return (
      <div className={cn(`flex flex-col gap-2`, className)} {...props}>
        {!isPending
          ? products.map((product) => (
              <SubscriptionList
                key={product.id}
                product={product}
                user={user}
                onSubscribe={() => {
                  stripeCheckoutHandler(product)
                }}
              />
            ))
          : Array.from(
              {
                length: 4,
              },
              (v, k) => k + 1,
            ).map((key) => <SubscriptionListSkeleton key={key} />)}
      </div>
    )

  if (hasActiveSubscription) return null

  return (
    <Dialog defaultOpen onOpenChange={onOpenChange}>
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
