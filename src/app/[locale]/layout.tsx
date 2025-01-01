import { Toaster as Sonner } from '@/components/ui/sonner'
import { Toaster } from '@/components/ui/toaster'
import { env } from '@/env'
import { interSansFont } from '@/lib/font/google/inter-sans-font'
import { cn } from '@/lib/utils'
import { Providers } from '@/providers/ssr'
import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata } from 'next'
import '../globals.css'

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
}: {
  children: React.ReactNode
  params: Promise<{
    locale: string
  }>
}) {
  return (
    <div
      className={cn(
        'h-screen dark:bg-zinc-900 antialiased',
        interSansFont.className,
      )}
    >
      <Toaster />
      <Sonner />
      <GoogleAnalytics gaId={env.GOOGLE_ANALYTICS_MEASUREMENT_Id} />
      <Providers>{children}</Providers>
    </div>
  )
}
