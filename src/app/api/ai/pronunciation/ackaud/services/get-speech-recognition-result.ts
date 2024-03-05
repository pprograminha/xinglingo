import type { RecognitionResult } from '@/components/pronunciation-assessment/form'
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk'
import { applyCommonConfigurationTo } from './apply-common-configuration'
import { getAudioConfig } from './get-audio-config'
import { getPronunciationAssessmentConfig } from './get-pronunciation-assessment-config'
import { getSpeechConfig } from './get-speech-config'

type GetSpeechRecognitionResultData = {
  audioText: string
  audioFile?: File
}

type GetSpeechRecognitionResultConfig = Partial<{
  audioConfig: SpeechSDK.AudioConfig
}>

export const getSpeechRecognitionResult = async (
  { audioText, audioFile }: GetSpeechRecognitionResultData,
  config?: GetSpeechRecognitionResultConfig,
) => {
  const audioConfig = config?.audioConfig || (await getAudioConfig(audioFile!))
  const speechConfig = await getSpeechConfig()

  const pronunciationAssessmentConfig =
    await getPronunciationAssessmentConfig(audioText)

  const speechRecognizer = new SpeechSDK.SpeechRecognizer(
    speechConfig,
    audioConfig,
  )
  applyCommonConfigurationTo(speechRecognizer)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(speechRecognizer as any).recognized = undefined

  pronunciationAssessmentConfig.applyTo(speechRecognizer)

  return {
    speechRecognizer,
    getResult: () =>
      new Promise<RecognitionResult | null>((resolve, reject) => {
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
      }),
  }
}
