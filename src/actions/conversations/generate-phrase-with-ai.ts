'use server'

import { openai } from '@/lib/ai/openai'
import { withAuth } from '@/lib/auth/get-auth'
import crypto from 'crypto'

const phrases: string[] = []

export async function generatePhraseWithAi(): Promise<string | null> {
  return (
    await withAuth(async () => {
      const prompt = `
        ${crypto.randomUUID()}

        Você gerará somente uma frase em inglês.
        As vezes gere a frase como se fosse uma expressão.

        Respeite o contexto da conversa e a gramática.
      `

      const messages = phrases.map((phrase) => ({
        role: 'user' as const,
        content: phrase,
      }))

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-0301',
        messages: [
          {
            role: 'system',
            content: prompt,
          },
          ...messages,
        ],
        max_tokens: 30,
      })
      const phrase = response.choices[0].message.content

      if (phrase) phrases.push(phrase)

      return phrase
    }, null)
  )()
}
