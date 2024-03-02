/* eslint-disable no-multi-str */
/* eslint-disable new-cap */
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

  pronunciationAssessmentConfig.enableProsodyAssessment = true

  const autoDetectSourceLanguageConfig =
    SpeechSDK.AutoDetectSourceLanguageConfig.fromLanguages([
      env.AZURE_SPEECH_LANGUAGE,
    ])

  return { pronunciationAssessmentConfig, autoDetectSourceLanguageConfig }
}
