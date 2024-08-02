'use server'

import { getAuth } from '@/lib/auth/get-auth'
import { db } from '@/lib/db/drizzle/query'

type GetTextOptions = {
  locale?: string
}

type GetTextResponse<
  T extends string | string[] | null | undefined = undefined,
> = T extends string ? string | null : T extends string[] ? string[] : null

export const getTexts = async function <
  T extends string | string[] | null | undefined = undefined,
>(
  textId: T,
  { locale: overrideLocale }: GetTextOptions,
): Promise<GetTextResponse<T>> {
  if (!textId) return null as GetTextResponse<T>

  const textsId = (Array.isArray(textId) ? textId : [textId]) as string[]

  const locale = overrideLocale || (await getAuth(true)).user?.locale

  const texts = await db.query.texts.findMany({
    where: (texts, { eq, and, or }) =>
      and(
        or(
          ...textsId.flatMap((textId) => [
            eq(texts.id, textId),
            eq(texts.parentTextId, textId),
          ]),
        ),
        locale ? eq(texts.locale, locale) : undefined,
      ),
  })

  const orderedTexts: string[] = []

  texts.forEach((text) => {
    const textIndex = textsId.findIndex((tId) => tId === text.id)

    orderedTexts[textIndex] = text.text
  })

  if (Array.isArray(textId)) {
    return orderedTexts as GetTextResponse<T>
  }

  return (orderedTexts[0] || null) as GetTextResponse<T>
}
