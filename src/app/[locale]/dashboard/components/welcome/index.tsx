import { getWordsList } from '@/actions/conversations/get-words-list'
import { createHistory } from '@/actions/models/create-history'
import { getModels } from '@/actions/models/get-models'
import { getProducts } from '@/actions/stripe/get-products'
import { ButtonWithAccessChecker } from '@/components/button-with-access-checker'
import { Offensive } from '@/components/offensive'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { User } from '@/lib/db/drizzle/types'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { langs, Locale, localeImages } from '@/lib/intl/locales'
import { retrieveActiveSubscription } from '@/lib/subscription'
import { redirect } from '@/navigation'
import { ChevronRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { History } from './components/history'

type WelcomeProps = {
  user: User | null
  t: Awaited<ReturnType<typeof getTranslations>>
  modelsData: Awaited<ReturnType<typeof getModels>>
  wordsListData: Awaited<ReturnType<typeof getWordsList>>
  products: Awaited<ReturnType<typeof getProducts>>
}

export const Welcome = ({
  user,
  t,
  wordsListData,
  products,
  modelsData,
}: WelcomeProps) => {
  const {
    green: { words },
    count: { offensive, wordsToLearn, wordsRemaining },
  } = wordsListData

  return (
    <Card className="bg-gradient-to-tr col-span-2 md:col-span-1 h-full dark:from-zinc-920 dark:to-zinc-800/70 relative">
      <div className="bg-[url('/assets/svgs/radiant-gradient.svg')] bg-cover rounded-xl h-full">
        <div className="h-full flex flex-col justify-between px-4 pt-4 pb-10">
          <div className="bg-gradient-to-tr from-zinc-800 via-zinc-800 to-violet-200/10 rounded-xl w-full px-4 py-2">
            <div className="bg-[url('/assets/svgs/bg-700.svg')] bg-[length:200px,200px]">
              {user?.profile?.localeToLearn && (
                <div className="flex justify-between h-full flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-4 flex-wrap">
                      <Image
                        src={localeImages[user.profile.localeToLearn as Locale]}
                        width={100}
                        height={100}
                        className="w-[70px] h-[70px] md:w-[100px] md:h-[100px]"
                        alt="Country"
                      />
                      <div className="flex gap-3 justify-between flex-1 items-center">
                        <div>
                          <h1
                            className={`text-xl md:text-2xl ${pixelatedFont()} whitespace-nowrap`}
                          >
                            {langs(t, user.profile.localeToLearn as Locale)}
                          </h1>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger>
                              <div className="mt-2 text-xs  whitespace-nowrap">
                                <span className="text-zinc-400">
                                  {wordsToLearn}
                                </span>{' '}
                                /{' '}
                                <span className="text-zinc-400">
                                  {words.length}
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {t.rich(
                                  'Your goal is to learn {words} words, {wordsRemaining} words remaining',
                                  {
                                    words: wordsToLearn,
                                    wordsRemaining,
                                    questionHelp: () => null,
                                  },
                                )}
                                <br />
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Offensive value={offensive} />
                      </div>
                    </div>
                    <form
                      className="w-full"
                      action={async () => {
                        'use server'
                        if (
                          user &&
                          modelsData.histories[0] &&
                          retrieveActiveSubscription(user)
                        ) {
                          createHistory({
                            userId: user.id,
                            modelId: modelsData.histories[0].id,
                          })
                          redirect(`/board/${modelsData.histories[0].id}`)
                        }
                      }}
                    >
                      <ButtonWithAccessChecker
                        user={user}
                        products={products}
                        type="submit"
                        variant="secondary"
                        size="default"
                        className="md:max-w-xs w-full flex items-center gap-1 border border-zinc-700"
                      >
                        {t('Continue')} <ChevronRight className="w-4" />
                      </ButtonWithAccessChecker>
                    </form>
                  </div>
                  <div className="flex flex-col justify-end py-3 md:p-4 w-full h-full">
                    <h1 className="text-xs text-zinc-400">
                      {t('Progress towards fluency')}
                    </h1>
                    <div className="flex gap-2 items-center ">
                      <Progress value={(words.length / wordsToLearn) * 100} />{' '}
                      <span className="text-xs">
                        %{((words.length / wordsToLearn) * 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <History
            modelsData={modelsData}
            products={products}
            t={t}
            wordsListData={wordsListData}
            user={user}
          />
          <div />
        </div>
      </div>
    </Card>
  )
}
