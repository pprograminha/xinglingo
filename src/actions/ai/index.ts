'use server'

import { openai } from '@/lib/ai/openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { z } from 'zod'

type AIData = {
  format?: {
    name: string
    schemaVariant: 'example-messages'
    size?: number
  }
  messages: Array<ChatCompletionMessageParam>
}

export async function execAI({ messages, format }: AIData) {
  const schemas = () => {
    if (!format) return

    if (format.schemaVariant === 'example-messages') {
      const exampleMessagesSchema = z.object({
        icon: z
          .string()
          .describe(
            'Generate an icon related to the heading. Max 1 and min 1 character. Ex: 🕹️ ✨🪅🧸',
          ),
        heading: z.string().describe('Generate a question .'),
      })
      return exampleMessagesSchema
    }
  }

  const schema = schemas()

  if (format && schema) {
    const getCompletion = async () => {
      const completion = await openai.beta.chat.completions.parse({
        model: 'gpt-4o-mini-2024-07-18',
        messages,

        response_format: zodResponseFormat(schema, format.name),
      })

      return completion.choices[0].message.parsed
    }

    const completionSize = format.size || 1

    if (completionSize === 1) return getCompletion()

    const items: Exclude<Awaited<ReturnType<typeof getCompletion>>, null>[] = []

    for (let index = 0; index < completionSize; index++) {
      const completion = await getCompletion()
      if (!completion) continue

      items.push(completion)
    }

    return items
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
  })

  const content = completion.choices[0].message.content

  return content
}
