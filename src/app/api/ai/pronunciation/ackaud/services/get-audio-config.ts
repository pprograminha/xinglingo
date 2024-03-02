import { env } from '@/env'
import { openPushStream } from '@/lib/file-push-stream'
import fs from 'fs'
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk'

export const getAudioConfig = async (file: File) => {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const filepath =
    env.NODE_ENV === 'production' ? `/tmp/${file.name}` : `tmp/${file.name}`

  await fs.promises.writeFile(filepath, buffer)

  const audioStream = openPushStream(filepath)
  const audioConfig = SpeechSDK.AudioConfig.fromStreamInput(audioStream)

  return audioConfig
}
