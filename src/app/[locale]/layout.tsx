import { GoogleAuth } from '@/components/google-auth'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import '../globals.css'
import { Wrapper } from '../wrapper'
import { NextIntlProvider } from '../next-intl-provider'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'LingoAI',
  description: 'English pronunciation Ai Speech',
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: {
    locale: string
  }
}) {
  return (
    <html lang={params.locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/assets/favicon.ico" sizes="any" />
      </head>
      <body
        className={cn(
          'min-h-screen dark:bg-zinc-900 font-sans antialiased',
          fontSans.variable,
        )}
      >
        <Toaster />
        <Sonner />
        <NextIntlProvider>
          <Wrapper>
            {children}
            <GoogleAuth />
          </Wrapper>
        </NextIntlProvider>
      </body>
    </html>
  )
}
