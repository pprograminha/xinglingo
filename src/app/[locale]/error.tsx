'use client'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import '../globals.css'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations()
  return (
    <div className="text-white flex justify-center items-center h-full w-full">
      <div className="flex flex-col">
        <Image
          src="/assets/imgs/tutor-ai-04.png"
          width={100}
          height={65}
          alt="Panda"
        />
        <div className="mt-2">
          <h2 className={`${pixelatedFont()} text-4xl`}>
            {t('Something went wrong!')}
          </h2>
          <Button
            variant="secondary"
            className="dark:text-red-500 mt-4"
            onClick={() => reset()}
          >
            {t('Try again')}
          </Button>
        </div>
      </div>
    </div>
  )
}
