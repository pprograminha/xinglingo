/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import 'server-only'

import { openai } from '@ai-sdk/openai'
import {
  createAI,
  createStreamableUI,
  createStreamableValue,
  getAIState,
  getMutableAIState,
  streamUI,
} from 'ai/rsc'

import {
  BotCard,
  BotMessage,
  Purchase,
  spinner,
  Stock,
  SystemMessage,
} from '@/components/stocks'

import { ModeTranslator } from '@/components/modes/mode-translator'
import { Events } from '@/components/stocks/events'
import { EventsSkeleton } from '@/components/stocks/events-skeleton'
import { SpinnerMessage, UserMessage } from '@/components/stocks/message'
import { StockSkeleton } from '@/components/stocks/stock-skeleton'
import { Stocks } from '@/components/stocks/stocks'
import { StocksSkeleton } from '@/components/stocks/stocks-skeleton'
import { Chat, Message } from '@/lib/types'
import { nanoid, runAsyncFnWithoutBlocking, sleep } from '@/lib/utils'
import { getTranslations } from 'next-intl/server'
import { z } from 'zod'
import { getAuth } from '../auth/get-auth'
import { langs, Locale, locales } from '../intl/locales'

async function searchForWordOrPhraseInDictionary(word: number) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  const searching = createStreamableUI(
    <div className="inline-flex items-start gap-1 md:items-center">
      {spinner}
      <p className="mb-2">searching {word}...</p>
    </div>,
  )

  const systemMessage = createStreamableUI(null)

  runAsyncFnWithoutBlocking(async () => {
    await sleep(1000)

    searching.update(
      <div className="inline-flex items-start gap-1 md:items-center">
        {spinner}
        <p className="mb-2">Searching {word}... working on it...</p>
      </div>,
    )

    await sleep(1000)

    searching.done(
      <div>
        <p className="mb-2">Searched {word}.</p>
      </div>,
    )

    systemMessage.done(<SystemMessage>Searched {word}.</SystemMessage>)

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: 'system',
          content: `[Searched.]`,
        },
      ],
    })
  })

  return {
    searchingUI: searching.value,
    newMessage: {
      id: nanoid(),
      display: systemMessage.value,
    },
  }
}

