import { withAuth } from 'next-auth/middleware'
import createIntlMiddleware from 'next-intl/middleware'
import { NextRequest } from 'next/server'
import { locales } from './lib/intl/locales'

const publicPages = ['/', '/get-started']

const intlMiddleware = createIntlMiddleware({
  locales,
  localeDetection: true,
  defaultLocale: 'pt',
  localePrefix: 'always',
})

const authMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req)
  },
  {
    callbacks: {
      authorized: ({ token }) => token != null,
    },
    pages: {
      signIn: '/',
    },
  },
)

export default function middleware(req: NextRequest) {
  const publicPathnameRegex = RegExp(
    `^(/(${locales.join('|')}))?(${publicPages.join('|')})?/?$`,
    'i',
  )

  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname)

  if (isPublicPage) {
    return intlMiddleware(req)
  } else {
    return (authMiddleware as typeof intlMiddleware)(req)
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|api|favicon.ico|assets).*)'],
}
// curl -X POST https://api.openai.com/v1/chat/completions \
// -H "Content-Type: application/json" \
// -H "Authorization: Bearer APIKEY" \
// -d '{
//  "model": "gpt-3.5-turbo-0125",
//  "messages": [
//     {"role": "system", "content": "Você me ajudará retornando um JSON, para ok true a pergunta/resposta do usuário é verdadeira para ok false a pergunta/resposta é falsa. Ex.: {ok: true} | {ok: false}"},
//     {"role": "user", "content": "A terra é um geoide"}
//  ]
// }'
