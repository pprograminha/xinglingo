import { env } from '@/env'
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk'

export const getPronunciationAssessmentConfig = async (
  referenceText: string,
) => {
  const pronunciationAssessmentConfig =
    new SpeechSDK.PronunciationAssessmentConfig(
      referenceText,
      SpeechSDK.PronunciationAssessmentGradingSystem.HundredMark,
      SpeechSDK.PronunciationAssessmentGranularity.Phoneme,
      true,
    )

  const autoDetectSourceLanguageConfig =
    SpeechSDK.AutoDetectSourceLanguageConfig.fromLanguages([
      env.AZURE_SPEECH_LANGUAGE,
    ])

  return { pronunciationAssessmentConfig, autoDetectSourceLanguageConfig }
}
