'use server'

import { NextedArray } from '@/@types/nexted-array'
import { Unpacked } from '@/@types/unpacked'
import { getAuth } from '@/lib/auth/get-auth'
import { db } from '@/lib/db/drizzle/query'
import { Locale } from '@/lib/intl/locales'

type GetTextOptions = {
  locale?: string
}

export type TextsPerCategoryValue = string | null

export type TextsIdPerCategory = {
  [category: string]: NextedArray<TextsPerCategoryValue>
}

type TextsPerCategoryValueObjField<T> = T extends TextsPerCategoryValue
  ? T
  : Unpacked<T[keyof T]>

type TextsPerCategoryValueObjMetadata<T> = {
  data: {
    id: TextsPerCategoryValueObjField<T>
    parentTextId: TextsPerCategoryValueObjField<T>
    text: TextsPerCategoryValueObjField<T>
  }
  locale: Locale
}[]

export type TextsPerCategoryValueObj<T> = {
  root: TextsPerCategoryValueObjMetadata<T>[number]
  metadata: TextsPerCategoryValueObjMetadata<T>
}
export type TextsPerCategory<T> = {
  [K in keyof T]: NextedArray<TextsPerCategoryValueObj<T>>
}

export const getTexts = async function <
  T extends TextsIdPerCategory = TextsIdPerCategory,
>(
  textsIdPerCategory: T,
  { locale: overrideLocale }: GetTextOptions,
): Promise<TextsPerCategory<T>> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /* @ts-ignore */
  const getTextsId = (textsId: NextedArray<T>) => {
    if (textsId.some((t) => Array.isArray(t))) {
      return getTextsId(textsId.flat() as NextedArray<T>)
    }

    return textsId.filter(Boolean) as unknown as string[]
  }

  const textsId = getTextsId(
    Object.values(textsIdPerCategory) as NextedArray<T>,
  )

  const { user } = await getAuth(true)

  const locale = overrideLocale || user?.locale

  const texts = await db.query.texts.findMany({
    where: (texts, { eq, and, or }) =>
      and(
        or(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          /* @ts-ignore */
          ...textsId.flatMap((textId) =>
            user?.role === 'admin'
              ? [eq(texts.id, textId), eq(texts.parentTextId, textId)]
              : [eq(texts.id, textId)],
          ),
        ),
        // locale ? eq(texts.locale, locale) : undefined,
      ),
  })

  const textsPerCategory = { ...textsIdPerCategory } as TextsPerCategory<T>

  const defineValue = (
    data: TextsPerCategoryValueObj<T>,
    category: Extract<keyof T, string>,
    ...i: number[]
  ) => {
    const textsPerCategoryChaining: {
      data:
        | NextedArray<TextsPerCategoryValueObj<T>>
        | TextsPerCategory<T>[string]
        | TextsPerCategoryValue
        | TextsPerCategoryValueObj<T>
      index: number
    }[] = [
      {
        data: textsPerCategory[category],
        index: -1,
      },
    ]
    for (const index of i) {
      const nonDefinedtextsPerCategoryIndex =
        textsPerCategoryChaining.findIndex((t) => t.index === -1)

      if (nonDefinedtextsPerCategoryIndex !== -1) {
        textsPerCategoryChaining[nonDefinedtextsPerCategoryIndex] = {
          ...textsPerCategoryChaining[nonDefinedtextsPerCategoryIndex],
          index,
        }
      }

      const textsPerCategoryData =
        textsPerCategoryChaining[textsPerCategoryChaining.length - 1].data

      if (Array.isArray(textsPerCategoryData)) {
        if (Array.isArray(textsPerCategoryData[index])) {
          textsPerCategoryChaining.push({
            data: textsPerCategoryData[index],
            index: -1,
          })
        } else {
          textsPerCategoryChaining.push({
            data,
            index: -1,
          })
        }
      }
    }

    const tr = [...textsPerCategoryChaining].reverse() as {
      data:
        | NextedArray<TextsPerCategoryValueObj<T>>
        | TextsPerCategoryValueObj<T>
      index: number
    }[]

    type CategoryTextResponse = {
      data?:
        | NextedArray<TextsPerCategoryValueObj<T>>
        | TextsPerCategoryValueObj<T>
    }

    const { data: textsData } = tr.reduce(
      (previousValue, textsPerCategory) => {
        if (
          textsPerCategory.index === -1 &&
          !Array.isArray(textsPerCategory.data)
        ) {
          return {
            data: textsPerCategory.data,
          } as CategoryTextResponse
        }

        if (previousValue.data && Array.isArray(textsPerCategory.data)) {
          textsPerCategory.data[textsPerCategory.index] = previousValue.data

          return {
            data: [...textsPerCategory.data],
          } as CategoryTextResponse
        }

        return previousValue as CategoryTextResponse
      },
      {
        data: undefined,
      } as CategoryTextResponse,
    )
    if (textsData)
      textsPerCategory[category] = textsData as TextsPerCategory<T>[string]
  }

  for (const category in textsIdPerCategory) {
    const categoryTextsId = new Array(...textsIdPerCategory[category])

    const recursive = (
      textsId: typeof categoryTextsId | NextedArray<string | null>,
      ...i: number[]
    ) => {
      textsId.forEach((textId, ti) => {
        if (Array.isArray(textId)) {
          return recursive(textId, ...i, ti)
        }

        const text = texts.find((t) => t.id === textId)
        const textsChildren = textId
          ? texts.filter((t) => t.parentTextId === textId)
          : []

        const root: TextsPerCategoryValueObjMetadata<T>[number] = {
          data: {
            id: (text?.id || null) as TextsPerCategoryValueObjField<T>,
            parentTextId: (text?.parentTextId ||
              null) as TextsPerCategoryValueObjField<T>,
            text: (text?.text || null) as TextsPerCategoryValueObjField<T>,
          },

          locale: locale as Locale,
        }

        defineValue(
          {
            root,
            metadata: [
              root,
              ...textsChildren.map((text) => ({
                data: {
                  id: text.id,
                  text: text.text,
                  parentTextId: text.parentTextId,
                },
                locale: text.locale,
              })),
            ] as TextsPerCategoryValueObjMetadata<T>,
          },
          category,
          ...i,
          ti,
        )
      })
    }

    recursive(categoryTextsId)
  }

  return textsPerCategory
}
