'use server'

import { getAuth } from '@/lib/auth/get-auth'
import { db } from '@/lib/db/drizzle/query'
import { getText } from '../texts/get-text'
import { getTexts } from '../texts/get-texts'
import { getLocale } from 'next-intl/server'
import { unpackedText as unpackedTextPrimitive } from '@/lib/texts/unpacked'

type GetSectionParams = {
  sectionId: string
}

export const getSection = async ({ sectionId }: GetSectionParams) => {
  const { user } = await getAuth()
  const locale = await getLocale()
  if (!sectionId || !user) return null

  const section = await db.query.sections.findFirst({
    where: (sections, { eq }) => eq(sections.id, sectionId),
    with: {
      lessons: true,
    },
  })

  if (!section) return null

  const [title, description, prompt] = await Promise.all([
    getText({ textId: section.title }),
    getText({ textId: section.description }),
    getText({ textId: section.prompt }),
  ])

  const lessonTextsData = {
    lessonTitle: section.lessons.map((l) => l.title),
    lessonDescription: section.lessons.map((l) => l.description),
    lessonPrompt: section.lessons.map((l) => l.prompt),
  }
  const lessonTexts = await getTexts(lessonTextsData, {
    locale,
  })

  const unpackedText = function <K extends keyof typeof lessonTextsData>(
    k: K,
    ...i: number[]
  ) {
    return unpackedTextPrimitive<typeof lessonTextsData, K>(
      {
        key: k,
        texts: lessonTexts,
      },
      ...i,
    )
  }

  const parseLessons = () =>
    section.lessons.map(({ ...l }, li) => ({
      ...l,
      title: unpackedText('lessonTitle', li),
      prompt: unpackedText('lessonPrompt', li),
      description: unpackedText('lessonDescription', li),
      numbering: li + 1,
    }))

  return {
    ...section,
    lessons: parseLessons(),
    title,
    description,
    prompt,
  }
}
