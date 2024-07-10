'use server'
import { getAuth, withAuth } from '@/lib/auth/get-auth'
import { db } from '@/lib/db/drizzle/query'
import {
  conversations,
  pronunciationsAssessment,
  words,
} from '@/lib/db/drizzle/schema'
import { User } from '@/lib/db/drizzle/types'
import {
  differenceInDays,
  eachWeekendOfMonth,
  getDate,
  getDaysInMonth,
  isEqual,
  isSameDay,
  isSameMonth,
  isSameYear,
  startOfDay,
} from 'date-fns'
import { asc, desc, eq, sql } from 'drizzle-orm'

type GetWordsProps = {
  sort?: 'desc' | 'asc'
  user?: User
  date?: Date
}

export const getWordsList = async (props?: GetWordsProps) => {
  return (
    await withAuth(async (props?: GetWordsProps) => {
      const { sort = 'desc' } = props || {}

      const { user } = await getAuth()

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
          wordCount: sql<number>`count(${words.word}) as wordCount`.mapWith(
            Number,
          ),
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
      const div = (n1: number, n2: number) =>
        n1 / n2 === Infinity ? 0 : n1 / n2

      const wordsPerYear = 5000
      const wordsPerYearCurrent = wordsSameDate('green', isSameYear).length
      const wordsPerYearRemaining = sub(
        wordsPerYear,
        wordsSameDate('green', isSameYear).length,
      )
      const wordsRemaining = sub(wordsPerYear, wordsSameDate('green').length)

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
            eachWeekendOfMonth(currentDate).filter((d) => d >= currentDate)
              .length,
        ),
      )
      const wordsPerDayCurrent = wordsSameDate('green', isSameDay).length
      const wordsPerDayRemaining = sub(
        wordsPerDay,
        wordsSameDate('green', isSameDay).length,
      )

      let intensive = 0

      if (user) {
        let conversationsCreatedAt = (
          await db.query.conversations.findMany({
            where: (conversations, { eq }) =>
              eq(conversations.recipientId, user.id),
            columns: {
              text: true,
              createdAt: true,
            },
            orderBy: [desc(conversations.createdAt)],
          })
        ).map((c) => c.createdAt)

        conversationsCreatedAt = conversationsCreatedAt.map((createdAt) =>
          startOfDay(createdAt),
        )

        conversationsCreatedAt = conversationsCreatedAt.reduce(
          (oldConversationsCreatedAt, conversationCreatedAt) => {
            const existingConversationCreatedAt =
              oldConversationsCreatedAt.some((oldConversationCreatedAt) =>
                isEqual(oldConversationCreatedAt, conversationCreatedAt),
              )

            if (existingConversationCreatedAt) return oldConversationsCreatedAt

            return [...oldConversationsCreatedAt, conversationCreatedAt]
          },
          [] as typeof conversationsCreatedAt,
        )

        const isStudiedToday = conversationsCreatedAt.some((c) =>
          isEqual(c, startOfDay(currentDate)),
        )

        intensive += isStudiedToday ? 1 : 0

        let oldConversationsCreatedAt:
          | (typeof conversationsCreatedAt)[number]
          | null = null

        for (const createdAt of conversationsCreatedAt) {
          if (!oldConversationsCreatedAt) {
            oldConversationsCreatedAt = createdAt
            continue
          }
          const diff = differenceInDays(oldConversationsCreatedAt, createdAt)

          if (diff > 1) break

          intensive += 1
        }
      }

      const emblems = Math.floor(wordsData.length / wordsPerYear)

      const wordsToLearn = wordsPerYear * (emblems + 1)

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
          intensive,
          emblems,
          wordsToLearn,
          wordsRemaining,
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
    })
  )(props)
}
