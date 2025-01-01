'use client'
import { useSteps } from '@/hooks/use-steps'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { Locale, langs } from '@/lib/intl/locales'
import { useTranslations } from 'next-intl'

export const Title = () => {
  const t = useTranslations()
  const { steps } = useSteps()
  return (
    <h1
      className={`${pixelatedFont.className} text-5xl font-bold text-center text-green-200 text-shadow-md shadow-green-400`}
    >
      {t("What's your language level?", {
        lang: langs(t, steps[1] as Locale),
      })}
    </h1>
  )
}
