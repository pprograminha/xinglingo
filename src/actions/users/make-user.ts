'use server'
import { Steps, defaultTimes } from '@/hooks/use-steps'
import { db } from '@/lib/db/drizzle/query'
import { users, usersAvailability, usersProfile } from '@/lib/db/drizzle/schema'
import { NewUser, User } from '@/lib/db/drizzle/types'
import { Locale, locales } from '@/lib/intl/locales'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'
import crypto from 'node:crypto'

export async function makeUser({
  email,
  googleId,
  fullName,
  steps,
  image = null,
}: Omit<NewUser, 'id'> & { steps: Steps | []; googleId: string | null }) {
  let [user] = await db.select().from(users).where(eq(users.email, email))

  const locale = cookies().get('NEXT_LOCALE')?.value || 'en'

  if (user && (user.image !== image || user.locale !== locale)) {
    await db
      .update(users)
      .set({
        image,
        locale,
      })
      .where(eq(users.email, email))

    if (image) user.image = image
    if (locale) user.locale = locale
  }

  if (!user) {
    ;[user] = await db
      .insert(users)
      .values([
        {
          email,
          googleId,
          image,
          locale,
          fullName,
          id: crypto.randomUUID(),
        },
      ])
      .returning()
  }

  const defaultLocaleToLearn = (locales.find((l) => l !== user.locale)?.[0] ||
    'en') as Locale

  let [, localeToLearn, communicationLevel, times = defaultTimes] = steps

  const days = times
    .filter((t) => t.includes('days'))
    .map((d) => d.split('.')[1])

  times = times.filter((t) => !t.includes('days'))

  let [userProfile] = await db
    .select()
    .from(usersProfile)
    .where(eq(usersProfile.userId, user.id))

  if (!userProfile) {
    ;[userProfile] = await db.insert(usersProfile).values([
      {
        id: crypto.randomUUID(),
        communicationLevel: communicationLevel || 'basics',
        localeToLearn: localeToLearn || defaultLocaleToLearn,
        userId: user.id,
      },
    ])
  }

  let [userAvailability] = await db
    .select()
    .from(usersAvailability)
    .where(eq(usersAvailability.userId, user.id))

  if (!userAvailability) {
    ;[userAvailability] = await db.insert(usersAvailability).values([
      {
        id: crypto.randomUUID(),
        days,
        times,
        userId: user.id,
      },
    ])
  }

  ;(user as User).profile = userProfile
  ;(user as User).availability = userAvailability

  return user
}
