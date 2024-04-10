import { env } from 'process'
import { Speech } from '../db/drizzle/types'

type SpeechClient = Speech['client']

export const clientUrl = (client: SpeechClient, key: string) => {
  const clients: Record<SpeechClient, string> = {
    'cloudflare-s3': `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`,
  }

  return clients[client]
}
