'use server'

import { getAuth } from '@/lib/auth/get-auth'
import { db } from '@/lib/db/drizzle/query'
import { getText } from '../texts/get-text'

type GetSectionParams = {
  sectionId: string
}

export const getSection = async ({ sectionId }: GetSectionParams) => {
  const { user } = await getAuth()
  if (!sectionId || !user) return null

  const section = await db.query.sections.findFirst({
    where: (sections, { eq }) => eq(sections.id, sectionId),
  })

  if (!section) return null

  const [title, description, prompt] = await Promise.all([
    getText({ textId: section.title }),
    getText({ textId: section.description }),
    getText({ textId: section.prompt }),
  ])

  return {
    ...section,
    title,
    description,
    prompt,
  }
}
