'use client'
import { getServerEnv } from '@/actions/env/get-server-env'
import { env as baseEnv } from '@/env'
import { Bubble as BubblePrimitive } from '@typebot.io/nextjs'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

export const Bubble = () => {
  const t = useTranslations()

  const [env, setEnv] = useState<typeof baseEnv | null>(null)
  const locale = useLocale()

  useEffect(() => {
    getServerEnv().then((response) => setEnv(response))
  }, [])

  if (!env || !locale) return null

  return (
    <BubblePrimitive
      key={locale}
      apiHost={env.TYPEBOT_BOT_URL}
      typebot={`${env.TYPEBOT_BOT_KEY}-${locale.toLowerCase()}`}
      previewMessage={{
        avatarUrl: 'https://xinglingo.com/assets/imgs/tutor-ai-03.png',
        message: t('Do you have any doubts?'),
        autoShowDelay: 1000,
      }}
      theme={{
        button: {
          backgroundColor: '#C75F96',

          size: 'medium',
        },
        chatWindow: {
          backgroundColor: '#222225',
        },
        previewMessage: {
          backgroundColor: '#222225',
          textColor: '#ffffff',
          closeButtonBackgroundColor: '#C75F96',
        },
      }}
    />
  )
}
