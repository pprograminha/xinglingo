import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { lingos } from '@/lib/storage/local'
import { cn } from '@/lib/utils'
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react'
import { cache, HtmlHTMLAttributes, useState } from 'react'

type ThumbsProps = HtmlHTMLAttributes<HTMLDivElement>
type Thumbs = 'like' | 'deslike'
export const Thumbs = cache(({ className, ...props }: ThumbsProps) => {
  const defaultThumbs = lingos.storage.get('model:thumbs') as Thumbs | null

  const [thumbs, setThumbs] = useState<Thumbs | null>(defaultThumbs)

  const defineThumbs = (dl: Thumbs) => {
    setThumbs((t) => {
      const ndl = t === dl ? null : dl
      lingos.storage.set('model:thumbs', ndl)

      return ndl
    })
  }

  return (
    <div className={cn('flex gap-1 items-center', className)} {...props}>
      <Button
        size="icon"
        variant="outline"
        data-selected={thumbs}
        className="rounded-full text-zinc-500 data-[selected=like]:dark:bg-zinc-700"
        onClick={() => defineThumbs('like')}
      >
        <ThumbsUpIcon className="w-4" />
      </Button>
      <Separator className="h-6 mx-1" orientation="vertical" />
      <Button
        size="icon"
        variant="outline"
        data-selected={thumbs}
        className="rounded-full text-zinc-500 data-[selected=deslike]:dark:bg-zinc-700"
        onClick={() => defineThumbs('deslike')}
      >
        <ThumbsDownIcon className="w-4" />
      </Button>
    </div>
  )
})
