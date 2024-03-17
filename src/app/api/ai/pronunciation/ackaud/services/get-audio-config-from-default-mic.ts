import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk'

export const getAudioConfigFromDefaultMicrophone = () => {
  const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput()

  return audioConfig
}
