import { Metadata } from 'next'

import { getWordsList } from '@/actions/conversations/get-words-list'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, WholeWord } from 'lucide-react'
import Link from 'next/link'
import { DailyWords } from './components/daily-words'
import { WordsList } from './components/words-list'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'LingoAI dashboard',
}

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const {
    words: wordsList,
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
  } = await getWordsList()

  return (
    <>
      <div className="flex-col flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <div className="flex gap-2 items-center">
              <Button size="icon" variant="outline" asChild>
                <Link href="/">
                  <ArrowLeft />
                </Link>
              </Button>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <div className="cursor-not-allowed">
                <TabsTrigger value="analytics" disabled>
                  Analytics
                </TabsTrigger>
              </div>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Annual{' '}
                      <span className="text-green-400">Green Words</span>
                    </CardTitle>
                    <WholeWord />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {green.wordsSameYear.length}
                    </div>
                    <div className="my-2">
                      <p className="text-xs font-bold rounded-md mb-1 inline-block ">
                        <span className="text-yellow-200">Yellow Words</span>:{' '}
                        {yellow.wordsSameYear.length}
                      </p>
                      <br />
                      <p className="text-xs font-bold rounded-md inline-block">
                        <span className="text-red-400">Red Words</span>:{' '}
                        {red.wordsSameYear.length}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Annual goal: {wordsPerYear} words, {wordsPerYearRemaining}{' '}
                      remaining
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Monthly{' '}
                      <span className="text-green-400">Green Words</span>
                    </CardTitle>
                    <WholeWord />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {green.wordsSameMonth.length}
                    </div>
                    <div className="my-2">
                      <p className="text-xs font-bold rounded-md mb-1 inline-block ">
                        <span className="text-yellow-200">Yellow Words</span>:{' '}
                        {yellow.wordsSameMonth.length}
                      </p>
                      <br />
                      <p className="text-xs font-bold rounded-md inline-block">
                        <span className="text-red-400">Red Words</span>:{' '}
                        {red.wordsSameMonth.length}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Monthly goal: {wordsPerMonth} words,{' '}
                      {wordsPerMonthRemaining} remaining
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Daily{' '}
                      <span className="text-green-400">Green Words</span>
                    </CardTitle>
                    <WholeWord />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {green.wordsSameDay.length}
                    </div>
                    <div className="my-2">
                      <p className="text-xs font-bold rounded-md mb-1 inline-block ">
                        <span className="text-yellow-200">Yellow Words</span>:{' '}
                        {yellow.wordsSameDay.length}
                      </p>
                      <br />
                      <p className="text-xs font-bold rounded-md inline-block">
                        <span className="text-red-400">Red Words</span>:{' '}
                        {red.wordsSameDay.length}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Daily goal: {wordsPerDay} words, {wordsPerDayRemaining}{' '}
                      remaining
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Month Words</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <DailyWords
                      greenWords={green.words}
                      yellowWords={yellow.words}
                      redWords={red.words}
                    />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Words List</CardTitle>
                    <CardDescription>
                      Words: {wordsList.reduce((c, w) => c + w.wordCount, 0)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <WordsList wordsList={wordsList} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
