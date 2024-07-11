import { cn } from '@/lib/utils'
import { HtmlHTMLAttributes } from 'react'
import { Skeleton } from '../ui/skeleton'

type SkeletonWordProps = HtmlHTMLAttributes<HTMLDivElement> & {
  gen?: number
}

export const SkeletonWord = ({
  className,
  gen = 1,
  ...props
}: SkeletonWordProps) => {
  const sizesInRem = ['3rem', '4rem', '5rem', '6rem']

  return (
    <div className="flex flex-wrap gap-2">
      {Array.from(
        {
          length: gen,
        },
        (v, k) => k + 1,
      ).map((key) => {
        const randomIndex = Math.floor(Math.random() * 4)

        const size = sizesInRem[randomIndex]

        return (
          <Skeleton
            key={key}
            style={{
              maxWidth: size,
            }}
            className={cn('w-full', className)}
            {...props}
          />
        )
      })}
    </div>
  )
}
