import { locales } from '@/lib/intl/locales'
import { z } from 'zod'
type TextsSchemaVariant = 'NULLABLE' | 'DEFAULT'

type TextsSchemaData<T extends TextsSchemaVariant> = {
  variant?: T
}
export const textsSchema = function <T extends TextsSchemaVariant = 'DEFAULT'>(
  data?: TextsSchemaData<T>,
) {
  const { variant = 'DEFAULT' } = data || { variant: 'DEFAULT' }

  const textSchema = () =>
    ({
      DEFAULT: z.string().min(1),
      NULLABLE: z.string().min(1).nullable(),
    })[variant]

  const metadataItemSchema = z.object({
    locale: z.enum(locales),
    data: z.object({
      id: textSchema(),
      parentTextId: textSchema().nullable().optional(),
      text: textSchema(),
    }),
  })

  return z.object({
    root: metadataItemSchema,
    metadata: z.array(metadataItemSchema),
  })
}
