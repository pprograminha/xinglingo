import { z } from 'zod'

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
        title: z.string().min(1),
        description: z.string().optional().nullable(),
        prompt: z.string().min(1).optional().nullable(),
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
        title: z.string().min(1),
        slug: z.string().min(1).optional().nullable(),
        variant: z.enum(['book', 'default']),
        description: z.string().optional().nullable(),
        prompt: z.string().min(1),
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
      title: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().optional().nullable(),
      modelId: z.string().min(1),
      prompt: z.string().min(1),
      sections: sectionsSchema(data),
    }),
  )
  return z.object({
    units: unitSchema.optional().default([]),
  })
}
