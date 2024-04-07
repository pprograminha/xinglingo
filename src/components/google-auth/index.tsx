'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { signIn, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { toast } from '../ui/use-toast'
import Image from 'next/image'

export function GoogleAuth() {
  const [isOpen, setIsOpen] = useState(false)

  const { status } = useSession({
    required: false,
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      setIsOpen(true)
    }

    if (status === 'authenticated') {
      setIsOpen(false)
    }
  }, [status])

  async function googleAuthHandler() {
    await signIn('google', {
      redirect: false,
    })
  }
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (isOpen === false) {
          toast({
            title: 'Autenticação é obrigatória para prosseguir.',
            variant: 'destructive',
          })
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px] p-0 bg-transparent dark:bg-transparent border-0">
        <div className="rounded-lg border border-zinc-100 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-2xl shadow-zinc-600/10 dark:shadow-none">
          <div className="p-8 py-12 sm:p-16">
            <div className="space-y-4">
              <Image
                src="/assets/logo.png"
                loading="lazy"
                width={120}
                height={120}
                className="w-30"
                alt="LingoAI logo"
              />
              <h2 className="mb-8 text-2xl font-bold text-zinc-800 dark:text-white">
                Sign in to unlock the <br />
                best of LingoAI.
              </h2>
            </div>
            <div className="mt-16 grid space-y-4">
              <Button
                className="group relative flex h-11 bg-transparent dark:bg-transparent hover:bg-transparent dark:hover:bg-transparent items-center px-6 before:absolute before:inset-0 before:rounded-lg before:bg-white dark:before:bg-zinc-700 dark:before:border-zinc-600 before:border before:border-zinc-200 before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 disabled:before:bg-zinc-300 disabled:before:scale-100"
                onClick={googleAuthHandler}
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
                  <span>Continue with Google</span>
                </span>
              </Button>
            </div>
            <div className="mt-32 space-y-4 text-center text-zinc-600 dark:text-zinc-400 sm:-mb-8">
              <p className="text-xs">
                By proceeding, you agree to our{" "}
                <a href="#" className="underline">
                  Terms of Use
                </a>{" "}
                and confirm you have read our
                <a href="#" className="underline">
                  Privacy and Cookie Statement
                </a>
                .
              </p>
              <p className="text-xs">
                This site is protected by reCAPTCHA and the
                <a href="#" className="underline">
                  Google Privacy Policy
                </a>{" "}
                and
                <a href="#" className="underline">
                  Terms of Service
                </a>{" "}
                apply.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
