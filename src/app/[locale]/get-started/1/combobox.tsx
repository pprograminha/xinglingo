'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useSize } from '@/hooks/use-size'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { useSteps } from '@/hooks/use-steps'
import { Locale, langs, locales } from '@/lib/intl/locales'
import { useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { useRouter } from '@/navigation'

export function Combobox() {
  const [open, setOpen] = React.useState(false)
  const t = useTranslations()
  const { steps, setStep } = useSteps()
  const router = useRouter()
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const { width } = useSize(buttonRef)

  const langsValues = Object.entries(langs(t)).map(([value, label]) => ({
    value,
    label,
  }))

  const searchParams = useSearchParams()

  const getParams = React.useCallback(() => {
    if (typeof window === 'undefined')
      return {
        subject: null,
      }

    const subjectData = z
      .string()
      .refine((v) => locales.some((l) => l === v))
      .safeParse(searchParams.get('subject'))

    let subject: Locale | null = null

    if (subjectData.success) {
      setStep(1, subjectData.data as Locale)

      subject = subjectData.data as Locale
    }

    return {
      subject,
    }
  }, [searchParams, setStep])

  React.useEffect(() => {
    getParams()
  }, [getParams])

  const defaultValue = langsValues[0]?.value as Locale | undefined

  const value = steps[1] || defaultValue

  const label = langsValues.find((l) => l.value === value)?.label

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={buttonRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="lg:w-[400px] md:w-[300px] w-full p-6 justify-between"
        >
          {label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      {Boolean(width) && (
        <PopoverContent className="w-full max-w-max p-0">
          <Command style={{ width }}>
            <CommandInput placeholder={`${t('Search language')}...`} />
            <CommandEmpty>{t('No results found')}</CommandEmpty>
            <CommandList className="w-full">
              {langsValues.map((lang) => (
                <CommandItem
                  key={lang.value}
                  value={lang.value}
                  onSelect={(currentValue) => {
                    const newValue =
                      currentValue === value ? defaultValue : currentValue

                    if (searchParams.has('subject'))
                      router.replace('/get-started/1')

                    setStep(1, newValue as Locale)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === lang.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {lang.label}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  )
}
