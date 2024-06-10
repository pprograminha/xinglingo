import { LabelId } from '@/app/[locale]/get-started/2/radio-group'
import { TimeId } from '@/app/[locale]/get-started/3/radio-group'
import { Locale } from '@/lib/intl/locales'
import { lingos } from '@/lib/storage/local'
import { create } from 'zustand'
import { PersistStorage, persist } from 'zustand/middleware'

export type Steps = [
  undefined,
  Locale,
  LabelId | undefined,
  `${TimeId}.${string}`[],
]

type StepsValues = Steps[number]

interface StepsState {
  previousStep: number
  currentStep: number
  steps: Steps
  setStep: (step: number, steps?: StepsValues) => void
}
export const defaultTimes: `${TimeId}.${string}`[] = [
  'evening-night.21-24',
  'evening-night.18-21',
  'daytime.9-12',
  'daytime.12-15',
  'daytime.15-18',
  'evening-night.0-3',
  'morning.6-9',
  'morning.3-6',
]
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
      steps: [undefined, 'en', undefined, defaultTimes],
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
      name: lingos.prefixKey(`get-started:steps`),
      storage,
    },
  ),
)
