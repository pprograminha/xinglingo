'use client'
import { ExcludeArray } from '@/@types/exclude-array'
import { execAI } from '@/actions/ai'
import { Thumbs } from '@/app/[locale]/board/[model-id]/[section-id]/[lesson-id]/components/thumbs'
import { env } from '@/env'
import { useAuth } from '@/hooks/use-auth'
import { useModel } from '@/hooks/use-model'
import { Actions, AI } from '@/lib/chat/actions'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { langs, Locale } from '@/lib/intl/locales'
import { cn } from '@/lib/utils'
import { useActions, useUIState } from 'ai/rsc'
import {
  ArrowUpRightIcon,
  Loader2Icon,
  MessageCircleIcon,
  PhoneCallIcon,
  SwordsIcon,
} from 'lucide-react'
import { nanoid } from 'nanoid'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { HtmlHTMLAttributes, useCallback, useEffect, useState } from 'react'
import { UserMessage } from '../stocks/message'
import { Typing } from '../typing'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { ChatReport } from './chat-report'
import { ShareLink } from './share-link'

type ExampleMessagesType = Array<
  Partial<
    ExcludeArray<Exclude<Awaited<ReturnType<typeof execAI>>, string | null>> & {
      skeleton: true
    }
  >
>

type ChatControlsProps = HtmlHTMLAttributes<HTMLDivElement>
export const ChatControls = ({ className, ...props }: ChatControlsProps) => {
  const { model, isFetchingModel, section, lesson } = useModel()

  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions() as Actions

  const { user } = useAuth()

  const [exampleMessages, setExampleMessages] = useState<ExampleMessagesType>(
    Array.from({
      length: 4,
    }).map(() => ({
      skeleton: true,
    })),
  )
  const locale = useLocale() as Locale
  const t = useTranslations()

  const lastMessages = messages.length > 5 ? messages.slice(-5) : messages

  const getExampleMessages =
    useCallback(async (): Promise<ExampleMessagesType> => {
      const exampleMessagesValues =
        env.VERCEL_ENV !== 'development'
          ? await execAI({
              format: {
                name: 'generate-example-messages',
                schemaVariant: 'example-messages',
                size: 4,
              },
              messages: [
                {
                  role: 'assistant',
                  content: `
                  Please generate example messages for the chat. 
        
                  ${user?.profile?.localeToLearn ? `O usuário está aprendendo ${langs(t, user.profile.localeToLearn as Locale)}` : ''}
                  Use o titulo e subtitulo da seção como base para gerar as frases de exemplo: 
                  {
                    titulo: ${section?.title.root.data.text}, 
                    subtitulo: ${lesson?.title.root.data.text} 
                  }
        
                  ${
                    lastMessages.length > 0
                      ? `
                    Com base nas respostas do assistente abaixo crie uma nova mensagem para ajudar o usuário a responder. 
                    ${JSON.stringify(lastMessages)}
                  `
                      : ''
                  }
                  
                  Reply in the language ${langs(t, locale)} `,
                },
              ],
            })
          : [
              {
                icon: '🌐',
                heading: 'How do you say',
              },
              {
                icon: '🌞',
                heading:
                  'What is the translation of........ ......... ...... ........ ..... ......... ..... .... ...... .... ....... ...... ....',
              },
              {
                icon: '🎌',
                heading: 'Can you tell me how to pronounce',
              },
              {
                icon: '✈️',
                heading: 'What are some common phrases in',
              },
            ]

      const exampleMessages =
        typeof exampleMessagesValues === 'string' ||
        exampleMessagesValues === null
          ? []
          : exampleMessagesValues

      if (Array.isArray(exampleMessages)) {
        return exampleMessages
      }

      return []
    }, [locale, t, lastMessages, lesson, section, user])

  useEffect(() => {
    getExampleMessages().then(setExampleMessages)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className={cn(
        'hidden md:block rounded-tl-md pl-2 pt-1 w-full max-w-[40%] bg-gradient-to-bl from-zinc-800 to-zinc-800 border-zinc-700/40 border-t border-l',
        className,
      )}
      {...props}
    >
      <div className="rounded-tl-md gap-2 flex pl-3 pr-2 pt-1 bg-gradient-to-bl from-zinc-900/70 to-zinc-900/70 border-zinc-700/40 border-t border-l h-full">
        <div className="space-y-2 justify-start  bg-gradient-to-bl from-zinc-900 to-zinc-900 border-zinc-700/40 border-t border-l border-r overflow-y-auto rounded-t-md p-8 h-full">
          <div className="mb-4 flex flex-wrap gap-4 items-center">
            {!isFetchingModel && model ? (
              <Image
                src={model.imageUrl}
                alt={model.name}
                width={20}
                height={30}
              />
            ) : (
              <Loader2Icon className="w-4 h-4 animate-spin" />
            )}
            <div>
              <h1 className={`text-xl ${pixelatedFont.className}`}>
                <Typing text="Está sem criatividade?" />
              </h1>
              <p className="text-zinc-500 text-xs">
                <Typing
                  text="Use as frases que eu criei para você"
                  startDelay={500}
                />
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-start ">
            <ShareLink />
            <Thumbs />
            <ChatReport />
          </div>
          <Separator />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-1.5">
            {exampleMessages.map((example, i) => (
              <div
                key={i}
                data-skeleton={example.skeleton}
                onClick={async () => {
                  if (!example.heading) return

                  setMessages((currentMessages) => [
                    ...currentMessages,
                    {
                      id: nanoid(),
                      display: <UserMessage>{example.heading}</UserMessage>,
                    },
                  ])

                  const responseMessage = await submitUserMessage(
                    example.heading,
                  )

                  setMessages((currentMessages) => [
                    ...currentMessages,
                    responseMessage,
                  ])
                }}
                style={{
                  animationDelay: `${300 * (i + 1)}ms`,
                }}
                className={`
                  overflow-x-auto
                  w-full
                  h-full
                  min-h-full
                  md:w-auto
                  md:data-[skeleton=true]:min-w-[40%]
                  data-[skeleton=true]:animate-pulse
                  data-[skeleton=true]:from-zinc-800
                  data-[skeleton=true]:to-zinc-800
                  items-start
                  relative
                  group
                  grow
                  pt-1
                  pb-3
                  pl-2
                  pr-8
                  bg-zinc-800/20
                  flex
                  cursor-pointer 
                  gap-x-2 
                  rounded-lg 
                  border 
                  p-xs 
                  border-zinc-800 
                  hover:bg-zinc-900 
                  dark:hover:bg-zinc-800 
                  transition 
                  duration-300`}
              >
                <div className="flex h-8 w-8 items-center self-start justify-center rounded-md p-xs transition-all duration-200 group-hover:bg-transparent">
                  <div className="default font-sans text-md">
                    {example.icon}
                  </div>
                </div>

                {!example.skeleton && (
                  <ArrowUpRightIcon className="w-4 absolute top-2 right-2" />
                )}

                <h1
                  className={`font-sans mt-2 text-md leading-3 font-medium ${pixelatedFont.className}`}
                >
                  {example.heading}
                </h1>
              </div>
            ))}
          </div>
          <Separator />
        </div>
        <div className="space-y-2 flex flex-col pb-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="outline" className="h-full lg:w-16">
                <PhoneCallIcon className="w-4 text-zinc-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Conversar com {model?.name} por chamada</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="outline" className="h-full lg:w-16">
                <SwordsIcon className="w-4 text-zinc-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Ativar desafios</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                data-current={true}
                size="icon"
                variant="outline"
                className="h-full lg:w-16 data-[current=true]:dark:bg-zinc-800"
              >
                <MessageCircleIcon className="w-4 text-zinc-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Conversar com {model?.name}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
