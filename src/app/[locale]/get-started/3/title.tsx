import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { useTranslations } from 'next-intl'

export const Title = () => {
  const t = useTranslations()
  return (
    <h1
      className={`${pixelatedFont.className} text-5xl font-bold text-center text-green-200 text-shadow-md shadow-green-400`}
    >
      {t('When can you take lessons?')}
    </h1>
  )
}
