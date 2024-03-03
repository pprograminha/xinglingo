import { migrate } from 'drizzle-orm/neon-http/migrator'

import dotenv from 'dotenv'

import { neon } from '@neondatabase/serverless'

import { drizzle } from 'drizzle-orm/neon-http'

dotenv.config({
  path: ['.env.local', '.env'],
  override: true,
})

try {
  console.log('Connnecting Drizzle...')

  const sql = neon<boolean, boolean>(process.env.DRIZZLE_DATABASE_URL!)

  const mdb = drizzle(sql)

  migrate(mdb, { migrationsFolder: 'drizzle' })
} catch {
  console.log('❌ Unable to perform migrations!')
}
