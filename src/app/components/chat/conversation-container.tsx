'use client'
import { useEffect, useState } from 'react'
import { getConversations } from '../../../actions/conversations/get-conversations'
import { Conversations } from './conversations'
import { Bone } from 'lucide-react'

export function ConversationContainer() {
  const [conversations, setConversations] = useState<
    Awaited<ReturnType<typeof getConversations>>
  >([])

  useEffect(() => {
    getConversations().then((conversations) => {
      setConversations(conversations)
    })
  }, [])

  if (conversations.length === 0)
    return (
      <div className="pr-4 h-full flex items-center justify-center flex-grow">
        <Bone className="w-16 h-16 animate-bounce" />
      </div>
    )

  return <Conversations conversations={conversations} />
}
