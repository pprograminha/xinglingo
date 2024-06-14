import { getTranslations } from 'next-intl/server'

export const locales = ['en', 'es', 'pt', 'it-IT', 'fr'] as const

export type Locale = (typeof locales)[number]

export const imagesSrc: Record<Locale, string> = {
  'it-IT': '/assets/imgs/flags/italian.png',
  pt: '/assets/imgs/flags/brazil.png',
  en: '/assets/imgs/flags/usa.png',
  es: '/assets/imgs/flags/spain.png',
  fr: '/assets/imgs/flags/france.png',
}

type LangsResponse<T extends Locale | undefined> = T extends undefined
  ? Record<Locale, string>
  : string

export const langs = <T extends Locale | undefined = undefined>(
  t: Awaited<ReturnType<typeof getTranslations>>,
  locale?: T,
): LangsResponse<T> => {
  const langs = {
    en: t('English'),
    es: t('Spanish'),
    pt: t('Portuguese'),
    'it-IT': t('Italian'),
    fr: t('French'),
  }

  if (locale) {
    return langs[locale] as LangsResponse<T>
  }

  return langs as LangsResponse<T>
}
