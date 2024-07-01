import { getWordsList } from '@/actions/conversations/get-words-list'
import { Button } from '@/components/ui/button'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { scoreColor } from '@/lib/score-color'
import { Link } from '@/navigation'
import { ChevronRightIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

type WordsListProps = {
  wordsList: Awaited<ReturnType<typeof getWordsList>>['words']
  t: Awaited<ReturnType<typeof getTranslations>>
}

export function WordsList({ wordsList, t }: WordsListProps) {
  const groupedWords = [
    wordsList.reduce(
      (previousValue, word) => {
        let wordIndex =
          previousValue.length - 1 === -1 ? 0 : previousValue.length - 1

        if (
          previousValue[wordIndex] &&
          previousValue[wordIndex].length === 15
        ) {
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
    )[0],
  ].filter(Boolean)

  return (
    <div className="pb-4">
      <h2 className={`text-2xl ${pixelatedFont()}`}>
        {t('Words you have already encountered')}: {wordsList.length}
      </h2>

      {groupedWords.map((words, index) => (
        <div className="w-full flex flex-wrap gap-2" key={index}>
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
      ))}

      <Button variant="secondary" asChild>
        <Link href="/profile" className="mt-4 shadow-md shadow-zinc-900">
          {t('See more')} <ChevronRightIcon className="w-4 ml-2" />
        </Link>
      </Button>
    </div>
  )
}
