'use client'
import { Bubble as BubblePrimitive } from '@typebot.io/nextjs'
import { useTranslations } from 'next-intl'

export const Bubble = () => {
  const t = useTranslations()
  return (
    <BubblePrimitive
      apiHost="https://bot.chatswt.io"
      typebot="lingos-bot"
      previewMessage={{
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
