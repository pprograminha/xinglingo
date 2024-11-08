import type { AI } from '@/lib/chat/actions'
import { useActions, useUIState } from 'ai/rsc'
import { nanoid } from 'nanoid'
import { UserMessage } from '../stocks/message'
import { PromptForm } from './prompt-form'

export interface ChatPanelProps {
  input: string
  setInput: (value: string) => void
  scrollToBottom: () => void
}

export function ChatPanel({ input, setInput, scrollToBottom }: ChatPanelProps) {
  const [, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()

  const exampleMessages = [
    {
      heading: 'What are the',
      subheading: 'trending memecoins today?',
      message: `What are the trending memecoins today?`,
    },
    {
      heading: 'What is the price of',
      subheading: '$DOGE right now?',
      message: 'What is the price of $DOGE right now?',
    },
    {
      heading: 'I would like to buy',
      subheading: '42 $DOGE',
      message: `I would like to buy 42 $DOGE`,
    },
    {
      heading: 'What are some',
      subheading: `recent events about $DOGE?`,
      message: `What are some recent events about $DOGE?`,
    },
  ]

  return (
    <div className="fixed px-4 right-0 md:left-9 bottom-0 w-full ">
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="space-y-4 bg-background py-2 shadow-lg sm:rounded-t-xl  md:py-4">
          <PromptForm
            scrollToBottom={scrollToBottom}
            input={input}
            setInput={setInput}
          />
          <div className="mb-4 grid grid-cols-2 gap-2 sm:px-0">
            {exampleMessages.map((example) => (
              <div
                className="w-full max-h-20 whitespace-nowrap text-ellipsis overflow-hidden"
                key={example.heading}
                onClick={async () => {
                  setMessages((currentMessages) => [
                    ...currentMessages,
                    {
                      id: nanoid(),
                      display: <UserMessage>{example.message}</UserMessage>,
                    },
                  ])

                  const responseMessage = await submitUserMessage(
                    example.message,
                  )

                  setMessages((currentMessages) => [
                    ...currentMessages,
                    responseMessage,
                  ])
                }}
              >
                <div className="group col-span-1 flex p-2 h-full w-full cursor-pointer items-center gap-x-2 rounded-lg border p-xs border-zinc-800 dark:hover:border-zinc-700/70 transition duration-300 bg-background dark:bg-zinc-800 dark:hover:bg-zinc-800">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md p-xs transition-all duration-200 group-hover:bg-transparent dark:bg-offset border-borderMain/50 bg-offset dark:bg-offsetDark">
                    <div className="default font-sans text-base">🍝</div>
                  </div>
                  <div>
                    <div className="line-clamp-2 default font-sans text-sm font-medium">
                      {example.heading}
                    </div>
                    <div className="text-sm text-zinc-600">
                      {example.subheading}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
