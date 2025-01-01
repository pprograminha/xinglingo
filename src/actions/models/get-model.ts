'use server'

import { db } from '@/lib/db/drizzle/query'
import { models } from '@/lib/db/drizzle/schema'
import { eq } from 'drizzle-orm'
import { Model } from './get-models'

export const getModel = async (modelId: string): Promise<Model | null> => {
  const model = (await db.query.models.findFirst({
    where: eq(models.id, modelId),
  })) as Model | undefined

  if (model) model.imageUrl = `/assets/imgs/${model.image}`

  return model || null
}
