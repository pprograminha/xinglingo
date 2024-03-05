import { Metadata } from 'next'

import { getConversations, getWordMetrics } from '@/components/chat/actions'
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
import { getDaysInMonth, isSameDay, isSameMonth, isSameYear } from 'date-fns'
import { ArrowLeft, WholeWord } from 'lucide-react'
import Link from 'next/link'
import { Overview } from './components/overview'
import { WordMetrics } from './components/word-metrics'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'EnglishAi dashboard',
}

export const revalidate = 60

export default async function DashboardPage() {
  const [conversations, wordMetrics] = await Promise.all([
    getConversations(),
    getWordMetrics(),
  ])

  const allWords = conversations
    .map((c) => c.pronunciationAssessment?.words || [])
    .flat()

  const currentDate = new Date()

  const wordsSameYear = (is: (n: number) => boolean) =>
    allWords
      .filter((w) => isSameYear(w.createdAt, currentDate))
      .filter((w) => is(w.accuracyScore))

  const wordsSameMonth = (is: (n: number) => boolean) =>
    allWords
      .filter((w) => isSameMonth(w.createdAt, currentDate))
      .filter((w) => is(w.accuracyScore))

  const wordsSameDay = (is: (n: number) => boolean) =>
    allWords
      .filter((w) => isSameDay(w.createdAt, currentDate))
      .filter((w) => is(w.accuracyScore))

  const wordsPerYear = 5000
  const wordsPerMonth = Math.round(wordsPerYear / 12)
  const wordsPerDay = Math.round(wordsPerMonth / getDaysInMonth(currentDate))

  const sub = (n1: number, n2: number) => (n1 - n2 < 0 ? 0 : n1 - n2)

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
                      Annual goal: {wordsPerYear} words,{' '}
                      {sub(wordsPerYear, wordsSameYear(isGreen).length)}{' '}
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
                      {sub(wordsPerMonth, wordsSameMonth(isGreen).length)}{' '}
                      remaining
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
                      Daily goal: {wordsPerDay} words,{' '}
                      {sub(wordsPerDay, wordsSameDay(isGreen).length)} remaining
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview wordsSameYear={wordsSameYear(isGreen)} />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Word Metrics</CardTitle>
                    <CardDescription>
                      Words: {wordMetrics.reduce((c, w) => c + w.wordCount, 0)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <WordMetrics wordMetrics={wordMetrics} />
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
