'use client'

import { useRecordConversation } from '@/hooks/use-record-conversation'
import { useSwitch } from '@/hooks/use-switch'
import { uid } from '@/lib/get-uid'
import { getWords } from '@/lib/get-words'
import { scoreColor, scoreStyle } from '@/lib/score-color'
import * as Ably from 'ably'
import { useChannel } from 'ably/react'
import { format, isSameDay } from 'date-fns'
import { Bone, Mic, MicOff } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { getConversations } from './actions'

type TConversations = Awaited<ReturnType<typeof getConversations>>

type ConversationProps = {
  conversations: TConversations
}

export function Conversations({
  conversations: defaultConversations,
}: ConversationProps) {
  const [conversations, setConversations] =
    useState<TConversations>(defaultConversations)

  const { toggle: toggleMode } = useSwitch()
  const [channnelIndex, setChannelIndex] = useState(0)
  const {
    conversation: recConversation,
    isLoading,
    startRecording,
  } = useRecordConversation()

  useChannel('status-updates', (conversation: Ably.Types.Message) => {
    setConversations((cs) => {
      const conversationIndex = cs.findIndex(
        (c) => c.id === conversation.data.id,
      )

      if (conversationIndex !== -1) {
        cs[conversationIndex] = conversation.data

        return [...cs]
      }

      return [...cs, conversation.data]
    })
  })

  const conversationsContainerRef = useRef<HTMLDivElement | null>(null)

  const words = getWords(
    conversations.map((c) => c.text.toLowerCase()).join(' '),
  )

  const groupConversationsPerDay = conversations
    .filter((c) => c.author)
    .reduce((allConversations, conversation) => {
      for (const allConversationIndex in allConversations) {
        const dayConversations = allConversations[Number(allConversationIndex)]

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
    }, [] as TConversations[])
    .reverse()

  useEffect(() => {
    conversationsContainerRef.current?.scrollTo({
      top: conversationsContainerRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [])

  const dayConversations = groupConversationsPerDay[channnelIndex] || []

  const $getWords = (conversation: TConversations['0']) =>
    conversation.pronunciationAssessment?.words.map((w) => ({
      ...w,
      w:
        conversation.text
          .split(' ')
          .find(
            (word) =>
              word.toLowerCase().replace(/[^a-z0-9']/g, '') ===
              w.word.toLowerCase().replace(/[^a-z0-9']/g, ''),
          ) || w.word,
    })) || []

  return (
    <div className="flex-grow">
      <p className="text-xs md:inline hidden">Words: {words.length}</p>
      <div
        data-center={conversations.length === 0}
        className="data-[center=true]:flex flex-col data-[center=true]:items-center data-[center=true]:justify-center"
      >
        {conversations.length === 0 && (
          <Bone className="w-16 h-16 animate-bounce" />
        )}
        {conversations.length > 0 && (
          <Tabs
            defaultValue="0"
            onValueChange={(e) => setChannelIndex(Number(e))}
          >
            <h1 className="mt-3 md:inline hidden">Channels: </h1>
            <TabsList className="my-3">
              {[...groupConversationsPerDay].map((c, index) => (
                <TabsTrigger value={String(index)} key={String(index)}>
                  {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent
              value={String(channnelIndex)}
              ref={conversationsContainerRef}
              className="flex flex-col overflow-y-auto overflow-x-hidden h-[calc(100vh_-_280px)]  min-h-[200px] pr-4"
            >
              {dayConversations.map((conversation) => (
                <HoverCard key={conversation.id}>
                  <HoverCardTrigger
                    className="inline-block data-[me=true]:text-right"
                    data-me={conversation.authorId === uid()}
                  >
                    <div
                      data-me={conversation.authorId === uid()}
                      className="cursor-pointer  inline-flex data-[me=true]:flex-row-reverse justify-start gap-3 my-2 text-sm flex-1 group hover:animate-shadow-pop-bl rounded-lg p-2"
                    >
                      <div className="inline-flex group-data-[me=true]:flex-row-reverse justify-start gap-3 text-sm">
                        <div className="rounded-full bg-zinc-900 dark:bg-gray-100 border p-1 shrink-0 w-10 h-10 flex items-center justify-center">
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
                        </div>
                        <p className="leading-relaxed group-data-[me=true]:text-right">
                          <span className="block font-bold text-gray-400">
                            {conversation.author?.fullName}
                          </span>
                          <span className="inline-flex group-data-[me=true]:flex-row-reverse">
                            <span>🧩</span>
                            <span>
                              {conversation.pronunciationAssessment &&
                              $getWords(conversation).length > 0 ? (
                                <>
                                  {$getWords(conversation).map((w) => (
                                    <span
                                      key={w.id}
                                      data-score-color={scoreColor(
                                        w.accuracyScore,
                                      )}
                                      className="inline-block border-b mx-[2px] data-[score-color=red]:border-red-400 data-[score-color=green]:border-green-400 data-[score-color=yellow]:border-yellow-400"
                                    >
                                      {w.w}
                                    </span>
                                  ))}
                                </>
                              ) : (
                                conversation.text
                              )}
                            </span>
                          </span>
                        </p>
                      </div>
                      {channnelIndex === 0 && (
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={isLoading}
                          data-on={recConversation?.id === conversation.id}
                          onClick={() => {
                            if (recConversation?.id !== conversation.id) {
                              startRecording({
                                referenceText: conversation.text,
                                conversation,
                              })
                              toggleMode(['chat', 'pronunciation'])
                            }
                          }}
                          className="flex-shrink-0 dark:data-[on=true]:border-red-500 data-[on=true]:border-red-500 data-[on=true]:animate-pulse data-[on=true]:duration-700 data-[on=true]:cursor-not-allowed"
                        >
                          {recConversation?.id === conversation.id ? (
                            <Mic />
                          ) : (
                            <MicOff />
                          )}
                        </Button>
                      )}
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent
                    align={conversation.authorId === uid() ? 'end' : 'start'}
                  >
                    {conversation.pronunciationAssessment ? (
                      <div className="text-sm mb-1">
                        <div className="mb-1 dark:bg-zinc-900 p-1 rounded-md">
                          <span className="text-zinc-400 text-xs">
                            Accuracy Score:
                          </span>{' '}
                          <span
                            className="data-[score-color=red]:text-red-400 data-[score-color=green]:text-green-400 data-[score-color=yellow]:text-yellow-400"
                            data-score-color={scoreColor(
                              conversation.pronunciationAssessment
                                .accuracyScore,
                            )}
                          >
                            {conversation.pronunciationAssessment.accuracyScore}
                          </span>
                        </div>
                        <div className="mb-1 dark:bg-zinc-900 p-1 rounded-md">
                          <span className="text-zinc-400 text-xs">
                            Completeness Score:
                          </span>{' '}
                          <span
                            className="data-[score-color=red]:text-red-400 data-[score-color=green]:text-green-400 data-[score-color=yellow]:text-yellow-400"
                            data-score-color={scoreColor(
                              conversation.pronunciationAssessment
                                .completenessScore,
                            )}
                          >
                            {
                              conversation.pronunciationAssessment
                                .completenessScore
                            }
                          </span>
                        </div>
                        <div className="mb-1 dark:bg-zinc-900 p-1 rounded-md">
                          <span className="text-zinc-400 text-xs">
                            Fluency Score:
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
                            Pron Score:
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
                            Prosody Score:
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
                      <p className="text-sm mb-1">{conversation.text}</p>
                    )}
                    <p className="text-zinc-500 text-xs">
                      Created at:{' '}
                      {format(conversation.createdAt, 'yyyy/MM/dd HH:mm:ss')}
                    </p>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </TabsContent>
            <TabsContent value="password">
              Change your password here.
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
