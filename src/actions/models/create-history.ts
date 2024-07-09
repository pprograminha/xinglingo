'use server'
import { db } from '@/lib/db/drizzle/query'
import { histories } from '@/lib/db/drizzle/schema'
import { History } from '@/lib/db/drizzle/types'
import { snowflakeId } from '@/lib/snowflake'
import { eq } from 'drizzle-orm'

export const createHistory = async (
  historyData: Omit<History, 'id' | 'createdAt' | 'updatedAt'>,
) => {
  const existingHistoryModel = await db.query.histories.findFirst({
    where: (histories, { eq, and }) =>
      and(
        eq(histories.modelId, historyData.modelId),
        eq(histories.userId, historyData.userId),
      ),
  })

  if (existingHistoryModel) {
    await db
      .update(histories)
      .set({
        ...historyData,
        id: snowflakeId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(histories.id, existingHistoryModel.id))

    return
  }

  await db.insert(histories).values([
    {
      ...historyData,
      id: snowflakeId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ])
}
