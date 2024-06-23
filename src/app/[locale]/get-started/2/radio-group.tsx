'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  RadioGroupItem,
  RadioGroup as RadioGroupPrimitive,
} from '@/components/ui/radio-group'
import { useSteps } from '@/hooks/use-steps'
import { useTranslations } from 'next-intl'
import { Progress } from '../components/progress'
import Image from 'next/image'
import { Title } from './title'
import { Link } from '../components/link'
import { ArrowLeftIcon } from 'lucide-react'

export type LabelId = 'starting' | 'basics' | 'conversational' | 'fluent'

type Label = {
  id: LabelId
  text: string
}
export const RadioGroup = () => {
  const t = useTranslations()
  const { steps, setStep } = useSteps()

  const labels: Label[] = [
    {
      id: 'starting',
      text: t("I'm just starting"),
    },
    {
      id: 'basics',
      text: t('I know the basics'),
    },
    {
      id: 'conversational',
      text: t("I'm conversational"),
    },
    {
      id: 'fluent',
      text: t("I'm fluent in most situations"),
    },
  ]

  return (
    <div className="flex flex-col items-center justify-between py-10 md:py-20 px-8 w-full md:w-1/2">
      <div>
        <div className="flex md:hidden mt-4 items-center flex-col">
          <Progress />
          <Image
            src="/assets/imgs/cat.png"
            width={400}
            height={267}
            alt="cat"
            className=" mb-3 rounded-md "
          />
          <Title />
        </div>
      </div>

      <RadioGroupPrimitive
        className="w-full mt-8"
        key={steps[2]}
        defaultValue={steps[2]}
        onValueChange={(value) => setStep(2, value as LabelId)}
      >
        {labels.map(({ id, text }) => (
          <Label
            key={id}
            htmlFor={id}
            data-active={steps[2] === id}
            className="border
            data-[active=true]:border-green-300
            border-transparent
            p-3
            group
            flex
            items-center
            justify-between
            w-full
            gap-2
            cursor-pointer
            border-zinc-800
            hover:bg-zinc-950/20
            rounded-md"
          >
            {text}
            <RadioGroupItem
              value={id}
              id={id}
              className="group-data-[active=true]:border-green-300  group-data-[active=true]:text-green-300 border-2 p-0 w-6 h-6"
            />
          </Label>
        ))}
      </RadioGroupPrimitive>

      <div className="flex w-full items-center gap-2 mt-8 pb-4">
        <Button size="icon" variant="secondary" asChild>
          <Link step={1} href="/get-started/1">
            <ArrowLeftIcon className="w-4 h-4" />
          </Link>
        </Button>
        <Button className="w-full" asChild>
          <Link step={3} href="/get-started/3">
            {t('Next')}
          </Link>
        </Button>
      </div>
    </div>
  )
}
