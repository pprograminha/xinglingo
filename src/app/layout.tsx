import { getLocale } from 'next-intl/server'
import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Xinglingo',
  manifest: '/manifest.json',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()

  return (
    <html suppressHydrationWarning lang={locale}>
      <body>{children}</body>
    </html>
  )
}
