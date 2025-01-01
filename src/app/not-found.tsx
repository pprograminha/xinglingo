import { getCurrentLocale } from '@/lib/intl/get-current-locale'
import { redirect } from '@/navigation'

export const dynamic = 'force-dynamic'

export default async function NotFoundPage() {
  return redirect({
    href: '/dashboard',
    locale: await getCurrentLocale(),
  })
}
