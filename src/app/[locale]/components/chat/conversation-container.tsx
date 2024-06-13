'use client'
import { getConversations } from '@/actions/conversations/get-conversations'
import { useChannels } from '@/hooks/use-channels'
import { Bone } from 'lucide-react'
import { useEffect } from 'react'
import { Conversations } from './conversations'
import Image from 'next/image'

type Conversations = Awaited<ReturnType<typeof getConversations>>

export function ConversationContainer() {
  const { setConversations, isFetching, channels, setIsFetching } =
    useChannels()

  useEffect(() => {
    setIsFetching(true)

    getConversations()
      .then((conversations) => {
        setConversations(conversations)
      })
      .finally(() => {
        setIsFetching(false)
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isFetching)
    return (
      <div className="pr-4 h-full flex items-center justify-center flex-grow">
        <Bone className="w-16 h-16 animate-bounce" />
      </div>
    )
  else if (!isFetching && channels.length === 0)
    return (
      <div className="flex items-center justify-center h-full">
        <Image
          src="/assets/imgs/panda.png"
          loading="lazy"
          width={320}
          height={213}
          className="w-24 opacity-20"
          alt="Xinglingo panda"
        />
      </div>
    )

  return <Conversations />
}
