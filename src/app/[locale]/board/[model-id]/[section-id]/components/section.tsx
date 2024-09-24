'use client'
import { ChatList } from '@/components/chat/chat-list'
import { ChatPanel } from '@/components/chat/chat-panel'
import { Loading } from '@/components/loading'
import { Button } from '@/components/ui/button'
import { useScrollAnchor } from '@/hooks/use-scroll-anchor'
import type { AI } from '@/lib/chat/actions'
import { lingos } from '@/lib/storage/local'
import { useRouter } from '@/navigation'
import { useUIState } from 'ai/rsc'
import { XIcon } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Unit } from '../../(sidebar)/page'

type SectionProps = {
  params: {
    'model-id': string
    'section-id': string
  }
}

export function Section({ params }: SectionProps) {
  const router = useRouter()

  const [isRendering, setIsRendering] = useState(true)
  const [messages] = useUIState<typeof AI>()

  const sectionData = lingos.storage.get('unit:section')

  const [input, setInput] = useState('')

  const { messagesRef, scrollRef, scrollToBottom } = useScrollAnchor()

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
    if (
      !currentLesson ||
      (isRendering === false && !section) ||
      (section && sectionId !== section.id)
    ) {
      backHandler()
    }
  }, [section, currentLesson, sectionId, isRendering, backHandler])

  useEffect(() => {
    // if (currentLesson)
    //   getConversations({
    //     lessonId: currentLesson.id,
    //   })
    scrollToBottom()
    setIsRendering(false)
  }, [scrollToBottom])

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
        <section className="w-full flex justify-between">
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
        <section className="flex flex-col justify-between h-full w-full p-4 overflow-auto">
          <div className="mb-6">
            {section.title.root.data.text}
            <h2 className="text-2xl font-bold">
              {currentLesson.title.root.data.text}
            </h2>
          </div>

          <div className="group w-full overflow-auto px-0 mx-0" ref={scrollRef}>
            <div className={'pb-[300px] pt-4 md:pt-10'} ref={messagesRef}>
              <ChatList messages={messages} isShared={false} />
            </div>
            <ChatPanel
              id={'id'}
              input={input}
              setInput={setInput}
              scrollToBottom={scrollToBottom}
            />
          </div>
        </section>
      </main>
    </div>
  )
}
