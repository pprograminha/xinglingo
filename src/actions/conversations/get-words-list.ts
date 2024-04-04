'use server'
import { User } from '@/lib/db/drizzle/@types'
import { db } from '@/lib/db/drizzle/query'
import { pronunciationsAssessment, words } from '@/lib/db/drizzle/schema'
import {
  eachWeekendOfMonth,
  getDate,
  getDaysInMonth,
  isSameDay,
  isSameMonth,
  isSameYear,
} from 'date-fns'
import { asc, desc, eq, sql } from 'drizzle-orm'

type GetWordsProps = {
  sort?: 'desc' | 'asc'
  user?: User
  date?: Date
}

export const getWordsList = async function getWords(props?: GetWordsProps) {
  const { sort = 'desc', user } = props || {}

  const sqWithoutWhere = db
    .select({
      word: words.word,
      accuracyScore: words.accuracyScore,
      createdAt: words.createdAt,
    })
    .from(words)

  const sqWithWhere =
    user &&
    sqWithoutWhere
      .innerJoin(
        pronunciationsAssessment,
        eq(words.pronunciationAssessmentId, pronunciationsAssessment.id),
      )
      .where(eq(pronunciationsAssessment.creatorId, user.id))
      .as('sq')

  let sq: typeof sqWithoutWhere | typeof sqWithWhere = sqWithoutWhere

  if (sqWithWhere) {
    sq = sqWithWhere
  } else {
    sq = sqWithoutWhere.as('sq')
  }

  const sorts = {
    desc,
    asc,
  }
  const wordsData = await db
    .select({
      word: sql`${words.word}`.mapWith(String),
      wordCount: sql<number>`count(${words.word}) as wordCount`.mapWith(Number),
      avgAccuracyScore:
        sql<number>`avg(${words.accuracyScore}) as avgAccuracyScore`.mapWith(
          Number,
        ),
      scoreColor: sql<string>`CASE
        WHEN avg(${words.accuracyScore}) >= 0 AND avg(${words.accuracyScore}) < 50 THEN 'red'
        WHEN avg(${words.accuracyScore}) >= 50 AND avg(${words.accuracyScore}) < 95 THEN 'yellow'
        ELSE 'green'
      END AS scoreColor`,
      createdAt: sql<Date>`MIN(${words.createdAt}) as createdAt`.mapWith(
        (d) => new Date(d),
      ),
    })
    .from(sq)
    .groupBy(sql`word`)
    .orderBy(sorts[sort](sql`wordCount`))

  const wordsSameDate = (
    scoreColor: string,
    isSame?: (d1: Date | string, d2: Date | string) => boolean,
  ) =>
    wordsData
      .filter((w) => !isSame || isSame(w.createdAt, currentDate))
      .filter((w) => w.scoreColor === scoreColor)

  const currentDate = new Date()
  const sub = (n1: number, n2: number) => (n1 - n2 < 0 ? 0 : n1 - n2)
  const div = (n1: number, n2: number) => (n1 / n2 === Infinity ? 0 : n1 / n2)

  const wordsPerYear = 5000
  const wordsPerYearCurrent = wordsSameDate('green', isSameYear).length
  const wordsPerYearRemaining = sub(
    wordsPerYear,
    wordsSameDate('green', isSameYear).length,
  )

  const wordsPerMonth = Math.round(div(wordsPerYearRemaining, 12))
  const wordsPerMonthCurrent = wordsSameDate('green', isSameMonth).length
  const wordsPerMonthRemaining = sub(
    wordsPerMonth,
    wordsSameDate('green', isSameMonth).length,
  )

  const wordsPerDay = Math.round(
    div(
      wordsPerMonthRemaining,
      getDaysInMonth(currentDate) -
        getDate(currentDate) -
        eachWeekendOfMonth(currentDate).filter((d) => d >= currentDate).length,
    ),
  )
  const wordsPerDayCurrent = wordsSameDate('green', isSameDay).length
  const wordsPerDayRemaining = sub(
    wordsPerDay,
    wordsSameDate('green', isSameDay).length,
  )

  const response = {
    words: wordsData,
    green: {
      words: wordsSameDate('green'),
      wordsSameYear: wordsSameDate('green', isSameYear),
      wordsSameMonth: wordsSameDate('green', isSameMonth),
      wordsSameDay: wordsSameDate('green', isSameDay),
    },
    red: {
      words: wordsSameDate('red'),
      wordsSameYear: wordsSameDate('red', isSameYear),
      wordsSameMonth: wordsSameDate('red', isSameMonth),
      wordsSameDay: wordsSameDate('red', isSameDay),
    },
    yellow: {
      words: wordsSameDate('yellow'),
      wordsSameYear: wordsSameDate('yellow', isSameYear),
      wordsSameMonth: wordsSameDate('yellow', isSameMonth),
      wordsSameDay: wordsSameDate('yellow', isSameDay),
    },
    count: {
      wordsPerYear,
      wordsPerYearCurrent,
      wordsPerYearRemaining,
      wordsPerMonth,
      wordsPerMonthCurrent,
      wordsPerMonthRemaining,
      wordsPerDay,
      wordsPerDayCurrent,
      wordsPerDayRemaining,
    },
  }

  return response
}
