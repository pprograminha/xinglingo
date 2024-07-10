'use client'
import { lingos } from '@/lib/storage/local'
import { usePathname, useRouter } from '@/navigation'
import { ThemeProvider } from '@/providers/theme-provider'
import { SessionProvider } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const params = useSearchParams()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const pathname = usePathname()

  const coupon = params.get('coupon')

  useEffect(() => {
    if (coupon && isClient) {
      lingos.storage.set('coupon-code', coupon)

      router.replace(pathname)
    }
  }, [coupon, router, pathname, isClient])

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <ThemeProvider>
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  )
}
