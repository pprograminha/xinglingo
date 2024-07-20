'use client'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { BookOpenIcon, PuzzleIcon } from 'lucide-react'
import { CSSProperties } from 'react'
import { Unit } from '../page'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

type UnitsProps = {
  units: Unit[]
}
export const Units = ({ units }: UnitsProps) => {
  const t = useTranslations()

  const icons = {
    default: <PuzzleIcon />,
    book: <BookOpenIcon />,
  }

  const filteredUnits = units.filter((unit) => unit.sections.length !== 0)

  return (
    <div className="md:min-h-full md:h-full overflow-auto md:max-w-xl w-full rounded-xl mx-auto scrollbar-hide mt-4 md:mt-0">
      <div className="flex flex-col justify-center  gap-2 items-center ">
        {filteredUnits.map((unit) => (
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
                    {unit.title}
                  </h1>
                </div>
                <Button variant="secondary">{t('Continue')}</Button>
              </div>
              {unit.sections.map((section, si) => {
                const sectionStyle = unit.sections.map((_, i) => {
                  return {
                    marginTop: `${[i === 0 ? 0 : 7, 7, 14, 14, 7, 7, 14, 14][i % 8]}px`,
                    left: `${[0, 45, 70, 45, 0, -45, -70, -45][i % 8]}px`,
                  } as CSSProperties
                })

                return (
                  <div
                    className="flex flex-col items-baseline relative"
                    style={sectionStyle[si]}
                    key={section.id}
                  >
                    {si === 0 && (
                      <div className="border-2 relative overflow-visible inline-block rounded-md dark:bg-zinc-700 border-zinc-600 px-4 animate-bounce">
                        <p
                          className={`uppercase font-bold text-xl text-violet-500 tracking-wider  ${pixelatedFont()}`}
                        >
                          {t('Start')}
                        </p>
                        <div className="absolute left-1/2 -translate-x-1/2 rotate-45 w-2 h-2 border-b border-r border-zinc-600 -bottom-1 dark:bg-zinc-700" />
                      </div>
                    )}
                    <button
                      className="rounded-full data-[current=true]:p-2 data-[current=true]:bg-zinc-700 group"
                      data-current={section.current}
                    >
                      <div className="rounded-full group-data-[current=true]:p-1.5 group-data-[current=true]:pb-3.5 group-data-[current=true]:bg-zinc-800 relative">
                        <div className="rounded-[50%_/_50%] rounded-t-3xl h-[57px] w-[70px] group-data-[current=true]:bg-violet-600 bg-zinc-700/50 absolute translate-y-2"></div>
                        <div className="rounded-[50%_/_50%] h-[57px] w-[70px]  group-data-[current=true]:text-white text-violet-500 group-data-[current=true]:bg-violet-400 bg-zinc-700 relative z-10 group-hover:transform group-hover:translate-y-[1.5px] flex items-center justify-center p-4">
                          {icons[section.variant]}
                        </div>
                      </div>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
