import { env } from '@/env'
import { openai } from '@/lib/ai/openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const response = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    stream: true,
    messages: [
      {
        role: 'system',
        content: `
        De inglês para .
        ${env.OPENAI_PROMPT}`,
      },
      ...messages,
    ],
  })
  // const text = await streamText(response)
  const stream = OpenAIStream(response)

  return new StreamingTextResponse(stream)
}
