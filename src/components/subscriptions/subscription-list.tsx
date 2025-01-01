'use client'
import { env } from '@/env'
import { User } from '@/lib/db/drizzle/types'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { retrieveActiveSubscription } from '@/lib/subscription'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { Product } from '.'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

type SubscriptionListProps = {
  product: Product
  user?: User | null
  className?: string
  onSubscribe: () => void
}

export const SubscriptionList = ({
  onSubscribe,
  product,
  user,
  className,
}: SubscriptionListProps) => {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations()

  type TranslationKeys = Parameters<typeof t>[0]

  const activeSubscription = retrieveActiveSubscription(user)

  return (
    <div
      data-color={product.color}
      data-active={product.color !== 'red'}
      data-active-subscription={Boolean(activeSubscription)}
      className={cn(
        `
        w-full
        data-[color=red]:opacity-70
        rounded-xl group`,
        className,
      )}
    >
      <div className="bg-zinc-800 rounded-xl h-full w-full">
        <div className="flex flex-col h-full relative px-6 py-6 bg-gradient-to-tr from-zinc-800 via-zinc-800 group-data-[active=true]:to-pink-600/20 shadow-lg rounded-xl dark:bg-zinc-850 justify-between w-full">
          {product.color !== 'red' && !activeSubscription && (
            <Badge variant="discount" className="px-4 absolute -top-2 -right-2">
              {t('Discount of {discount} until {date}', {
                discount: `${env.NEXT_PUBLIC_DISCOUNT}%`,
                date: format(env.NEXT_PUBLIC_EXPIRE_AT, 'dd/MM'),
              })}
            </Badge>
          )}

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col md:flex-row gap-6 justify-between"
          >
            <div>
              {product.name && (
                <h3
                  className={`
                      text-3xl
                      ${pixelatedFont.className}
                      tracking-wide
                    group-data-[color=pink]:text-pink-300
                    group-data-[color=red]:text-red-500
                    group-data-[color=slate]:text-slate-200
                  `}
                >
                  {t(product.name as TranslationKeys)}
                </h3>
              )}
              <p className="text-xs text-zinc-500">{product.description}</p>

              {product.color !== 'red' && (
                <h2 className="rounded-md text-orange-400 font-bold  mt-2 text-xs inline-block">
                  {t('{days} days free trial', {
                    days: env.NEXT_PUBLIC_TRIAL_PERIOD_DAYS,
                  })}
                </h2>
              )}
            </div>
            <div>
              <div
                className={`mb-4 text-zinc-600 dark:text-white text-3xl ${pixelatedFont.className} `}
              >
                <span className="text-2xl text-zinc-500 line-through block">
                  {product.color === 'red'
                    ? product.priceAmountWithoutDiscount?.replaceAll('0', '?')
                    : product.priceAmountWithoutDiscount}
                </span>{' '}
                <span>
                  {product.color === 'red'
                    ? product.priceAmount?.replaceAll('0', '?')
                    : product.priceAmount}
                  {product.intervalVariant && (
                    <span>/{t(product.intervalVariant)}</span>
                  )}
                </span>
              </div>
              <div
                className="
                  relative
                  mb-4
                  flex
                  min-w-[200px]
                  rounded-full
                  justify-center
                  items-center
                  group-data-[active-subscription=true]:cursor-not-allowed
                  group-data-[active-subscription=true]:opacity-60
                  group-data-[color=red]:cursor-not-allowed
                "
              >
                <div
                  className={`
                    absolute
                    h-7
                    w-[54%]
                    z-10
                    rounded-full
                    group-data-[active-subscription=true]:hidden
                    group-data-[active-subscription=false]:animate-ping

                    group-data-[color=red]:animate-none
                    group-data-[color=red]:hidden
                  group-data-[color=pink]:dark:bg-pink-400
                  group-data-[color=slate]:dark:bg-slate-200
                  group-data-[color=pink]:hover:dark:bg-pink-500

                  group-data-[color=slate]:hover:dark:bg-slate-500
                  `}
                />

                <Button
                  type="submit"
                  variant="secondary"
                  className={`
                    w-full
                    rounded-full
                    py-5
                    z-10
                    relative
                    group-data-[active-subscription=true]:pointer-events-none
                  group-data-[color=pink]:dark:bg-pink-400
                  group-data-[color=pink]:hover:dark:bg-pink-500
                  group-data-[color=slate]:dark:bg-blue-300
                  group-data-[color=red]:dark:bg-zinc-500
                  group-data-[color=red]:dark:text-white
                  group-data-[color=slate]:hover:dark:bg-blue-300/80
                  dark:text-zinc-900
                  `}
                  disabled={isPending || product.color === 'red'}
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
              </div>
            </div>
            {/* <ul className="mt-4 space-y-2">
              {product.benefits.map((feat, i) => (
                <li
                  data-lastest={i + 1 === product.benefits.length}
                  className="flex items-center text-xs py-3 border-b data-[lastest=true]:border-none border-zinc-700 text-zinc-400"
                  key={feat.id}
                >
                  <CheckIcon
                    className={`group-data-[color=pink]:dark:bg-pink-300 group-data-[color=slate]:dark:bg-slate-200 text-zinc-900 w-5 h-5 rounded-full mr-2 p-0.5`}
                  />
                  {feat.message}
                  {feat.question && (
                      <Tooltip>
                        <TooltipTrigger>
                          <CircleHelpIcon className="ml-2 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{feat.question}</p>
                        </TooltipContent>
                      </Tooltip>
                  )}
                </li>
              ))}
            </ul> */}
          </form>
        </div>
      </div>
    </div>
  )
}
