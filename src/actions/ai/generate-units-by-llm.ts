'use server'
import { openai } from '@/lib/ai/openai'
import { snowflakeId } from '@/lib/snowflake'
import {
  lessonsSchema as lessonsSchemaFn,
  sectionsSchema as sectionsSchemaFn,
  unitFormSchema as unitFormSchemaFn,
} from '@/schemas/unit-form'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import crypto from 'node:crypto'

const unitFormSchema = unitFormSchemaFn({
  actionType: 'ONLY_CREATION',
})

const sectionsSchema = sectionsSchemaFn({
  actionType: 'ONLY_CREATION',
})
const lessonsSchema = lessonsSchemaFn({
  actionType: 'ONLY_CREATION',
})

type GroupType = 'section' | 'unit' | 'lesson'

type GenerateUnitsByLLMData<T extends GroupType = 'unit'> = {
  prompt?: string
  type?: T
}
type GenerateUnitsByLLMResponse<T extends GroupType = 'unit'> =
  | (T extends 'unit'
      ? {
          type: 'unit'
          units: z.infer<typeof unitFormSchema>['units']
        }
      : T extends 'section'
        ? {
            type: 'section'
            sections: z.infer<typeof sectionsSchema>
          }
        : {
            type: 'lesson'
            lessons: z.infer<typeof lessonsSchema>
          })
  | null

export async function generateUnitsByLLM<T extends GroupType = 'unit'>(
  data: GenerateUnitsByLLMData<T> = {},
): Promise<GenerateUnitsByLLMResponse<T>> {
  const { prompt: $prompt, type = 'unit' } = data

  const schemas: Record<
    GroupType,
    typeof sectionsSchema | typeof lessonsSchema | typeof unitFormSchema
  > = {
    lesson: lessonsSchema,
    section: sectionsSchema,
    unit: unitFormSchema,
  }

  const schema = schemas[type]

  const prompt = `
    ${crypto.randomUUID()}

    Generate a valid JSON in the format of the schema below:
    schema: ${JSON.stringify(zodToJsonSchema(schema))}

    ${$prompt}

    Return only the JSON, without any additional text.
  `

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: prompt,
      },
    ],
  })

  let jsonData = response.choices[0].message.content

  let result = null as GenerateUnitsByLLMResponse<T> | null

  try {
    if (jsonData) {
      if (jsonData.includes('```json')) {
        jsonData = jsonData.replaceAll('```json', '').replaceAll('```', '')
      }

      if (type === 'unit') {
        const data = unitFormSchema.parse(JSON.parse(jsonData))

        result = {
          type: 'unit',
          units: data.units.map((u) => ({
            ...u,
            modelId: 'undefined',
            unitId: undefined,
            sections: u.sections.map((s, si) => ({
              ...s,
              _id: snowflakeId() + si,
              sectionId: undefined,
              lessons: s.lessons.map((l, li) => ({
                ...l,
                _id: snowflakeId() + li,
                lessonId: undefined,
              })),
            })),
          })),
        } as GenerateUnitsByLLMResponse<T>
      } else if (type === 'section') {
        const sections = sectionsSchema.parse(JSON.parse(jsonData))

        result = {
          type: 'section',
          sections: sections.map((s, si) => ({
            ...s,
            _id: snowflakeId() + si,
            sectionId: undefined,
            lessons: s.lessons.map((l, li) => ({
              ...l,
              _id: snowflakeId() + li,
              lessonId: undefined,
            })),
          })),
        } as GenerateUnitsByLLMResponse<T>
      } else if (type === 'lesson') {
        const lessons = lessonsSchema.parse(JSON.parse(jsonData))

        result = {
          type: 'lesson',
          lessons: lessons.map((l, li) => ({
            ...l,
            _id: snowflakeId() + li,
            lessonId: undefined,
          })),
        } as GenerateUnitsByLLMResponse<T>
      }
    }
  } catch (error) {
    console.log(error)
  }

  return result
}
