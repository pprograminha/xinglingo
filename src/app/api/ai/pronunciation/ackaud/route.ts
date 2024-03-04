/* eslint-disable @typescript-eslint/no-explicit-any */
import { RecognitionResult } from '@/components/pronunciation-assessment/form'
import { db } from '@/lib/db/drizzle/query'
import {
  phonemes,
  pronunciationsAssessment,
  words,
} from '@/lib/db/drizzle/schema'
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk'
import crypto from 'node:crypto'
import { z } from 'zod'
import { applyCommonConfigurationTo } from './services/apply-common-configuration'
import { getAudioConfig } from './services/get-audio-config'
import { getPronunciationAssessmentConfig } from './services/get-pronunciation-assessment-config'
import { getSpeechConfig } from './services/get-speech-config'

export async function POST(req: Request) {
  const formData = await req.formData()

  const audioBlob = formData.get('audioBlob')
  const audioText = formData.get('audioText')
  const conversationId = formData.get('conversationId')

  const safeParse = z
    .object({
      audioBlob: z.any(),
      audioText: z.string().min(1),
      conversationId: z.string().optional().nullable(),
    })
    .safeParse({
      audioBlob,
      audioText,
      conversationId,
    })

  try {
    if (safeParse.success === false) {
      throw new Error('Zod Validation Error')
    }

    const referenceText = safeParse.data.audioText
    const blob = safeParse.data.audioBlob as File
    const conversationId = safeParse.data.conversationId

    const audioConfig = await getAudioConfig(blob)
    const speechConfig = await getSpeechConfig()

    const { autoDetectSourceLanguageConfig, pronunciationAssessmentConfig } =
      await getPronunciationAssessmentConfig(referenceText)

    const speechRecognizer = SpeechSDK.SpeechRecognizer.FromConfig(
      speechConfig,
      autoDetectSourceLanguageConfig,
      audioConfig,
    )
    applyCommonConfigurationTo(speechRecognizer)
    ;(speechRecognizer as any).recognized = undefined

    pronunciationAssessmentConfig.applyTo(speechRecognizer)

    const result = await new Promise<RecognitionResult | null>(
      (resolve, reject) => {
        speechRecognizer.recognizeOnceAsync(
          (speechRecognitionResult: SpeechSDK.SpeechRecognitionResult) => {
            const pronunciationAssessmentResultJson =
              speechRecognitionResult.properties.getProperty(
                SpeechSDK.PropertyId.SpeechServiceResponse_JsonResult,
              )
            if (pronunciationAssessmentResultJson)
              resolve(JSON.parse(pronunciationAssessmentResultJson))
            else resolve(null)
          },
          (error) => {
            reject(new Error(error))
          },
        )
      },
    )

    if (!result) {
      throw new Error('Result Json is Empty')
    }

    const nbest = result.NBest[0]

    if (nbest) {
      const [pronunciationAssessment] = await db
        .insert(pronunciationsAssessment)
        .values([
          {
            id: crypto.randomUUID(),
            accuracyScore: nbest.PronunciationAssessment.AccuracyScore,
            fluencyScore: nbest.PronunciationAssessment.FluencyScore,
            prosodyScore: nbest.PronunciationAssessment.ProsodyScore,
            pronScore: nbest.PronunciationAssessment.PronScore,
            completenessScore: nbest.PronunciationAssessment.CompletenessScore,
            ...(conversationId
              ? {
                  conversationId,
                }
              : {
                  text: referenceText,
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

    return Response.json(result)
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
