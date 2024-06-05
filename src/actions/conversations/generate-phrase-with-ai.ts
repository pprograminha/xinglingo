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
      // const assistant = await openai.beta.assistants.create({
      //   name: 'weather assistant',
      //   instructions: 'Provide weather information based on location.',
      //   model: 'gpt-3.5-turbo-1106',
      // })

      // // Create a thread
      // const thread = await openai.beta.threads.create()

      // // Send a message to the thread
      // const message = await openai.beta.threads.messages.create(thread.id, {
      //   role: 'user',
      //   content: 'hey',
      // })

      // // Run the thread with the assistant
      // const run = await openai.beta.threads.runs.create(thread.id, {
      //   assistant_id: assistant.id,
      //   instructions: 'Tell me about the weather in New York City.',
      // })

      // // Retrieve the run
      // const retrievedRun = await openai.beta.threads.runs.retrieve(
      //   thread.id,
      //   run.id,
      // )

      // // List messages in the thread
      // const messages = await openai.beta.threads.messages.list(thread.id)
      // messages.data.forEach((message) => {
      // })
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
