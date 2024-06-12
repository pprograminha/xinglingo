import { getWordsList } from '@/actions/conversations/get-words-list'
import { CardContent, CardTitle, Card, CardHeader } from '@/components/ui/card'
import { getTranslations } from 'next-intl/server'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { interSansFont } from '@/lib/font/google/inter-sans-font'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { CircleHelpIcon } from 'lucide-react'
import { GoalTabs } from './goal-tabs'
import { WordsList } from '../words-list'

type GoalProps = {
  wordsListData: Awaited<ReturnType<typeof getWordsList>>
  t: Awaited<ReturnType<typeof getTranslations>>
}
export const Goal = ({ wordsListData, t }: GoalProps) => {
  const {
    words: wordsList,
    count: { wordsPerYear, wordsPerYearRemaining },
  } = wordsListData

  return (
    <Card className="bg-gradient-to-tr col-span-3 md:col-span-1 dark:from-zinc-920 dark:to-zinc-900">
      <div className="h-full bg-[url('/assets/svgs/layered-steps.svg')] w-full bg-repeat-y rounded-xl ">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-2xl font-medium ${pixelatedFont()}`}>
            {t.rich(
              'Your goal is to learn 5000 words this year, 400 words remaining',
              {
                wordsPerYear,
                wordsPerYearRemaining,
                questionHelp: () => (
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger className="w-4 h-4 inline-block">
                        <CircleHelpIcon className="w-full h-full block -mb-0.5 text-zinc-400" />{' '}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className={`${interSansFont()}`}>
                          {t(
                            'For fluency, you may need to learn from 5000 to 10000 words',
                            {
                              wordsMin: wordsPerYear,
                              wordsMax: 10000,
                            },
                          )}
                          <br />
                          {t("It's only 14 words a day, you can do it!", {
                            words: 14,
                          })}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ),
              },
            )}
            <br />
            <span className="text-lg">
              {t('All the words you learned in the year 2024', {
                year: new Date().getFullYear(),
              })}
              :
            </span>
          </CardTitle>
        </CardHeader>
        <GoalTabs wordsListData={wordsListData} t={t} />
        <CardContent>
          <WordsList wordsList={wordsList} t={t} />
        </CardContent>
      </div>
    </Card>
  )
}
