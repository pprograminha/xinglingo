'use client'
import { useSteps } from '@/hooks/use-steps'

import * as React from 'react'

import { Progress as ProgressPrimitive } from '@/components/ui/progress'
import { useTranslations } from 'next-intl'

const MAX_STEPS = 4

export function Progress() {
  const { currentStep } = useSteps()
  const [progress, setProgress] = React.useState(13)
  const t = useTranslations()

  React.useEffect(() => {
    const timer = setTimeout(
      () => setProgress((currentStep / MAX_STEPS) * 100),
      500,
    )
    return () => clearTimeout(timer)
  }, [currentStep])

  return (
    <>
      <h1 className="text-xs text-zinc-500 mb-2">
        {t("You're almost there, just 1 steps to go!", {
          step: MAX_STEPS - currentStep,
        })}
      </h1>
      <ProgressPrimitive value={progress} className="w-[60%]" />
    </>
  )
}
