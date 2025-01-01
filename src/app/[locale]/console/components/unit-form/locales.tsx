import { SetLang } from '@/components/set-lang'
import { langs, Locale, localeImages } from '@/lib/intl/locales'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useState } from 'react'

type UnitLocales = {
  localeComponent: React.FC<{
    locale: string
  }>
}
export const UnitLocales = ({
  localeComponent: LocaleComponent,
}: UnitLocales) => {
  const t = useTranslations()
  const [locales, setLocales] = useState(
    Object.entries(langs(t)).map(([locale, title]) => ({
      locale,
      show: locale === 'pt',
      title,
    })),
  )

  return (
    <div className="flex gap-2 items-start justify-between">
      <div className="flex-1">
        {locales
          .filter((l) => l.show)
          .map(({ locale, title }) => (
            <div key={locale}>
              <div className="flex gap-2 items-center my-2">
                <Image
                  src={localeImages[locale as Locale]}
                  alt={locale}
                  className="shrink-0"
                  width={20}
                  height={20}
                />
                {title}
              </div>
              <LocaleComponent locale={locale} />
            </div>
          ))}
      </div>

      <SetLang
        action="n"
        onChangeLang={(locale) => {
          setLocales((ls) =>
            ls.map((l) => ({
              ...l,
              show: l.locale === locale,
            })),
          )
        }}
      />
    </div>
  )
}
