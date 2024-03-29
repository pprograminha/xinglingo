'use server'
import { db } from '@/lib/db/drizzle/query'
import { words } from '@/lib/db/drizzle/schema'
import { asc, desc, sql } from 'drizzle-orm'

export const getWordsList = async function getWords(
  orderProp: 'desc' | 'asc' = 'desc',
): Promise<
  {
    word: string
    wordCount: number
    avgAccuracyScore: number
  }[]
> {
  const sq = db
    .select({
      word: words.word,
      accuracyScore: words.accuracyScore,
    })
    .from(words)
    .as('sq')

  const order = {
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
    })
    .from(sq)
    .groupBy(sql`word`)
    .orderBy(order[orderProp](sql`wordCount`))

  return wordsData
}
