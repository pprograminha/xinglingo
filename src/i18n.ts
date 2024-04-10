import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'
import { Locale, locales } from './lib/intl/locales'

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound()

  return {
    messages: (await import(`../locales/${locale}.json`)).default,
  }
})
