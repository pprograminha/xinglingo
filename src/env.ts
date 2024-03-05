import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

const nodeEnv = z.enum(['development', 'production', 'test'])

export const env = createEnv({
  server: {
    ABLY_API_KEY: z.string().min(1),
    S_USER_FULLNAME: z.string().min(1),
    S_USER_EMAIL: z.string().min(1),
    DRIZZLE_DATABASE_URL: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_AZURE_SPEECH_SUBSCRITION_KEY: z.string().min(1),
    NEXT_PUBLIC_AZURE_SPEECH_REGION: z.string().min(1),
    NEXT_PUBLIC_AZURE_SPEECH_LANGUAGE: z.string().min(1),
  },
  shared: {
    NODE_ENV: nodeEnv,
    VERCEL_ENV: z
      .enum(['production', 'preview', 'development'])
      .default('development'),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_AZURE_SPEECH_LANGUAGE:
      process.env.NEXT_PUBLIC_AZURE_SPEECH_LANGUAGE,
    NEXT_PUBLIC_AZURE_SPEECH_REGION:
      process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION,
    NEXT_PUBLIC_AZURE_SPEECH_SUBSCRITION_KEY:
      process.env.NEXT_PUBLIC_AZURE_SPEECH_SUBSCRITION_KEY,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
  },
})
