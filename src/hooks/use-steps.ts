import { LabelId } from '@/app/[locale]/get-started/2/radio-group'
import { TimeId } from '@/app/[locale]/get-started/3/radio-group'
import { Locale } from '@/lib/intl/locales'
import { prefixKey } from '@/lib/storage/local'
import { create } from 'zustand'
import { PersistStorage, persist } from 'zustand/middleware'

type Steps = [undefined, Locale, LabelId | undefined, `${TimeId}.${string}`[]]

type StepsValues = Steps[number]

interface StepsState {
  previousStep: number
  currentStep: number
  steps: Steps
  setStep: (step: number, steps?: StepsValues) => void
}

const storage: PersistStorage<StepsState> = {
  getItem: (key: string) => {
    try {
      const value = sessionStorage.getItem(key)
      return value ? JSON.parse(value) : null
    } catch {
      return null
    }
  },
  setItem: (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value))
  },
  removeItem: (key: string) => {
    sessionStorage.removeItem(key)
  },
}

export const useSteps = create<StepsState>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      previousStep: 0,
      steps: [undefined, 'en', undefined, []],
      setStep: (step, value) => {
        const steps = get().steps

        if (value) {
          steps[step] = value
        }

        set((state) => ({
          steps,
          previousStep: state.currentStep,
          currentStep: step,
        }))
      },
    }),
    {
      name: prefixKey(`getStarted:steps`),
      storage,
    },
  ),
)
