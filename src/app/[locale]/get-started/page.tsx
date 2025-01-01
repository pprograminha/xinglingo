import { getCurrentLocale } from '@/lib/intl/get-current-locale'
import { redirect } from '@/navigation'

const GetStarted = async () => {
  return redirect({
    href: '/get-started/1',
    locale: await getCurrentLocale(),
  })
}

export default GetStarted
