import { cn } from '@/lib/utils'
import Image from 'next/image'

type IntensiveProps = {
  value: number
  className?: string
}
export const Intensive = ({ value, className }: IntensiveProps) => {
  return (
    <div
      className={cn(
        `flex
        gap-1
        border
        border-orange-600/60
        shrink-0
        text-orange-500
        rounded-full
        px-2
        md:px-6
        text-xs
        py-2
        max-h-8
        bg-gradient-to-tr
        dark:from-zinc-700
        dark:to-orange-700/40`,
        className,
      )}
    >
      <Image
        src="/assets/svgs/flame-danger.svg"
        width={15}
        height={15}
        alt="Flame danger"
      />
      {value}x
    </div>
  )
}
