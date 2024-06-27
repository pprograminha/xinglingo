import { Loading } from '@/components/loading'

export default function LoadingPage() {
  return (
    <Loading className="[&>div]:bg-[url('/assets/svgs/radiant-gradient.svg')] border dark:border-zinc-800 rounded-xl [&>div]:bg-cover [&>div]:rounded-xl bg-transparent" />
  )
}
