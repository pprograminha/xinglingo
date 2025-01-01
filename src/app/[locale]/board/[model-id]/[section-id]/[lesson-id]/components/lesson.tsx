'use client'
import { ChatControls } from '@/components/chat/chat-controls'
import { ChatList } from '@/components/chat/chat-list'
import { ChatPanel } from '@/components/chat/chat-panel'
import { Loading } from '@/components/loading'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useBreakpoint } from '@/hooks/use-breakpoint'
import { useModel } from '@/hooks/use-model'
import { useScrollAnchor } from '@/hooks/use-scroll-anchor'
import type { AI } from '@/lib/chat/actions'
import { delay } from '@/lib/delay'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { lingos } from '@/lib/storage/local'
import { usePathname, useRouter } from '@/navigation'
import { useUIState } from 'ai/rsc'
import { XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Unit } from '../../../(sidebar)/page'
import { Thumbs } from './thumbs'

type LessonProps = {
  params: {
    'model-id': string
    'section-id': string
    'lesson-id': string
  }
}

export function Lesson({ params }: LessonProps) {
  const router = useRouter()
  const pathname = usePathname()
  const headerRef = useRef<HTMLDivElement | null>(null)
  const progressRef = useRef<HTMLDivElement | null>(null)
  const [isRendering, setIsRendering] = useState(true)
  const [messages] = useUIState<typeof AI>()
  const isMd = useBreakpoint('md')
  const t = useTranslations()

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

  const [currentLesson, setCurrentLesson] = useState<
    Unit['sections'][number]['lessons'][number] | null
  >(null)

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

      const paths = pathname.split('/')

      const currentLessonId = paths.pop()

      if (currentLessonId)
        router.replace(
          pathname.replace(currentLessonId, section.lessons[lessonIndex].id),
        )

      setCurrentLesson(section.lessons[lessonIndex])

      setSectionHandler({
        ...section,
      })
    },
    [section, router, pathname, setSectionHandler],
  )

  useEffect(() => {
    const currLesson = section?.lessons.find(
      (l) => l.id === params['lesson-id'],
    )

    if (
      !currLesson ||
      (isRendering === false && !section) ||
      (section && sectionId !== section.id)
    ) {
      backHandler()

      return
    }

    if (currLesson && currentLesson === null) {
      defineCurrentLesson(currLesson)
    }
  }, [
    params,
    section,
    currentLesson,
    sectionId,
    isRendering,
    backHandler,
    defineCurrentLesson,
  ])

  useEffect(() => {
    setIsRendering(false)
  }, [])

  useEffect(() => {
    delay(500).then(scrollToBottom)
  }, [scrollToBottom, messages.length])

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

  const progressComponent = useMemo(() => {
    return (
      <div className="flex flex-row md:flex-col items-center mx-4 gap-2 md:h-full md:w-auto w-full">
        {section?.lessons.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => {
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

  const { model } = useModel()
  const { user } = useAuth()

  if (isRendering || !section || !currentLesson || !model || !user)
    return <Loading />

  const nextLesson = retrieveNextLesson(currentLesson)

  return (
    <main className="min-h-screen overflow-hidden h-screen bg-[url('/assets/svgs/radiant-gradient.svg')]  bg-no-repeat bg-cover flex md:flex-row flex-col items-center justify-between">
      <aside
        className="flex flex-row md:flex-col gap-4 items-center justify-center p-4 md:h-full md:w-auto w-full"
        ref={progressRef}
      >
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
      <div className="flex flex-col flex-1 h-full md:w-auto w-full relative">
        <header className="w-full flex p-4 justify-between" ref={headerRef}>
          <Button
            variant="ghost"
            className="text-white border-white"
            onClick={() => {
              if (nextLesson) defineCurrentLesson(nextLesson)
            }}
          >
            {t('Skip')}
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
            {currentLesson.completed ? t('Next') : t('Check')}
          </Button>
        </header>
        <section
          className="flex h-full flex-1"
          style={{
            height: !headerRef.current
              ? undefined
              : `calc(100vh - ${isMd ? headerRef.current.clientHeight : headerRef.current.clientHeight + (progressRef.current?.clientHeight || 0)}px)`,
          }}
        >
          <div className="w-full h-full flex items-stretch justify-stretch flex-col pr-2">
            <header className="mb-6 p-4 pr-8 flex flex-wrap-reverse gap-8 items-start justify-between">
              <div>
                <h1>{section.title.root.data.text}</h1>
                <h2 className="text-2xl font-bold">
                  {currentLesson.title.root.data.text}
                </h2>
              </div>
              <div className=" flex gap-4 items-center">
                {model.imageUrl && (
                  <Image
                    className="self-start"
                    src={model.imageUrl}
                    alt={model.name}
                    height={60}
                    width={50}
                  />
                )}
                <div className="flex  gap-4">
                  <div className="space-y-1">
                    <h1
                      className={`${pixelatedFont.className} text-xl leading-none`}
                    >
                      {model.name}
                    </h1>
                    <p className={`text-zinc-600 text-xs`}>
                      {model.description}
                    </p>
                  </div>
                  <Thumbs className="mt-2" />
                </div>
              </div>
            </header>
            {messages.length > 0 && (
              <div className="group w-full overflow-auto" ref={scrollRef}>
                <div
                  className="pt-4 md:pt-10  pb-24 pl-6 pr-4" // h-[20000px] border border-red-200
                  ref={messagesRef}
                >
                  <ChatList messages={messages} />
                </div>
              </div>
            )}
            <ChatPanel
              input={input}
              setInput={setInput}
              isAtBottom={false}
              scrollToBottom={scrollToBottom}
            />
          </div>
          <ChatControls className="h-full" />
        </section>
      </div>
    </main>
  )
}
