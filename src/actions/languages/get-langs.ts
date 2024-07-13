import { getAuth } from '@/lib/auth/get-auth'
import { langs, Locale, localeImages } from '@/lib/intl/locales'
import { snowflakeId } from '@/lib/snowflake'
import { getTranslations } from 'next-intl/server'
import { getWordsList } from '../conversations/get-words-list'

export const getLanguages = async () => {
  const { user } = await getAuth()
  const t = await getTranslations()

  if (!user || !user.profile) return []

  const currentLang = user.profile.localeToLearn

  const wordsResult = await getWordsList({
    locale: false,
  })

  const languages = Object.entries(langs(t)).map(([locale, name]) => {
    const greenWords = wordsResult.green.words.filter(
      (w) => w.locale === locale,
    ).length

    return {
      id: snowflakeId(),
      name,
      count: {
        words: greenWords,
        wordsToLearn: wordsResult.count.wordsToLearn,
        wordsRemaining: wordsResult.count.wordsToLearn - greenWords,
      },
      progress: (greenWords / wordsResult.count.wordsToLearn) * 100,
      current: currentLang === locale,
      locale: locale as Locale,
      imageUrl: localeImages[locale as Locale],
    }
  })

  return languages
}
