'use server'
import { db } from '@/lib/db/drizzle/query'
import { users } from '@/lib/db/drizzle/schema'
import { User } from '@/lib/db/drizzle/types'
import { eq } from 'drizzle-orm'

export async function updateUser({
  email,
  locale,
  userId,
  role,
  fullName,
  image,
}: Omit<Partial<User>, 'id'> & { userId: string }) {
  const [user] = await db.select().from(users).where(eq(users.id, userId))

  if (user) {
    await db
      .update(users)
      .set({
        email,
        fullName,
        role,
        image,
        updatedAt: new Date(),
        locale,
      })
      .where(eq(users.id, userId))

    if (locale) user.locale = locale
  }
}
