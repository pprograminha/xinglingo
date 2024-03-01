import { z } from 'zod'
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk'
import { env } from '@/env'
import fs from 'fs'
import path from 'path'
import { openPushStream } from '@/lib/file-push-stream'

export async function POST(req: Request) {
  const formData = await req.formData()

  const audioBlob = formData.get('audioBlob')
  const audioText = formData.get('audioText')

  const safeParse = z
    .object({
      audioBlob: z.instanceof(File),
      audioText: z.string().min(1),
    })
    .safeParse({
      audioBlob,
      audioText,
    })

  try {
    if (safeParse.success === false) {
      throw new Error('Zod Validation Error')
    }

    const referenceText = safeParse.data.audioText
    const blob = safeParse.data.audioBlob

    const bytes = await blob.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const filepath = path.join(blob.name)

    await fs.promises.writeFile(filepath, buffer)

    const pronunciationAssessmentConfig =
      new SpeechSDK.PronunciationAssessmentConfig(
        referenceText,
        SpeechSDK.PronunciationAssessmentGradingSystem.HundredMark,
        SpeechSDK.PronunciationAssessmentGranularity.Phoneme,
        true,
      )

    pronunciationAssessmentConfig.enableContentAssessmentWithTopic(
      'conversation',
    )

    const audioStream = openPushStream(filepath)
    const audioConfig = SpeechSDK.AudioConfig.fromStreamInput(audioStream)
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
      env.AZURE_SPEECH_SUBSCRITION_KEY,
      env.AZURE_SPEECH_REGION,
    )
    const autoDetectSourceLanguageConfig =
      SpeechSDK.AutoDetectSourceLanguageConfig.fromLanguages([
        env.AZURE_SPEECH_LANGUAGE,
      ])

    pronunciationAssessmentConfig.enableProsodyAssessment = true
    speechConfig.speechRecognitionLanguage = env.AZURE_SPEECH_LANGUAGE

    const speechRecognizer = SpeechSDK.SpeechRecognizer.FromConfig(
      speechConfig,
      autoDetectSourceLanguageConfig,
      audioConfig,
    )

    pronunciationAssessmentConfig.applyTo(speechRecognizer)

    const result = await new Promise<string>((resolve) => {
      speechRecognizer.recognizeOnceAsync(
        (speechRecognitionResult: SpeechSDK.SpeechRecognitionResult) => {
          const pronunciationAssessmentResultJson =
            speechRecognitionResult.properties.getProperty(
              SpeechSDK.PropertyId.SpeechServiceResponse_JsonResult,
            )

          resolve(pronunciationAssessmentResultJson)
        },
      )
    })

    return Response.json(JSON.parse(result))
  } catch (error) {
    console.error(error)

    return Response.json(
      { message: (error as Error)?.message },
      {
        status: 400,
      },
    )
  }
}