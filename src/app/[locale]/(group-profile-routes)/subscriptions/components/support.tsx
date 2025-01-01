'use client'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { open, setInputValue } from '@typebot.io/js'
import { useTranslations } from 'next-intl'

export const Support = () => {
  const t = useTranslations()

  return (
    <div className="mt-6">
      <h1 className={`${pixelatedFont.className} text-2xl text-zinc-400`}>
        {t('Hey! Noticed any issues with your subscription?')}
      </h1>
      <p className="text-xs">
        {t.rich('Talk to support by clicking here', {
          span: (text) => (
            <span
              className="hover:underline cursor-pointer text-green-400"
              onClick={() => {
                open()
                setInputValue('5')
              }}
            >
              {text}
            </span>
          ),
        })}
      </p>
    </div>
  )
}
