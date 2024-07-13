import { getUser } from '@/actions/users/get-user'
import { User } from '@/lib/db/drizzle/types'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export const useAuth = () => {
  const { data, status } = useSession()

  const sessionUser = data?.user as
    | (NonNullable<typeof data>['user'] & {
        more: User
      })
    | undefined

  const [user, setUser] = useState<User | null>(null)

  const uid = () => user?.id || null

  useEffect(() => {
    if (sessionUser?.more) {
      getUser(sessionUser.more.id).then((user) => setUser(user))
    }
  }, [sessionUser?.more])

  return { user, isAuthenticated: status === 'authenticated', uid }
}
