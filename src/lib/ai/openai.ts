import dotenv from 'dotenv'
import OpenAI from 'openai'
dotenv.config({
  path: ['.env.local', '.env'],
  override: true,
})

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
