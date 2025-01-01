import { getUser } from '@/actions/users/get-user'
import { getServerSession } from 'next-auth'
import { User } from '../db/drizzle/types'
import { authOptions } from './auth-options'
import { redirect } from '@/navigation'
import { getCurrentLocale } from '../intl/get-current-locale'

export const getAuth = async (isPublicPage = false) => {
  const session = await getServerSession(authOptions)

  const sessionUser = session?.user as
    | (NonNullable<typeof session>['user'] & {
        more: User
      })
    | undefined

  let user: User | null = sessionUser?.more || null
  if (user) {
    user = await getUser(user.id)
  } else {
    if (!isPublicPage)
      redirect({
        href: '/auth',
        locale: await getCurrentLocale(),
      })
    return {
      user: null,
    }
  }

  return { user }
}

interface GenericFunction {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...props: any): any
}

export async function withAuth<T extends GenericFunction>(
  callback: T,
  friendlyReturn: Awaited<ReturnType<T>> | '@' = '@',
) {
  const { user } = await getAuth()

  if (!user) {
    if (friendlyReturn !== '@') return () => friendlyReturn as ReturnType<T>

    throw new Error(callback.name)
  }

  return callback
}
