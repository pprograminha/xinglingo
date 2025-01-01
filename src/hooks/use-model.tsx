import { getModel } from '@/actions/models/get-model'
import { Model } from '@/actions/models/get-models'
import { getSection } from '@/actions/units/get-section'
import { useParams } from 'next/navigation'
import React, { use, useEffect, useState } from 'react'
import { z } from 'zod'

type Section = NonNullable<Awaited<ReturnType<typeof getSection>>>
type Lesson = Section['lessons'][number]
type ModelContextProps = {
  model: Model | null
  section: Section | null
  lesson: Lesson | null
  isFetchingModel: boolean
  isFetchingSection: boolean
}

const ModelContext = React.createContext<ModelContextProps>(
  {} as ModelContextProps,
)

type ModelProviderProps = {
  children: React.ReactNode
}

const paramsSchema = z.object({
  'model-id': z.string(),
  'section-id': z.string(),
  'lesson-id': z.string(),
  locale: z.string(),
})

type Params = z.infer<typeof paramsSchema>

export const ModelProvider = ({ children }: ModelProviderProps) => {
  const [model, setModel] = useState<Model | null>(null)
  const [isFetchingModel, setIsFetchingModel] = useState<boolean>(false)

  const [section, setSection] = useState<Section | null>(null)
  const [isFetchingSection, setIsFetchingSection] = useState<boolean>(false)

  const [lesson, setLesson] = useState<Lesson | null>(null)

  const params =
    paramsSchema.safeParse(useParams()).data || ({} as Partial<Params>)

  const modelId = params['model-id']
  const sectionId = params['section-id']
  const lessonId = params['lesson-id']

  useEffect(() => {
    if (modelId) {
      setIsFetchingModel(true)

      getModel(modelId)
        .then(setModel)
        .finally(() => {
          setIsFetchingModel(false)
        })
    }
    if (sectionId) {
      setIsFetchingSection(true)

      getSection({
        sectionId,
      })
        .then((section) => {
          setSection(section)

          if (section)
            setLesson(section.lessons.find((l) => l.id === lessonId) || null)
        })
        .finally(() => {
          setIsFetchingSection(false)
        })
    }
  }, [modelId, sectionId, lessonId])

  return (
    <ModelContext.Provider
      value={{ model, section, lesson, isFetchingModel, isFetchingSection }}
    >
      {children}
    </ModelContext.Provider>
  )
}

export const useModel = () => {
  return use(ModelContext)
}
