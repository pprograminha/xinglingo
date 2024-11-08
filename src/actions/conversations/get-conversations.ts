'use server'

import { getAuth } from '@/lib/auth/get-auth'
import { db } from '@/lib/db/drizzle/query'
import { conversations } from '@/lib/db/drizzle/schema'
import {
  Conversation,
  Phoneme,
  PronunciationAssessment,
  Word,
} from '@/lib/db/drizzle/types'
import { desc } from 'drizzle-orm'

type Conversations = (Conversation & {
  pronunciationAssessment:
    | (PronunciationAssessment & {
        words: (Word & {
          phonemes: Phoneme[]
        })[]
      })
    | null
})[]

type GetConversationsParams = {
  lessonId?: string
}
export const getConversations = async (
  params?: GetConversationsParams,
): Promise<Conversations> => {
  const { user } = await getAuth()

  if (!user) return []

  const { lessonId } = params || {}

  const conversationsData = await db.query.conversations.findMany({
    where: (conversations, { eq, and }) =>
      and(
        eq(conversations.recipientId, user.id),
        lessonId ? eq(conversations.lessonId, lessonId) : undefined,
      ),
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
    orderBy: [desc(conversations.createdAt)],
  })

  return conversationsData
}
