'use client'
import { ThemeProvider } from '@/providers/theme-provider'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

export function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider>
        <SessionProvider>{children}</SessionProvider>
      </ThemeProvider>
    </>
  )
}
