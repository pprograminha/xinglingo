import { Toaster as Sonner } from '@/components/ui/sonner'
import { Toaster } from '@/components/ui/toaster'
import { interSansFont } from '@/lib/font/google/inter-sans-font'
import { cn } from '@/lib/utils'
import { Providers } from '@/providers/ssr'
import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata } from 'next'
import '../globals.css'
import { env } from '@/env'

export const metadata: Metadata = {
  title: {
    template: '%s | Xinglingo',
    default: 'Xinglingo',
  },
  manifest: '/manifest.json',
  robots: {
    follow: true,
    index: true,
  },
  icons: {
    icon: '/assets/favicon.ico',
  },
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
      <body
        className={cn('h-screen dark:bg-zinc-900 antialiased', interSansFont())}
      >
        <Toaster />
        <Sonner />
        <GoogleAnalytics gaId={env.GOOGLE_ANALYTICS_MEASUREMENT_Id} />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
