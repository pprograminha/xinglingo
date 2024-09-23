import { Unpacked } from '@/@types/unpacked'
import {
  TextsIdPerCategory,
  TextsPerCategory,
  TextsPerCategoryValueObj,
} from '@/actions/texts/get-texts'

type UnpackedTextData<K, T> = {
  key: K
  texts: TextsPerCategory<T>
}

export const unpackedText = function <
  T extends TextsIdPerCategory = TextsIdPerCategory,
  K extends keyof T = keyof T,
>({ key: k, texts }: UnpackedTextData<K, T>, ...i: number[]) {
  let result:
    | TextsPerCategory<T>[string]
    | TextsPerCategoryValueObj<Unpacked<T[K]>> = texts[k]

  i.forEach((i) => {
    if (Array.isArray(result)) result = result[i] as typeof result
  })

  return result as unknown as TextsPerCategoryValueObj<Unpacked<T[K]>>
}
