'use server'
import { db } from '@/lib/db/drizzle/query'
import { cache } from 'react'

export const getProducts = cache(async () => {
  const products = await db.query.products.findMany({
    where: (products, { eq }) => eq(products.active, true),
    with: {
      prices: {
        where: (prices, { eq }) => eq(prices.active, true),
      },
    },
  })

  return products
})
