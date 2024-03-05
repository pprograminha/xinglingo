'use client'

import { Conversation } from '@/lib/db/drizzle/@types'
import * as Ably from 'ably'
import { AblyProvider, useChannel } from 'ably/react'
import { Bone } from 'lucide-react'
import { Suspense, useMemo, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { ConversationContainer } from './conversation-container'
import { ChatForm } from './form'
export default function ChatContainer() {
  const client = new Ably.Realtime.Promise({
    authUrl: '/api/ably/token',
    authMethod: 'POST',
  })

  return (
    <AblyProvider client={client}>
      <Chat />
    </AblyProvider>
  )
}
const Chat = () => {
  const [messageText, setMessageText] = useState<string>('')

  const { channel } = useChannel('status-updates')

  const publicFromClientHandler = (conversation: Conversation) => {
    if (channel === null) return

    channel.publish('update-from-client', conversation)
  }

  const c = useMemo(() => <ConversationContainer />, [])

  return (
    <>
      <Card className="w-full rounded-none md:h-full flex flex-col">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
          <CardDescription>Define the topic and chat</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
          <Suspense
            fallback={
              <div className="pr-4 h-[474px] w-[50vw] flex items-center justify-center flex-grow">
                <Bone className="w-16 h-16 animate-bounce" />
              </div>
            }
          >
            {c}
          </Suspense>

          <div className="flex items-center pt-0">
            <ChatForm
              onMessageText={setMessageText}
              onPublicFromClientHandler={publicFromClientHandler}
              messageText={messageText}
            />
          </div>
        </CardContent>
      </Card>
    </>
  )
}
