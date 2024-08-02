'use server'

import { getAuth } from '@/lib/auth/get-auth'
import { db } from '@/lib/db/drizzle/query'

type GetUnitParams = Partial<{
  sectionId: string
}>
export const getUnit = async ({ sectionId }: GetUnitParams = {}) => {
  const { user } = await getAuth()

  if (!sectionId || !user) return null

  const section = await db.query.sections.findFirst({
    where: (sections, { eq }) => eq(sections.id, sectionId),
  })

  if (!section) return null

  const unit = await db.query.userUnits.findFirst({
    where: (units, { eq, and }) =>
      and(eq(units.unitId, section.unitId), eq(units.userId, user.id)),
    with: {
      unit: true,
      sections: {
        with: {
          section: true,
          lessons: {
            with: {
              lesson: true,
            },
          },
        },
      },
    },
  })

  if (!unit) return null

  const response = {
    ...unit.unit,
    sections: unit.sections.map((s) => ({
      ...s.section,
      lessons: s.lessons.map((l) => ({
        ...l.lesson,
        completed: l.completed,
        current: l.current,
      })),
      completed: s.completed,
      current: s.current,
    })),
    completed: unit.completed,
    current: unit.current,
  }

  return response
}
