'use server'

import {
  Conversation,
  Phoneme,
  PronunciationAssessment,
  Word,
} from '@/lib/db/drizzle/types'
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
