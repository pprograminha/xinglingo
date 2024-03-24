import { Metadata } from 'next'

import { getConversations } from '@/components/chat/actions/get-conversations'
import { getWordsList } from '@/components/chat/actions/get-words-list'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { isGreen, isRed, isYellow } from '@/lib/score-color'
import {
  eachWeekendOfMonth,
  getDate,
  getDaysInMonth,
  isSameDay,
  isSameMonth,
  isSameYear,
} from 'date-fns'
import { ArrowLeft, WholeWord } from 'lucide-react'
import Link from 'next/link'
import { Overview } from './components/overview'
import { WordsList } from './components/words-list'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'EnglishAi dashboard',
}

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [conversations, wordsList] = await Promise.all([
    getConversations(),
    getWordsList(),
  ])

  const allWords = conversations
    .filter((c) => c.authorId)
    .flatMap((c) => c.pronunciationAssessment?.words || [])

  const currentDate = new Date()
  const sub = (n1: number, n2: number) => (n1 - n2 < 0 ? 0 : n1 - n2)

  const wordsSameYear = (filter: (accuracyScore: number) => boolean) =>
    allWords
      .filter((w) => isSameYear(w.createdAt, currentDate))
      .filter((w) => filter(w.accuracyScore))

  const wordsSameMonth = (filter: (accuracyScore: number) => boolean) =>
    allWords
      .filter((w) => isSameMonth(w.createdAt, currentDate))
      .filter((w) => filter(w.accuracyScore))

  const wordsSameDay = (filter: (accuracyScore: number) => boolean) =>
    allWords
      .filter((w) => isSameDay(w.createdAt, currentDate))
      .filter((w) => filter(w.accuracyScore))

  const wordsPerYear = 5000
  const wordsPerYearRemaining = sub(wordsPerYear, wordsSameYear(isGreen).length)

  const wordsPerMonth = Math.round(wordsPerYearRemaining / 12)
  const wordsPerMonthRemaining = sub(
    wordsPerMonth,
    wordsSameMonth(isGreen).length,
  )

  const wordsPerDay = Math.round(
    wordsPerMonthRemaining /
      (getDaysInMonth(currentDate) -
        getDate(currentDate) -
        eachWeekendOfMonth(currentDate).filter((d) => d >= currentDate).length),
  )
  const wordsPerDayRemaining = sub(wordsPerDay, wordsSameDay(isGreen).length)

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
                      {wordsSameYear(isGreen).length}
                    </div>
                    <div className="my-2">
                      <p className="text-xs font-bold rounded-md mb-1 inline-block ">
                        <span className="text-yellow-200">Yellow Words</span>:{' '}
                        {wordsSameYear(isYellow).length}
                      </p>
                      <br />
                      <p className="text-xs font-bold rounded-md inline-block">
                        <span className="text-red-400">Red Words</span>:{' '}
                        {wordsSameYear(isRed).length}
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
                      {wordsSameMonth(isGreen).length}
                    </div>
                    <div className="my-2">
                      <p className="text-xs font-bold rounded-md mb-1 inline-block ">
                        <span className="text-yellow-200">Yellow Words</span>:{' '}
                        {wordsSameMonth(isYellow).length}
                      </p>
                      <br />
                      <p className="text-xs font-bold rounded-md inline-block">
                        <span className="text-red-400">Red Words</span>:{' '}
                        {wordsSameMonth(isRed).length}
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
                      {wordsSameDay(isGreen).length}
                    </div>
                    <div className="my-2">
                      <p className="text-xs font-bold rounded-md mb-1 inline-block ">
                        <span className="text-yellow-200">Yellow Words</span>:{' '}
                        {wordsSameDay(isYellow).length}
                      </p>
                      <br />
                      <p className="text-xs font-bold rounded-md inline-block">
                        <span className="text-red-400">Red Words</span>:{' '}
                        {wordsSameDay(isRed).length}
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
                    <Overview
                      greenWords={wordsSameYear(isGreen)}
                      yellowWords={wordsSameYear(isYellow)}
                      redWords={wordsSameYear(isRed)}
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
