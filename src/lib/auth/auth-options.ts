import { makeUser } from '@/actions/users/make-user'
import { env } from '@/env'
import { Steps } from '@/hooks/use-steps'
import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { cookies } from 'next/headers'
import { lingos } from '../storage/local'
// import AppleProvider from 'next-auth/providers/apple'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    // AppleProvider({
    //   clientId: env.GOOGLE_CLIENT_ID,
    //   clientSecret: env.GOOGLE_CLIENT_SECRET,
    // }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email || !user.name) {
        return false
      }

      const googleId = account?.provider === 'google' ? user.id : null

      const steps = JSON.parse(
        cookies().get(`${lingos.prefixKey(`auth:steps`)}`)?.value || '[]',
      ) as Steps | []

      const makedUser = await makeUser({
        steps,
        googleId,
        email: user.email,
        fullName: user.name,
        image: user.image,
      })

      type User = typeof user & { more: typeof makedUser }
      ;(user as User).more = makedUser

      return true
    },
    async jwt({ token, user }) {
      user && (token.user = user)

      return token
    },
    async session({ session, token }) {
      session.user = token.user as typeof session.user

      return session
    },
  },
  pages: {
    error: '/auth',
    signIn: '/auth',
    newUser: '/',
  },
}
