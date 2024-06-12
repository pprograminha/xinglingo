import { getWordsList } from '@/actions/conversations/get-words-list'
import { CardContent, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getTranslations } from 'next-intl/server'

type GoalTabsProps = {
  wordsListData: Awaited<ReturnType<typeof getWordsList>>
  t: Awaited<ReturnType<typeof getTranslations>>
}
type GoalTabProps = {
  wordsListData: Awaited<ReturnType<typeof getWordsList>>
  value: 'yearly' | 'monthly' | 'daily'
  variant: 'day' | 'year' | 'month'
  t: Awaited<ReturnType<typeof getTranslations>>
}

type TltKeys =
  | "Today's goal: 14 words, 0 remaining"
  | 'Monthly goal: 400 words, 200 remaining'
  | 'Annual goal: 5000 words, 400 remaining'

const GoalTab = ({ t, wordsListData, value, variant }: GoalTabProps) => {
  const {
    count: {
      wordsPerYear,
      wordsPerYearRemaining,
      wordsPerDay,
      wordsPerDayRemaining,
      wordsPerMonthRemaining,
      wordsPerMonth,
    },
    green,
    red,
    yellow,
  } = wordsListData

  const colorsData = {
    green,
    red,
    yellow,
  } as const

  const wordsCount: Record<
    typeof variant,
    Record<'wordPerVariant' | 'wordVariantRemaining' | 'key', number | TltKeys>
  > = {
    day: {
      key: "Today's goal: 14 words, 0 remaining",
      wordPerVariant: wordsPerDay,
      wordVariantRemaining: wordsPerDayRemaining,
    },
    month: {
      key: 'Monthly goal: 400 words, 200 remaining',
      wordPerVariant: wordsPerMonth,
      wordVariantRemaining: wordsPerMonthRemaining,
    },
    year: {
      key: 'Annual goal: 5000 words, 400 remaining',
      wordPerVariant: wordsPerYear,
      wordVariantRemaining: wordsPerYearRemaining,
    },
  }
  const words: Record<
    typeof variant,
    Record<
      keyof typeof colorsData,
      {
        words: typeof colorsData.green.wordsSameDay
      }
    >
  > = {
    day: {
      green: {
        words: colorsData.green.wordsSameDay,
      },
      red: {
        words: colorsData.red.wordsSameDay,
      },
      yellow: {
        words: colorsData.yellow.wordsSameDay,
      },
    },
    year: {
      green: {
        words: colorsData.green.wordsSameYear,
      },
      red: {
        words: colorsData.red.wordsSameYear,
      },
      yellow: {
        words: colorsData.yellow.wordsSameYear,
      },
    },
    month: {
      green: {
        words: colorsData.green.wordsSameMonth,
      },
      red: {
        words: colorsData.red.wordsSameMonth,
      },
      yellow: {
        words: colorsData.yellow.wordsSameMonth,
      },
    },
  }

  return (
    <TabsContent value={value}>
      <CardContent className="mt-4 pb-2">
        <div className="gap-2 flex flex-wrap">
          <div className="bg-gradient-to-tr from-transparent to-zinc-700/40 flex-1 border border-green-300/10 p-2 rounded-xl inline-block">
            <CardTitle className="text-xs font-medium">
              <span className="text-green-200">{t('Green words')}</span>
            </CardTitle>
            <div className="text-xl mt-1 font-bold">
              {words[variant].green.words.length}
            </div>
          </div>
          <div className="bg-gradient-to-tr from-transparent to-zinc-700/40 flex-1 lg:flex-none  border border-yellow-300/10 p-2 rounded-xl inline-block">
            <CardTitle className="text-xs font-medium">
              <span className="text-yellow-100">{t('Yellow words')}</span>
            </CardTitle>
            <div className="text-xl mt-1 font-bold">
              {words[variant].yellow.words.length}
            </div>
          </div>
          <div className="bg-gradient-to-tr from-transparent to-zinc-700/40 flex-1 lg:flex-none  border border-red-300/10 p-2 rounded-xl inline-block">
            <CardTitle className="text-xs font-medium">
              <span className="text-red-200">{t('Red words')}</span>
            </CardTitle>
            <div className="text-xl mt-1 font-bold">
              {words[variant].red.words.length}
            </div>
          </div>
        </div>
        <p className="text-xs mt-2 text-zinc-400">
          {t(wordsCount[variant].key as TltKeys, {
            words: wordsCount[variant].wordPerVariant,
            remaining: wordsCount[variant].wordVariantRemaining,
          })}
        </p>
      </CardContent>
    </TabsContent>
  )
}

export const GoalTabs = ({ wordsListData, t }: GoalTabsProps) => {
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
      <GoalTab
        t={t}
        value="yearly"
        variant="year"
        wordsListData={wordsListData}
      />
      <GoalTab
        t={t}
        value="monthly"
        variant="month"
        wordsListData={wordsListData}
      />
      <GoalTab
        t={t}
        value="daily"
        variant="day"
        wordsListData={wordsListData}
      />
    </Tabs>
  )
}
