'use server'

import { getAuth, withAuth } from '@/lib/auth/get-auth'
import {
  Conversation,
  Phoneme,
  PronunciationAssessment,
  Word,
} from '@/lib/db/drizzle/types'
import { db } from '@/lib/db/drizzle/query'
import { conversations } from '@/lib/db/drizzle/schema'
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

export const getConversations = async (): Promise<Conversations> => {
  return (
    await withAuth(async () => {
      const { user } = await getAuth()

      if (!user) return []

      const conversationsData = await db.query.conversations.findMany({
        where: ({ authorId }, { eq }) => eq(authorId, user.id),
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
    }, [])
  )()
}
