'use client'
import { getCurrency, Locale } from '@/lib/intl/locales'
import { BigNumber } from 'bignumber.js'
import { CheckIcon, Loader2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useState, useTransition } from 'react'
import { Product } from '.'
import { Button } from '../ui/button'
import { getCountryOrContinent } from '@/lib/geo'

type SubscriptionProps = {
  product: Product
  onSubscribe: () => void
}

export const Subscription = ({ onSubscribe, product }: SubscriptionProps) => {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations()
  const locale = useLocale()
  const [isClient, setIsClient] = useState(false)

  type TranslationKeys = Parameters<typeof t>[0]

  const price = product.prices[0]

  const feats = {
    prod_QPn87NTXuVQL8i: [
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
      },
      {
        id: 3,
        message: t('Test your pronunciation with NLP'),
      },
      {
        id: 4,
        message: t('Answer correction with LLM'),
      },
    ],
  }

  const [currency, setCurrency] = useState(getCurrency(locale as Locale))

  const priceAmount =
    currency === 'BRL'
      ? price?.unitAmount
        ? new BigNumber(price.unitAmount.toString()).div(100).toNumber()
        : null
      : 12.99

  useEffect(() => {
    setIsClient(true)

    if (isClient)
      getCountryOrContinent(t).then((countryOrContinent) => {
        const currencies: Record<typeof countryOrContinent, typeof currency> = {
          brazil: 'BRL',
          europe: 'EUR',
          other: 'USD',
          unknown: getCurrency(locale as Locale),
          usa: 'USD',
        }

        setCurrency(currencies[countryOrContinent])
      })
  }, [t, isClient, locale])

  if (!price) return null

  return (
    <div
      className="flex flex-col p-6 bg-zinc-800 shadow-lg rounded-lg dark:bg-zinc-850 justify-between "
      key={price.id}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        {currency}
        {product.name && (
          <h3 className="text-2xl font-bold text-center">
            {t(product.name as TranslationKeys)}
          </h3>
        )}
        <div className="mt-4 text-center text-zinc-600 dark:text-zinc-400">
          {priceAmount !== null && (
            <span className="text-4xl font-bold">
              {new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currency!,
              }).format(priceAmount)}
            </span>
          )}
          / {price.intervalVariant && t(price.intervalVariant)}
        </div>
        <ul className="mt-4 space-y-2">
          {feats[product.id as keyof typeof feats]?.map((feat) => (
            <li
              className="flex items-center text-xs text-zinc-400"
              key={feat.id}
            >
              <CheckIcon className=" text-green-500 rounded-full mr-2 p-1" />
              {feat.message}
            </li>
          ))}
        </ul>
        <Button
          type="submit"
          className="mt-6"
          disabled={isPending}
          onClick={() => {
            startTransition(() => {
              onSubscribe()
            })
          }}
        >
          {isPending ? (
            <Loader2 className="w-4 animate-spin" />
          ) : (
            t('Get Started')
          )}
        </Button>
      </form>
    </div>
  )
}
