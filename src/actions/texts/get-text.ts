'use server'

import { unpackedText } from '@/lib/texts/unpacked'
import { nanoid } from '@/lib/utils'
import { getTexts } from './get-texts'
import { getLocale } from 'next-intl/server'

type GetTextParams<T> = {
  textId: T
}

export const getText = async <T extends string | null>({
  textId,
}: GetTextParams<T>) => {
  const locale = await getLocale()
  const sectionId = nanoid()
  const textsData = {
    [sectionId]: [textId],
  }
  const texts = await getTexts(textsData, { locale })

  const text = unpackedText<typeof textsData, keyof typeof textsData>(
    {
      key: sectionId,
      texts,
    },
    0,
  )

  return text
}
