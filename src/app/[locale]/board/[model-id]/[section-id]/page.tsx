import { getModels } from '@/actions/models/get-models'
import { getAuth } from '@/lib/auth/get-auth'
import { redirect } from '@/navigation'

export default async function SectionPage() {
  const { user } = await getAuth()
  const { histories } = await getModels(user)

  return redirect(`/board/${histories[0].id}`)
}
