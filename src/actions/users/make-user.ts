'use server'
import { NewUser } from '@/lib/db/drizzle/@types'
import { db } from '@/lib/db/drizzle/query'
import { users } from '@/lib/db/drizzle/schema'
import { eq } from 'drizzle-orm'
import crypto from 'node:crypto'

export async function makeUser({
  email,
  fullName,
  image = null,
}: Omit<NewUser, 'id'>) {
  const [user] = await db.select().from(users).where(eq(users.email, email))

  if (user && (user.fullName !== fullName || user.image !== image)) {
    await db
      .update(users)
      .set({
        fullName,
        image,
      })
      .where(eq(users.email, email))

    if (image) user.image = image

    user.fullName = fullName
  }

  if (user) return user

  const [createdUser] = await db
    .insert(users)
    .values([
      {
        email,
        image,
        fullName,
        id: crypto.randomUUID(),
      },
    ])
    .returning()

  return createdUser
}
