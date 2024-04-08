/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { useChannels } from '@/hooks/use-channels'
import * as Ably from 'ably'
import { useChannel } from 'ably/react'
import { isSameDay } from 'date-fns'
import { SetStateAction, useEffect, useRef, useState } from 'react'
import { getConversations } from '../../../actions/conversations/get-conversations'
import { Conversation } from './conversation'

type TConversations = Awaited<ReturnType<typeof getConversations>>

type ConversationProps = {
  conversations: TConversations
}

export function Conversations({
  conversations: defaultConversations,
}: ConversationProps) {
  const getGroupConversationsPerDay = (conversations: TConversations) => {
    return conversations.reduce((allConversations, conversation) => {
      for (const allConversationIndex in allConversations) {
        const dayConversations = allConversations[Number(allConversationIndex)]

        const dayConversationIndex = dayConversations.findLastIndex(
          (dayConversations) =>
            isSameDay(dayConversations.createdAt, conversation.createdAt),
        )

        if (dayConversationIndex !== -1) {
          allConversations[allConversationIndex].push(conversation)

          return allConversations
        }
      }

      return [...allConversations, [conversation]]
    }, [] as TConversations[])
  }

  const { channelIndex, groupConversationsPerDay, onGroupConversationsPerDay } =
    useChannels()

  const [conversations, setConversations] = useState<TConversations>(() => {
    onGroupConversationsPerDay(
      getGroupConversationsPerDay(defaultConversations),
    )
    return defaultConversations
  })

  const conversationsHandler = (
    setStateAction: SetStateAction<TConversations>,
  ) => {
    if (typeof setStateAction === 'function') {
      setConversations((cs) => {
        onGroupConversationsPerDay(getGroupConversationsPerDay(cs))

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

      conversations = conversations || [...cs, conversation.data]

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

  const dayConversations = groupConversationsPerDay[channelIndex] || []

  return (
    <div className="flex-grow overflow-y-auto overflow-x-hidden h-[50vh]">
      <div
        data-center={conversations.length === 0}
        className="data-[center=true]:flex flex-col data-[center=true]:items-center data-[center=true]:justify-center"
      >
        {conversations.length > 0 && (
          <div className="flex flex-col">
            {dayConversations.map((conversation) => (
              <Conversation
                key={conversation.id}
                removeConversation={(cId) =>
                  conversationsHandler((cs) => {
                    const conversationIndex = cs.findIndex((c) => c.id === cId)

                    if (conversationIndex !== -1)
                      cs.splice(conversationIndex, 1)

                    return [...cs]
                  })
                }
                onNewConversations={(newConversations) => {
                  conversationsHandler((cs) => {
                    newConversations.forEach((nc) => {
                      const conversationIndex = cs.findIndex(
                        (c) => c.id === nc.id,
                      )

                      if (conversationIndex !== -1) {
                        cs[channelIndex] = nc
                      } else {
                        cs.push(nc)
                      }
                    })

                    return [...cs]
                  })
                }}
                channelIndex={channelIndex}
                conversation={conversation}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
