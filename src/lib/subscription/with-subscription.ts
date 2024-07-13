'use server'

import { redirect } from '@/navigation'
import { retrieveActiveSubscription } from '.'
import { getAuth } from '../auth/get-auth'

export const withSubscription = async (pathname?: string) => {
  const { user } = await getAuth()

  if (!user) {
    redirect(pathname || '/dashboard')
  }

  if (!retrieveActiveSubscription(user)) {
    redirect(pathname || '/dashboard')
  }
}
