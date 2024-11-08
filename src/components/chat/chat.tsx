'use client'

import { useLocalStorage } from '@/hooks/use-local-storage'
import { useScrollAnchor } from '@/hooks/use-scroll-anchor'
import { Message } from '@/lib/types'
import { useAIState, useUIState } from 'ai/rsc'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChatList } from './chat-list'
import { ChatPanel } from './chat-panel'
import { EmptyScreen } from './empty-screen'

export type ChatProps = {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ id }: ChatProps) {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [messages] = useUIState()
  const [aiState] = useAIState()

  const [, setNewChatId] = useLocalStorage('newChatId', id)

  useEffect(() => {
    const messagesLength = aiState.messages?.length
    if (messagesLength === 2) {
      router.refresh()
    }
  }, [aiState.messages, router])

  useEffect(() => {
    setNewChatId(id)
  })

  const { messagesRef, scrollRef, visibilityRef, scrollToBottom } =
    useScrollAnchor()

  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
      ref={scrollRef}
    >
      <div className="pb-[200px] pt-4 md:pt-10" ref={messagesRef}>
        {messages.length ? <ChatList messages={messages} /> : <EmptyScreen />}
        <div className="w-full h-px" ref={visibilityRef} />
      </div>
      <ChatPanel
        input={input}
        setInput={setInput}
        scrollToBottom={scrollToBottom}
      />
    </div>
  )
}
