import { env } from '@/env'
import { openai } from '@/lib/ai/openai'
import { getAuth } from '@/lib/auth/get-auth'
import { OpenAIStream, StreamingTextResponse } from 'ai'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { user } = await getAuth()

  if (!user) {
    throw new Error('UserError')
  }

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
