import { SparkleIcon } from 'lucide-react'
import { Skeleton } from '../ui/skeleton'

export const ProfileLinkSkeleton = () => {
  return (
    <>
      <div className="flex gap-2 items-center">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />

        <div className="w-full gap-2 flex items-center">
          <Skeleton className="h-4 w-full" />
          <SparkleIcon className="w-5 text-yellow-400 shrink-0" />
        </div>
      </div>
      <div className="mt-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/6 mt-1" />
      </div>
    </>
  )
}
