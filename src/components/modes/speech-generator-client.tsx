'use client'
import { useSessionStorage } from '@/hooks/use-session-storage'
import { useTranslations } from 'next-intl'
import { HtmlHTMLAttributes, useState } from 'react'
import { SpeechGenerator } from './speech-generator'

type SpeechGeneratorClientProps = HtmlHTMLAttributes<HTMLButtonElement> & {
  text: string
  voice: string
}

export const SpeechGeneratorClient = ({
  text,
  voice,
  ...props
}: SpeechGeneratorClientProps) => {
  const t = useTranslations()
  const [speechKeys, setSpeechKeys] = useSessionStorage<
    {
      text: string
      voice: string
      speechKey: string
    }[]
  >('speechs')
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)

  const speechKey = speechKeys?.find(
    (sk) => sk.text === text && sk.voice === voice,
  )?.speechKey

  return (
    <SpeechGenerator
      t={t}
      text={text}
      data-on={isAudioPlaying}
      speechKey={speechKey}
      voice={voice}
      onSoundStart={() => setIsAudioPlaying(true)}
      onSoundEnd={(key) => {
        if (!speechKey)
          setSpeechKeys([
            ...(speechKeys ?? []),
            {
              speechKey: key,
              voice,
              text,
            },
          ])

        setIsAudioPlaying(false)
      }}
      {...props}
    />
  )
}
