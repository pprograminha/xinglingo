'use client'
import { cancelSubscription } from '@/actions/stripe/cancel-subscription'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { User } from '@/lib/db/drizzle/types'
import { openSansFont } from '@/lib/font/google/open-sans-font'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { localeDate, Locale } from '@/lib/intl/locales'
import {
  retrieveActiveSubscription,
  retrieveCancelledSubscription,
  retrieveSubscription,
} from '@/lib/subscription'
import { format, isAfter } from 'date-fns'
import { Loader2Icon, Trash2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { toast } from 'sonner'
type MyPlansProps = {
  user?: User | null
}

export const MyPlans = ({ user }: MyPlansProps) => {
  const t = useTranslations()
  const subscription = retrieveSubscription(user)
  const [isCanceling, startCancelingSubscription] = useTransition()

  const activeSubscription = retrieveActiveSubscription(user)
  const cancelledSubscription = retrieveCancelledSubscription(user)

  const currentDate = new Date()

  const trialExpired =
    subscription && subscription.trialEnd
      ? isAfter(currentDate, subscription.trialEnd)
      : false

  if (!subscription || !subscription.price || !subscription.price.product)
    return null

  return (
    <div
      data-trial-expired={trialExpired}
      className="bg-zinc-800 rounded-xl group"
    >
      <div className="relative flex flex-wrap justify-between gap-x-6 gap-y-4 bg-gradient-to-tr p-6 from-zinc-800 via-zinc-800 to-green-800/20 rounded-xl">
        <div>
          {subscription.price.product.name && (
            <h1 className={`${pixelatedFont()} text-3xl`}>
              {t(subscription.price.product.name as Parameters<typeof t>[0])}
            </h1>
          )}

          <div>
            <h1 className={`${pixelatedFont()} text-xl text-zinc-400`}>
              {t('Current subscription billing cycle')}
            </h1>
            <div className="text-xs text-zinc-500">
              {subscription.currentPeriodStart && (
                <p>
                  {t('Started on: {date}', {
                    date: format(
                      subscription.currentPeriodStart,
                      t(`MMMM dd, yyyy 'at' h:mm aa`), // January 20, 1970 at 6:57 PM
                      user
                        ? {
                            locale: localeDate[user.locale as Locale],
                          }
                        : undefined,
                    ),
                  })}
                </p>
              )}
              {/* {subscription.currentPeriodEnd && (
                <p>
                  {isAfter(currentDate, subscription.currentPeriodEnd)
                    ? t('Ended on: {date}', {
                        date: format(
                          subscription.currentPeriodEnd,
                          t(`MMMM dd, yyyy 'at' h:mm aa`), // January 20, 1970 at 6:57 PM
                          user
                            ? {
                                locale: localeDate[user.locale as Locale],
                              }
                            : undefined,
                        ),
                      })
                    : t('Will end on: {date}', {
                        date: format(
                          subscription.currentPeriodEnd,
                          t(`MMMM dd, yyyy 'at' h:mm aa`), // January 20, 1970 at 6:57 PM
                          user
                            ? {
                                locale: localeDate[user.locale as Locale],
                              }
                            : undefined,
                        ),
                      })}
                </p>
              )} */}
            </div>
          </div>
          {trialExpired && (
            <div className="mb-4">
              <Badge
                variant="secondary"
                className={`dark:bg-zinc-600 hover:dark:bg-zinc-600 inline-block ${openSansFont()}`}
              >
                {t('Trial period has expired')}
              </Badge>
            </div>
          )}
          {subscription.trialStart && subscription.trialEnd && (
            <div className="mt-0">
              <h1 className={`font-bold text-xs text-orange-400`}>
                {t('Free trial period from {fromDate} to {toDate}', {
                  fromDate: format(
                    subscription.trialStart,
                    t(`MMMM dd, yyyy`), // January 20, 1970 at 6:57 PM
                    user
                      ? {
                          locale: localeDate[user.locale as Locale],
                        }
                      : undefined,
                  ),
                  toDate: format(
                    subscription.trialEnd,
                    t(`MMMM dd, yyyy`), // January 20, 1970 at 6:57 PM
                    user
                      ? {
                          locale: localeDate[user.locale as Locale],
                        }
                      : undefined,
                  ),
                })}
              </h1>
            </div>
          )}
        </div>
        <div className="flex flex-col group-data-[trial-expired=true]:justify-end justify-between">
          {!trialExpired && activeSubscription && (
            <Badge
              variant="outline"
              className="dark:text-yellow-200 dark:border-none"
            >
              {t('You are in the trial period')}
            </Badge>
          )}
          {cancelledSubscription && (
            <Badge variant="destructive">{t('Subscription canceled')}</Badge>
          )}
          {activeSubscription && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="dark:bg-red-500 hover:dark:bg-red-500 dark:text-white flex gap-4">
                  {t('Cancel subscription')}
                  <Trash2Icon className="w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {t('Are you sure you want to cancel your subscription?')}
                  </DialogTitle>
                  <DialogDescription>
                    {t('This action is irreversible')}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-wrap gap-4">
                  <Button
                    variant="outline"
                    className="w-full md:w-1/2 mt-4 flex gap-4"
                    onClick={() =>
                      startCancelingSubscription(async () => {
                        try {
                          await cancelSubscription(subscription.id)

                          toast(t('Subscription successfully canceled!'), {
                            description: t('We hope you come back someday'),
                          })

                          setTimeout(() => {
                            window.location.reload()
                          }, 5000)
                        } catch {
                          toast(
                            t(
                              'Something went wrong while trying to cancel your subscription!',
                            ),
                            {
                              description: t(
                                'If you see this message, please contact support',
                              ),
                            },
                          )
                        }
                      })
                    }
                  >
                    {isCanceling ? (
                      <Loader2Icon className="w-4 animate-spin" />
                    ) : (
                      <>
                        {t('Cancel subscription')}
                        <Trash2Icon className="w-4" />
                      </>
                    )}
                  </Button>
                  <DialogClose asChild>
                    <Button className="dark:bg-red-500 flex-1 hover:dark:bg-red-500 dark:text-white mt-4 flex gap-4">
                      {t('Back')}
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  )
}
