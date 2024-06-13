import { getTranslations } from 'next-intl/server'

export const locales = ['en', 'es', 'pt', 'it-IT', 'fr'] as const

export type Locale = (typeof locales)[number]

export const imagesSrc: Record<Locale, string> = {
  'it-IT': '/assets/svgs/flags/italian.svg',
  pt: '/assets/svgs/flags/brazil.svg',
  en: '/assets/svgs/flags/usa.svg',
  es: '/assets/svgs/flags/spain.svg',
  fr: '/assets/svgs/flags/france.svg',
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
