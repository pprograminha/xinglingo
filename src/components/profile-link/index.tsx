import { cn } from '@/lib/utils'
import { Link } from '@/navigation'
import { Suspense } from 'react'
import { ProfileLinkContent } from './content'
import { ProfileLinkSkeleton } from './skeleton'

type ProfileLinkProps = {
  className?: string
}

export const ProfileLink = async ({
  className,
  ...props
}: ProfileLinkProps) => {
  return (
    <Link
      href="/profile"
      className={cn(
        'cursor-pointer w-full max-w-xs min-h-[154px] bg-zinc-800 rounded-xl',
        className,
      )}
      {...props}
    >
      <div className="bg-gradient-to-tr from-zinc-800 h-full via-zinc-800 to-yellow-200/10 rounded-xl w-full p-4">
        <Suspense fallback={<ProfileLinkSkeleton />}>
          <ProfileLinkContent />
        </Suspense>
      </div>
    </Link>
  )
}
