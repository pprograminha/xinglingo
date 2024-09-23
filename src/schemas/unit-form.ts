import { z } from 'zod'
import { textsSchema } from './text'

const ACTION_SCHEMAS = {
  DEFAULT: z
    .enum(['no action', 'update', 'create', 'purge', 'remove'])
    .optional()
    .default('no action'),
  ONLY_CREATION: z.enum(['create']),
}

type UnitFormSchemaData = {
  actionType?: keyof typeof ACTION_SCHEMAS
}

export const lessonsSchema = (data: UnitFormSchemaData = {}) => {
  const { actionType = 'DEFAULT' } = data
  const _actionSchema = ACTION_SCHEMAS[actionType]
  return z
    .array(
      z.object({
        _id: z.string().min(1),
        _action: _actionSchema,
        lessonId: z.string().min(1).optional(),
        title: textsSchema(),
        description: textsSchema({
          variant: 'NULLABLE',
        }),
        prompt: textsSchema({
          variant: 'NULLABLE',
        }),
      }),
    )
    .optional()
    .default([])
}

export const sectionsSchema = (data: UnitFormSchemaData = {}) => {
  const { actionType = 'DEFAULT' } = data
  const _actionSchema = ACTION_SCHEMAS[actionType]

  return z
    .array(
      z.object({
        _id: z.string().min(1),
        _action: _actionSchema,
        sectionId: z.string().min(1).optional(),
        title: textsSchema(),
        slug: textsSchema({
          variant: 'NULLABLE',
        }),
        prompt: textsSchema(),
        description: textsSchema({
          variant: 'NULLABLE',
        }),
        variant: z.enum(['book', 'default']),
        lessons: lessonsSchema(data),
      }),
    )
    .optional()
    .default([])
}

export const unitFormSchema = function (data: UnitFormSchemaData = {}) {
  const { actionType = 'DEFAULT' } = data
  const _actionSchema = ACTION_SCHEMAS[actionType]

  const unitSchema = z.array(
    z.object({
      _action: _actionSchema,
      unitId: z.string().min(1).optional(),
      title: textsSchema(),
      slug: textsSchema(),
      prompt: textsSchema(),
      description: textsSchema({
        variant: 'NULLABLE',
      }),
      modelId: z.string().min(1),
      sections: sectionsSchema(data),
    }),
  )
  return z.object({
    units: unitSchema.optional().default([]),
  })
}
