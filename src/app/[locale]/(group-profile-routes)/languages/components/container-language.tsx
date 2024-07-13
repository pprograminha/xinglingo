'use client'
import { getLanguages } from '@/actions/languages/get-langs'
import { Language } from './language'
import { useState } from 'react'

type ContainerLanguageProps = {
  languages: Awaited<ReturnType<typeof getLanguages>>
}

export const ContainerLanguage = ({
  languages: defaultLanguages,
}: ContainerLanguageProps) => {
  const [languages, setLanguages] = useState(defaultLanguages)

  return (
    <div className="flex flex-col gap-2">
      {languages.map((lang) => (
        <Language
          key={lang.locale}
          lang={lang}
          langs={languages}
          onLanguages={setLanguages}
        />
      ))}
    </div>
  )
}
