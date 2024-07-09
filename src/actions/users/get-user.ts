'use server'
import { db } from '@/lib/db/drizzle/query'
import { User } from '@/lib/db/drizzle/types'
import { signOut } from 'next-auth/react'
import { cache } from 'react'

export const getUser = cache(async function getUser(
  userId: User['id'],
): Promise<User> {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
    with: {
      availability: true,
      profile: true,
      subscriptions: true,
    },
  })

  if (!user) signOut()

  return user as User
})
