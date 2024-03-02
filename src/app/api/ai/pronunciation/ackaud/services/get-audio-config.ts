import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk'

export const getAudioConfig = async (file: File) => {
  const audioConfig = SpeechSDK.AudioConfig.fromWavFileInput(file)

  return audioConfig
}
