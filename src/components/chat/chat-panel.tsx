import * as React from 'react'

import { shareChat } from '@/actions/chat'
import { Button } from '@/components/ui/button'
import type { AI } from '@/lib/chat/actions'
import { useAIState, useActions, useUIState } from 'ai/rsc'
import { ShareIcon } from 'lucide-react'
import { nanoid } from 'nanoid'
import { UserMessage } from '../stocks/message'
import { ButtonScrollToBottom } from './button-scroll-to-bottom'
import { ChatShareDialog } from './chat-share-dialog'
import { PromptForm } from './prompt-form'

export interface ChatPanelProps {
  id?: string
  title?: string
  input: string
  setInput: (value: string) => void
  scrollToBottom: () => void
}

export function ChatPanel({
  id,
  title,
  input,
  setInput,
  scrollToBottom,
}: ChatPanelProps) {
  const [aiState] = useAIState()
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)

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
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom scrollToBottom={scrollToBottom} />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        {messages?.length >= 2 ? (
          <div className="flex h-12 items-center justify-center">
            <div className="flex space-x-2">
              {id && title ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShareDialogOpen(true)}
                  >
                    <ShareIcon className="mr-2" />
                    Share
                  </Button>
                  <ChatShareDialog
                    open={shareDialogOpen}
                    onOpenChange={setShareDialogOpen}
                    onCopy={() => setShareDialogOpen(false)}
                    shareChat={shareChat}
                    chat={{
                      id,
                      title,
                      messages: aiState.messages,
                    }}
                  />
                </>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="space-y-4 bg-background py-2 shadow-lg sm:rounded-t-xl  md:py-4">
          <PromptForm input={input} setInput={setInput} />
          <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
            {exampleMessages.map((example) => (
              <div
                className="w-full"
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
