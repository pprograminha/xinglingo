import { redirect } from '@/navigation'

export const dynamic = 'force-dynamic'

export default function NotFoundPage() {
  return redirect('/dashboard')
}
