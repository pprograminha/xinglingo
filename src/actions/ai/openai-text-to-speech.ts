'use server'
import { openai } from '@/lib/ai/openai'
import { SpeechCreateParams } from 'openai/resources/audio/speech.mjs'

type TextToSpeechData = {
  text: string
  speed?: number
  voice: SpeechCreateParams['voice']
}

export const openaiTextToSpeech = async ({
  text,
  voice,
  speed,
}: TextToSpeechData) => {
  const response = openai.audio.speech.create({
    model: 'tts-1',
    voice,
    speed,
    input: text,
  })

  const as = await response.asResponse()

  const uint8Array = new Uint8Array(await as.arrayBuffer())

  return uint8Array
}
