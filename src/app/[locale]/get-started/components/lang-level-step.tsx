import { getTranslations } from 'next-intl/server'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {} from 'date-fns-tz'
type LangLevelStepProps = {
  t: Awaited<ReturnType<typeof getTranslations>>
}
export const LangLevelStep = ({ t }: LangLevelStepProps) => {
  const dates = Intl.DateTimeFormat().resolvedOptions().timeZone

  return (
    <div className="h-full flex">
      <div className="flex flex-col items-center px-4 justify-center z-10 h-full dark:bg-zinc-950 w-1/2">
        <h1 className="text-5xl font-bold text-center">
          {t("What's your language level?", {
            lang: 'English',
          })}
          {dates}
        </h1>
      </div>
      <div className="flex items-center justify-center px-8 w-1/2">
        <RadioGroup className="w-full">
          <Label
            htmlFor="r1"
            className="border border-transparent active:border-green-300/15 p-3 flex items-center justify-between w-full gap-2 cursor-pointer hover:bg-zinc-950/20 rounded-md"
          >
            {t("I'm just starting")}
            <RadioGroupItem value="starting" id="r1" />
          </Label>
          <Label
            htmlFor="r2"
            className="border border-transparent active:border-green-300/15 p-3 flex items-center justify-between w-full gap-2 cursor-pointer hover:bg-zinc-950/20 rounded-md"
          >
            {t('I know the basics')}
            <RadioGroupItem value="basics" id="r2" />
          </Label>
          <Label
            htmlFor="r3"
            className="border border-transparent active:border-green-300/15 p-3 flex items-center justify-between w-full gap-2 cursor-pointer hover:bg-zinc-950/20 rounded-md"
          >
            {t("I'm conversational")}
            <RadioGroupItem value="conversational" id="r3" />
          </Label>
          <Label
            htmlFor="r4"
            className="border border-transparent active:border-green-300/15 p-3 flex items-center justify-between w-full gap-2 cursor-pointer hover:bg-zinc-950/20 rounded-md"
          >
            {t("I'm fluent in most situations")}
            <RadioGroupItem value="fluent" id="r4" />
          </Label>
        </RadioGroup>
      </div>
    </div>
  )
}
