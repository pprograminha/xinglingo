'use client'
import { useChannels } from '@/hooks/use-channels'
import { Bone } from 'lucide-react'
import { useEffect } from 'react'
import { Conversations } from './conversations'
import { getConversations } from '@/actions/conversations/get-conversations'

type Conversations = Awaited<ReturnType<typeof getConversations>>

export function ConversationContainer() {
  const { setConversations, channels } = useChannels()

  useEffect(() => {
    getConversations().then((conversations) => {
      setConversations(conversations)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (channels.length === 0)
    return (
      <div className="pr-4 h-full flex items-center justify-center flex-grow">
        <Bone className="w-16 h-16 animate-bounce" />
      </div>
    )

  return <Conversations />
}
