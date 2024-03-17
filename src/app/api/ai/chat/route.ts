import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { env } from '@/env'

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
})

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()
  const response = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    stream: true,
    messages: [
      {
        role: 'system',
        content: env.OPENAI_PROMPT,
      },
      ...messages,
    ],
  })

  const stream = OpenAIStream(response)

  return new StreamingTextResponse(stream)
}
