'use client'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { BookOpenIcon, PuzzleIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { CSSProperties, useState } from 'react'
import { Unit } from '../page'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { lingos } from '@/lib/storage/local'

type SectionProps = {
  t: Awaited<ReturnType<typeof getTranslations>>
  unit: Unit
  units: Unit[]
  section: Unit['sections'][number]
  sectionIndex: number
  onRedirect: () => void
  onUnits: (units: Unit[]) => void
}

type PopoverHandlerData = {
  unit: Unit
  section: Unit['sections'][number]
}

export const Section = ({
  t,
  unit,
  section,
  sectionIndex,
  units,
  onRedirect,
  onUnits,
}: SectionProps) => {
  const [isOpen, setIsOpen] = useState<boolean | undefined>(undefined)
  const sectionStyle = unit.sections.map((_, i) => {
    return {
      marginTop: `${[i === 0 ? 0 : 7, 7, 14, 14, 7, 7, 14, 14][i % 8]}px`,
      left: `${[0, 45, 70, 45, 0, -45, -70, -45][i % 8]}px`,
    } as CSSProperties
  })

  const icons = {
    default: <PuzzleIcon />,
    book: <BookOpenIcon />,
  }

  const popoverHandler = (data: PopoverHandlerData) => {
    const unitIndex = units.findIndex((u) => u.id === data.unit.id)
    const sectionIndex = data.unit.sections.findIndex(
      (s) => s.id === data.section.id,
    )

    units[unitIndex].sections = units[unitIndex].sections.map((s) => ({
      ...s,
      current: false,
    }))

    units[unitIndex].sections[sectionIndex] = {
      ...data.section,
      current: true,
    }

    units[unitIndex] = {
      ...data.unit,
      sections: [...units[unitIndex].sections],
    }

    onUnits([...units])
  }

  const startHandler = (section: Unit['sections'][number]) => {
    lingos.storage.set('unit:section', section)

    onRedirect()
  }

  return (
    <div
      className="flex flex-col items-baseline relative"
      style={sectionStyle[sectionIndex]}
      key={section.id}
    >
      {section.current && (
        <div className="border-2 relative overflow-visible inline-block rounded-md dark:bg-zinc-700 border-zinc-600 px-4 animate-bounce">
          <p
            className={`uppercase font-bold text-xl text-violet-500 tracking-wider  ${pixelatedFont()}`}
          >
            {t('Start')}
          </p>
          <div className="absolute left-1/2 -translate-x-1/2 rotate-45 w-2 h-2 border-b border-r border-zinc-600 -bottom-1 dark:bg-zinc-700" />
        </div>
      )}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            onClick={() => popoverHandler({ unit, section })}
            className="rounded-full data-[colored=true]:p-2 data-[colored=true]:bg-zinc-700 data-[current=false]:!p-0 data-[current=false]:!bg-transparent group"
            data-current={section.current}
            data-completed={section.current}
            data-colored={section.current || section.completed}
          >
            <div className="rounded-full group-data-[colored=true]:p-1.5 group-data-[colored=true]:pb-3.5 group-data-[colored=true]:bg-zinc-800 group-data-[current=false]:!p-0 relative">
              <div className="rounded-[50%_/_50%] rounded-t-3xl h-[57px] w-[70px] group-data-[colored=true]:bg-violet-600 bg-zinc-700/50 absolute translate-y-2"></div>
              <div className="rounded-[50%_/_50%] h-[57px] w-[70px]  group-data-[colored=true]:text-white text-violet-500 group-data-[colored=true]:bg-violet-400 bg-zinc-700 relative z-10 group-hover:transform group-hover:translate-y-[1.5px] flex items-center justify-center p-4">
                {icons[section.variant]}
              </div>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 dark:bg-zinc-800 dark:border-zinc-700/60 rounded-xl">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4
                className={`text-2xl tracking-wide leading-none mb-3 ${pixelatedFont()}`}
              >
                {section.title.root.data.text}
              </h4>
              <div className="flex flex-col-reverse gap-2 items-baseline">
                <span className="text-xs text-zinc-500 inline-block border border-zinc-700 rounded-md py-1 px-2">
                  {(
                    (section.lessonsCompletedCount / section.lessonsCount) *
                      100 || 0
                  ).toFixed(2)}
                  %
                </span>
                <Progress
                  value={
                    (section.lessonsCompletedCount / section.lessonsCount) * 100
                  }
                />
              </div>
            </div>
            <Button
              variant="secondary"
              className="dark:bg-violet-400 hover:dark:bg-violet-500 mx-1"
              onClick={() => startHandler(section)}
            >
              {t('Start')}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
