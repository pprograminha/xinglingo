import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

const nodeEnv = z.enum(['development', 'production', 'test'])

export const env = createEnv({
  server: {
    AZURE_SPEECH_SUBSCRITION_KEY: z.string().min(1),
    AZURE_SPEECH_REGION: z.string().min(1),
    AZURE_SPEECH_LANGUAGE: z.string().min(1),
    ABLY_API_KEY: z.string().min(1),
    S_USER_FULLNAME: z.string().min(1),
    S_USER_EMAIL: z.string().min(1),
    DRIZZLE_DATABASE_URL: z.string().min(1),
  },

  shared: {
    NODE_ENV: nodeEnv,
    VERCEL_ENV: z
      .enum(['production', 'preview', 'development'])
      .default('development'),
  },
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
  },
})
