import { User } from '@/lib/db/drizzle/@types'
import { useSession } from 'next-auth/react'

export const useAuth = () => {
  const { data, status } = useSession()

  const sessionUser = data?.user as
    | (NonNullable<typeof data>['user'] & {
        more: User
      })
    | undefined

  const user = sessionUser?.more || null
  const uid = () => user?.id || null

  return { user, isAuthenticated: status === 'authenticated', uid }
}
