'use client'
import { Button } from '@/components/ui/button'

import {
  ALargeSmallIcon,
  CaseLowerIcon,
  CaseSensitiveIcon,
  CaseUpperIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  TriangleAlertIcon,
  WholeWordIcon,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

import React from 'react'

import { getWordsList } from '@/actions/conversations/get-words-list'
import { Typing } from '@/components/typing'
import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { scoreColor } from '@/lib/score-color'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Link } from '@/navigation'
import { Model } from '@/lib/db/drizzle/types'

type CommmandItemComponentProps = {
  word: Awaited<ReturnType<typeof getWordsList>>['words'][number]
  variant?: 'popover' | 'collapsible'
  className?: string
  model?: Model
  style?: React.CSSProperties
}
export function CommmandItemComponent({
  word,
  model,
  variant = 'collapsible',
  className,
  ...props
}: CommmandItemComponentProps) {
  const t = useTranslations()
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <CommandItem
      data-color={scoreColor(word.avgAccuracyScore)}
      data-variant={variant}
      className={cn(
        `group relative
          border
          rounded-xl
          flex-col
          items-start
          border-transparent
          w-full
          data-[color=yellow]:my-2
          data-[color=red]:my-2
          data-[variant=popover]:!my-1
          data-[color=yellow]:border-yellow-200/30 data-[color=red]:border-red-400/30
          `,
        className,
      )}
      {...props}
    >
      {scoreColor(word.avgAccuracyScore) !== 'green' && (
        <Badge
          className="absolute -top-1 -right-1
            bg-zinc-800
            font-thin
            p-1
            group-data-[color=green]:border-green-300 group-data-[color=yellow]:border-yellow-300 group-data-[color=red]:border-red-400
            group-data-[color=green]:text-green-300 group-data-[color=yellow]:text-yellow-300 group-data-[color=red]:text-red-400
            "
          variant="outline"
        >
          <TriangleAlertIcon
            className="w-4 min-w-4
            shrink-0
          "
          />
        </Badge>
      )}

      {variant === 'popover' ? (
        <Popover>
          <div className="flex items-center gap-2 justify-between w-full">
            <div className="flex items-center">
              <WordIcon className="mr-2 h-4 w-4 text-zinc-500" />
              <span className="group-data-[color=green]:text-green-300 group-data-[color=yellow]:text-yellow-300 group-data-[color=red]:text-red-400">
                {word.word}
              </span>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger>
                    <span className="ml-2 inline-block border text-xs px-1 rounded-md border-zinc-500 text-zinc-400 group-data-[color=yellow]:text-yellow-300 group-data-[color=red]:text-red-400">
                      {word.avgAccuracyScore.toFixed(0)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{t('Scoring')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <PopoverTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="group-data-[color=yellow]:mr-6 group-data-[color=red]:mr-6"
              >
                <ChevronDownIcon
                  data-open={isOpen}
                  className="w-4 transition-all data-[open=true]:rotate-180"
                />
              </Button>
            </PopoverTrigger>
          </div>
          <PopoverContent className="space-y-2">
            <h1 className={`${pixelatedFont()}`}>
              {t(
                'To improve your score, you should practice your pronunciation',
              )}
            </h1>
            <p className="text-zinc-500 text-xs">
              {t("You've already pronounced this word {wordCount} time(s)", {
                wordCount: word.wordCount,
              })}
            </p>
            {model && (
              <div className="bg-gradient-to-tr from-violet-400 to-violet-700 p-0.5 rounded-lg inline-block">
                <Button
                  className="dark:text-white gap-2 px-2 py-1 h-auto"
                  variant="secondary"
                  asChild
                >
                  <Link
                    href={`/models/${model.slug}/channels/${'channel.id'}/?word=${word.word}`}
                  >
                    {t('Learn word')}
                    <ChevronRightIcon className="w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      ) : (
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="w-full group-data-[color=yellow]:pr-6 group-data-[color=red]:pr-6"
        >
          <div className="flex items-center gap-2 justify-between w-full">
            <div className="flex items-center">
              <WordIcon className="mr-2 h-4 w-4 text-zinc-500" />
              <span className="group-data-[color=green]:text-green-300 group-data-[color=yellow]:text-yellow-300 group-data-[color=red]:text-red-400">
                {word.word}
              </span>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger>
                    <span className="ml-2 inline-block border text-xs px-1 rounded-md border-zinc-500 text-zinc-400 group-data-[color=yellow]:text-yellow-300 group-data-[color=red]:text-red-400">
                      {word.avgAccuracyScore.toFixed(0)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('Scoring')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CollapsibleTrigger asChild>
              <Button size="icon" variant="secondary" className="ml-auto">
                <ChevronDownIcon
                  data-open={isOpen}
                  className="w-4 transition-all data-[open=true]:rotate-180"
                />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-2 mt-4">
            <h1>
              {t(
                'To improve your score, you should practice your pronunciation',
              )}
            </h1>
            <p className="text-zinc-500">
              {t("You've already pronounced this word {wordCount} time(s)", {
                wordCount: word.wordCount,
              })}
            </p>
            {model && (
              <div className="bg-gradient-to-tr from-violet-400 to-violet-700 p-0.5 rounded-lg inline-block">
                <Button
                  className="dark:text-white gap-2 px-2 py-1 h-auto"
                  variant="secondary"
                  asChild
                >
                  <Link
                    href={`/models/${model.slug}/channels/${'channel.id'}/?word=${word.word}`}
                  >
                    {t('Learn word')}
                    <ChevronRightIcon className="w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      )}
    </CommandItem>
  )
}

type WordIconProps = React.HtmlHTMLAttributes<SVGSVGElement>

function WordIcon(props: WordIconProps) {
  const WordIcon = [
    ALargeSmallIcon,
    WholeWordIcon,
    CaseSensitiveIcon,
    CaseUpperIcon,
    CaseLowerIcon,
  ][Math.floor(Math.random() * 5)]

  return <WordIcon {...props} />
}
type DialogProps = {
  wordsListData: Awaited<ReturnType<typeof getWordsList>>
  model?: Model
}

export function Dialog({ wordsListData, model }: DialogProps) {
  const t = useTranslations()
  const [open, setOpen] = React.useState(false)

  const { words: defaultWords } = wordsListData

  const [words, setWords] = React.useState([...defaultWords])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const wordsWithCaptalize = words.map((word) => ({
    ...word,
    originalWord: word.word,
    word: word.word[0].toUpperCase() + word.word.substring(1, word.word.length),
  }))

  const latestWords = wordsWithCaptalize.filter((_, i) => i <= 4)
  const restWords = wordsWithCaptalize.filter((_, i) => i > 4)

  const sortedRef = React.useRef(false)

  const lowestScoringWord = React.useMemo(() => {
    return wordsWithCaptalize.reduce(
      (oldWord, word) => {
        if (oldWord.score < word.avgAccuracyScore) {
          return {
            word: oldWord.word,
            originalWord: oldWord.originalWord,
            score: oldWord.score,
          }
        }

        return {
          word: word.word,
          originalWord: word.originalWord,
          score: word.avgAccuracyScore,
        }
      },
      {} as { word: string; originalWord: string; score: number },
    )
  }, [wordsWithCaptalize])

  return (
    <>
      <Button
        variant="secondary"
        className="dark:bg-zinc-700 gap-2"
        onClick={() => setOpen(true)}
      >
        {t('See more')}
        <kbd className="text-zinc-400 border-zinc-600 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>J
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <div>
          <div className="flex flex-col  gap-2 pr-10 items-start my-5">
            <Image
              src="/assets/imgs/tutor-ai-02.png"
              width={200}
              height={130}
              alt="Petutor AI"
            />

            <p className={`${pixelatedFont()} px-4 md:px-8`}>
              <Typing
                text={`- ${t('Here are all the words you learned with us, feel free to explore')}`}
              />
            </p>
          </div>
          <div className="px-4 md:px-8">
            <p className="text-xs text-zinc-500">
              -{' '}
              {t(
                'The word with the lowest score is "{lowestScoringWord}" Would you like to improve that score?',
                {
                  lowestScoringWord: lowestScoringWord.originalWord,
                },
              )}
            </p>
            <div className="mt-2 bg-gradient-to-tr from-violet-400 to-violet-700 p-0.5 rounded-lg inline-block">
              <Button
                className="dark:text-white gap-2 px-2 py-1 h-auto"
                variant="secondary"
              >
                {t('Learn word')}
                <ChevronRightIcon className="w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 gap-2">
          <CommandInput placeholder={`${t('Search your word')}...`} />
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <Switch
                  checked={sortedRef.current}
                  onClick={() => {
                    sortedRef.current = !sortedRef.current

                    if (sortedRef.current) {
                      setWords((words) => [
                        ...words.sort(
                          (a, b) => a.avgAccuracyScore - b.avgAccuracyScore,
                        ),
                      ])
                    } else {
                      setWords([...defaultWords])
                    }
                  }}
                />
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{t('Sort by worst scores')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CommandList className="px-4">
          <CommandEmpty>{t('No results found')}.</CommandEmpty>
          <CommandGroup
            heading={sortedRef.current ? t('Worst scores') : t('Lastest words')}
          >
            {latestWords.map((word) => (
              <CommmandItemComponent
                word={word}
                key={word.word}
                model={model}
              />
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading={t('Words')}>
            {restWords.map((word) => (
              <CommmandItemComponent
                word={word}
                key={word.word}
                model={model}
              />
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
