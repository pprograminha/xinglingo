import React from 'react'
import { ClientProviders } from './client'
import { NextIntlProvider } from './next-intl-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlProvider>
      <ClientProviders>{children}</ClientProviders>
    </NextIntlProvider>
  )
}
