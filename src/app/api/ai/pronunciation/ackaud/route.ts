/* eslint-disable @typescript-eslint/no-explicit-any */
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk'
import { z } from 'zod'
import { applyCommonConfigurationTo } from './services/apply-common-configuration'
import { getAudioConfig } from './services/get-audio-config'
import { getPronunciationAssessmentConfig } from './services/get-pronunciation-assessment-config'
import { getSpeechConfig } from './services/get-speech-config'

export async function POST(req: Request) {
  const formData = await req.formData()

  const audioBlob = formData.get('audioBlob')
  const audioText = formData.get('audioText')

  const safeParse = z
    .object({
      audioBlob: z.any(),
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
    const blob = safeParse.data.audioBlob as File

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await new Promise<any>((resolve, reject) => {
      speechRecognizer.recognizeOnceAsync(
        (speechRecognitionResult: SpeechSDK.SpeechRecognitionResult) => {
          const pronunciationAssessmentResult =
            SpeechSDK.PronunciationAssessmentResult.fromResult(
              speechRecognitionResult,
            )
          const pronunciationAssessmentResultJson =
            speechRecognitionResult.properties.getProperty(
              SpeechSDK.PropertyId.SpeechServiceResponse_JsonResult,
            )
          return pronunciationAssessmentResult
          if (pronunciationAssessmentResultJson)
            resolve(JSON.parse(pronunciationAssessmentResultJson))
          else resolve(null)
        },
        (error) => {
          reject(new Error(error))
        },
      )
    })

    if (!result) {
      throw new Error('Result Json is Empty')
    }

    return Response.json(result)
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
