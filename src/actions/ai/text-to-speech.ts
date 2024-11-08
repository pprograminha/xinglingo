'use server'
import { db } from '@/lib/db/drizzle/query'
import { speechs } from '@/lib/db/drizzle/schema'
import { r2 } from '@/lib/storage/r2'
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'node:crypto'
import { env } from 'node:process'
import { SpeechCreateParams } from 'openai/resources/audio/speech.mjs'
import { openaiTextToSpeech } from './openai-text-to-speech'

type TextToSpeechData = {
  text?: string
  key?: string
  speed?: number
  voice: SpeechCreateParams['voice']
}

export async function textToSpeech({
  text,
  key,
  speed = 1,
  voice,
}: TextToSpeechData) {
  if (!text && !key) {
    throw new Error('Text or key must be provided')
  }

  let Key = key!

  if (text && !key) {
    const uint8Array = await openaiTextToSpeech({
      text,
      speed,
      voice,
    })

    Key = `${crypto.randomUUID()}.mp3`

    await r2.send(
      new PutObjectCommand({
        Bucket: env.CLOUDFLARE_BUCKET_NAME,
        Key,
        Body: uint8Array,
      }),
    )
    const speechId = crypto.randomUUID()

    await db.insert(speechs).values([
      {
        id: speechId,
        speech: Key,
        speed,
        voice,
        client: 'cloudflare-s3',
      },
    ])
  }

  const signedUrl = await getSignedUrl(
    r2,
    new GetObjectCommand({
      Bucket: env.CLOUDFLARE_BUCKET_NAME,
      Key,
    }),
    { expiresIn: 60 },
  )

  return {
    signedUrl,
    key: Key,
  }
}
