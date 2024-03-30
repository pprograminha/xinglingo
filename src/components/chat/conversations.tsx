/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { getWords } from '@/lib/get-words'
import * as Ably from 'ably'
import { useChannel } from 'ably/react'
import { isSameDay } from 'date-fns'
import { Bone } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Conversation } from './conversation'
import { getConversations } from '../../actions/conversations/get-conversations'
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel'

type TConversations = Awaited<ReturnType<typeof getConversations>>

type ConversationProps = {
  conversations: TConversations
}

export function Conversations({
  conversations: defaultConversations,
}: ConversationProps) {
  const [conversations, setConversations] =
    useState<TConversations>(defaultConversations)

  const [channnelIndex, setChannelIndex] = useState(0)

  useChannel('status-updates', (conversation: Ably.Types.Message) => {
    setConversations((cs) => {
      const conversationIndex = cs.findIndex(
        (c) => c.id === conversation.data.id,
      )

      if (conversationIndex !== -1) {
        cs[conversationIndex] = conversation.data

        return [...cs]
      }

      return [...cs, conversation.data]
    })
  })

  const conversationsContainerRef = useRef<HTMLDivElement | null>(null)

  const words = getWords(
    conversations
      .filter((c) => c.authorId)
      .map((c) => c.text.toLowerCase())
      .join(' '),
  )

  const groupConversationsPerDay = conversations
    .reduce((allConversations, conversation) => {
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
    .reverse()

  useEffect(() => {
    conversationsContainerRef.current?.scrollTo({
      top: conversationsContainerRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [])

  const dayConversations = groupConversationsPerDay[channnelIndex] || []

  return (
    <div className="flex-grow">
      <p className="text-xs md:inline hidden">Palavras: {words.length}</p>
      <div
        data-center={conversations.length === 0}
        className="data-[center=true]:flex flex-col data-[center=true]:items-center data-[center=true]:justify-center"
      >
        {conversations.length === 0 && (
          <Bone className="w-16 h-16 animate-bounce" />
        )}
        {conversations.length > 0 && (
          <Tabs
            defaultValue="0"
            onValueChange={(e) => setChannelIndex(Number(e))}
          >
            <h1 className="mt-3 md:inline hidden">Canais: </h1>
            <br />
            <TabsList className="my-3">
              <Carousel className="overflow-hidden w-[calc(100vw_-_100px)] md:w-[300px]">
                <CarouselContent className="pl-4">
                  {[...groupConversationsPerDay].map((c, index) => (
                    <TabsTrigger
                      className="md:basis-1/12 basis-1/4 flex items-center justify-center"
                      key={String(index)}
                      value={String(index)}
                    >
                      <CarouselItem className="!p-0">{index + 1}</CarouselItem>
                    </TabsTrigger>
                  ))}
                </CarouselContent>
              </Carousel>
            </TabsList>
            <TabsContent
              value={String(channnelIndex)}
              ref={conversationsContainerRef}
              className="flex flex-col overflow-y-auto overflow-x-hidden h-[calc(100vh_-_280px)]  min-h-[200px] pr-4"
            >
              {dayConversations.map((conversation) => (
                <Conversation
                  key={conversation.id}
                  removeConversation={(cId) =>
                    setConversations((cs) => {
                      const conversationIndex = cs.findIndex(
                        (c) => c.id === cId,
                      )

                      if (conversationIndex !== -1)
                        cs.splice(conversationIndex, 1)

                      return [...cs]
                    })
                  }
                  onNewConversations={(newConversations) => {
                    setConversations((cs) => {
                      newConversations.forEach((nc) => {
                        const conversationIndex = cs.findIndex(
                          (c) => c.id === nc.id,
                        )

                        if (conversationIndex !== -1) {
                          cs[channnelIndex] = nc
                        } else {
                          cs.push(nc)
                        }
                      })

                      return [...cs]
                    })
                  }}
                  channnelIndex={channnelIndex}
                  conversation={conversation}
                />
              ))}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
