import { createSharedPathnamesNavigation } from 'next-intl/navigation'
import { locales } from '@/lib/intl/locales'

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({
    locales,
    localePrefix: 'always',
  })
