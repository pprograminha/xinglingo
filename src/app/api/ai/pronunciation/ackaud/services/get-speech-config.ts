import { env } from '@/env'
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk'

export const getSpeechConfig = async () => {
  const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
    env.AZURE_SPEECH_SUBSCRITION_KEY,
    env.AZURE_SPEECH_REGION,
  )

  speechConfig.speechRecognitionLanguage = env.AZURE_SPEECH_LANGUAGE

  if (!speechConfig) throw new Error('Speech Config Error')

  return speechConfig
}
