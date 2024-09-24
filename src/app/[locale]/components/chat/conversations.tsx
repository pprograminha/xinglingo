/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { useChannels } from '@/hooks/use-channels'
import { useEffect, useRef } from 'react'
import { Conversation } from './conversation'

export function Conversations() {
  const { currentChannelIndex, channels } = useChannels()

  const conversationsContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    conversationsContainerRef.current?.scrollTo({
      top: conversationsContainerRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [])

  const dayConversations =
    channels.find((c) => c.channelIndex === currentChannelIndex)
      ?.conversations || []

  return (
    <div className="flex-grow overflow-y-auto overflow-x-hidden h-[50vh]">
      <div
        data-center={dayConversations.length === 0}
        className="data-[center=true]:flex flex-col data-[center=true]:items-center data-[center=true]:justify-center"
      >
        {dayConversations.length > 0 && (
          <div className="flex flex-col">
            {dayConversations.map((conversation) => (
              <Conversation key={conversation.id} conversation={conversation} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
