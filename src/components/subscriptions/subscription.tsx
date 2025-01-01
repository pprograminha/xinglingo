'use client'
import { env } from '@/env'
import { useAuth } from '@/hooks/use-auth'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { cn } from '@/lib/utils'
import { useRouter } from '@/navigation'
import { format } from 'date-fns'
import { CheckIcon, CircleHelpIcon, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { Product } from '.'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
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
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  type TranslationKeys = Parameters<typeof t>[0]

  return (
    <div
      data-color={product.color}
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
          {product.color !== 'red' && (
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
                className={`text-3xl ${pixelatedFont.className} tracking-wide
              group-data-[color=pink]:text-pink-300
              group-data-[color=red]:text-red-500
              group-data-[color=slate]:text-slate-200`}
              >
                {t(product.name as TranslationKeys)}
              </h3>
            )}
            <p className={`text-xs text-zinc-500`}>{product.description}</p>

            {product.color !== 'red' && (
              <h2 className="rounded-md text-orange-400 font-bold  mt-2 text-xs inline-block">
                {t('{days} days free trial', {
                  days: env.NEXT_PUBLIC_TRIAL_PERIOD_DAYS,
                })}
              </h2>
            )}
            <div
              className={`mt-4 text-zinc-600 dark:text-white text-5xl ${pixelatedFont.className} `}
            >
              <div className="">
                <span className="text-2xl text-zinc-500 line-through inline-block">
                  {product.color === 'red'
                    ? product.priceAmountWithoutDiscount?.replaceAll('0', '?')
                    : product.priceAmountWithoutDiscount}
                </span>{' '}
              </div>

              {product.color === 'red'
                ? product.priceAmount?.replaceAll('0', '?')
                : product.priceAmount}

              {product.intervalVariant && (
                <span>/{t(product.intervalVariant)}</span>
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
                disabled={isPending || product.color === 'red'}
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
              {product.benefits?.map((feat, i) => (
                <li
                  data-lastest={i + 1 === product.benefits?.length}
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
            </ul>
          </form>
        </div>
      </div>
    </div>
  )
}
