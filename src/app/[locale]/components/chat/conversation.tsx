/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { deleteConversation } from '@/actions/conversations/delete-conversation'
import { TextToHTML } from '@/components/text-to-html'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { useAuth } from '@/hooks/use-auth'
import { useBreakpoint } from '@/hooks/use-breakpoint'
import { useConversations } from '@/hooks/use-conversations'
import { usePronunciation } from '@/hooks/use-pronunciation'
import { useRecordConversation } from '@/hooks/use-record-conversation'
import {
  Phoneme,
  PronunciationAssessment,
  Conversation as TypeConversation,
  Word,
} from '@/lib/db/drizzle/types'
import { scoreColor, scoreStyle } from '@/lib/score-color'
import { Collapsible } from '@radix-ui/react-collapsible'
import { useChat } from 'ai/react'
import { format } from 'date-fns'
import { Loader2, Mic, MicOff, Sparkles, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { SpeechGenerator } from './speech-generator'

type Conversations = (TypeConversation & {
  pronunciationAssessment:
    | (PronunciationAssessment & {
        words: (Word & {
          phonemes: Phoneme[]
        })[]
      })
    | null
})[]

type ConversationProps = {
  conversation: Conversations[number]
  lessonId?: string
}

export function Conversation({ conversation, lessonId }: ConversationProps) {
  const { openPronunciation } = usePronunciation()
  const { removeConversation, upsertConversation } = useConversations()
  const t = useTranslations()
  const [isSounding, setIsSounding] = useState(false)

  const { uid } = useAuth()
  const {
    conversation: recConversation,
    isLoading,
    startRecording,
  } = useRecordConversation()
  const userId = uid()
  const {
    append,
    isLoading: openaiIsLoading,
    input,
    messages,
  } = useChat({
    onResponse(response) {
      console.log(response)
    },
    generateId: () => conversation.id,

    onFinish(message) {
      if (userId)
        upsertConversation({
          type: 'create',
          data: {
            text: message.content,
            recipientId: userId,
            lessonId,
            role: 'llm',
          },
        })
    },

    sendExtraMessageFields: true,
    api: '/api/ai/chat',
    id: conversation.lessonId ?? undefined,
    body: {
      model: 'gpt-3.5-turbo',
      temperature: 0.6,
      max_length: 400,
    },
  })

  console.log(input)
  console.log(messages)

  const isMd = useBreakpoint('md')
  const [isOpen, setIsOpen] = useState(false)

  const parseWords = (conversation: Conversations[number]) => {
    const cwords = conversation.text.split(' ')

    return (
      conversation.pronunciationAssessment?.words.map((w) => {
        const cwordIndex = cwords.findIndex(
          (word) =>
            word.toLowerCase().replace(/[^a-z0-9']/g, '') ===
            w.word.toLowerCase().replace(/[^a-z0-9']/g, ''),
        )

        const cword = cwords[cwordIndex]

        cwords.splice(cwordIndex, 1)

        return {
          ...w,
          w: cword || w.word,
        }
      }) || []
    )
  }

  return (
    <HoverCard
      {...(!isMd
        ? {
            open: isOpen,
            onOpenChange: () => setIsOpen(false),
          }
        : {})}
    >
      <HoverCardTrigger
        onClick={() => setIsOpen(true)}
        className="inline-block data-[me=true]:text-right group"
        data-me={Boolean(conversation.role === 'user')}
      >
        <div className="cursor-pointer w-full inline-flex flex-col  justify-start gap-3 my-2 text-sm flex-1 hover:animate-shadow-pop-bl rounded-lg p-2">
          <div className="inline-flex flex-col justify-start gap-3 text-sm">
            <div className="flex group-data-[me=true]:flex-row-reverse gap-3 items-center w-full">
              <div className="rounded-full bg-zinc-900 dark:bg-gray-100 border p-1 shrink-0 w-10 h-10 flex items-center justify-center">
                {conversation.author?.image ? (
                  <Avatar>
                    <AvatarFallback>
                      {conversation.author.fullName[0]}
                    </AvatarFallback>
                    <AvatarImage
                      src={conversation.author.image}
                      alt={conversation.author.fullName}
                    />
                  </Avatar>
                ) : (
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
                )}
              </div>
              <p className="leading-relaxed group-data-[me=true]:text-right">
                <span className="block font-bold text-gray-400  group-data-[me=false]:border group-data-[me=false]:rounded-md group-data-[me=false]:px-1 group-data-[me=false]:text-xs text-xs md:text-md group-data-[me=false]:font-normal">
                  {conversation.author?.fullName}
                </span>
              </p>
            </div>
            <div className="inline-flex group-data-[me=true]:flex-row-reverse">
              {conversation.role !== 'user' ? (
                <>
                  {conversation.text.length > 1000 ? (
                    <Collapsible>
                      <TextToHTML text={conversation.text} />
                    </Collapsible>
                  ) : (
                    <TextToHTML text={conversation.text} />
                  )}
                </>
              ) : (
                <span>
                  {conversation.pronunciationAssessment &&
                  parseWords(conversation).length > 0 ? (
                    <>
                      {parseWords(conversation).map((w) => (
                        <span
                          key={w.id}
                          data-score-color={scoreColor(w.accuracyScore)}
                          className="inline-block border-b mx-[2px] data-[score-color=red]:border-red-400 data-[score-color=green]:border-green-400 data-[score-color=yellow]:border-yellow-400"
                        >
                          {w.w}
                        </span>
                      ))}
                    </>
                  ) : (
                    <TextToHTML text={conversation.text} />
                  )}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center w-20 gap-1 group-data-[me=true]:justify-end group-data-[me=true]:ml-auto">
            {conversation.role === 'user' && (
              <Button
                variant="outline"
                size="icon"
                disabled={isLoading}
                data-on={recConversation?.id === conversation.id}
                onClick={() => {
                  if (recConversation?.id !== conversation.id) {
                    openPronunciation()
                    startRecording({
                      referenceText: conversation.text,
                      conversation,
                    })
                  }
                }}
                className="flex-shrink-0 w-9 dark:data-[on=true]:border-red-500 data-[on=true]:border-red-500 data-[on=true]:animate-pulse data-[on=true]:duration-700 data-[on=true]:cursor-not-allowed"
              >
                {recConversation?.id === conversation.id ? <Mic /> : <MicOff />}
              </Button>
            )}
            {conversation.role === 'user' && (
              <SpeechGenerator
                onSoundStart={() => setIsSounding(true)}
                onSoundEnd={() => setIsSounding(false)}
                conversationId={conversation.id}
                data-on={isSounding}
              />
            )}
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        align={conversation.role === 'user' ? 'end' : 'start'}
        className="md:max-h-max max-h-[150px] overflow-y-auto"
        side="bottom"
      >
        {conversation.role === 'user' && (
          <Button
            size="sm"
            variant="outline"
            className="w-full mb-4"
            disabled={openaiIsLoading || isLoading}
            onClick={() =>
              append({
                content: conversation.text,
                role: 'user',
              })
            }
          >
            {openaiIsLoading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <>
                {t('Translation and definition of vocabulary')}{' '}
                <Sparkles className="w-4 ml-1" />
              </>
            )}
          </Button>
        )}
        {conversation.pronunciationAssessment ? (
          <div className="text-sm mb-1">
            <div className="mb-1 dark:bg-zinc-900 p-1 rounded-md">
              <span className="text-zinc-400 text-xs">
                {t('Accuracy Score')}:
              </span>{' '}
              <span
                className="data-[score-color=red]:text-red-400 data-[score-color=green]:text-green-400 data-[score-color=yellow]:text-yellow-400"
                data-score-color={scoreColor(
                  conversation.pronunciationAssessment.accuracyScore,
                )}
              >
                {conversation.pronunciationAssessment.accuracyScore}
              </span>
            </div>
            <div className="mb-1 dark:bg-zinc-900 p-1 rounded-md">
              <span className="text-zinc-400 text-xs">
                {t('Completeness Score')}:
              </span>{' '}
              <span
                className="data-[score-color=red]:text-red-400 data-[score-color=green]:text-green-400 data-[score-color=yellow]:text-yellow-400"
                data-score-color={scoreColor(
                  conversation.pronunciationAssessment.completenessScore,
                )}
              >
                {conversation.pronunciationAssessment.completenessScore}
              </span>
            </div>
            <div className="mb-1 dark:bg-zinc-900 p-1 rounded-md">
              <span className="text-zinc-400 text-xs">
                {t('Fluency Score')}:
              </span>{' '}
              <span
                className="data-[score-color=red]:text-red-400 data-[score-color=green]:text-green-400 data-[score-color=yellow]:text-yellow-400"
                data-score-color={scoreColor(
                  conversation.pronunciationAssessment.fluencyScore,
                )}
              >
                {conversation.pronunciationAssessment.fluencyScore}
              </span>
            </div>
            <div className="mb-1 dark:bg-zinc-900 p-1 rounded-md">
              <span className="text-zinc-400 text-xs">
                {t('Pronunciation Score')}:
              </span>{' '}
              <span
                className="data-[score-color=red]:text-red-400 data-[score-color=green]:text-green-400 data-[score-color=yellow]:text-yellow-400"
                data-score-color={scoreColor(
                  conversation.pronunciationAssessment.pronScore,
                )}
              >
                {conversation.pronunciationAssessment.pronScore}
              </span>
            </div>
            <div className="mb-4 dark:bg-zinc-900 p-1 rounded-md">
              <span className="text-zinc-400 text-xs">
                {t('Prosody Score')}:
              </span>{' '}
              <span
                className="data-[score-color=red]:text-red-400 data-[score-color=green]:text-green-400 data-[score-color=yellow]:text-yellow-400"
                data-score-color={scoreColor(
                  conversation.pronunciationAssessment.prosodyScore,
                )}
              >
                {conversation.pronunciationAssessment.prosodyScore}
              </span>
            </div>
            {conversation.pronunciationAssessment.words.map((w) => (
              <span
                key={w.id}
                data-score-color={scoreColor(w.accuracyScore)}
                className={`${scoreStyle} capitalize border inline-block p-[1px] px-2 m-[1.5px] rounded-md  data-[score-color=red]:border-red-400 data-[score-color=green]:border-green-400 data-[score-color=yellow]:border-yellow-400 group`}
              >
                {w.word}{' '}
                <span className="inline-block rounded-md  px-1 ">
                  {w.accuracyScore}
                </span>
              </span>
            ))}
          </div>
        ) : (
          <div className="text-sm mb-1 overflow-y-auto max-h-60 ">
            <TextToHTML text={conversation.text} />
          </div>
        )}
        <p className="text-zinc-500 text-xs">
          {t('Created at:')}{' '}
          {format(conversation.createdAt, 'yyyy/MM/dd HH:mm:ss')}
        </p>
        <Button
          size="sm"
          variant="outline"
          className="w-full mt-4"
          onClick={() => {
            deleteConversation(conversation.id)
            removeConversation(conversation.id)
          }}
        >
          {t('Delete')} <Trash2 className="w-4 ml-1" />
        </Button>
      </HoverCardContent>
    </HoverCard>
  )
}
