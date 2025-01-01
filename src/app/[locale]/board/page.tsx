import { getModels } from '@/actions/models/get-models'
import { getAuth } from '@/lib/auth/get-auth'
import { getCurrentLocale } from '@/lib/intl/get-current-locale'
import { redirect } from '@/navigation'

export default async function Board() {
  const { user } = await getAuth()
  const { histories } = await getModels(user)

  return redirect({
    href: `/board/${histories[0].id}`,
    locale: await getCurrentLocale(),
  })
}
