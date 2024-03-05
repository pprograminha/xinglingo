/* eslint-disable @typescript-eslint/no-explicit-any */
import { RecognitionResult } from '@/components/pronunciation-assessment/ponunciation-assesment-dash'
import { db } from '@/lib/db/drizzle/query'
import {
  phonemes,
  pronunciationsAssessment,
  words,
} from '@/lib/db/drizzle/schema'
import { eq } from 'drizzle-orm'
import crypto from 'node:crypto'
import { z } from 'zod'

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
      throw new Error('Zod Validation Error')
    }
    const conversationId = safeParse.data.conversationId
    const referenceText = safeParse.data.referenceText
    const speechRecognitionResult = safeParse.data
      .speechRecognitionResult as RecognitionResult

    const nbest = speechRecognitionResult.NBest[0]

    if (nbest) {
      let popularPronunciationAssessment = true

      if (conversationId) {
        const conversation = await db.query.conversations.findFirst({
          where: (conversations, { eq }) =>
            eq(conversations.id, conversationId),

          with: {
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
          await db
            .delete(pronunciationsAssessment)
            .where(
              eq(
                pronunciationsAssessment.id,
                conversation.pronunciationAssessment.id,
              ),
            )

          const newPronunciationsAssessmentId = crypto.randomUUID()

          const [newPronunciationsAssessment] = await db
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

          try {
            const insertWords = nbest.Words.map((w) => ({
              id: crypto.randomUUID(),
              accuracyScore: w.PronunciationAssessment.AccuracyScore,
              word: w.Word,
              pronunciationAssessmentId: newPronunciationsAssessment.id,
            }))

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
            await db.insert(words).values(insertWords)
            await db.insert(phonemes).values(insertPhonemes)
          } catch {
            await db
              .delete(pronunciationsAssessment)
              .where(
                eq(pronunciationsAssessment.id, newPronunciationsAssessment.id),
              )
          }

          popularPronunciationAssessment = false
        }
      }

      if (popularPronunciationAssessment) {
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
      }
    }

    return Response.json({ ok: 1 })
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
