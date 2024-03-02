import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk'

export const getAudioConfig = async (file: File) => {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const audioConfig = SpeechSDK.AudioConfig.fromWavFileInput(buffer)

  return audioConfig
}
