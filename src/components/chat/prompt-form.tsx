/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import * as React from 'react'
import Textarea from 'react-textarea-autosize'

import { useActions, useUIState } from 'ai/rsc'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/hooks/use-enter-submit'
import { type AI } from '@/lib/chat/actions'
import { ArrowLeftToLineIcon } from 'lucide-react'
import { nanoid } from 'nanoid'
import { UserMessage } from '../stocks/message'
import { ButtonScrollToBottom } from './button-scroll-to-bottom'

export function PromptForm({
  input,
  setInput,
  scrollToBottom,
}: {
  input: string

  scrollToBottom: () => void
  setInput: (value: string) => void
}) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const { submitUserMessage } = useActions()
  const [, setMessages] = useUIState<typeof AI>()

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <form
      ref={formRef}
      onSubmit={async (e: any) => {
        e.preventDefault()

        // Blur focus on mobile
        if (window.innerWidth < 600) {
          e.target.message?.blur()
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
        setMessages((currentMessages) => [...currentMessages, responseMessage])
      }}
    >
      <div className="relative flex items-center justify-between max-h-60 w-full grow overflow-hidden bg-background rounded-lg  sm:rounded-md border bg-zinc-800 border-zinc-700 px-4">
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Send a message."
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="gap-2 flex top-[13px] sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="submit" size="icon" disabled={input === ''}>
                <ArrowLeftToLineIcon />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
          <ButtonScrollToBottom
            variant="default"
            scrollToBottom={scrollToBottom}
            type="button"
            size="icon"
          />
        </div>
      </div>
    </form>
  )
}
