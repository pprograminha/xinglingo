'use client'

import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useSteps } from '@/hooks/use-steps'
import {
  ArrowLeftIcon,
  CloudMoon,
  LucideIcon,
  Moon,
  Sun,
  SunDim,
  SunMedium,
  Sunrise,
  Sunset,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Link } from '../components/link'
import { Progress } from '../components/progress'
import { Title } from './title'

export type TimeId = 'morning' | 'daytime' | 'evening-night' | 'days'

type Time = {
  id: TimeId
  text: string
  items: {
    id: string
    text: string
    Icon?: LucideIcon
  }[]
}

export const RadioGroup = () => {
  const t = useTranslations()
  const { steps, setStep } = useSteps()

  const times: Time[] = [
    {
      id: 'morning',
      text: t('Morning'),
      items: [
        {
          id: '3-6',
          text: '3-6',
          Icon: Moon,
        },
        {
          id: '6-9',
          text: '6-9',
          Icon: Sunrise,
        },
      ],
    },
    {
      id: 'daytime',
      text: t('Daytime'),
      items: [
        {
          id: '9-12',
          text: '9-12',
          Icon: SunMedium,
        },
        {
          id: '12-15',
          text: '12-15',
          Icon: Sun,
        },
        {
          id: '15-18',
          text: '15-18',
          Icon: SunDim,
        },
      ],
    },
    {
      id: 'evening-night',
      text: t('Evening and night'),
      items: [
        {
          id: '18-21',
          text: '18-21',
          Icon: Sunset,
        },
        {
          id: '21-24',
          text: '21-24',
          Icon: CloudMoon,
        },
        {
          id: '0-3',
          text: '0-3',
          Icon: Moon,
        },
      ],
    },

    {
      id: 'days',
      text: t('Days'),
      items: [
        {
          id: 'mon',
          text: t('Mon'),
        },
        {
          id: 'tue',
          text: t('Tue'),
        },
        {
          id: 'wed',
          text: t('Wed'),
        },
        {
          id: 'thu',
          text: t('Thu'),
        },
        {
          id: 'fri',
          text: t('Fri'),
        },
        {
          id: 'sat',
          text: t('Sat'),
        },
        {
          id: 'sun',
          text: t('Sun'),
        },
      ],
    },
  ]

  return (
    <div className="flex flex-col items-center justify-between py-10 md:py-20 px-8 w-full md:w-1/2">
      <div>
        <div className="flex md:hidden items-center flex-col">
          <Progress />
          <Image
            src="/assets/imgs/panda.png"
            width={400}
            height={267}
            alt="cat"
            className=" mb-3 rounded-md "
          />
          <Title />
        </div>
      </div>
      <div className="w-full">
        <h1 className="mb-2">Times</h1>
        <ToggleGroup type="multiple" className="flex flex-col w-full">
          {times.map((time) => (
            <div key={time.id} className="flex flex-col flex-1 w-full">
              <h1 className="text-xs mb-2">{time.text}</h1>

              <div className="flex items-center flex-wrap whitespace-nowrap gap-2 flex-1 w-full [&>button]:w-full">
                {time.items.map((item) => (
                  <ToggleGroupItem
                    key={item.id}
                    className="gap-2 flex-1 w-full border border-zinc-700 data-[state=on]:border-green-300"
                    size="lg"
                    data-state={
                      steps[3].some((step) => step === `${time.id}.${item.id}`)
                        ? 'on'
                        : 'off'
                    }
                    onClick={() => {
                      const on = steps[3].some(
                        (step) => step === `${time.id}.${item.id}`,
                      )

                      if (on) {
                        setStep(
                          3,
                          steps[3].filter(
                            (step) => step !== `${time.id}.${item.id}`,
                          ),
                        )
                      } else {
                        setStep(3, [...steps[3], `${time.id}.${item.id}`])
                      }
                    }}
                    value={`${time.id}.${item.id}`}
                    aria-label={item.text}
                  >
                    {item.Icon && <item.Icon className="w-4 h-4" />}
                    {item.text}
                  </ToggleGroupItem>
                ))}
              </div>
            </div>
          ))}
        </ToggleGroup>
      </div>

      <div className="flex w-full items-center gap-2 mt-4">
        <Button size="icon" variant="secondary" asChild>
          <Link step={2} href="/get-started/2">
            <ArrowLeftIcon className="w-4 h-4" />
          </Link>
        </Button>
        <Button className="w-full" asChild>
          <Link step={4} href="/auth">
            {t('Next')}
          </Link>
        </Button>
      </div>
    </div>
  )
}
