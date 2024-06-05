'use server'

import { env } from '@/env'

type ReCAPTCHAResponse = {
  success: true | false
  challenge_ts: Date
  hostname: string
}
export const verifyReCAPTCHA = async (
  token: string,
): Promise<ReCAPTCHAResponse> => {
  const response = await fetch(
    'https://www.google.com/recaptcha/api/siteverify',
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${env.RECAPTCHA_SECRET}&response=${token}`,
      method: 'POST',
    },
  )
  const data: ReCAPTCHAResponse = await response.json()

  return data
}
