'use client'

import * as React from 'react'

import { useActions, useUIState } from 'ai/rsc'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/hooks/use-enter-submit'
import { type AI } from '@/lib/chat/actions'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { SendIcon } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useTranslations } from 'next-intl'
import { UserMessage } from '../stocks/message'
import { ButtonScrollToBottom } from './button-scroll-to-bottom'
import { Textarea } from '../ui/textarea'

export interface ChatPanelProps {
  input: string
  setInput: (value: string) => void
  scrollToBottom: () => void
  isAtBottom: boolean
}

export function ChatPanel({
  input,
  isAtBottom,
  setInput,
  scrollToBottom,
}: ChatPanelProps) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const t = useTranslations()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const { submitUserMessage } = useActions()
  const [messages, setMessages] = useUIState<typeof AI>()

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div
      data-has-messages={messages.length > 0}
      className="mx-auto mt-auto md:data-[has-messages=false]:my-auto p-2 sm:max-w-2xl  w-full group
      
      "
    >
      <form
        ref={formRef}
        onSubmit={async (e) => {
          e.preventDefault()

          // Blur focus on mobile
          if (window.innerWidth < 600) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(e.target as any).message?.blur()
          }

          const value = input.trim()
          setInput('')
          if (!value) return

          // Optimistically add user message UI
          setMessages((currentMessages) => [
            ...currentMessages,
            {
              id: nanoid(),
              display: <UserMessage>{value}</UserMessage>,
            },
          ])

          // Submit and get response message
          const responseMessage = await submitUserMessage(value)
          setMessages((currentMessages) => [
            ...currentMessages,
            responseMessage,
          ])
        }}
      >
        <h1
          className={`${pixelatedFont.className} mx-auto text-4xl text-center mb-4 hidden md:group-data-[has-messages=false]:inline-block`}
        >
          O que você quer saber?
        </h1>
        <div className="w-full flex flex-col items-center gap-2">
          <div className="w-full flex  gap-2 items-center">
            <div className="w-full relative">
              <div
                className={`flex items-center justify-between max-h-20 md:max-h-60 w-full pr-14 grow overflow-y-auto bg-background rounded-3xl border border-dashed bg-zinc-800 border-zinc-700 px-4
                shadow-[inset_0_0px_100px_rgba(0,0,0,0.2)]
                md:group-data-[has-messages=false]:rounded-md
                md:group-data-[has-messages=false]:h-28
                `}
              >
                <Textarea
                  ref={inputRef}
                  tabIndex={0}
                  onKeyDown={onKeyDown}
                  placeholder={t('Ask anything') + '...'}
                  className={`placeholder:text-xs !ring-0 w-full resize-none bg-transparent placeholder:overflow-hidden placeholder:whitespace-nowrap overflow-hidden min-h-full py-4 border-0 !outline-none sm:text-sm
                  
                 
                  `}
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  name="message"
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />

                <div className="gap-2 flex top-2 absolute right-4  ">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="submit"
                        size="icon"
                        className="rounded-full dark:hover:bg-zinc-700"
                        variant="outline"
                        disabled={input === ''}
                      >
                        <SendIcon className="w-4" />
                        <span className="sr-only">{t('Send message')}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t('Send message')}</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
            {!isAtBottom && (
              <ButtonScrollToBottom
                variant="outline"
                className="rounded-full dark:hover:bg-zinc-700 group-data-[has-messages=false]:hidden"
                scrollToBottom={scrollToBottom}
                type="button"
                size="icon"
              />
            )}
          </div>
          <p className="text-xs text-zinc-400 text-center">
            {t('The model may present inaccuracies, use it with discretion')}
          </p>
        </div>
      </form>
    </div>
  )
}
