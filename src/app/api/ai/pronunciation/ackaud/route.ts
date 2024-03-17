/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Ably from 'ably/promises'
import { RecognitionResult } from '@/components/pronunciation-assessment/pronunciation-assesment-dash'
import { db } from '@/lib/db/drizzle/query'
import {
  phonemes,
  pronunciationsAssessment,
  words,
} from '@/lib/db/drizzle/schema'
import { eq } from 'drizzle-orm'
import crypto from 'node:crypto'
import { z } from 'zod'
import { env } from '@/env'
import {
  Conversation,
  Phoneme,
  PronunciationAssessment,
  Word,
} from '@/lib/db/drizzle/@types'
import { getConversation } from '@/components/chat/actions/get-conversation'

type Conversations = (Conversation & {
  pronunciationAssessment:
    | (PronunciationAssessment & {
        words: (Word & {
          phonemes: Phoneme[]
        })[]
      })
    | null
})[]

export async function POST(req: Request) {
  const formData = await req.formData()

  const speechRecognitionResult = JSON.parse(
    formData.get('speechRecognitionResult') as string,
  )
  const conversationId = formData.get('conversationId')
  const referenceText = formData.get('referenceText')

  const safeParse = z
    .object({
      speechRecognitionResult: z.any(),
      conversationId: z.string().optional().nullable(),
      referenceText: z.string().optional().nullable(),
    })
    .safeParse({
      speechRecognitionResult,
      conversationId,
      referenceText,
    })

  try {
    if (safeParse.success === false) {
      throw new Error('ZodValidationError')
    }
    const conversationId = safeParse.data.conversationId
    const referenceText = safeParse.data.referenceText
    const speechRecognitionResult = safeParse.data
      .speechRecognitionResult as RecognitionResult

    const nbest = speechRecognitionResult.NBest[0]

    let conversation: Conversations['0'] | null | undefined = null

    if (nbest) {
      let popularPronunciationAssessment = true

      if (conversationId) {
        conversation = await db.query.conversations.findFirst({
          where: (conversations, { eq }) =>
            eq(conversations.id, conversationId),

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

        if (conversation && conversation.pronunciationAssessment) {
          try {
            await db
              .delete(pronunciationsAssessment)
              .where(
                eq(
                  pronunciationsAssessment.id,
                  conversation.pronunciationAssessment.id,
                ),
              )
          } catch {
            throw new Error('DeletePronunciationAssessmentError')
          }

          const newPronunciationsAssessmentId = crypto.randomUUID()

          let newPronunciationsAssessment: PronunciationAssessment | null = null

          try {
            ;[newPronunciationsAssessment] = await db
              .insert(pronunciationsAssessment)
              .values([
                {
                  id: newPronunciationsAssessmentId,
                  accuracyScore: nbest.PronunciationAssessment.AccuracyScore,
                  fluencyScore: nbest.PronunciationAssessment.FluencyScore,
                  prosodyScore: nbest.PronunciationAssessment.ProsodyScore,
                  pronScore: nbest.PronunciationAssessment.PronScore,
                  completenessScore:
                    nbest.PronunciationAssessment.CompletenessScore,
                  conversationId,
                },
              ])
              .returning()
          } catch {
            throw new Error('InsertPronunciationAssessmentError')
          }

          if (!newPronunciationsAssessment) {
            throw new Error('InsertPronunciationAssessmentError')
          }

          const insertWords = nbest.Words.map((w) => ({
            id: crypto.randomUUID(),
            accuracyScore: w.PronunciationAssessment.AccuracyScore,
            word: w.Word,
            pronunciationAssessmentId: newPronunciationsAssessment!.id,
          }))

          if (insertWords.length === 0) {
            try {
              await db
                .delete(pronunciationsAssessment)
                .where(
                  eq(
                    pronunciationsAssessment.id,
                    newPronunciationsAssessment.id,
                  ),
                )
            } catch {}

            throw new Error('WordsLengthError')
          }

          const fullWords = insertWords.map((w, i) => {
            return {
              ...w,
              W: nbest.Words[i],
            }
          })

          const insertPhonemes = fullWords
            .map((w) =>
              w.W.Phonemes.map((p) => ({
                id: crypto.randomUUID(),
                accuracyScore: p.PronunciationAssessment.AccuracyScore,
                phoneme: p.Phoneme,
                wordId: w.id,
              })),
            )
            .flat()

          if (insertPhonemes.length === 0) {
            try {
              await db
                .delete(pronunciationsAssessment)
                .where(
                  eq(
                    pronunciationsAssessment.id,
                    newPronunciationsAssessment.id,
                  ),
                )
            } catch {}

            throw new Error('PhonemesLengthError')
          }

          try {
            await db.insert(words).values(insertWords)
          } catch {
            try {
              await db
                .delete(pronunciationsAssessment)
                .where(
                  eq(
                    pronunciationsAssessment.id,
                    newPronunciationsAssessment.id,
                  ),
                )
            } catch {}

            throw new Error('InsertWordsError')
          }

          try {
            await db.insert(phonemes).values(insertPhonemes)
          } catch {
            try {
              await db
                .delete(pronunciationsAssessment)
                .where(
                  eq(
                    pronunciationsAssessment.id,
                    newPronunciationsAssessment.id,
                  ),
                )
            } catch {}

            throw new Error('InsertPhonemesError')
          }

          popularPronunciationAssessment = false
        }
      }

      if (popularPronunciationAssessment) {
        try {
          const [pronunciationAssessment] = await db
            .insert(pronunciationsAssessment)
            .values([
              {
                id: crypto.randomUUID(),
                accuracyScore: nbest.PronunciationAssessment.AccuracyScore,
                fluencyScore: nbest.PronunciationAssessment.FluencyScore,
                prosodyScore: nbest.PronunciationAssessment.ProsodyScore,
                pronScore: nbest.PronunciationAssessment.PronScore,
                completenessScore:
                  nbest.PronunciationAssessment.CompletenessScore,
                ...(conversationId!
                  ? {
                      conversationId,
                    }
                  : {
                      text: referenceText!,
                    }),
              },
            ])
            .returning()

          const insertWords = nbest.Words.map((w) => ({
            id: crypto.randomUUID(),
            accuracyScore: w.PronunciationAssessment.AccuracyScore,
            word: w.Word,
            pronunciationAssessmentId: pronunciationAssessment.id,
          }))

          await db.insert(words).values(insertWords)

          const fullWords = insertWords.map((w, i) => {
            return {
              ...w,
              W: nbest.Words[i],
            }
          })

          const insertPhonemes = fullWords
            .map((w) =>
              w.W.Phonemes.map((p) => ({
                id: crypto.randomUUID(),
                accuracyScore: p.PronunciationAssessment.AccuracyScore,
                phoneme: p.Phoneme,
                wordId: w.id,
              })),
            )
            .flat()

          await db.insert(phonemes).values(insertPhonemes)
        } catch {
          throw new Error('PopularPronunciationAssessmentError')
        }
      }
    }

    if (conversation) {
      try {
        const client = new Ably.Rest(env.ABLY_API_KEY)

        const channel = client.channels.get('status-updates')

        await channel.publish(
          'update-from-server',
          await getConversation(conversation.id),
        )
      } catch {}
    }

    return Response.json({
      ok: 1,
    })
  } catch (error) {
    console.error(error)

    return Response.json(
      {
        message: (error as Error)?.message,
      },
      {
        status: 400,
      },
    )
  }
}
