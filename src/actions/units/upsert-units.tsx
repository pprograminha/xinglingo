'use server'
import { db } from '@/lib/db/drizzle/query'
import { lessons, sections, units } from '@/lib/db/drizzle/schema'
import { SnowflakeId } from '@/lib/snowflake'
import { unitFormSchema } from '@/schemas/unit-form'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { upsertText } from '../texts/upsert-text'

export const upsertLessons = async (
  lessonsData: z.infer<
    ReturnType<typeof unitFormSchema>
  >['units'][number]['sections'][number]['lessons'],
  sectionId: string,
) => {
  const promises = lessonsData.map(async (lesson, li) => {
    const title = await upsertText(
      lesson.title.metadata.map((md) => ({
        locale: md.locale,
        root: lesson.title.root.data.id === md.data.id,
        parentTextId: md.data.parentTextId,
        text: md.data.text,
        textId: md.data.id,
      })),
    )

    const prompt = await upsertText(
      lesson.prompt.metadata.map((md) => ({
        locale: md.locale,
        root: lesson.prompt.root.data.id === md.data.id,
        parentTextId: md.data.parentTextId,
        text: md.data.text,
        textId: md.data.id,
      })),
    )

    if (lesson._action === 'create') {
      const lessonId = SnowflakeId({ workerId: li }).generate()

      if (title)
        await db.insert(lessons).values({
          id: lessonId,
          sectionId,
          title,
          prompt,
        })

      return
    }

    if (title && lesson._action === 'update' && lesson.lessonId) {
      await db
        .update(lessons)
        .set({
          title,
          prompt,
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

    const title = await upsertText(
      section.title.metadata.map((md) => ({
        locale: md.locale,
        root: section.title.root.data.id === md.data.id,
        parentTextId: md.data.parentTextId,
        text: md.data.text,
        textId: md.data.id,
      })),
    )

    const slug = await upsertText(
      section.slug.metadata.map((md) => ({
        locale: md.locale,
        root: section.slug.root.data.id === md.data.id,
        parentTextId: md.data.parentTextId,
        text: md.data.text,
        textId: md.data.id,
      })),
    )
    const prompt = await upsertText(
      section.prompt.metadata.map((md) => ({
        locale: md.locale,
        root: section.prompt.root.data.id === md.data.id,
        parentTextId: md.data.parentTextId,
        text: md.data.text,
        textId: md.data.id,
      })),
    )

    if (section._action === 'create' && title && prompt) {
      const sectionId = SnowflakeId({ workerId: si }).generate()

      await db.insert(sections).values({
        id: sectionId,
        unitId,
        variant: section.variant,
        prompt,
        slug,
        title,
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
          unitId,
          variant: section.variant,
          prompt,
          slug,
          title,
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

    const title = await upsertText(
      unit.title.metadata.map((md) => ({
        locale: md.locale,
        root: unit.title.root.data.id === md.data.id,
        parentTextId: md.data.parentTextId,
        text: md.data.text,
        textId: md.data.id,
      })),
    )

    const slug = await upsertText(
      unit.slug.metadata.map((md) => ({
        locale: md.locale,
        root: unit.slug.root.data.id === md.data.id,
        parentTextId: md.data.parentTextId,
        text: md.data.text,
        textId: md.data.id,
      })),
    )
    const prompt = await upsertText(
      unit.prompt.metadata.map((md) => ({
        locale: md.locale,
        root: unit.prompt.root.data.id === md.data.id,
        parentTextId: md.data.parentTextId,
        text: md.data.text,
        textId: md.data.id,
      })),
    )

    if (unit._action === 'create' && prompt && title && slug) {
      const unitId = SnowflakeId({ workerId: ui }).generate()

      await db.insert(units).values({
        id: unitId,
        modelId: unit.modelId,
        prompt,
        slug,
        title,
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
          prompt,
          slug,
          title,
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
