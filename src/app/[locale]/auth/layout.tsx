'use client'

import { env } from '@/env'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={env.NEXT_PUBLIC_RECAPTCHA_KEY}>
      {children}
    </GoogleReCaptchaProvider>
  )
}