async function submitUserMessage(content: string) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  const { user } = await getAuth(true)

  const t = await getTranslations()

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content,
      },
    ],
  })

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
  let textNode: undefined | React.ReactNode

  const result = await streamUI({
    model: openai('gpt-3.5-turbo') as Parameters<typeof streamUI>[0]['model'],
    initial: <SpinnerMessage />,
    system: `\
    You should communicate with the user in ${langs(t, (user?.locale as Locale) ?? 'en')}, as that is their native language.
    You are a teacher who will teach the user how to learn ${langs(t, (user?.profile?.localeToLearn as Locale) ?? 'en')}, step by step.
    
    If the user requests searching a word or phrase or more than one phrase or word, call \`search_for_word_in_dictionary_ui\` to show the dictionary word UI.
    If you want to show trending stocks, call \`list_stocks\`.
    If you want to show events, call \`get_events\`.
    If the user wants complete another impossible task, respond that you were not made for that task.
    
    Besides that, you can also chat with users and do some calculations if needed.`,
    messages: [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name,
      })),
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue('')
        textNode = <BotMessage content={textStream.value} />
      }

      if (done) {
        textStream.done()
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content,
            },
          ],
        })
      } else {
        textStream.update(delta)
      }

      return textNode
    },
    tools: {
      listStocks: {
        description: 'List three imaginary stocks that are trending.',
        parameters: z.object({
          stocks: z.array(
            z.object({
              symbol: z.string().describe('The symbol of the stock'),
              price: z.number().describe('The price of the stock'),
              delta: z.number().describe('The change in price of the stock'),
            }),
          ),
        }),
        generate: async function* ({ stocks }) {
          yield (
            <BotCard>
              <StocksSkeleton />
            </BotCard>
          )

          await sleep(1000)

          const toolCallId = nanoid()

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'listStocks',
                    toolCallId,
                    args: { stocks },
                  },
                ],
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'listStocks',
                    toolCallId,
                    result: stocks,
                  },
                ],
              },
            ],
          })

          return (
            <BotCard>
              <Stocks props={stocks} />
            </BotCard>
          )
        },
      },
      showStockPrice: {
        description:
          'Get the current stock price of a given stock or currency. Use this to show the price to the user.',
        parameters: z.object({
          symbol: z
            .string()
            .describe(
              'The name or symbol of the stock or currency. e.g. DOGE/AAPL/USD.',
            ),
          price: z.number().describe('The price of the stock.'),
          delta: z.number().describe('The change in price of the stock'),
        }),
        generate: async function* ({ symbol, price, delta }) {
          yield (
            <BotCard>
              <StockSkeleton />
            </BotCard>
          )

          await sleep(1000)

          const toolCallId = nanoid()

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'showStockPrice',
                    toolCallId,
                    args: { symbol, price, delta },
                  },
                ],
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'showStockPrice',
                    toolCallId,
                    result: { symbol, price, delta },
                  },
                ],
              },
            ],
          })

          return (
            <BotCard>
              <Stock props={{ symbol, price, delta }} />
            </BotCard>
          )
        },
      },
      searchForWordOrPhraseInDictionary: {
        description:
          'Show dictionary word or phrase and the UI. Use this if the user wants to explain a word or phrase.',
        parameters: z.object({
          wordOrPhrase: z.string().describe('The word or phrase.'),
          translatedWordOrPhrase: z
            .string()
            .describe(
              `Translate "wordOrPhrase" to ${langs(t, (user?.profile?.localeToLearn as Locale | undefined) || 'en')}`,
            ),

          sourceLocale: z.enum(locales).describe('The source language locale'),
          targetLocale: z
            .enum(locales)
            .describe('The target language locale for translation'),
        }),
        generate: async function* ({
          wordOrPhrase,
          translatedWordOrPhrase,
          sourceLocale,
          targetLocale,
        }) {
          const toolCallId = nanoid()

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'searchForWordOrPhraseInDictionary',
                    toolCallId,
                    args: { wordOrPhrase, translatedWordOrPhrase },
                  },
                ],
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'searchForWordOrPhraseInDictionary',
                    toolCallId,
                    result: {
                      wordOrPhrase,
                      translatedWordOrPhrase,
                    },
                  },
                ],
              },
            ],
          })

          return (
            <BotCard>
              <ModeTranslator
                sourceText={wordOrPhrase}
                translatedText={translatedWordOrPhrase}
                sourceLocale={sourceLocale}
                targetLocale={targetLocale}
              />
            </BotCard>
          )
        },
      },
      getEvents: {
        description:
          'List funny imaginary events between user highlighted dates that describe stock activity.',
        parameters: z.object({
          events: z.array(
            z.object({
              date: z
                .string()
                .describe('The date of the event, in ISO-8601 format'),
              headline: z.string().describe('The headline of the event'),
              description: z.string().describe('The description of the event'),
            }),
          ),
        }),
        generate: async function* ({ events }) {
          yield (
            <BotCard>
              <EventsSkeleton />
            </BotCard>
          )

          await sleep(1000)

          const toolCallId = nanoid()

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'getEvents',
                    toolCallId,
                    args: { events },
                  },
                ],
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'getEvents',
                    toolCallId,
                    result: events,
                  },
                ],
              },
            ],
          })

          return (
            <BotCard>
              <Events props={events} />
            </BotCard>
          )
        },
      },
    },
  })

  return {
    id: nanoid(),
    display: result.value,
  }
}

export type AIState = {
  chatId: string
  messages: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
    searchForWordOrPhraseInDictionary,
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  onGetUIState: async () => {
    'use server'

    const session = await getAuth()

    if (session && session.user) {
      const aiState = getAIState() as Chat

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState)
        return uiState
      }
    }
  },
})

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter((message) => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'tool' ? (
          message.content.map((tool) => {
            return tool.toolName === 'listStocks' ? (
              <BotCard>
                {/* TODO: Infer types based on the tool result */}
                {/* @ts-expect-error */}
                <Stocks props={tool.result} />
              </BotCard>
            ) : tool.toolName === 'showStockPrice' ? (
              <BotCard>
                {/* @ts-expect-error */}
                <Stock props={tool.result} />
              </BotCard>
            ) : tool.toolName === 'searchForWordOrPhraseInDictionary' ? (
              <BotCard>
                {/* @ts-expect-error */}
                <Purchase props={tool.result} />
              </BotCard>
            ) : tool.toolName === 'getEvents' ? (
              <BotCard>
                {/* @ts-expect-error */}
                <Events props={tool.result} />
              </BotCard>
            ) : null
          })
        ) : message.role === 'user' ? (
          <UserMessage>{message.content as string}</UserMessage>
        ) : message.role === 'assistant' &&
          typeof message.content === 'string' ? (
          <BotMessage content={message.content} />
        ) : null,
    }))
}
