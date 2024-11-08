'use client'
import { Button } from '@/components/ui/button'
import { Locale } from '@/lib/intl/locales'
import { ArrowLeftRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ModeTranslatorGroup } from './mode-translator-group'

type ModeTranslatorProps = {
  sourceText: string
  translatedText: string
  sourceLocale?: string
  targetLocale?: string
}
export function ModeTranslator({
  sourceText,
  translatedText,
  sourceLocale = 'en',
  targetLocale = 'en',
}: ModeTranslatorProps) {
  const [reverseGroup, setReverseGroup] = useState(false)

  const sourceWords = useMemo(() => {
    return sourceText.split(/\s+/).filter((word) => word.length > 0)
  }, [sourceText])
  const translatedWords = useMemo(() => {
    return translatedText.split(/\s+/).filter((word) => word.length > 0)
  }, [translatedText])

  const groups = useMemo(() => {
    const source = (
      <ModeTranslatorGroup
        key={1}
        words={sourceWords}
        locale={sourceLocale as Locale}
        text={sourceText}
      />
    )
    const target = (
      <ModeTranslatorGroup
        key={2}
        words={translatedWords}
        locale={targetLocale as Locale}
        text={translatedText}
      />
    )

    if (reverseGroup) {
      return [target, source]
    }

    return [source, target]
  }, [
    sourceLocale,
    sourceText,
    targetLocale,
    translatedText,
    sourceWords,
    translatedWords,
    reverseGroup,
  ])

  return (
    <div className="max-w-4xl mx-auto py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{groups}</div>
      <div className="flex justify-center mt-4 space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setReverseGroup(!reverseGroup)
          }}
        >
          <ArrowLeftRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
