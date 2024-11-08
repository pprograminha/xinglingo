'use client'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { usePathname, useRouter } from '@/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Unit } from '../page'
import { Section } from './section'
import { UnitForm } from './unit-form'

type UnitsProps = {
  units: Unit[]
  currentModelId: string
}

export const Units = ({ units: defaultUnits, currentModelId }: UnitsProps) => {
  const { permissions } = useAuth()
  const router = useRouter()
  const [units, setUnits] = useState(
    defaultUnits.filter((unit) => unit.sections.length !== 0),
  )
  const t = useTranslations()
  const pathname = usePathname()

  const currentSection = (unit: Unit) => unit.sections.find((s) => s.current)
  const currentLesson = (section: Unit['sections'][number]) =>
    section.lessons.find((l) => l.current)

  const hasSomeLessonCompleted = (unit: Unit) =>
    unit.sections.some((s) => s.lessons.some((l) => l.completed))

  return (
    <div className="md:min-h-full md:h-full overflow-auto md:max-w-xl w-full rounded-xl mx-auto scrollbar-hide mt-4 md:mt-0">
      <div className="flex flex-col justify-center  gap-2 items-center ">
        {units.map((unit) => (
          <div
            key={unit.id}
            className=" w-full border rounded-xl border-zinc-800 bg-zinc-800/30 p-4 pb-6 relative"
          >
            {((unit.numbering || 0) - 1) % 5 === 0 && (
              <div className="bg-[url('/assets/imgs/sakura.png')] bg-[100%_100%] bg-no-repeat bg-[length:200px_134px] h-full w-full absolute top-0 left-0 opacity-20" />
            )}
            <div className="z-10 relative flex flex-col items-center justify-center">
              <div className="p-4 mb-6 flex justify-between gap-4 flex-wrap items-center border rounded-xl w-full border-zinc-800">
                <div>
                  <p className="uppercase text-xs text-zinc-500 font-bold">
                    {t('Section {count}, Unit {unitCount}', {
                      count: unit.sections.find((s) => s.current)?.numbering,
                      unitCount: unit.numbering,
                    })}
                  </p>
                  <h1 className={`${pixelatedFont()} text-3xl`}>
                    {unit.title.root.data.text}
                  </h1>
                </div>
                <Button
                  variant="secondary"
                  onClick={() =>
                    router.push(`${pathname}/${currentSection(unit)?.id}`)
                  }
                >
                  {hasSomeLessonCompleted(unit) ? t('Continue') : t('Start')}
                </Button>
              </div>
              {unit.sections.map((section, si) => (
                <Section
                  t={t}
                  onRedirect={() =>
                    currentLesson(section) &&
                    router.push(
                      `${pathname}/${section.id}/${currentLesson(section)!.id}`,
                    )
                  }
                  key={section.id}
                  onUnits={setUnits}
                  section={section}
                  sectionIndex={si}
                  units={units}
                  unit={unit}
                />
              ))}
              {permissions.CAN_ADD_AND_UPDATE && (
                <UnitForm units={[unit]} currentModelId={currentModelId} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
