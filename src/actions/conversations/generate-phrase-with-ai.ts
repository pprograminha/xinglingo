'use server'

import { env } from '@/env'
import { openai } from '@/lib/ai/openai'
import { getWordsList } from './get-words-list'
import { withAuth } from '@/lib/auth/get-auth'

export async function generatePhraseWithAi(): Promise<string | null> {
  return (
    await withAuth(async () => {
      const response = await openai.chat.completions.create({
        model: env.OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: `
            Você gerará somente uma frase em inglês.
            As vezes gere a frase como se fosse uma expressão.
            Não crie a frase com base nas palavras abaixo (Isso é extremamente importante)!!!


            Palavras que não devem ser usadas:
            ${(await getWordsList()).words.reduce((p, c) => `${p} | avgAccuracyScore: ${c.avgAccuracyScore}, word: ${c.word}, wordCount: ${c.wordCount}`, '')}
            `,
          },
        ],
        temperature: 0.6,
      })

      return response.choices[0].message.content
    }, null)
  )()
}
