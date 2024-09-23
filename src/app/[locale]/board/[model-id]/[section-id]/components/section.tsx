'use client'
import { Loading } from '@/components/loading'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useConversations } from '@/hooks/use-conversations'
import { lingos } from '@/lib/storage/local'
import { useRouter } from '@/navigation'
import { XIcon } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Unit } from '../../(sidebar)/page'
import { Textarea, TextareaHandler } from '../components/textarea'

type SectionProps = {
  params: {
    'model-id': string
    'section-id': string
  }
}

export function Section({ params }: SectionProps) {
  const [isRendering, setIsRendering] = useState(true)
  const [isReRendering, setIsReRendering] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  const {
    // conversations,
    // isFetching,
    isCreating,
    getConversations,
    upsertConversation,
  } = useConversations()
  const textareaRef = useRef<TextareaHandler>(null)
  const conversationsContainerRef = useRef<HTMLDivElement | null>(null)
  const sectionData = lingos.storage.get('unit:section')

  const modelId = params['model-id']
  const sectionId = params['section-id']

  const backHandler = useCallback(() => {
    router.push(`/board/${modelId}`)
  }, [router, modelId])

  const [section, setSection] = useState<Unit['sections'][number] | null>(
    () => {
      if (!sectionData) return null

      try {
        return JSON.parse(sectionData)
      } catch {
        return null
      }
    },
  )

  const setSectionHandler = useCallback(
    (sectionData: Unit['sections'][number] | null) => {
      setSection(sectionData)
      lingos.storage.set('unit:section', sectionData)
    },
    [],
  )

  const [currentLesson, setCurrentLesson] = useState(section?.lessons[0])

  useEffect(() => {
    conversationsContainerRef.current?.scrollTo({
      top: conversationsContainerRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [isReRendering])

  useEffect(() => {
    if (
      !currentLesson ||
      (isRendering === false && !section) ||
      (section && sectionId !== section.id)
    ) {
      backHandler()
    }
  }, [section, currentLesson, sectionId, isRendering, backHandler])

  useEffect(() => {
    if (currentLesson)
      getConversations({
        lessonId: currentLesson.id,
      })

    setIsRendering(false)
  }, [getConversations, currentLesson])

  const retrieveNextLesson = useCallback(
    (lesson: Unit['sections'][number]['lessons'][number]) => {
      if (!section) return null

      const lessonIndex = section.lessons.findIndex((l) => l.id === lesson.id)

      return section.lessons[lessonIndex + 1] || null
    },
    [section],
  )

  const completeLessonHandler = useCallback(
    (lesson: Unit['sections'][number]['lessons'][number]) => {
      if (!section) return

      const lessonIndex = section.lessons.findIndex((l) => l.id === lesson.id)

      section.lessons[lessonIndex] = {
        ...section.lessons[lessonIndex],
        completed: true,
      }

      setSectionHandler({
        ...section,
      })
    },
    [section, setSectionHandler],
  )
  const defineCurrentLesson = useCallback(
    (lesson: Unit['sections'][number]['lessons'][number]) => {
      if (!section) return

      const lessonIndex = section.lessons.findIndex((l) => l.id === lesson.id)

      section.lessons = section.lessons.map((l) => ({
        ...l,
        current: false,
      }))
      section.lessons[lessonIndex] = {
        ...section.lessons[lessonIndex],
        current: true,
      }

      setCurrentLesson(section.lessons[lessonIndex])
      setSectionHandler({
        ...section,
      })
    },
    [section, setSectionHandler],
  )

  const progressComponent = useMemo(() => {
    return (
      <div className="flex flex-row md:flex-col items-center mx-4 gap-2 md:h-full md:w-auto w-full">
        {section?.lessons.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => {
              setCurrentLesson(lesson)
              defineCurrentLesson(lesson)
            }}
            aria-disabled={!lesson.completed}
            data-current={lesson.current}
            className="md:w-4
            md:h-auto
            h-4
            shrink-0
            flex-1
            rounded-full
            bg-violet-400
            border-2
            border-transparent
            aria-[disabled=false]:data-[current=true]:border-violet-600
            data-[current=true]:border-violet-400
            data-[current=true]:pointer-events-none
            aria-disabled:bg-zinc-900/20
            aria-disabled:dark:bg-zinc-50/20
            "
          />
        ))}
      </div>
    )
  }, [section, defineCurrentLesson])

  if (isRendering || !section || !currentLesson) return <Loading />

  const nextLesson = retrieveNextLesson(currentLesson)

  return (
    <div className="min-h-screen h-screen bg-[url('/assets/svgs/radiant-gradient.svg')]  bg-no-repeat bg-cover flex md:flex-row flex-col items-center justify-between">
      <aside className="flex flex-row md:flex-col gap-4 items-center justify-center p-4 md:h-full md:w-auto w-full">
        <Button
          variant="secondary"
          size="icon"
          className="shrink-0"
          onClick={backHandler}
          disabled={isRendering}
        >
          <XIcon className="h-6 w-6 text-white" />
        </Button>
        {progressComponent}
      </aside>
      <main className="flex flex-col flex-1 h-full md:w-auto w-full relative">
        <section className="w-full flex justify-between p-4">
          <Button
            variant="ghost"
            className="text-white border-white"
            onClick={() => {
              if (nextLesson) defineCurrentLesson(nextLesson)
            }}
          >
            Skip
          </Button>
          <Button
            variant="default"
            className="bg-white text-black"
            onClick={() => {
              if (!currentLesson.completed) {
                completeLessonHandler(currentLesson)
              }

              if (nextLesson) defineCurrentLesson(nextLesson)
            }}
          >
            {currentLesson.completed ? 'Next' : 'Check'}
          </Button>
        </section>
        <section
          ref={conversationsContainerRef}
          className="flex-1 flex flex-col justify-between h-full w-full p-4 overflow-auto"
        >
          <div
            className="flex-1 pb-48"
            style={{
              paddingBottom: (textareaRef.current?.getHeight() ?? 0) + 60,
            }}
          >
            <div className="mb-6">
              {section.title.root.data.text}
              <h2 className="text-2xl font-bold">
                {currentLesson.title.root.data.text}
              </h2>
            </div>
            <div className="flex flex-col gap-2">
              {/* {isFetching && (
                <Loader2Icon className="animate-spin w-6 mx-auto" />
              )}
              {conversations.map((conversation) => (
                <Conversation
                  key={conversation.id}
                  conversation={conversation}
                  lessonId={currentLesson.id}
                />
              ))} */}
            </div>
            {/* <AI initialAIState={{ messages: [], chatId: currentLesson.id }}>
              <Chat initialMessages={[]} />
            </AI> */}
          </div>

          <div className="flex flex-col gap-4 items-center justify-center absolute bottom-4 left-4 right-4">
            <Textarea
              ref={textareaRef}
              isLoading={isCreating}
              onTyping={() => setIsReRendering(!isReRendering)}
              onSend={async (text) => {
                if (user) {
                  const [err] = await upsertConversation({
                    type: 'create',
                    data: {
                      authorId: user.id,
                      recipientId: user.id,
                      lessonId: currentLesson.id,
                      role: 'user',
                      text,
                    },
                  })

                  if (err)
                    toast(err.message, {
                      className: '!text-red-400',
                    })
                }
              }}
            />

            <div className="w-full mt-md">
              <div className="grid grid-cols-1 gap-2 md:auto-rows-fr md:grid-cols-2">
                <div style={{ opacity: 1, willChange: 'auto' }}>
                  <div className="group col-span-1 flex h-full w-full cursor-pointer items-center gap-x-2 rounded-lg border p-xs border-zinc-800 ring-borderMain/50 divide-borderMain/50 dark:divide-borderMainDark/50  dark:ring-borderMainDark/50 dark:border-borderMainDark/50 transition duration-300 bg-background dark:bg-backgroundDark md:hover:bg-offset md:dark:hover:bg-offsetDark">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md p-xs transition-all duration-200 group-hover:bg-transparent dark:bg-offset border-borderMain/50 ring-borderMain/50 divide-borderMain/50 dark:divide-borderMainDark/50  dark:ring-borderMainDark/50 dark:border-borderMainDark/50 bg-offset dark:bg-offsetDark">
                      <div className="default font-sans text-base">🍝</div>
                    </div>
                    <div className="line-clamp-2 default font-sans text-sm font-medium">
                      Top cookbooks in 2024
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
