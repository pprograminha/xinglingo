import { getWordsList } from '@/actions/conversations/get-words-list'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { cn } from '@/lib/utils'
import { CoinsIcon, HelpCircleIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

type YourPerformanceProps = {
  t: Awaited<ReturnType<typeof getTranslations>>
  wordsListData: Awaited<ReturnType<typeof getWordsList>>
  className?: string
}
export const YourPerformance = ({
  t,
  wordsListData,
  className,
}: YourPerformanceProps) => {
  const {
    words,
    green: { words: greenWords },
    red: { words: redWords },
    yellow: { words: yellowWords },
  } = wordsListData

  const allWordsCount = words.length

  const getPercentage = (n1: number, n2: number) => (n1 / n2) * 100 || 0

  return (
    <div
      className={cn(
        'md:bg-transparent bg-zinc-800 lg:self-end md:mt-6 lg:mt-0 rounded-xl h-full md:w-full',
        className,
      )}
    >
      <div
        className="p-4 md:bg-none bg-gradient-to-tr from-zinc-800 via-zinc-800 to-violet-300/5 rounded-xl h-full"
        id="gradient"
      >
        <div
          className="flex flex-col justify-between md:bg-none gap-2 bg-[url('/assets/svgs/bg-700.svg')] bg-[length:200px_137px] h-full"
          id="bg"
        >
          <div className="flex gap-2 items-center">
            <div>
              <div className="flex gap-2 items-center">
                <h1 className={`text-2xl ${pixelatedFont()}`}>
                  {t('Your performance')}{' '}
                </h1>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircleIcon className="w-4 text-zinc-500" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-md grid gap-2">
                      <p>
                        {t.rich(
                          'Words with a score above or equal to 95 are represented in <g>green</g>',
                          {
                            g: (chunks) => (
                              <span className="px-1 bg-green-300/10 text-green-300 rounded-md">
                                {chunks}
                              </span>
                            ),
                          },
                        )}
                      </p>
                      <p>
                        {t.rich(
                          'Words with a score of 50 points or more but less than 95 points are represented in <y>yellow</y>',
                          {
                            y: (chunks) => (
                              <span className="px-1 bg-yellow-300/10 text-yellow-300 rounded-md">
                                {chunks}
                              </span>
                            ),
                          },
                        )}
                      </p>
                      <p>
                        {t.rich(
                          'Words with a score between 0 and 49 points are represented in <r>red</r>',
                          {
                            r: (chunks) => (
                              <span className="px-1 bg-red-300/10 text-red-400 rounded-md">
                                {chunks}
                              </span>
                            ),
                          },
                        )}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="flex gap-2 items-center text-xs text-zinc-400">
                {t('Earn points by talking to the petutors')}
                <CoinsIcon className="w-4 h-4" />
              </p>
            </div>
          </div>
          <div className="flex flex-col mt-auto gap-2 ">
            <div className="bg-zinc-900 rounded-xl p-1 lg:h-full mt-auto">
              <div
                data-start={
                  getPercentage(greenWords.length, allWordsCount) <= 20
                }
                style={{
                  width: `${getPercentage(greenWords.length, allWordsCount)}%`,
                }}
                className={`bg-green-500/5 flex gap-2 lg:flex-col data-[start=true]:items-start justify-between items-end text-green-300 p-1 rounded-xl text-xs`}
              >
                %{getPercentage(greenWords.length, allWordsCount).toFixed(2)}
              </div>
            </div>
            <div className="bg-zinc-900 rounded-xl p-1 lg:h-full">
              <div
                data-start={
                  getPercentage(yellowWords.length, allWordsCount) <= 20
                }
                style={{
                  width: `${getPercentage(yellowWords.length, allWordsCount)}%`,
                }}
                className="bg-yellow-500/5 flex gap-2 lg:flex-col data-[start=true]:items-start justify-between items-end text-yellow-300 p-1 rounded-xl text-xs"
              >
                %{getPercentage(yellowWords.length, allWordsCount).toFixed(2)}
              </div>
            </div>
            <div className="bg-zinc-900 rounded-xl p-1 lg:h-full">
              <div
                data-start={getPercentage(redWords.length, allWordsCount) <= 20}
                style={{
                  width: `${getPercentage(redWords.length, allWordsCount)}%`,
                }}
                className="bg-red-500/5 flex gap-2 lg:flex-col data-[start=true]:items-start justify-between items-end text-red-400 p-1 rounded-xl text-xs"
              >
                %{getPercentage(redWords.length, allWordsCount).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
