import { getModels } from '@/actions/models/get-models'
import { getAuth } from '@/lib/auth/get-auth'
import { redirect } from '@/navigation'
import { notFound } from 'next/navigation'

export default async function Board() {
  const { user } = await getAuth()
  const { histories } = await getModels(user)

  if (!histories[0]) notFound()

  return redirect(`/board/${histories[0].id}`)
}
