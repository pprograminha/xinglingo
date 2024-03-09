'use server'

import {
  Conversation,
  Phoneme,
  PronunciationAssessment,
  User,
  Word,
} from '@/lib/db/drizzle/@types'
import { db } from '@/lib/db/drizzle/query'
import { conversations, users, words } from '@/lib/db/drizzle/schema'
import { InferInsertModel, asc, desc, eq, sql } from 'drizzle-orm'
import crypto from 'node:crypto'
import { cache } from 'react'

export type Conversations = (Conversation & {
  pronunciationAssessment:
    | (PronunciationAssessment & {
        words: (Word & {
          phonemes: Phoneme[]
        })[]
      })
    | null
})[]

const getConversations = cache(
  async function getConversations(): Promise<Conversations> {
    const conversationsData = await db.query.conversations.findMany({
      with: {
        author: true,
        pronunciationAssessment: {
          with: {
            words: {
              with: {
                phonemes: true,
              },
            },
          },
        },
      },
    })

    return conversationsData
  },
)
export const getConversation = async (
  conversationId: string,
): Promise<Conversations['0'] | undefined> => {
  const conversationsData = await db.query.conversations.findFirst({
    where: (conversations, { eq }) => eq(conversations.id, conversationId),
    with: {
      author: true,
      pronunciationAssessment: {
        with: {
          words: {
            with: {
              phonemes: true,
            },
          },
        },
      },
    },
  })

  return conversationsData
}

export const getWordsList = cache(async function getWords(
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
})

export { getConversations }

export async function createConversation({
  text,
  authorId,
}: Omit<InferInsertModel<typeof conversations>, 'id'>): Promise<
  Conversation & {
    author: User | null
  }
> {
  const [conversation] = (await db
    .insert(conversations)
    .values([
      {
        id: crypto.randomUUID(),
        text,
        authorId,
      },
    ])
    .returning()) as [
    Conversation & {
      author: User | null
    },
  ]

  if (conversation.authorId) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, conversation.authorId))

    conversation.author = user
  }

  return conversation
}
