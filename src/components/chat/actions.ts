'use server'

import {
  Conversation,
  Phoneme,
  PronunciationAssessment,
  User,
  Word,
} from '@/lib/db/drizzle/@types'
import { db } from '@/lib/db/drizzle/query'
import { conversations, users } from '@/lib/db/drizzle/schema'
import { InferInsertModel, eq } from 'drizzle-orm'
import crypto from 'node:crypto'
import { cache } from 'react'

type Response = (Conversation & {
  pronunciationAssessment:
    | (PronunciationAssessment & {
        words: (Word & {
          phonemes: Phoneme[]
        })[]
      })
    | null
})[]

const getConversations = cache(
  async function getConversations(): Promise<Response> {
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
