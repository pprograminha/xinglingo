/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { useChannels } from '@/hooks/use-channels'
import * as Ably from 'ably'
import { useChannel } from 'ably/react'
import { SetStateAction, useEffect, useRef } from 'react'
import { getConversations } from '../../../actions/conversations/get-conversations'
import { Conversation } from './conversation'

type TConversations = Awaited<ReturnType<typeof getConversations>>

export function Conversations() {
  const { currentChannelIndex, channels, setConversations } = useChannels()

  const conversationsHandler = (
    setStateAction: SetStateAction<TConversations>,
  ) => {
    if (typeof setStateAction === 'function') {
      setConversations((cs) => {
        return setStateAction(cs)
      })
      return
    }
    conversationsHandler(setStateAction)
  }

  useChannel('status-updates', (conversation: Ably.Types.Message) => {
    conversationsHandler((cs) => {
      const conversationIndex = cs.findIndex(
        (c) => c.id === conversation.data.id,
      )

      let conversations: TConversations | null = null

      if (conversationIndex !== -1) {
        cs[conversationIndex] = conversation.data

        conversations = [...cs]
      }

      conversations = conversations || [conversation.data, ...cs]

      return conversations
    })
  })

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
