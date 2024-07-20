import { getWordsList } from '@/actions/conversations/get-words-list'
import { Offensive } from '@/components/offensive'
import { getAuth } from '@/lib/auth/get-auth'
import { langs, Locale, localeImages } from '@/lib/intl/locales'
import Image from 'next/image'
import { Units } from './components/units'
import { getTranslations } from 'next-intl/server'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { Link } from '@/navigation'
import { Separator } from '@/components/ui/separator'
import { GraduationCapIcon } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export type Unit = {
  id: string
  title: string
  numbering?: number
  current: boolean
  sections: {
    id: string
    current: boolean
    numbering?: number
    variant: 'default' | 'book'
  }[]
}

export default async function Models() {
  // const pathname = usePathname()

  const {
    count: { offensive, progress },
  } = await getWordsList()
  const { user } = await getAuth()
  const t = await getTranslations()

  const units: Unit[] = [
    {
      id: '56783229873872564371',

      current: true,
      title: 'Anything',
      sections: [
        {
          id: '56783229873872564371',
          current: true,
          variant: 'default' as const, //  book | default
        },
        {
          id: '56754872378576846782',
          current: false,
          variant: 'book' as const, //  book | default
        },
        {
          id: '56754872378576846784',
          current: false,
          variant: 'default' as const, //  book | default
        },
        {
          id: '567548723785743846384',
          current: false,
          variant: 'book' as const, //  book | default
        },
        {
          id: '5675487323785743846384',
          current: false,
          variant: 'default' as const, //  book | default
        },
        {
          id: '567548722323785743846384',
          current: false,
          variant: 'default' as const, //  book | default
        },
        {
          id: '5675487223323785743846384',
          current: false,
          variant: 'book' as const, //  book | default
        },
        {
          id: '567553323785743846384',
          current: false,
          variant: 'book' as const, //  book | default
        },
        {
          id: '567553324435743846384',
          current: false,
          variant: 'book' as const, //  book | default
        },
      ],
    },
    {
      id: '56754872378576846782',
      current: false,
      title: 'Anything',
      sections: [
        {
          id: '56783229873872564371',
          current: true,
          variant: 'default' as const, //  book | default
        },
        {
          id: '56754872378576846782',
          current: false,
          variant: 'book' as const, //  book | default
        },
        {
          id: '56754872378576846784',
          current: false,
          variant: 'default' as const, //  book | default
        },
        {
          id: '567548723785743846384',
          current: false,
          variant: 'book' as const, //  book | default
        },
        {
          id: '5675487323785743846384',
          current: false,
          variant: 'default' as const, //  book | default
        },
        {
          id: '567548722323785743846384',
          current: false,
          variant: 'default' as const, //  book | default
        },
        {
          id: '5675487223323785743846384',
          current: false,
          variant: 'book' as const, //  book | default
        },
        {
          id: '567553323785743846384',
          current: false,
          variant: 'book' as const, //  book | default
        },
        {
          id: '567553324435743846384',
          current: false,
          variant: 'book' as const, //  book | default
        },
      ],
    },
    {
      id: '56754872378576846784',
      current: false,
      title: 'Anything',

      sections: [],
    },
    {
      id: '567548723785743846384',
      current: false,
      title: 'Anything',

      sections: [],
    },
    {
      id: '5675487323785743846384',
      current: false,
      title: 'Anything',

      sections: [],
    },
    {
      id: '567548722323785743846384',
      current: false,
      title: 'Anything',

      sections: [],
    },
    {
      id: '5675487223323785743846384',
      current: false,
      title: 'Anything',

      sections: [],
    },
    {
      id: '567553323785743846384',
      current: false,
      title: 'Anything',

      sections: [],
    },
    {
      id: '567553324435743846384',
      current: false,
      title: 'Anything',

      sections: [],
    },
  ].map((u, i) => ({
    ...u,
    sections: u.sections.map((s, i) => ({
      ...s,
      numbering: i + 1,
    })),
    numbering: i + 1,
  }))

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
                  <h1 className={`${pixelatedFont()} text-xl md:text-3xl`}>
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
                  <h1 className={`${pixelatedFont()} text-xl md:text-3xl`}>
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
