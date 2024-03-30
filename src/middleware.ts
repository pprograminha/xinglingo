import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/',
    error: '/error',
  },
})
export const config = {
  matcher: ['/((?!_next/static|_next/image|api|favicon.ico|assets).*)'],
}
