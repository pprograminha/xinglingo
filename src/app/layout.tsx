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
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
