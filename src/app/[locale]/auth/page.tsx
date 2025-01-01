/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { Logo } from '@/components/logo'
import { SetLang } from '@/components/set-lang'
import { Button } from '@/components/ui/button'
import { env } from '@/env'
import { useAuth } from '@/hooks/use-auth'
import { useSteps } from '@/hooks/use-steps'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { lingos } from '@/lib/storage/local'
import { Link, useRouter } from '@/navigation'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect } from 'react'
import {
  IGoogleReCaptchaConsumerProps,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3'
import { toast } from 'sonner'
import { addAuthCookies } from './actions/add-auth-cookies.action'
import { verifyReCAPTCHA } from './actions/verify-recaptcha.action'

export default function Auth() {
  const router = useRouter()
  const { previousStep, steps } = useSteps()
  const t = useTranslations()
  const { executeRecaptcha } = env.NEXT_PUBLIC_RECAPTCHA_ENABLE
    ? useGoogleReCaptcha()
    : ({} as IGoogleReCaptchaConsumerProps)

  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/board/517764140345851904')
    }
  }, [isAuthenticated, router])

  async function googleAuthHandler() {
    if (previousStep !== 0) {
      lingos.storage.set('first-time', previousStep.toString())
    }

    const hasReCAPTCHA = env.NEXT_PUBLIC_RECAPTCHA_ENABLE

    if (!hasReCAPTCHA) {
      await addAuthCookies({
        steps,
      })
      await signIn('google')
      return
    }

    if (executeRecaptcha && typeof window !== 'undefined') {
      const recaptchaToken = await executeRecaptcha()
      await verifyReCAPTCHA(recaptchaToken)
      await addAuthCookies({
        steps,
      })
      await signIn('google')
    } else {
      toast(t('An error occurred with ReCAPTCHA, please try again later :('), {
        description: t('Contact support if you see this error'),
        action: {
          label: t('Undo'),
          onClick: () => {},
        },
      })
    }
  }

  return (
    <>
      <div className="h-full  bg-gradient-to-tr from-zinc-900 shadow-zinc-600/10">
        <div className="h-full bg-[url('/assets/svgs/bg.svg')] relative flex items-center justify-center">
          <div className="p-8 py-12 sm:p-16 flex flex-col items-center">
            <Logo className="absolute top-4 left-4 md:left-10 md:scale-150" />
            <div className="space-y-4 flex flex-col items-center">
              <Link href="/get-started">
                <Image
                  src="/assets/imgs/panda.png"
                  loading="lazy"
                  width={320}
                  height={213}
                  className="w-30"
                  alt="Xinglingo panda"
                />
              </Link>

              <h2
                className={`${pixelatedFont.className} mb-8 text-4xl max-w-sm font-bold text-zinc-800 dark:text-white`}
              >
                {t('Sign in to unlock the best of Xinglingo')}
              </h2>
            </div>

            <div className="w-full mt-5 gap-2 max-w-[450px] flex items-center justify-center">
              <Button
                className="w-full max-w-[400px]"
                onClick={googleAuthHandler}
                size="lg"
                variant="secondary"
              >
                <span className="w-full relative flex justify-center items-center gap-3 text-base font-medium text-zinc-600 dark:text-zinc-200">
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    className="w-5"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </svg>
                  <span>{t('Continue with Google')}</span>
                </span>
              </Button>
              <SetLang />
            </div>
            <div className="mt-10 space-y-4 text-center text-zinc-600 dark:text-zinc-400 sm:-mb-8">
              <p className="text-xs">
                {t('By proceeding, you agree to our')}{' '}
                <Link href="/terms-of-service" className="underline">
                  {t('Terms of Use')}
                </Link>{' '}
                {t('and confirm you have read our')}{' '}
                <Link href="/privacy-policy" className="underline">
                  {t('Privacy and Cookie Statement')}
                </Link>
              </p>

              <p className="text-xs">
                {t('This site is protected by reCAPTCHA and the')}{' '}
                <Link
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  className="underline"
                >
                  {t('Google Privacy Policy')}
                </Link>{' '}
                {t('and')}{' '}
                <Link
                  href="https://policies.google.com/terms"
                  target="_blank"
                  className="underline"
                >
                  {t('Terms of Service')}
                </Link>{' '}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
