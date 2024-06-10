'use server'
import { Steps, defaultTimes } from '@/hooks/use-steps'
import { db } from '@/lib/db/drizzle/query'
import { users } from '@/lib/db/drizzle/schema'
import { NewUser } from '@/lib/db/drizzle/types'
import { Locale, locales } from '@/lib/intl/locales'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'
import crypto from 'node:crypto'

export async function makeUser({
  email,
  fullName,
  steps,
  image = null,
}: Omit<NewUser, 'id'> & { steps: Steps | [] }) {
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
          image,
          locale,
          fullName,
          id: crypto.randomUUID(),
        },
      ])
      .returning()
  }
  const defaultLangToLearn = (locales.find((l) => l !== user.locale)?.[0] ||
    'en') as Locale

  let [
    ,
    langToLearn = defaultLangToLearn,
    communicationLevel = 'basics',
    times = defaultTimes,
  ] = steps

  const days = times
    .filter((t) => t.includes('days'))
    .map((d) => d.split('.')[1])

  times = times.filter((t) => !t.includes('days'))

  console.log({ langToLearn, communicationLevel, times, days })

  return user
}
