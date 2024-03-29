'use server'
import { NewUser } from '@/lib/db/drizzle/@types'
import { db } from '@/lib/db/drizzle/query'
import { users } from '@/lib/db/drizzle/schema'
import { eq } from 'drizzle-orm'
import crypto from 'node:crypto'

export async function makeUser({ email, fullName }: Omit<NewUser, 'id'>) {
  const [user] = await db.select().from(users).where(eq(users.email, email))

  if (user && user.fullName !== fullName) {
    await db
      .update(users)
      .set({
        fullName,
      })
      .where(eq(users.email, email))

    user.fullName = fullName
  }

  if (user) return user

  const [createdUser] = await db
    .insert(users)
    .values([
      {
        email,
        fullName,
        id: crypto.randomUUID(),
      },
    ])
    .returning()

  return createdUser
}
