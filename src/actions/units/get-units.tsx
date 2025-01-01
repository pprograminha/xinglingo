'use server'

import { getAuth } from '@/lib/auth/get-auth'
import { db } from '@/lib/db/drizzle/query'
import {
  lessons,
  units as schemaUnits,
  sections,
} from '@/lib/db/drizzle/schema'
import { unpackedText as unpackedTextPrimitive } from '@/lib/texts/unpacked'
import { asc } from 'drizzle-orm'
import { getTexts } from '../texts/get-texts'

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

  const textsData = {
    unitTitles: units.map((u) => u.title),
    unitDescriptions: units.map((u) => u.description),
    unitPrompts: units.map((u) => u.prompt),
    unitSlugs: units.map((u) => u.slug),
    sectionTitles: units.map((u) => u.sections.map((s) => s.title)),
    sectionPrompts: units.map((u) => u.sections.map((s) => s.prompt)),
    sectionDescriptions: units.map((u) => u.sections.map((s) => s.description)),
    sectionSlugs: units.map((u) => u.sections.map((s) => s.slug)),
    lessonTitles: units.map((u) =>
      u.sections.map((s) => s.lessons.map((l) => l.title)),
    ),
    lessonDescriptions: units.map((u) =>
      u.sections.map((s) => s.lessons.map((l) => l.description)),
    ),
    lessonPrompts: units.map((u) =>
      u.sections.map((s) => s.lessons.map((l) => l.prompt)),
    ),
  }

  const texts = await getTexts(textsData, { locale })

  const unpackedText = function <K extends keyof typeof textsData>(
    k: K,
    ...i: number[]
  ) {
    return unpackedTextPrimitive<typeof textsData, K>(
      {
        key: k,
        texts,
      },
      ...i,
    )
  }

  type LessonsOptions = {
    sectionIndex: number
    unitIndex: number
  }

  const parseLessons = (
    lessons: Lessons,
    { sectionIndex, unitIndex }: LessonsOptions,
  ) =>
    lessons.map(({ userLessons, ...l }, li) => ({
      ...l,
      title: unpackedText('lessonTitles', unitIndex, sectionIndex, li),
      prompt: unpackedText('lessonPrompts', unitIndex, sectionIndex, li),
      description: unpackedText(
        'lessonDescriptions',
        unitIndex,
        sectionIndex,
        li,
      ),
      numbering: li + 1,
      completed: retrieveBoolean(userLessons?.[0]?.completed, false),
      current: retrieveBoolean(userLessons?.[0]?.current, li === 0),
    }))
  const response = units.map(({ sections, userUnits, ...u }, ui) => {
    return {
      ...u,
      numbering: ui + 1,
      title: unpackedText('unitTitles', ui),
      description: unpackedText('unitDescriptions', ui),
      prompt: unpackedText('unitPrompts', ui),
      slug: unpackedText('unitSlugs', ui),

      completed: retrieveBoolean(userUnits?.[0]?.completed, false),
      current: retrieveBoolean(userUnits?.[0]?.current, ui === 0),
      sections: sections.map(({ lessons, userSections, ...s }, si) => {
        const lessonOptions: LessonsOptions = {
          sectionIndex: si,
          unitIndex: ui,
        }

        return {
          ...s,
          title: unpackedText('sectionTitles', ui, si),
          description: unpackedText('sectionDescriptions', ui, si),
          slug: unpackedText('sectionSlugs', ui, si),
          prompt: unpackedText('sectionPrompts', ui, si),

          numbering: si + 1,
          completed: retrieveBoolean(userSections?.[0]?.completed, false),
          current: retrieveBoolean(userSections?.[0]?.current, si === 0),
          lessonsCompletedCount: parseLessons(lessons, lessonOptions).filter(
            (l) => l.completed,
          ).length,
          lessonsCount: parseLessons(lessons, lessonOptions).length,
          lessons: parseLessons(lessons, lessonOptions),
        }
      }),
    }
  })

  return response
}
