'use server'
import { db } from '@/lib/db/drizzle/query'
import { models } from '@/lib/db/drizzle/schema'
import { Model } from '@/lib/db/drizzle/types'
import { eq } from 'drizzle-orm'

export const updateModel = async (
  modelData: Partial<Omit<Model, 'id' | 'createdAt' | 'updatedAt'>>,
  modelId: Model['id'],
) => {
  const model = await db.query.models.findFirst({
    where: (models, { eq }) => eq(models.id, modelId),
  })

  if (!model) {
    throw new Error('Model does not exist')
  }

  await db
    .update(models)
    .set({ ...modelData, updatedAt: new Date() })
    .where(eq(models.id, modelId))
}
