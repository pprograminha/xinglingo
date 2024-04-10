import { eq } from 'drizzle-orm'
import crypto from 'node:crypto'
import { db } from './query'
import { users } from './schema'
import { NewUser, User } from './types'

const newUsers: NewUser[] = [
  {
    id: crypto.randomUUID(),
    fullName: process.env.USER_FULLNAME!,
    email: process.env.USER_EMAIL!,
  },
]

async function seed() {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, process.env.USER_EMAIL!))

  let insertedUsers: User[] = []

  if (!user) {
    insertedUsers = await db.insert(users).values(newUsers).returning()
  }

  console.log(`Seeded ${insertedUsers.length} users`)
}

seed()
