import { getModels } from '@/actions/models/get-models'
import { getAuth } from '@/lib/auth/get-auth'
import { redirect } from '@/navigation'
import { notFound } from 'next/navigation'

export default async function Models() {
  const { user } = await getAuth()
  const { histories } = await getModels(user)

  if (!histories[0]) notFound()

  return redirect(`/models/${histories[0].slug}`)
}
