import { getWordsList } from '@/actions/conversations/get-words-list'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { scoreColor } from '@/lib/score-color'
import { getTranslations } from 'next-intl/server'

type WordsListProps = {
  wordsList: Awaited<ReturnType<typeof getWordsList>>['words']
  t: Awaited<ReturnType<typeof getTranslations>>
}

export function WordsList({ wordsList, t }: WordsListProps) {
  const groupedWords = wordsList.reduce(
    (previousValue, word) => {
      let wordIndex =
        previousValue.length - 1 === -1 ? 0 : previousValue.length - 1

      if (previousValue[wordIndex] && previousValue[wordIndex].length === 15) {
        wordIndex += 1
      }

      if (!previousValue[wordIndex]) {
        previousValue[wordIndex] = []
      }

      if (previousValue[wordIndex].length < 15) {
        previousValue[wordIndex] = [...previousValue[wordIndex], word]
      }

      return [...previousValue]
    },
    [] as (typeof wordsList)[],
  )

  return (
    <div className="pb-4">
      <h2 className={`text-2xl ${pixelatedFont()}`}>
        {t('Words you have already encountered')}: {wordsList.length}
      </h2>

      <Carousel className="w-full mt-2 pb-6 select-none cursor-grab active:cursor-grabbing">
        <CarouselContent>
          {groupedWords.map((words, index) => (
            <CarouselItem key={index}>
              <div className="w-full flex flex-wrap gap-2">
                {words.map((w) => (
                  <div className="flex items-center" key={w.word}>
                    <div
                      className="font-medium dark:bg-zinc-900 flex gap-1 items-center border rounded-md py-1 px-2 data-[score-color=red]:border-red-400 data-[score-color=green]:border-green-400 text-zinc-300 text-xs data-[score-color=yellow]:border-yellow-400"
                      data-score-color={scoreColor(w.avgAccuracyScore)}
                    >
                      <p className="leading-none">{w.word}</p>
                      <span>{w.wordCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-1/2 -translate-x-[110%] top-full" />
        <CarouselNext className="right-1/2 translate-x-[110%] top-full" />
      </Carousel>
    </div>
  )
}
