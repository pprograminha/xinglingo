'use client'
import { ModelProvider } from '@/hooks/use-model'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
  params: Promise<{
    locale: string
    'model-id': string
  }>
}) {
  return <ModelProvider>{children}</ModelProvider>
}
