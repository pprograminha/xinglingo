'use client'
import { isSameDay } from 'date-fns'
import { Bone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getConversations } from '../../../actions/conversations/get-conversations'
import { Conversations } from './conversations'
import { useChannels } from '@/hooks/use-channels'
type Conversations = Awaited<ReturnType<typeof getConversations>>
export function ConversationContainer() {
  const [conversations, setConversations] = useState<
    Awaited<ReturnType<typeof getConversations>>
  >([])
  const { onGroupConversationsPerDay } = useChannels()

  const getGroupConversationsPerDay = (conversations: Conversations) => {
    return conversations
      .reduce((allConversations, conversation) => {
        for (const allConversationIndex in allConversations) {
          const dayConversations =
            allConversations[Number(allConversationIndex)]

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
      }, [] as Conversations[])
      .map((conversations) => conversations.reverse())
  }

  useEffect(() => {
    getConversations().then((conversations) => {
      onGroupConversationsPerDay(getGroupConversationsPerDay(conversations))

      setConversations(conversations)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (conversations.length === 0)
    return (
      <div className="pr-4 h-full flex items-center justify-center flex-grow">
        <Bone className="w-16 h-16 animate-bounce" />
      </div>
    )

  return (
    <Conversations
      conversations={conversations}
      getGroupConversationsPerDay={getGroupConversationsPerDay}
    />
  )
}
