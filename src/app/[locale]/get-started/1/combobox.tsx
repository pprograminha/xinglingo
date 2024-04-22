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
import { Locale, langs } from '@/lib/intl/locales'

export function Combobox() {
  const [open, setOpen] = React.useState(false)
  const t = useTranslations()
  const { steps, setStep } = useSteps()

  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const { width } = useSize(buttonRef)

  const langsValues = Object.entries(langs(t)).map(([value, label]) => ({
    value,
    label,
  }))

  const defaultValue = langsValues[0]?.value

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
