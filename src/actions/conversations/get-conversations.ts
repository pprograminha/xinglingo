'use server'

import { withAuth } from '@/lib/auth/get-auth'
import {
  Conversation,
  Phoneme,
  PronunciationAssessment,
  Word,
} from '@/lib/db/drizzle/@types'
import { db } from '@/lib/db/drizzle/query'

type Conversations = (Conversation & {
  pronunciationAssessment:
    | (PronunciationAssessment & {
        words: (Word & {
          phonemes: Phoneme[]
        })[]
      })
    | null
})[]

export const getConversations = async () => {
  return (await withAuth(
    async () => {
      const conversationsData = await db.query.conversations.findMany({
        // where: ({ authorId }, { isNotNull }) => isNotNull(authorId),
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
    []
  ))()
}
