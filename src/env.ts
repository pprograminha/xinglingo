import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

const nodeEnv = z.enum(['development', 'production', 'test'])

export const env = createEnv({
  server: {
    ABLY_API_KEY: z.string().min(1),
    USER_FULLNAME: z.string().min(1),
    USER_EMAIL: z.string().min(1),
    OPENAI_API_KEY: z.string().min(1),
    OPENAI_PROMPT: z.string().min(1),
    OPENAI_MODEL: z.string().min(1),
    DRIZZLE_DATABASE_URL: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    NEXTAUTH_URL: z.string().min(1),
    NEXTAUTH_SECRET: z.string().min(1),
    CLOUDFLARE_BUCKET_NAME: z.string().min(1),
    CLOUDFLARE_ACCOUNT_ID: z.string().min(1),
    CLOUDFLARE_SECRET_KEY: z.string().min(1),
    CLOUDFLARE_ACCESS_KEY: z.string().min(1),
    CLOUDFLARE_TOKEN_API: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_AZURE_SPEECH_SUBSCRITION_KEY: z.string().min(1),
    NEXT_PUBLIC_AZURE_SPEECH_REGION: z.string().min(1),
    NEXT_PUBLIC_AZURE_SPEECH_LANGUAGE: z.string().min(1),
    NEXT_PUBLIC_APP_URL: z.string().min(1),
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
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_AZURE_SPEECH_REGION:
      process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION,
    NEXT_PUBLIC_AZURE_SPEECH_SUBSCRITION_KEY:
      process.env.NEXT_PUBLIC_AZURE_SPEECH_SUBSCRITION_KEY,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
  },
})
