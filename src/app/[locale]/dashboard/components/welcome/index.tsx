import { getWordsList } from '@/actions/conversations/get-words-list'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { User } from '@/lib/db/drizzle/types'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { Locale, imagesSrc, langs } from '@/lib/intl/locales'
import { ChevronRight, CoinsIcon, HelpCircleIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

type WelcomeProps = {
  user: User | null
  t: Awaited<ReturnType<typeof getTranslations>>
  wordsListData: Awaited<ReturnType<typeof getWordsList>>
}

export const Welcome = ({ user, t, wordsListData }: WelcomeProps) => {
  const {
    green: { words },
    red: { words: redWords },
    yellow: { words: yellowWords },
    count: { wordsPerYear },
  } = wordsListData

  const allWordsCount = words.length + redWords.length + yellowWords.length

  return (
    <Card className="bg-gradient-to-tr col-span-2 md:col-span-1 h-full dark:from-zinc-920 dark:to-zinc-800/70 relative">
      <div className="bg-[url('/assets/svgs/radiant-gradient.svg')] bg-cover rounded-xl h-full">
        <div className="h-full flex flex-col justify-between px-4 pt-4 pb-10">
          <div className="bg-gradient-to-tr from-zinc-800 h-full via-zinc-800 to-violet-200/10 rounded-xl w-full px-4 py-2">
            <div className="bg-[url('/assets/svgs/bg-700.svg')] h-full bg-[length:200px,200px]">
              {user?.profile?.localeToLearn && (
                <div className="flex justify-between h-full flex-col gap-2">
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
                          <span className="text-zinc-400">{wordsPerYear}</span>{' '}
                          /{' '}
                          <span className="text-zinc-400">{words.length}</span>
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
                  <div className="flex flex-col justify-end py-3 md:p-4 w-full h-full">
                    <h1 className="text-xs text-zinc-400">
                      Progresso para fluência
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
              Bem-vindo(a)!! {user?.fullName}
            </h1>

            <div className="flex flex-col lg:flex-row justify-between items-start gap-2 lg:gap-4">
              <div>
                <div className="flex flex-col gap-2">
                  <h2 className={`text-zinc-400 text-2xl ${pixelatedFont()}`}>
                    Continuar de onde parou?
                  </h2>
                </div>
                <div className="flex flex-wrap md:flex-nowrap md:w-[210px] mt-6">
                  <div
                    className="cursor-pointer
                  relative
                  flex
                  flex-col
                  place-items-center
                  md:flex-none

                  bg-gradient-to-tr
                  dark:from-zinc-800
                  dark:via-zinc-800/80
                  dark:to-violet-300/5
                  border
                  border-zinc-900/30
                  z-40
                  transition-all

                  rounded-xl
                  min-w-[100px]
                  md:min-w-[170px]
                  h-[100px]
                  md:h-[170px]
                  md:hover:-translate-y-5"
                  >
                    <ChevronRight className="md:w-6 w-4 md:relative md:top-2 absolute top-0 right-0 text-zinc-500" />

                    <Image
                      src="/assets/imgs/tutor-ai-01.png"
                      width={150}
                      className="m-auto md:w-[150px] md:h-[120px] w-[100px] h-[70px]"
                      height={150}
                      alt="Tutor AI"
                    />
                  </div>
                  <div
                    className="cursor-pointer
                  relative
                  flex
                  flex-col
                  place-items-center
                  md:flex-none

                  bg-gradient-to-tr
                  dark:from-zinc-800
                  dark:via-zinc-800/80
                  dark:to-violet-300/5
                  border
                  border-zinc-900/30
                  z-30

                  md:-translate-x-[150px]
                  rounded-xl
                  min-w-[100px]
                  md:min-w-[170px] h-[100px] md:h-[170px] transition-all md:hover:-translate-y-5"
                  >
                    <ChevronRight className="md:w-6 w-4 md:relative md:top-2 absolute top-0 right-0 text-zinc-500" />

                    <Image
                      src="/assets/imgs/tutor-ai-02.png"
                      className="m-auto md:w-[150px] md:h-[120px] w-[100px] h-[70px]"
                      width={150}
                      height={150}
                      alt="Tutor AI"
                    />
                  </div>
                  <div
                    className="cursor-pointer
                  relative
                  flex
                  flex-col
                  place-items-center
                  md:flex-none

                  bg-gradient-to-tr
                  dark:from-zinc-800
                  dark:via-zinc-800/80
                  dark:to-violet-300/5
                  border
                  border-zinc-900/30
                  z-20

                  md:-translate-x-[300px]
                  rounded-xl
                  min-w-[100px] md:min-w-[170px] h-[100px] md:h-[170px] transition-all md:hover:-translate-y-5"
                  >
                    <ChevronRight className="md:w-6 w-4 md:relative md:top-2 absolute top-0 right-0 text-zinc-500" />

                    <Image
                      src="/assets/imgs/tutor-ai-03.png"
                      className="m-auto md:w-[150px] md:h-[120px] w-[100px] h-[70px]"
                      width={150}
                      height={150}
                      alt="Tutor AI"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800 lg:self-end md:mt-6 lg:mt-0 rounded-xl h-full md:w-full">
                <div className="p-4 bg-gradient-to-tr from-zinc-800 via-zinc-800 to-violet-300/5 rounded-xl h-full">
                  <div className="flex flex-col justify-between gap-2 bg-[url('/assets/svgs/bg-700.svg')] bg-[length:200px_137px] h-full">
                    <div className="flex gap-2 items-center">
                      <div>
                        <div className="flex gap-2 items-center">
                          <h1 className={`text-2xl ${pixelatedFont()}`}>
                            Seu desempenho{' '}
                          </h1>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircleIcon className="w-4 text-zinc-500" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-md grid gap-2">
                                <p>
                                  - Palavras que possuem uma pontuação superior
                                  a 95 ou igual a 95 são representadas em{' '}
                                  <span className="px-1 bg-green-300/10 text-green-300 rounded-md">
                                    verde
                                  </span>
                                </p>
                                <p>
                                  - As palavras com uma pontuação de 50 pontos
                                  ou mais, mas inferior a 95 pontos, são
                                  representadas em{' '}
                                  <span className="px-1 bg-yellow-300/10 text-yellow-300 rounded-md">
                                    amarelo
                                  </span>
                                </p>
                                <p>
                                  - Palavras com pontuação de 0 a 49 pontos são
                                  representadas em{' '}
                                  <span className="px-1 bg-red-300/10 text-red-400 rounded-md">
                                    vermelho
                                  </span>
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <p className="flex gap-2 items-center text-xs text-zinc-400">
                          Consiga pontos conversando com os tutores{' '}
                          <CoinsIcon className="w-4 h-4" />
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col mt-auto gap-2 ">
                      <div className="bg-zinc-900 rounded-xl p-1 lg:h-full mt-auto">
                        <div
                          data-start={
                            (words.length / allWordsCount) * 100 <= 20
                          }
                          style={{
                            width: `${(words.length / allWordsCount) * 100}%`,
                          }}
                          className={`bg-green-500/5 flex gap-2 lg:flex-col data-[start=true]:items-start justify-between items-end text-green-300 p-1 rounded-xl text-xs`}
                        >
                          %{((words.length / allWordsCount) * 100).toFixed(2)}
                        </div>
                      </div>
                      <div className="bg-zinc-900 rounded-xl p-1 lg:h-full">
                        <div
                          data-start={
                            (yellowWords.length / allWordsCount) * 100 <= 20
                          }
                          style={{
                            width: `${(yellowWords.length / allWordsCount) * 100}%`,
                          }}
                          className="bg-yellow-500/5 flex gap-2 lg:flex-col data-[start=true]:items-start justify-between items-end text-yellow-300 p-1 rounded-xl text-xs"
                        >
                          %
                          {((yellowWords.length / allWordsCount) * 100).toFixed(
                            2,
                          )}
                        </div>
                      </div>
                      <div className="bg-zinc-900 rounded-xl p-1 lg:h-full">
                        <div
                          data-start={
                            (redWords.length / allWordsCount) * 100 <= 20
                          }
                          style={{
                            width: `${(redWords.length / allWordsCount) * 100}%`,
                          }}
                          className="bg-red-500/5 flex gap-2 lg:flex-col data-[start=true]:items-start justify-between items-end text-red-400 p-1 rounded-xl text-xs"
                        >
                          %
                          {((redWords.length / allWordsCount) * 100).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-2 justify-between">
            {/* <div className="relative flex-col shrink-0 flex justify-center items-center select-none h-[500px]">
              <div className="relative">
                <Image
                  src="/assets/svgs/dialogue.svg"
                  width={250}
                  className="ml-auto animate-in"
                  height={100}
                  alt="Tutor AI"
                />

                <p
                  className={`text-md typing-animation leading-4 absolute top-[calc(50%_+_-20px)] right-8 -translate-y-1/2 min-w-[200px] max-w-[200px] p-5 pl-8 ${pixelatedFont()}`}
                >
                  <Typing
                    text={`Sabia que dá pra aprender uma nova lingua em até 1 ano?`}
                  />
                </p>
              </div>

              <Image
                src="/assets/imgs/tutor-ai-04.png"
                width={200}
                height={200}
                alt="Tutor AI"
              />
            </div> */}
          </div>
        </div>
      </div>
    </Card>
  )
}
