import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'
import { Locale, locales } from '../lib/intl/locales'

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale

  if (!locales.includes(locale as Locale)) notFound()

  return {
    locale,
    messages: (await import(`../../locales/${locale}.json`)).default,
  }
})
