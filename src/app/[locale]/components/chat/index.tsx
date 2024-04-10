'use client'

import { useAuth } from '@/hooks/use-auth'
import { usePronunciation } from '@/hooks/use-pronunciation'
import { Conversation } from '@/lib/db/drizzle/types'
import { cn } from '@/lib/utils'
import * as Ably from 'ably'
import { AblyProvider, useChannel } from 'ably/react'
import { HTMLAttributes, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ConversationContainer } from './conversation-container'
import { ChatForm } from './form'
import { PhraseGenerator } from './phrase-generator'
import { PronunciationAssessmentDash } from '../pronunciation-assessment/pronunciation-assesment-dash'

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
  const t = useTranslations()
  const { uid } = useAuth()

  const { channel } = useChannel('status-updates')

  const sendMessageHandler = (conversation: Conversation) => {
    if (channel === null) return

    channel.publish('update-from-client', conversation)
  }

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
      <div className="h-full pr-2 pb-2 md:pr-4 md:pb-4">
        <Card
          className={cn(
            'w-full h-full flex flex-col border-0 rounded-lg relative',
            className,
          )}
          {...props}
        >
          <CardHeader className="md:flex hidden z-20">
            <CardTitle>{t('Conversation')}</CardTitle>
            <CardDescription>{t('Learn by talking to the AI')}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col pt-3 p-1 md:p-6 md:pt-0 z-20 ">
            <ConversationContainer />

            <div className="flex items-center pt-0 space-x-2">
              <ChatForm
                onMessageText={setMessageText}
                onSendMessageHandler={sendMessageHandler}
                messageText={messageText}
                uid={uid}
                t={t}
              />
              <PhraseGenerator onPhrase={(phrase) => setMessageText(phrase)} />
            </div>
          </CardContent>
          <div className='bg-[url("/assets/chat-bg.png")] !dark:bg-[url("/assets/chat-bg.png")] bg-auto z-10 absolute top-0 left-0 right-0 bottom-0 opacity-10' />
        </Card>
      </div>
    </>
  )
}
