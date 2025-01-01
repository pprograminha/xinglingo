'use server'

import { db } from '@/lib/db/drizzle/query'
import { histories } from '@/lib/db/drizzle/schema'
import { User, Model as TableModel } from '@/lib/db/drizzle/types'
import { desc } from 'drizzle-orm'

export type Model = TableModel & {
  imageUrl: string
}
export const getModels = async (user: User | null) => {
  let models = (await db.query.models.findMany({
    limit: 3,
  })) as Model[]

  let modelHistories = (
    user
      ? (
          await db.query.histories.findMany({
            where: (histories, { eq }) => eq(histories.userId, user.id),
            limit: 3,
            orderBy: [desc(histories.id)],
            with: {
              model: true,
            },
          })
        ).map(({ model }) => model)
      : models.slice(0, 2)
  ) as Model[]

  modelHistories = modelHistories.reduce(
    (histories, history) => {
      const existingHistory = histories.some((h) => h.id === history.id)

      if (existingHistory) return histories

      return [...histories, history]
    },
    [] as typeof modelHistories,
  )

  const recommended = modelHistories.length === 0

  modelHistories = modelHistories.map((m) => ({
    ...m,
    imageUrl: `/assets/imgs/${m.image}`,
  }))
  models = models.map((m) => ({
    ...m,
    imageUrl: `/assets/imgs/${m.image}`,
  }))

  return {
    recommended,
    models,
    histories: recommended ? models : modelHistories,
  }
}
