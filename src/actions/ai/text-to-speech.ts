'use server'
import { withAuth } from '@/lib/auth/get-auth'
import { db } from '@/lib/db/drizzle/query'
import { speechs, speechsToConversations } from '@/lib/db/drizzle/schema'
import { r2 } from '@/lib/storage/r2'
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { eq } from 'drizzle-orm'
import crypto from 'node:crypto'
import { env } from 'node:process'
import { SpeechCreateParams } from 'openai/resources/audio/speech.mjs'
import { openaiTextToSpeech } from './openai-text-to-speech'

type TextToSpeechData = {
  conversationId: string
  speed?: number
  voice: SpeechCreateParams['voice']
}

export async function textToSpeech({
  conversationId,
  speed = 1,
  voice,
}: TextToSpeechData) {
  return (
    await withAuth(async () => {
      const conversation = await db.query.conversations.findFirst({
        where: (conversations, { eq }) => eq(conversations.id, conversationId),
      })

      if (!conversation) {
        throw new Error('ConversationNotFound')
      }

      const speechsToConversationsData = await db
        .select()
        .from(speechsToConversations)
        .leftJoin(speechs, eq(speechsToConversations.speechId, speechs.id))
        .where(eq(speechsToConversations.conversationId, conversationId))

      if (speechsToConversationsData.length > 0) {
        const speechs = speechsToConversationsData
          .map((speechToConversation) => speechToConversation.speechs!)
          .filter(Boolean)

        const speech = speechs.find(
          (sc) => sc.speed === speed && sc.voice === voice,
        )

        if (speech) {
          const signedUrl = await getSignedUrl(
            r2,
            new GetObjectCommand({
              Bucket: env.CLOUDFLARE_BUCKET_NAME,
              Key: speech.speech,
            }),
            { expiresIn: 60 },
          )

          return {
            signedUrl,
          }
        }
      }

      const uint8Array = await openaiTextToSpeech({
        text: conversation.text,
        speed,
        voice,
      })

      const Key = `${crypto.randomUUID()}.mp3`

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

      await db.insert(speechsToConversations).values([
        {
          conversationId,
          speechId,
        },
      ])

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
      }
    })
  )()
}
