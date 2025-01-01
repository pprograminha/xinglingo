'use server'

import { redirect } from '@/navigation'
import { retrieveActiveSubscription } from '.'
import { getAuth } from '../auth/get-auth'
import { getCurrentLocale } from '../intl/get-current-locale'

export const withSubscription = async (pathname?: string) => {
  const { user } = await getAuth()

  if (!user) {
    redirect({
      href: pathname || '/dashboard',
      locale: await getCurrentLocale(),
    })
  }

  if (!retrieveActiveSubscription(user)) {
    redirect({
      href: pathname || '/dashboard',
      locale: await getCurrentLocale(),
    })
  }
}
