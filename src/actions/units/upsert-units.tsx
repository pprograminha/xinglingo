'use server'
import { db } from '@/lib/db/drizzle/query'
import { lessons, sections, units } from '@/lib/db/drizzle/schema'
import { SnowflakeId } from '@/lib/snowflake'
import { unitFormSchema } from '@/schemas/unit-form'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export const upsertLessons = async (
  lessonsData: z.infer<
    ReturnType<typeof unitFormSchema>
  >['units'][number]['sections'][number]['lessons'],
  sectionId: string,
) => {
  const promises = lessonsData.map(async (lesson, li) => {
    if (lesson._action === 'create') {
      const lessonId = SnowflakeId({ workerId: li }).generate()
      await db.insert(lessons).values({
        id: lessonId,
        sectionId,
        prompt: lesson.prompt,
        title: lesson.title,
      })

      return
    }

    if (lesson._action === 'update' && lesson.lessonId) {
      await db
        .update(lessons)
        .set({
          title: lesson.title,
          prompt: lesson.prompt,
          sectionId,
          updatedAt: new Date(),
        })
        .where(eq(lessons.id, lesson.lessonId))

      return
    }

    if (lesson._action === 'purge' && lesson.lessonId) {
      await db.delete(lessons).where(eq(lessons.id, lesson.lessonId))
    }
  })

  await Promise.all(promises)
}

export const upsertSections = async (
  sectionsData: z.infer<
    ReturnType<typeof unitFormSchema>
  >['units'][number]['sections'],
  unitId: string,
) => {
  const promises = sectionsData.map(async (section, si) => {
    if (
      section._action === 'no action' &&
      section.lessons.length > 0 &&
      section.sectionId
    ) {
      await upsertLessons(section.lessons, section.sectionId)

      return
    }

    if (section._action === 'create') {
      const sectionId = SnowflakeId({ workerId: si }).generate()

      await db.insert(sections).values({
        id: sectionId,
        unitId,
        variant: section.variant,
        prompt: section.prompt,
        slug: section.slug,
        title: section.title,
      })

      if (section.lessons.length > 0) {
        await upsertLessons(section.lessons, sectionId)
      }
      return
    }

    if (section._action === 'update' && section.sectionId) {
      await db
        .update(sections)
        .set({
          prompt: section.prompt,
          unitId,
          variant: section.variant,
          slug: section.slug,
          title: section.title,
          updatedAt: new Date(),
        })
        .where(eq(sections.id, section.sectionId))

      if (section.lessons.length > 0) {
        await upsertLessons(section.lessons, section.sectionId)
      }
      return
    }

    if (section._action === 'purge' && section.sectionId) {
      await db.delete(sections).where(eq(sections.id, section.sectionId))
    }
  })

  await Promise.all(promises)
}

export const upsertUnits = async (
  unitsData: z.infer<ReturnType<typeof unitFormSchema>>['units'],
) => {
  const promises = unitsData.map(async (unit, ui) => {
    if (
      unit._action === 'no action' &&
      unit.sections.length > 0 &&
      unit.unitId
    ) {
      await upsertSections(unit.sections, unit.unitId)

      return
    }

    if (unit._action === 'create') {
      const unitId = SnowflakeId({ workerId: ui }).generate()

      await db.insert(units).values({
        id: unitId,
        modelId: unit.modelId,
        prompt: unit.prompt,
        slug: unit.slug,
        title: unit.title,
      })

      if (unit.sections.length > 0) {
        await upsertSections(unit.sections, unitId)
      }

      return
    }

    if (unit._action === 'update' && unit.unitId) {
      await db
        .update(units)
        .set({
          modelId: unit.modelId,
          prompt: unit.prompt,
          slug: unit.slug,
          title: unit.title,
          updatedAt: new Date(),
        })
        .where(eq(units.id, unit.unitId))

      if (unit.sections.length > 0) {
        await upsertSections(unit.sections, unit.unitId)
      }

      return
    }

    if (unit._action === 'purge' && unit.unitId) {
      await db.delete(units).where(eq(units.id, unit.unitId))
    }
  })

  await Promise.all(promises)
}
