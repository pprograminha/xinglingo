'use client'

import * as Ably from 'ably'
import { AblyProvider, useChannel } from 'ably/react'
import { Bone, MessageCircle } from 'lucide-react'
import { Suspense, useMemo, useState } from 'react'
import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
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

  const publicFromClientHandler = () => {
    if (channel === null) return

    channel.publish('update-from-client', {
      text: `${messageText}`,
    })
  }

  const c = useMemo(() => <ConversationContainer />, [])

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-black hover:bg-gray-700 m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900"
            variant="outline"
          >
            <MessageCircle className="text-white" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          sideOffset={10}
          side="bottom"
          align="end"
          className="p-0 md:w-[600px] border-0 bg-transparent dark:bg-transparent overflow-hidden"
        >
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Chat</CardTitle>
              <CardDescription>....</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense
                fallback={
                  <div className="pr-4 h-[474px] flex items-center justify-center">
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
        </PopoverContent>
      </Popover>
    </>
  )
}
