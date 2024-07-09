'use client'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { getCurrency, Locale } from '@/lib/intl/locales'
import { BigNumber } from 'bignumber.js'
import { CheckIcon, CircleHelpIcon, Loader2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo, useTransition } from 'react'
import { Product } from '.'
import { Button } from '../ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'
import { Badge } from '../ui/badge'
import { format } from 'date-fns'
import { env } from '@/env'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from '@/navigation'

type SubscriptionProps = {
  product: Product
  className?: string
  onSubscribe: () => void
}

export const Subscription = ({
  onSubscribe,
  product,
  className,
}: SubscriptionProps) => {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations()
  const locale = useLocale()
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  type TranslationKeys = Parameters<typeof t>[0]

  const price = product.prices[0]

  const feats = {
    Standart: {
      color: 'slate',
      description: t(
        'Explore our trained LLM models to test your pronunciation and receive accurate answer feedback',
      ),
      items: [
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
      items: [],
    },
  }

  const currency = getCurrency(locale as Locale)

  const priceAmountWithoutDiscount = useMemo(() => {
    if (!price || price.unitAmount === null) return 0

    if (currency === 'BRL') {
      return new BigNumber(price.unitAmount.toString()).div(100).toNumber()
    }

    return 17.84 // tmp
  }, [currency, price])

  const priceAmount = Number(
    (
      priceAmountWithoutDiscount -
      priceAmountWithoutDiscount * (env.NEXT_PUBLIC_DISCOUNT / 100)
    ).toFixed(2),
  )

  const productFeats = feats[product.name as keyof typeof feats]
  const productColor = productFeats.color

  const formatPrice = (priceAmount: number) =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency!,
    }).format(priceAmount)

  if (!productFeats) return null
  return (
    <div
      data-color={productColor}
      className={cn(
        `p-0.5
        bg-gradient-to-br
        data-[color=pink]:from-pink-300
        data-[color=pink]:via-transparent
        data-[color=pink]:to-transparent
        z-10
        md:min-w-[385px]
        data-[color=slate]:from-slate-200
        data-[color=slate]:via-transparent
        data-[color=slate]:to-transparent
        data-[color=red]:md:block
        data-[color=red]:hidden
        data-[color=red]:from-red-400
        data-[color=red]:z-0
        data-[color=red]:opacity-60
        data-[color=red]:scale-75
        data-[color=red]:-translate-x-20
        data-[color=red]:via-transparent
        data-[color=red]:to-transparent
        rounded-xl group`,
        className,
      )}
    >
      <div className="bg-zinc-800 rounded-xl h-full">
        <div className="flex flex-col h-full relative px-6 py-10 w-full max-w-sm bg-gradient-to-tr from-zinc-800 via-zinc-800 to-pink-600/20 shadow-lg rounded-xl dark:bg-zinc-850 justify-between ">
          {price && (
            <Badge variant="discount" className="px-4 absolute top-2 right-2">
              {t('Discount of {discount} until {date}', {
                discount: `${env.NEXT_PUBLIC_DISCOUNT}%`,
                date: format(env.NEXT_PUBLIC_EXPIRE_AT, 'dd/MM'),
              })}
            </Badge>
          )}
          <form onSubmit={(e) => e.preventDefault()}>
            {product.name && (
              <h3
                className={`text-3xl ${pixelatedFont()} tracking-wide
              group-data-[color=pink]:text-pink-300
              group-data-[color=red]:text-red-500
              group-data-[color=slate]:text-slate-200`}
              >
                {t(product.name as TranslationKeys)}
              </h3>
            )}
            <p className="text-xs text-zinc-500">{productFeats.description}</p>

            {productColor !== 'red' && (
              <h2 className="rounded-md text-orange-400 font-bold  mt-2 text-xs inline-block">
                {t('{days} days free trial', {
                  days: env.NEXT_PUBLIC_TRIAL_PERIOD_DAYS,
                })}
              </h2>
            )}
            <div
              className={`mt-4 text-zinc-600 dark:text-white text-5xl ${pixelatedFont()} `}
            >
              <div className="">
                <span className="text-2xl text-zinc-500 line-through inline-block">
                  {productColor === 'red'
                    ? formatPrice(priceAmountWithoutDiscount).replaceAll(
                        '0',
                        '?',
                      )
                    : formatPrice(priceAmountWithoutDiscount)}
                </span>{' '}
              </div>

              {productColor === 'red'
                ? formatPrice(priceAmount).replaceAll('0', '?')
                : formatPrice(priceAmount)}
              {price?.intervalVariant && (
                <span>/{t(price.intervalVariant)}</span>
              )}
            </div>
            <div
              className="relative
                mb-4 mt-8
              flex justify-center items-center
            "
            >
              <div
                className={`
                absolute
                h-7
                w-[54%]
                z-10
                rounded-full
                animate-ping
                group-data-[color=red]:animate-none
                group-data-[color=pink]:dark:bg-pink-400
              group-data-[color=pink]:hover:dark:bg-pink-500
              group-data-[color=slate]:dark:bg-slate-200
              group-data-[color=red]:hidden
              group-data-[color=slate]:hover:dark:bg-slate-500
              `}
              />

              <Button
                type="submit"
                variant="secondary"
                className={`w-full rounded-full  py-5 z-10 relative
              group-data-[color=pink]:dark:bg-pink-400
              group-data-[color=pink]:hover:dark:bg-pink-500
              group-data-[color=slate]:dark:bg-blue-300
              group-data-[color=red]:dark:bg-red-400
              group-data-[color=slate]:hover:dark:bg-blue-300/80
              dark:text-zinc-900
              `}
                disabled={isPending || productColor === 'red'}
                onClick={() => {
                  if (isAuthenticated) {
                    startTransition(() => {
                      onSubscribe()
                    })
                  } else {
                    router.push('/auth')
                  }
                }}
              >
                {isPending ? (
                  <Loader2 className="w-4 animate-spin" />
                ) : (
                  t('Get Started')
                )}
              </Button>
            </div>
            <ul className="mt-4 space-y-2">
              {productFeats.items.map((feat, i) => (
                <li
                  data-lastest={i + 1 === productFeats.items.length}
                  className="flex items-center text-xs py-3 border-b data-[lastest=true]:border-none border-zinc-700 text-zinc-400"
                  key={feat.id}
                >
                  <CheckIcon
                    className={`group-data-[color=pink]:dark:bg-pink-300 group-data-[color=slate]:dark:bg-slate-200 text-zinc-900 w-5 h-5 rounded-full mr-2 p-0.5`}
                  />
                  {feat.message}
                  {feat.question && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <CircleHelpIcon className="ml-2 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{feat.question}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </li>
              ))}
            </ul>
          </form>
        </div>
      </div>
    </div>
  )
}
