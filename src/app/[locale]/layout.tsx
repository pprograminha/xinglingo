import { Toaster as Sonner } from '@/components/ui/sonner'
import { Toaster } from '@/components/ui/toaster'
import { interSansFont } from '@/lib/font/google/inter-sans-font'
import { cn } from '@/lib/utils'
import { Providers } from '@/providers/ssr'
import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Xinglingo',
  description: 'English pronunciation Ai Speech',
  manifest: '/manifest.json',
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
        className={cn('h-screen dark:bg-zinc-900 antialiased', interSansFont())}
      >
        <Toaster />
        <Sonner />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
