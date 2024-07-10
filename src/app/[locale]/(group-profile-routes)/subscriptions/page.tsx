import { Subscriptions } from '@/components/subscriptions'

export const dynamic = 'force-dynamic'

export default function SubscriptionsPage() {
  return (
    <section className="min-h-full w-full overflow-x-auto pl-[200px]  bg-zinc-900 border border-zinc-800 p-4 rounded-xl  flex flex-wrap items-center justify-center">
      <Subscriptions variant="dialog" />
    </section>
  )
}
