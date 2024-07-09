'use server'
import { db } from '@/lib/db/drizzle/query'
import { models } from '@/lib/db/drizzle/schema'
import { Model } from '@/lib/db/drizzle/types'
import { snowflakeId } from '@/lib/snowflake'

export const createModel = async (
  modelData: Omit<Model, 'id' | 'createdAt' | 'updatedAt'>,
) => {
  await db.insert(models).values([
    {
      ...modelData,
      id: snowflakeId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ])
}
