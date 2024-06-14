'use server'
import { db } from '@/lib/db/drizzle/query'
import { users, usersAvailability, usersProfile } from '@/lib/db/drizzle/schema'
import { User } from '@/lib/db/drizzle/types'
import { eq } from 'drizzle-orm'
import { signOut } from 'next-auth/react'
import { cache } from 'react'

export const getUser = cache(async function getUser(
  userId: User['id'],
): Promise<User> {
  const [userData] = await db
    .select()
    .from(users)
    .leftJoin(usersProfile, eq(usersProfile.userId, users.id))
    .leftJoin(usersAvailability, eq(usersAvailability.userId, users.id))
    .where(eq(users.id, userId))

  const {
    usersProfile: profile,
    usersAvailability: availability,
    users: user,
  } = userData

  if (!user) signOut()
  ;(user as User).profile = profile
  ;(user as User).availability = availability

  return user
})
