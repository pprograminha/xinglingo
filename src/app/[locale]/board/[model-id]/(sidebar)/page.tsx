import { getWordsList } from '@/actions/conversations/get-words-list'
import { Offensive } from '@/components/offensive'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { getAuth } from '@/lib/auth/get-auth'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { langs, Locale, localeImages } from '@/lib/intl/locales'
import { Link, redirect } from '@/navigation'
import { GraduationCapIcon } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { Units } from '../components/units'
import { getModels } from '@/actions/models/get-models'
import { getUnits } from '@/actions/units/get-units'
import { getCurrentLocale } from '@/lib/intl/get-current-locale'

export type Unit = Awaited<ReturnType<typeof getUnits>>[number]

type ModelsProps = {
  params: Promise<{
    'model-id': string
  }>
}
export default async function Models({ params: paramsPromise }: ModelsProps) {
  const { user } = await getAuth()

  const params = await paramsPromise

  const modelsData = await getModels(user)
  const modelExists = modelsData.models.some((m) => m.id === params['model-id'])

  if (!modelExists) {
    redirect({
      href: `/model`,
      locale: await getCurrentLocale(),
    })
  }

  const {
    count: { offensive, progress },
  } = await getWordsList()
  const t = await getTranslations()

  const locale = await getLocale()

  const units = await getUnits({
    modelId: params['model-id'],
    locale,
  })

  return (
    <div className="gap-4 md:p-8 p-2 min-h-full h-full">
      <div className="h-full min-h-full md:flex md:gap-4 md:flex-row-reverse">
        <div className="flex flex-col gap-2 w-full">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full flex justify-between items-center p-4">
            <div className="flex gap-2 items-center ml-auto">
              <Offensive value={offensive} />
            </div>
          </div>
          {user && user.profile && (
            <div className="bg-zinc-800/30 border border-zinc-800 rounded-xl w-full p-4">
              <div className="flex flex-wrap gap-x-4 items-center">
                <Image
                  src={localeImages[user.profile.localeToLearn as Locale]}
                  alt="Country flag"
                  width={100}
                  height={100}
                />
                <div>
                  <h1
                    className={`${pixelatedFont.className} text-xl md:text-3xl`}
                  >
                    {t('You are learning {lang}', {
                      lang: langs(t, user.profile.localeToLearn as Locale),
                    })}
                  </h1>
                  <p className="text-xs text-zinc-600">
                    {t.rich(
                      'Do you want to learn another language? Click here',
                      {
                        link: (message) => (
                          <Link
                            href="/languages"
                            className="hover:underline text-green-600"
                          >
                            {message}
                          </Link>
                        ),
                      },
                    )}
                  </p>
                </div>
              </div>

              <Separator className="my-2" />

              <div className="flex flex-col gap-4">
                <div className="flex gap-2 items-center text-orange-500">
                  <GraduationCapIcon />
                  <h1
                    className={`${pixelatedFont.className} text-xl md:text-3xl`}
                  >
                    {t('Your progress')}
                  </h1>
                </div>
                <div>
                  <span className="text-xs text-zinc-500">{progress}%</span>
                  <Progress
                    value={progress}
                    indicatorClassName="dark:bg-orange-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <Units units={units} />
      </div>
    </div>
  )
}
