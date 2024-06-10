import { getWordsList } from '@/actions/conversations/get-words-list'
import { CardContent, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getTranslations } from 'next-intl/server'

type GoalTabsProps = {
  wordsListData: Awaited<ReturnType<typeof getWordsList>>
  t: Awaited<ReturnType<typeof getTranslations>>
}
export const GoalTabs = async ({ wordsListData, t }: GoalTabsProps) => {
  const {
    count: {
      wordsPerDay,
      wordsPerDayRemaining,
      wordsPerMonth,
      wordsPerMonthRemaining,
      wordsPerYear,
      wordsPerYearRemaining,
    },
    green,
    red,
    yellow,
  } = wordsListData
  return (
    <Tabs defaultValue="yearly" className="w-full">
      <div className="px-6">
        <TabsList className="flex w-full flex-wrap h-auto">
          <TabsTrigger className="flex-1" value="yearly">
            {t('This year')}
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="monthly">
            {t('This month')}
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="daily">
            {t('Today')}
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="yearly">
        <CardContent className="mt-4 pb-2">
          <div className="gap-2 flex flex-wrap">
            <div className="bg-gradient-to-tr from-transparent to-zinc-700/40 flex-1 border border-green-300/10 p-2 rounded-xl inline-block">
              <CardTitle className="text-xs font-medium">
                <span className="text-green-200">{t('Green words')}</span>
              </CardTitle>
              <div className="text-xl mt-1 font-bold">
                {green.wordsSameYear.length}
              </div>
            </div>
            <div className="bg-gradient-to-tr from-transparent to-zinc-700/40  border border-yellow-300/10 p-2 rounded-xl inline-block">
              <CardTitle className="text-xs font-medium">
                <span className="text-yellow-100">{t('Yellow words')}</span>
              </CardTitle>
              <div className="text-xl mt-1 font-bold">
                {yellow.wordsSameYear.length}
              </div>
            </div>
            <div className="bg-gradient-to-tr from-transparent to-zinc-700/40  border border-red-300/10 p-2 rounded-xl inline-block">
              <CardTitle className="text-xs font-medium">
                <span className="text-red-200">{t('Red words')}</span>
              </CardTitle>
              <div className="text-xl mt-1 font-bold">
                {red.wordsSameYear.length}
              </div>
            </div>
          </div>
          <p className="text-xs mt-2 text-zinc-400">
            {t('Annual goal: 5000 words, 400 remaining', {
              words: wordsPerYear,
              remaining: wordsPerYearRemaining,
            })}
          </p>
        </CardContent>
      </TabsContent>
      <TabsContent value="monthly">
        <CardContent className="mt-4 pb-2">
          <div className="gap-2 flex flex-wrap">
            <div className="bg-gradient-to-tr from-transparent to-zinc-700/40 flex-1 border border-green-300/10 p-2 rounded-xl inline-block">
              <CardTitle className="text-xs font-medium">
                <span className="text-green-200">{t('Green words')}</span>
              </CardTitle>
              <div className="text-xl mt-1 font-bold">
                {green.wordsSameMonth.length}
              </div>
            </div>
            <div className="bg-gradient-to-tr from-transparent to-zinc-700/40  border border-yellow-300/10 p-2 rounded-xl inline-block">
              <CardTitle className="text-xs font-medium">
                <span className="text-yellow-100">{t('Yellow words')}</span>
              </CardTitle>
              <div className="text-xl mt-1 font-bold">
                {yellow.wordsSameMonth.length}
              </div>
            </div>
            <div className="bg-gradient-to-tr from-transparent to-zinc-700/40  border border-red-300/10 p-2 rounded-xl inline-block">
              <CardTitle className="text-xs font-medium">
                <span className="text-red-200">{t('Red words')}</span>
              </CardTitle>
              <div className="text-xl mt-1 font-bold">
                {red.wordsSameMonth.length}
              </div>
            </div>
          </div>
          <p className="text-xs mt-2 text-zinc-400">
            {t('Monthly goal: 400 words, 200 remaining', {
              words: wordsPerMonth,
              remaining: wordsPerMonthRemaining,
            })}
          </p>
        </CardContent>
      </TabsContent>
      <TabsContent value="daily">
        <CardContent className="mt-4 pb-2">
          <div className="gap-2 flex flex-wrap">
            <div className="bg-gradient-to-tr from-transparent to-zinc-700/40 flex-1 border border-green-300/10 p-2 rounded-xl inline-block">
              <CardTitle className="text-xs font-medium">
                <span className="text-green-200">{t('Green words')}</span>
              </CardTitle>
              <div className="text-xl mt-1 font-bold">
                {green.wordsSameDay.length}
              </div>
            </div>
            <div className="bg-gradient-to-tr from-transparent to-zinc-700/40  border border-yellow-300/10 p-2 rounded-xl inline-block">
              <CardTitle className="text-xs font-medium">
                <span className="text-yellow-100">{t('Yellow words')}</span>
              </CardTitle>
              <div className="text-xl mt-1 font-bold">
                {yellow.wordsSameDay.length}
              </div>
            </div>
            <div className="bg-gradient-to-tr from-transparent to-zinc-700/40  border border-red-300/10 p-2 rounded-xl inline-block">
              <CardTitle className="text-xs font-medium">
                <span className="text-red-200">{t('Red words')}</span>
              </CardTitle>
              <div className="text-xl mt-1 font-bold">
                {red.wordsSameDay.length}
              </div>
            </div>
          </div>
          <p className="text-xs mt-2 text-zinc-400">
            {t("Today's goal: 14 words, 0 remaining", {
              words: wordsPerDay,
              remaining: wordsPerDayRemaining,
            })}
          </p>
        </CardContent>
      </TabsContent>
    </Tabs>
  )
}
