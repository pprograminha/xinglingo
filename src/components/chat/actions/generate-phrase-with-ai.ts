'use server'

import { env } from '@/env'
import { openai } from '@/lib/openai'
import { getWordsList } from './get-words-list'

export async function generatePhraseWithAi(): Promise<string | null> {
  const response = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    messages: [
      {
        role: 'system',
        content: `
        Você gerará somente uma frase em inglês.
        Com base nas palavras abaixo você deve gerar uma frase optando por palavras que não foram listadas abaixo, porém não deve desconsiderar a opção de usá-las, caso usá-las opte pelas palavras com o "avgAccuracyScore" e "wordCount" mais baixo.
        A frase deverá ser criada de forma aleatória considerando as condições acima.
        Quanto mais palavras abaixo maior será a frase.
        As vezes gere a frase como se fosse uma expressão.
        Evite ao máximo criar a frase com as palavras abaixo (Isso é extremamente importante)!!!

    
        Palavras:
        ${(await getWordsList()).reduce((p, c) => `${p} | avgAccuracyScore: ${c.avgAccuracyScore}, word: ${c.word}, wordCount: ${c.wordCount}`, '')}
        `,
      },
    ],
  })

  return response.choices[0].message.content
}
