import { getWordsList } from '@/actions/conversations/get-words-list'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { User } from '@/lib/db/drizzle/types'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { Locale, imagesSrc, langs } from '@/lib/intl/locales'
import { ChevronRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { YourPerformance } from './your-performance'

type WelcomeProps = {
  user: User | null
  t: Awaited<ReturnType<typeof getTranslations>>
  wordsListData: Awaited<ReturnType<typeof getWordsList>>
}

export const Welcome = ({ user, t, wordsListData }: WelcomeProps) => {
  const {
    green: { words },
    count: { wordsPerYear },
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
                        src={imagesSrc[user.profile.localeToLearn as Locale]}
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
                          <div className="mt-2 text-xs  whitespace-nowrap">
                            <span className="text-zinc-400">
                              {wordsPerYear}
                            </span>{' '}
                            /{' '}
                            <span className="text-zinc-400">
                              {words.length}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1 border border-orange-600/60 shrink-0 text-orange-500 rounded-full px-2 md:px-6 text-xs py-2 max-h-8 bg-gradient-to-tr dark:from-zinc-700 dark:to-orange-700/40">
                          <Image
                            src="/assets/svgs/flame-danger.svg"
                            width={15}
                            height={15}
                            alt="Flame danger"
                          />
                          0x
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      className="md:max-w-xs flex items-center gap-1 border border-zinc-700"
                    >
                      {t('Continue')} <ChevronRight className="w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-col justify-end py-3 md:p-4 w-full h-full">
                    <h1 className="text-xs text-zinc-400">
                      {t('Progress towards fluency')}
                    </h1>
                    <div className="flex gap-2 items-center ">
                      <Progress value={(words.length / wordsPerYear) * 100} />{' '}
                      <span className="text-xs">
                        %{((words.length / wordsPerYear) * 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <h1 className={`text-4xl my-4 md:text-5xl ${pixelatedFont()}`}>
              {t('Welcome!! {userFullName}', {
                userFullName: user?.fullName,
              })}
            </h1>

            <div className="flex flex-col lg:flex-row justify-between items-start gap-2 lg:gap-4">
              <div>
                <div className="flex flex-col gap-2">
                  <h2 className={`text-zinc-400 text-2xl ${pixelatedFont()}`}>
                    {t('Continue where you left off?')}
                  </h2>
                </div>
                <div className="flex flex-wrap md:flex-nowrap md:w-[210px] mt-6 gap-1 md:gap-0">
                  <div
                    className="cursor-pointer
                  relative
                  flex
                  flex-col
                  place-items-center
                  md:flex-none

                  backdrop-blur-sm
                  rounded-xl
                  bg-gradient-to-tr
                  md:bg-none
                  md:rounded-none
                  dark:from-zinc-800
                  dark:via-zinc-800/80
                  dark:to-violet-300/5

                  z-40
                  transition-all


                  min-w-[100px]
                  md:min-w-[170px]
                  h-[100px]
                  md:h-[170px]
                  md:hover:-translate-y-5"
                  >
                    <ChevronRight className="md:w-6 w-4 md:relative absolute top-0 md:top-1/2 md:-translate-y-1/2 right-0 md:-right-[70px] text-white" />

                    <Image
                      src="/assets/imgs/tutor-ai-01.png"
                      width={180}
                      className="m-auto md:w-[180px] md:h-[120px] w-[100px] h-[70px]"
                      height={150}
                      alt="Petutor AI"
                    />
                  </div>
                  <div
                    className="cursor-pointer
                  relative
                  flex
                  flex-col
                  place-items-center
                  md:flex-none
                  backdrop-blur-sm
                  z-30
                       rounded-xl
                  bg-gradient-to-tr
                  md:bg-none
                  md:rounded-none
                  dark:from-zinc-800
                  dark:via-zinc-800/80
                  dark:to-violet-300/5
                  md:-translate-x-[150px]

                  min-w-[100px]
                  md:min-w-[170px] h-[100px] md:h-[170px] transition-all md:hover:-translate-y-5"
                  >
                    <ChevronRight className="md:w-6 w-4 md:relative absolute top-0 md:top-1/2 md:-translate-y-1/2 right-0 md:-right-[70px] text-white" />

                    <Image
                      src="/assets/imgs/tutor-ai-02.png"
                      width={180}
                      className="m-auto md:w-[180px] md:h-[120px] w-[100px] h-[70px]"
                      height={150}
                      alt="Petutor AI"
                    />
                  </div>
                  <div
                    className="cursor-pointer
                  relative
                  flex
                  flex-col
                  place-items-center
                  md:flex-none
                  backdrop-blur-sm
                  z-20
                  rounded-xl
                  bg-gradient-to-tr
                  md:bg-none
                  md:rounded-none
                  dark:from-zinc-800
                  dark:via-zinc-800/80
                  dark:to-violet-300/5
                  md:-translate-x-[300px]

                  min-w-[100px] md:min-w-[170px] h-[100px] md:h-[170px] transition-all md:hover:-translate-y-5"
                  >
                    <ChevronRight className="md:w-6 w-4 md:relative absolute top-0 md:top-1/2 md:-translate-y-1/2 right-0 md:-right-[70px] text-white" />

                    <Image
                      src="/assets/imgs/tutor-ai-03.png"
                      width={180}
                      className="m-auto md:w-[180px] md:h-[120px] w-[100px] h-[70px]"
                      height={150}
                      alt="Petutor AI"
                    />
                  </div>
                </div>
              </div>
              <YourPerformance t={t} wordsListData={wordsListData} />
            </div>
          </div>
          <div />
        </div>
      </div>
    </Card>
  )
}
