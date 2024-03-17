'use server'

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

export const getConversations =
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
  }
