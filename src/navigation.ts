import { createNavigation } from 'next-intl/navigation'
import { locales } from '@/lib/intl/locales'

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  localePrefix: 'always',
})
