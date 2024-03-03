import dotenv from 'dotenv'

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

dotenv.config({
  path: ['.env.local', '.env'],
  override: true,
})
const sql = postgres(process.env.DRIZZLE_DATABASE_URL!)

export const db = drizzle(sql)
