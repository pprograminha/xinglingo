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

const langs = [
  {
    value: 'English',
    label: 'English',
  },
  {
    value: 'Español',
    label: 'Español',
  },
  {
    value: 'Français',
    label: 'Français',
  },
  {
    value: 'Português',
    label: 'Português',
  },
  {
    value: '國語',
    label: '國語',
  },
]

export function Combobox() {
  const [open, setOpen] = React.useState(false)
  const defaultValue = langs[0].value
  const [value, setValue] = React.useState(defaultValue)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const { width } = useSize(buttonRef)
  const t = useTranslations()

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
          {value}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      {Boolean(width) && (
        <PopoverContent className="w-full max-w-max p-0">
          <Command style={{ width }}>
            <CommandInput placeholder={`${t('Search language')}...`} />
            <CommandEmpty>{t('No results found')}</CommandEmpty>
            <CommandList className="w-full">
              {langs.map((lang) => (
                <CommandItem
                  key={lang.value}
                  value={lang.value}
                  onSelect={(currentValue) => {
                    setValue(
                      currentValue === value ? defaultValue : currentValue,
                    )
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
