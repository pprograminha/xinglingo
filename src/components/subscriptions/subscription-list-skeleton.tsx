import { SkeletonWord } from '../skeleton-word'
import { Skeleton } from '../ui/skeleton'

export const SubscriptionListSkeleton = () => {
  return (
    <div
      className={`
        bg-zinc-800
        p-4
        md:h-[190px]
        w-full
        rounded-xl
        flex
        justify-between
        items-center
        md:flex-row
        flex-col
        gap-6
      `}
    >
      <div className="flex-1 self-start w-full md:w-auto">
        <Skeleton className="h-7 max-w-[100px] w-full" />
        <SkeletonWord className="h-3 mt-4" gen={7} />
        <SkeletonWord className="h-3 mt-2" gen={4} />
      </div>
      <div className="flex flex-col gap-4 w-full md:w-auto">
        <SkeletonWord className="h-3" gen={1} />
        <SkeletonWord className="h-4" gen={2} />
        <Skeleton className="h-10 md:w-[200px] w-full rounded-full" />
      </div>
    </div>
  )
}
