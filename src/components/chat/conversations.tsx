'use client'

import { Conversation } from '@/lib/db/drizzle/@types'
import { uid } from '@/lib/get-uid'
import * as Ably from 'ably'
import { useChannel } from 'ably/react'
import { format } from 'date-fns'
import { Bone, Mic, MicOff } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { useRecordConversation } from '@/hooks/use-record-conversation'
type ConversationProps = {
  conversations: Conversation[]
}

export function Conversations({
  conversations: defaultConversations,
}: ConversationProps) {
  const [conversations, setConversations] =
    useState<Conversation[]>(defaultConversations)
  const { conversation: recConversation, toggleRecord } =
    useRecordConversation()
  useChannel('status-updates', (conversation: Ably.Types.Message) => {
    setConversations((prev) => [...prev, conversation.data as Conversation])
  })

  const words = Array.from(
    new Set(
      conversations
        .map((c) => c.text.toLowerCase())
        .join(' ')
        .split(' ')
        .map((t) => t.replace(/[^a-zA-Z0-9']/g, '')),
    ),
  )

  return (
    <div className="flex-grow">
      <p className="text-xs">Words: {words.length}</p>
      <div
        data-center={conversations.length === 0}
        className="pr-4 min-h-[474px]  flex flex-col data-[center=true]:items-center data-[center=true]:justify-center"
      >
        {conversations.length === 0 && (
          <Bone className="w-16 h-16 animate-bounce" />
        )}
        {conversations
          .filter((c) => c.author)
          .map((conversation) => (
            <HoverCard key={conversation.id}>
              <HoverCardTrigger
                className="inline-block data-[me=true]:text-right"
                data-me={conversation.authorId === uid()}
              >
                <div
                  data-me={conversation.authorId === uid()}
                  className="cursor-pointer  inline-flex data-[me=true]:flex-row-reverse justify-start gap-3 my-2 text-sm flex-1 group hover:animate-shadow-pop-bl rounded-lg p-2"
                >
                  <div className="inline-flex group-data-[me=true]:flex-row-reverse justify-start gap-3 text-sm">
                    <div className="rounded-full bg-zinc-900 dark:bg-gray-100 border p-1 shrink-0 w-10 h-10 flex items-center justify-center">
                      <svg
                        stroke="none"
                        className="dark:fill-black fill-white"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        height={20}
                        width={20}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                        ></path>
                      </svg>
                    </div>
                    <p className="leading-relaxed group-data-[me=true]:text-right">
                      <span className="block font-bold text-gray-400">
                        {conversation.author?.fullName}
                      </span>
                      <span className="inline-flex group-data-[me=true]:flex-row-reverse">
                        <span>🧩</span>
                        <span>{conversation.text}</span>
                      </span>
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    data-on={recConversation?.id === conversation.id}
                    onClick={() => {
                      if (recConversation?.id !== conversation.id)
                        toggleRecord(conversation)
                    }}
                    className="flex-shrink-0 dark:data-[on=true]:border-red-500 data-[on=true]:border-red-500 data-[on=true]:animate-pulse data-[on=true]:duration-700 data-[on=true]:cursor-not-allowed"
                  >
                    {recConversation?.id === conversation.id ? (
                      <Mic />
                    ) : (
                      <MicOff />
                    )}
                  </Button>
                </div>
              </HoverCardTrigger>
              <HoverCardContent
                align={conversation.authorId === uid() ? 'end' : 'start'}
              >
                <p>{conversation.text}</p>
                <p className="text-zinc-500 text-xs">
                  Created at:{' '}
                  {format(conversation.createdAt, 'yyyy/MM/dd HH:mm:ss')}
                </p>
              </HoverCardContent>
            </HoverCard>
          ))}
      </div>
    </div>
  )
}
