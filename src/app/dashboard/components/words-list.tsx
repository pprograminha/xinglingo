import { getWordsList } from '@/components/chat/actions/get-words-list'
import { ScrollArea } from '@/components/ui/scroll-area'
import { scoreColor } from '@/lib/score-color'
import { ArrowDown01, ArrowUp10 } from 'lucide-react'

type WordsListProps = {
  wordsList: Awaited<ReturnType<typeof getWordsList>>
}
export function WordsList({ wordsList }: WordsListProps) {
  return (
    <div className="space-y-8">
      <ScrollArea className="h-[800px] w-full pr-4">
        <div className="gap-4 flex flex-1">
          <div className="w-full">
            <ArrowUp10 className="my-2 mx-1" />
            {wordsList.map((w) => (
              <div className="flex items-center mb-2" key={w.word}>
                <div
                  className="ml-2 space-y-1 border rounded-md p-1 data-[score-color=red]:border-red-400 data-[score-color=green]:border-green-400 data-[score-color=yellow]:border-yellow-400"
                  data-score-color={scoreColor(w.avgAccuracyScore)}
                >
                  <p className="text-sm font-medium leading-none">{w.word}</p>
                </div>
                <div className="ml-auto font-medium">{w.wordCount}</div>
              </div>
            ))}
          </div>
          <div className="w-full">
            <ArrowDown01 className="my-2 mx-1" />
            {wordsList.reverse().map((w) => (
              <div className="flex items-center mb-2" key={w.word}>
                <div
                  className="ml-2 space-y-1 border rounded-md p-1 data-[score-color=red]:border-red-400 data-[score-color=green]:border-green-400 data-[score-color=yellow]:border-yellow-400"
                  data-score-color={scoreColor(w.avgAccuracyScore)}
                >
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
