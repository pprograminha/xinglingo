import { getWordMetrics } from '@/components/chat/actions'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowDown10, ArrowUp01 } from 'lucide-react'

type WordMetricsProps = {
  wordMetrics: Awaited<ReturnType<typeof getWordMetrics>>
}
export function WordMetrics({ wordMetrics }: WordMetricsProps) {
  return (
    <div className="space-y-8">
      <ScrollArea className="h-[300px] w-full pr-4">
        <div className="gap-4 flex flex-1">
          <div className="w-full">
            <ArrowUp01 className="my-2 mx-1" />
            {wordMetrics.map((w) => (
              <div className="flex items-center mb-2" key={w.word}>
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{w.word[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="ml-2 space-y-1">
                  <p className="text-sm font-medium leading-none">{w.word}</p>
                </div>
                <div className="ml-auto font-medium">{w.wordCount}</div>
              </div>
            ))}
          </div>
          <div className="w-full">
            <ArrowDown10 className="my-2 mx-1" />
            {wordMetrics.reverse().map((w) => (
              <div className="flex items-center mb-2" key={w.word}>
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{w.word[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="ml-2 space-y-1">
                  <p className="text-sm font-medium leading-none">{w.word}</p>
                </div>
                <div className="ml-auto font-medium">{w.wordCount}</div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
