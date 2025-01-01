'use client'
import { Button } from '@/components/ui/button'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { langs, Locale, localeImages } from '@/lib/intl/locales'
import { Copy } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { SpeechGeneratorClient } from './speech-generator-client'

type ModeTranslatorGroupProps = {
  text: string
  words: string[]
  locale: Locale
}
export function ModeTranslatorGroup({
  text,
  words,
  locale,
}: ModeTranslatorGroupProps) {
  const t = useTranslations()
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  return (
    <div className="space-y-2">
      <div className="flex items-center flex-wrap gap-2">
        <Image
          src={localeImages[locale]}
          alt={langs(t, locale)}
          width={30}
          height={30}
        />
        <p>{langs(t, locale)}</p>
      </div>
      <div className="w-full max-h-40 overflow-y-auto flex flex-wrap items-start gap-1 p-2 dark:outline-none border dark:bg-zinc-800/60 border-zinc-700/60 rounded-md resize-none">
        {words.map((word) => (
          <div
            key={word}
            className={`px-1.5 cursor-pointer bg-zinc-700/80 hover:bg-zinc-700 rounded-md text-lg tracking-wider ${pixelatedFont.className}`}
          >
            {word}
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <SpeechGeneratorClient text={text} voice="shimmer" />
        <Tooltip open={isCopied}>
          <TooltipTrigger asChild>
            <Button
              data-copied={isCopied}
              variant="ghost"
              size="icon"
              className="data-[copied=true]:opacity-50"
              onClick={() => {
                copyToClipboard(text)
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('Copied successfully')}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
