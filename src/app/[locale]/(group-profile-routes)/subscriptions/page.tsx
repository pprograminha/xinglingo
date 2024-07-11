import { getAuth } from '@/lib/auth/get-auth'
import { Support } from './components/support'
import { Tabs } from './components/tabs'

export const dynamic = 'force-dynamic'

export default async function SubscriptionsPage() {
  const { user } = await getAuth()

  return (
    <section className="min-h-full w-full overflow-x-auto bg-zinc-900 border border-zinc-800 rounded-xl items-center justify-center md:mb-0 mb-20">
      <div className="bg-[url('/assets/svgs/radiant-gradient.svg')] bg-cover min-h-full h-full p-4 rounded-xl flex flex-col justify-between">
        <Tabs user={user} />

        <Support />
      </div>
    </section>
  )
}
