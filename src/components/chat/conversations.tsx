'use client'

import { Conversation } from '@/lib/db/drizzle/@types'
import { useChannel } from 'ably/react'
import { Bone } from 'lucide-react'
import { useState } from 'react'
import * as Ably from 'ably'
type ConversationProps = {
  conversations: Conversation[]
}

export function Conversations({
  conversations: defaultConversations,
}: ConversationProps) {
  const [conversations, setConversations] =
    useState<Conversation[]>(defaultConversations)

  useChannel('status-updates', (message: Ably.Types.Message) => {
    setConversations((prev) => [
      ...prev,
      {
        author: {
          createdAt: new Date(),
          email: 'm@m.com',
          fullName: 'mm ,,',
          id: '1',
        },
        authorId: '1',
        createdAt: new Date(),
        id: `${new Date().getTime()}`,
        updatedAt: new Date(),
        text: message.data.text,
      },
    ])
  })

  return (
    <div
      data-center={conversations.length === 0}
      className="pr-4 h-[474px] data-[center=true]:flex data-[center=true]:items-center data-[center=true]:justify-center"
    >
      {conversations.length === 0 && (
        <Bone className="w-16 h-16 animate-bounce" />
      )}
      {conversations
        .filter((c) => c.author)
        .map((conversation) => (
          <div className="flex gap-3 my-4 text-sm flex-1" key={conversation.id}>
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
            <p className="leading-relaxed">
              <span className="block font-bold text-gray-400">
                {conversation.author?.fullName}
              </span>
              🧩 {conversation.text}
            </p>
          </div>
        ))}
    </div>
  )
}
