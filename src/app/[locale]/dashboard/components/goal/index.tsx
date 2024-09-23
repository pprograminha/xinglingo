import { getWordsList } from '@/actions/conversations/get-words-list'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getTranslations } from 'next-intl/server'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { interSansFont } from '@/lib/font/google/inter-sans-font'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { CircleHelpIcon } from 'lucide-react'
import { GoalTabs } from './goal-tabs'
import { WordsList } from './words-list'

type GoalProps = {
  wordsListData: Awaited<ReturnType<typeof getWordsList>>
  t: Awaited<ReturnType<typeof getTranslations>>
}
export const Goal = ({ wordsListData, t }: GoalProps) => {
  const {
    words: wordsList,
    count: { wordsToLearn, wordsRemaining },
  } = wordsListData

  return (
    <Card className="bg-gradient-to-tr hidden md:block col-span-4 md:col-span-2 lg:col-span-1 dark:to-zinc-920 dark:from-zinc-800">
      <div className="h-full flex flex-col justify-between  w-full bg-repeat-y rounded-xl ">
        <div>
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className={`text-2xl font-medium ${pixelatedFont()}`}>
              {t.rich(
                'Your goal is to learn {words} words, {wordsRemaining} words remaining',
                {
                  words: wordsToLearn,
                  wordsRemaining,
                  questionHelp: () => (
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger className="w-4 h-4 inline-block">
                        <CircleHelpIcon className="w-full h-full block -mb-0.5 text-zinc-400" />{' '}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className={`${interSansFont()}`}>
                          {t(
                            'For fluency, you may need to learn from 5000 to 10000 words',
                            {
                              wordsMin: wordsToLearn,
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
                  ),
                },
              )}
            </CardTitle>
            <CardDescription className="text-xs">
              {t('All the words you learned in the year 2024', {
                year: new Date().getFullYear(),
              })}
              :
            </CardDescription>
          </CardHeader>
          <GoalTabs wordsListData={wordsListData} t={t} />
        </div>
        <div>
          <CardContent>
            <WordsList wordsList={wordsList} t={t} />
          </CardContent>
        </div>
      </div>
    </Card>
  )
}
