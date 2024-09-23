import { env } from '@/env'
import { searchSerper } from '@/lib/serper'
import { Serper } from '@langchain/community/tools/serper'
import { AgentAction, AgentFinish } from '@langchain/core/agents'
import { BaseMessageChunk } from '@langchain/core/messages'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { RunnableLike, RunnableSequence } from '@langchain/core/runnables'
import { ChatOpenAI } from '@langchain/openai'
import { AgentExecutor } from 'langchain/agents'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export const runtime = 'edge'

export async function POST(req: Request) {
  // await withSubscription()

  try {
    const { input, messages } = z
      .object({
        input: z.string().min(1),
        messages: z
          .array(
            z.object({
              role: z.enum([
                'ai',
                'system',
                'human',
                'remove',
                'assistant',
                'function',
                'generic',
                'tool',
                'user',
                'placeholder',
              ]),
              message: z.string().min(1),
            }),
          )
          .min(1),
      })
      .parse(await req.json())

    const model = new ChatOpenAI({
      model: 'gpt-4o-mini',
      apiKey: env.OPENAI_API_KEY,
    })

    const tools = [new Serper(env.SERPER_API_KEY)]
    const prompt: string | null = null

    if (tools[0]) {
      console.log(await searchSerper({ input, locale: 'pt-br' }))
      // try {
      //   prompt = await tools[0].invoke(input)
      // } catch {}
    }

    const chatPromptTeplateMessages: Parameters<
      typeof ChatPromptTemplate.fromMessages
    >[0] = [
      ...((prompt
        ? [
            [
              'system' as const,
              `Use esse prompt como base para responder: ${prompt}`,
            ],
          ]
        : []) as Parameters<typeof ChatPromptTemplate.fromMessages>[0]),
      ['human', '{input}'],
      ...(messages.map((m) => [m.role, m.message]) as Parameters<
        typeof ChatPromptTemplate.fromMessages
      >[0]),
    ]

    const prefix = ChatPromptTemplate.fromMessages(chatPromptTeplateMessages)

    const customOutputParser = (
      input: BaseMessageChunk,
    ): AgentAction | AgentFinish => {
      return {
        log: 'test',
        returnValues: {
          output: input,
        },
      }
    }

    const agent = RunnableSequence.from([
      prefix,
      model as unknown as RunnableLike,
      customOutputParser,
    ])
    const executor = AgentExecutor.fromAgentAndTools({
      agent,
      tools,
    })

    console.log('Loaded agent.')

    console.log(`Executing with input "${input}"...`)

    const result = await executor.invoke({ input })

    return NextResponse.json({
      errors: null,
      data: {
        content: result?.output?.content,
      },
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      errors: [
        {
          message: 'unknown',
        },
      ],
      data: null,
    })
  }
}
