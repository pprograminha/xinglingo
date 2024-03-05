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

  return pronunciationAssessmentConfig
}
