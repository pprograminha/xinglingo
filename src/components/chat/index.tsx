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
import { useAuth } from '@/hooks/use-auth'
import { Dialog, DialogContent } from '../ui/dialog'
import { usePronunciation } from '@/hooks/use-pronunciation'
import { PronunciationAssessmentDash } from '@/app/components/pronunciation-assessment/pronunciation-assesment-dash'

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
  const { isOpen, closePronunciation } = usePronunciation()
  const { uid } = useAuth()

  const { channel } = useChannel('status-updates')

  const publicFromClientHandler = (conversation: Conversation) => {
    if (channel === null) return

    channel.publish('update-from-client', conversation)
  }

  const c = useMemo(() => <ConversationContainer />, [])

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(isOpen) => {
          if (isOpen === false) {
            closePronunciation()
          }
        }}
      >
        <DialogContent>
          <PronunciationAssessmentDash />
        </DialogContent>
      </Dialog>
      <div className='h-full pr-2 pb-2 md:pr-4 md:pb-4'>
        <Card
          className={cn(
            'w-full h-full flex flex-col border-0 rounded-lg',
            className,
          )}
          {...props}
        >
          <CardHeader className="md:flex hidden">
            <CardTitle>Chat</CardTitle>
            <CardDescription>Aprenda conversando com a AI</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col pt-3 p-1 md:p-6 md:pt-0">
            <Suspense
              fallback={
                <div className="pr-4 h-full flex items-center justify-center flex-grow">
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
                uid={uid}
              />
              <PhraseGenerator onPhrase={(phrase) => setMessageText(phrase)} />
            </div>
          </CardContent>
        </Card>

      </div>
    </>
  )
}
