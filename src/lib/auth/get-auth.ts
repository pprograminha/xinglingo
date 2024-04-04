import { getServerSession } from 'next-auth'
import { authOptions } from './auth-options'
import { User } from '../db/drizzle/@types'

export const getAuth = async () => {
  const session = await getServerSession(authOptions)

  const sessionUser = session?.user as
    | (NonNullable<typeof session>['user'] & {
        more: User
      })
    | undefined

  return { user: sessionUser?.more || null }
}
