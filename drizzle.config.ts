import 'dotenv/config'
import type { Config } from 'drizzle-kit'

export default {
  schema: './src/lib/db/drizzle/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DRIZZLE_DATABASE_URL!,
  },
} satisfies Config
