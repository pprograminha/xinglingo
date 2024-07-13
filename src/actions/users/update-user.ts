'use server'
import { db } from '@/lib/db/drizzle/query'
import { users, usersProfile } from '@/lib/db/drizzle/schema'
import { User } from '@/lib/db/drizzle/types'
import { eq } from 'drizzle-orm'

type UpdateUserData = Omit<Partial<User>, 'id' | 'profile'> &
  Partial<{
    profile: Omit<Partial<User['profile']>, 'id' | 'createdAt' | 'updatedAt'>
  }> & { userId: string }

export async function updateUser({
  email,
  locale,
  userId,
  role,
  fullName,
  image,
  profile,
}: UpdateUserData) {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
    with: {
      profile: true,
    },
  })

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

    if (user.profile && profile) {
      await db
        .update(usersProfile)
        .set({
          ...profile,
          updatedAt: new Date(),
        })
        .where(eq(usersProfile.id, user.profile.id))
    }
  }
}
