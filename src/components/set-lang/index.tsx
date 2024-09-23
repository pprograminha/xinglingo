'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

import { updateUser } from '@/actions/users/update-user'
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
import { useAuth } from '@/hooks/use-auth'
import { Locale, localeImages, langs } from '@/lib/intl/locales'
import { cn } from '@/lib/utils'
import { usePathname, useRouter } from '@/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'

type SetLangProps = {
  className?: string
  collateral?: boolean
  action?: 'y' | 'n'
  onChangeLang?: (locale: string) => void
}

export function SetLang({
  className,
  collateral,
  onChangeLang,
  action = 'y',
}: SetLangProps) {
  const [open, setOpen] = React.useState(false)
  const t = useTranslations()

  const router = useRouter()
  const pathname = usePathname()
  const value = useLocale()
  const { uid } = useAuth()

  const langsValues = Object.entries(langs(t)).map(([value, label]) => ({
    value,
    label,
  }))

  const currentImageSrc = localeImages[value as Locale]

  const lang = langsValues.find((l) => l.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <div
          aria-expanded={open}
          className={cn(
            'px-2 py-2  dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-all rounded-md gap-1 items-center flex',
            className,
          )}
        >
          {lang && (
            <Image
              src={currentImageSrc}
              alt={lang.label}
              className="shrink-0"
              width={20}
              height={20}
            />
          )}
          <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-max p-0">
        <Command className="min-w-[200px]">
          <CommandInput placeholder={`${t('Search language')}...`} />
          <CommandEmpty>{t('No results found')}</CommandEmpty>
          <CommandList className="w-full">
            {langsValues.map((lang) => (
              <CommandItem
                key={lang.value}
                value={lang.value}
                onSelect={(locale) => {
                  const userId = uid()

                  if (onChangeLang) onChangeLang(locale)

                  if (collateral && lang && userId) {
                    updateUser({
                      locale,
                      userId,
                    })
                  }

                  if (action === 'y')
                    router.replace(pathname, { locale: locale as Locale })

                  setOpen(false)
                }}
              >
                {action === 'y' && (
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === lang.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                )}
                <div className="flex gap-2">
                  <Image
                    src={localeImages[lang.value as Locale]}
                    alt={lang.label}
                    className="shrink-0"
                    width={20}
                    height={20}
                  />
                  {lang.label}
                </div>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
