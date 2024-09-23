import { db } from '@/lib/db/drizzle/query'
import { texts } from '@/lib/db/drizzle/schema'
import { eq, or } from 'drizzle-orm'
import crypto from 'node:crypto'
import { z } from 'zod'

type UpsertTextDataItem = {
  locale: string
  text: string | null
  root: boolean
  textId?: string | null
  parentTextId?: string | null
}

type UpsertTextData = UpsertTextDataItem | UpsertTextDataItem[]

export const upsertText = async (data: UpsertTextData) => {
  const datas = Array.isArray(data) ? data : [data]

  let rootTextId: string | undefined

  const upsert = async (
    { locale, text, root, textId, parentTextId }: UpsertTextDataItem,
    parentTextIdToInsert?: string,
  ) => {
    let textRecord =
      z.string().uuid().safeParse(textId).success && textId
        ? await db.query.texts.findFirst({
            where: (texts, { eq }) => eq(texts.id, textId),
          })
        : undefined

    if (text === null) {
      if (textRecord) {
        await db
          .delete(texts)
          .where(
            or(
              eq(texts.id, textRecord.id),
              eq(texts.parentTextId, textRecord.id),
            ),
          )
      }

      return null
    }

    if (
      textRecord &&
      (textRecord.locale !== locale ||
        textRecord.text !== text ||
        textRecord.parentTextId !== parentTextId)
    ) {
      textRecord.locale = locale
      textRecord.parentTextId =
        parentTextId !== undefined ? parentTextId : textRecord.parentTextId

      textRecord.text = text

      await db
        .update(texts)
        .set({
          locale,
          parentTextId,
          text,
        })
        .where(eq(texts.id, textRecord.id))
    } else {
      ;[textRecord] = await db
        .insert(texts)
        .values([
          {
            id: crypto.randomUUID(),
            locale,
            parentTextId: parentTextIdToInsert,
            text,
          },
        ])
        .returning()
    }

    if (root) rootTextId = textRecord.id

    return textRecord
  }

  const rootData = datas.find((d) => d.root)

  let parentTextIdToInsert: string | undefined
  if (rootData) {
    const textRecord = await upsert(rootData)

    parentTextIdToInsert = textRecord?.id
  }

  await Promise.all(
    datas
      .filter((d) => !d.root)
      .map((data) => upsert(data, parentTextIdToInsert)),
  )

  return rootTextId
}
