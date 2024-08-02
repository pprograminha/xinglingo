'use server'

import { getAuth } from '@/lib/auth/get-auth'
import { db } from '@/lib/db/drizzle/query'
import {
  lessons,
  units as schemaUnits,
  sections,
} from '@/lib/db/drizzle/schema'
import { asc } from 'drizzle-orm'
import { getTexts } from '../texts/get-text'

type GetUnitParams = {
  modelId: string
  locale: string
}

export const getUnits = async ({ modelId, locale }: GetUnitParams) => {
  const { user } = await getAuth(true)

  const units = await db.query.units.findMany({
    where: (units, { eq, and }) => and(eq(units.modelId, modelId)),
    orderBy: [asc(schemaUnits.createdAt)],
    with: {
      ...(user
        ? {
            userUnits: {
              where: (fields, { eq }) => eq(fields.userId, user.id),
              limit: 1,
            },
          }
        : {}),

      sections: {
        orderBy: [asc(sections.createdAt)],
        with: {
          ...(user
            ? {
                userSections: {
                  where: (fields, { eq }) => eq(fields.userId, user.id),
                  limit: 1,
                },
              }
            : {}),
          lessons: user
            ? {
                orderBy: [asc(lessons.createdAt)],
                with: {
                  userLessons: {
                    where: (fields, { eq }) => eq(fields.userId, user.id),
                    limit: 1,
                  },
                },
              }
            : true,
        },
      },
    },
  })

  type Lessons = (typeof units)[number]['sections'][number]['lessons']

  const retrieveBoolean = function <T, Default>(
    value: T,
    defaultValue: Default,
  ) {
    if (typeof value === 'boolean') {
      if (!value && defaultValue) {
        return defaultValue
      }

      return value as boolean
    }

    return defaultValue
  }

  const parseLessons = (lessons: Lessons) =>
    lessons.map(({ userLessons, ...l }, li) => ({
      ...l,
      numbering: li + 1,
      completed: retrieveBoolean(userLessons?.[0]?.completed, false),
      current: retrieveBoolean(userLessons?.[0]?.current, li === 0),
    }))

  const titles = await getTexts(
    units.map((u) => u.title),
    { locale },
  )

  const descriptions = await getTexts(
    units.filter((u) => u.description).map((u) => u.description!),
    { locale },
  )

  const prompts = await getTexts(
    units.map((u) => u.prompt),
    { locale },
  )
  const slugs = await getTexts(
    units.map((u) => u.slug),
    { locale },
  )

  const response = await Promise.all(
    units.map(async ({ sections, userUnits, ...u }, ui) => {
      return {
        ...u,
        numbering: ui + 1,
        title: titles[ui],
        description: descriptions[ui],
        prompt: prompts[ui],
        slug: slugs[ui],

        completed: retrieveBoolean(userUnits?.[0]?.completed, false),
        current: retrieveBoolean(userUnits?.[0]?.current, ui === 0),
        sections: sections.map(({ lessons, userSections, ...s }, si) => ({
          ...s,
          // title: await getTexts(s.title, { locale }),
          // description: await getTexts(s.description, { locale }),
          // slug: await getTexts(s.slug, { locale }),
          // prompt: await getTexts(s.prompt, { locale }),
          numbering: si + 1,
          completed: retrieveBoolean(userSections?.[0]?.completed, false),
          current: retrieveBoolean(userSections?.[0]?.current, si === 0),
          lessonsCompletedCount: parseLessons(lessons).filter(
            (l) => l.completed,
          ).length,
          lessonsCount: parseLessons(lessons).length,
          lessons: parseLessons(lessons),
        })),
      }
    }),
  )

  return response
}
