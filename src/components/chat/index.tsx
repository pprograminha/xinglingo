'use client'

import { Conversation } from '@/lib/db/drizzle/@types'
import * as Ably from 'ably'
import { AblyProvider, useChannel } from 'ably/react'
import { Bone } from 'lucide-react'
import { HTMLAttributes, Suspense, useMemo, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { ConversationContainer } from './conversation-container'
import { ChatForm } from './form'
import { cn } from '@/lib/utils'
import { PhraseGenerator } from './phrase-generator'

type ChatContainerProps = HTMLAttributes<HTMLDivElement>

export default function ChatContainer(props: ChatContainerProps) {
  const client = new Ably.Realtime.Promise({
    authUrl: '/api/ably/token',
    authMethod: 'POST',
  })

  return (
    <AblyProvider client={client}>
      <Chat {...props} />
    </AblyProvider>
  )
}

type ChatProps = HTMLAttributes<HTMLDivElement>

const Chat = ({ className, ...props }: ChatProps) => {
  const [messageText, setMessageText] = useState<string>('')

  const { channel } = useChannel('status-updates')

  const publicFromClientHandler = (conversation: Conversation) => {
    if (channel === null) return

    channel.publish('update-from-client', conversation)
  }

  const c = useMemo(() => <ConversationContainer />, [])

  return (
    <>
      <Card
        className={cn(
          'w-full rounded-none md:min-h-screen min-h-[calc(100vh_-_82px)] flex flex-col',
          className,
        )}
        {...props}
      >
        <CardHeader className="md:flex hidden">
          <CardTitle>Chat</CardTitle>
          <CardDescription>Define the topic and chat</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col md:pt-0 pt-3">
          <Suspense
            fallback={
              <div className="pr-4 h-[40vh] flex items-center justify-center flex-grow">
                <Bone className="w-16 h-16 animate-bounce" />
              </div>
            }
          >
            {c}
          </Suspense>

          <div className="flex items-center pt-0 space-x-2">
            <ChatForm
              onMessageText={setMessageText}
              onPublicFromClientHandler={publicFromClientHandler}
              messageText={messageText}
            />
            <PhraseGenerator onPhrase={(phrase) => setMessageText(phrase)} />
          </div>
        </CardContent>
      </Card>
    </>
  )
}
