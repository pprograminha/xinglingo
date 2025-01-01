import { env } from '@/env'
import { openai } from '@/lib/ai/openai'
// import { OpenAIStream, streamText } from 'ai'

export const runtime = 'edge'

export async function POST(req: Request) {
  // await withSubscription()
  const { messages } = await req.json()

  await openai.chat.completions.create({
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
  // const stream = OpenAIStream(response)

  // return new StreamTextResult(stream)
}
