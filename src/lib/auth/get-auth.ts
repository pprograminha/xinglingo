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

interface GenericFunction {
  (...props: any): any;
}

export async function withAuth<T extends GenericFunction>(callback: T, friendlyReturn: Awaited<ReturnType<T>> |  '¨*&x6.1' = '¨*&x6.1') {
  const {user} = await getAuth()
  
  if(!user) {
    if(friendlyReturn !==  '¨*&x6.1') return () => friendlyReturn as ReturnType<T>

    throw new Error(callback.name)
  }
 
  return callback
}
