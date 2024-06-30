import { getWordsList } from '@/actions/conversations/get-words-list'
import { Intensive } from '@/components/intensive'
import { SetLang } from '@/components/set-lang'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandList } from '@/components/ui/command'
import { getAuth } from '@/lib/auth/get-auth'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { Locale, imagesSrc, langs, locales } from '@/lib/intl/locales'
import { scoreColor } from '@/lib/score-color'
import { Link } from '@/navigation'
import { ChevronLeftIcon } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { YourPerformance } from '../dashboard/components/welcome/your-performance'
import { CommmandItemComponent, Dialog } from './components/dialog'

const UserProfile = async () => {
  const { user } = await getAuth()

  const t = await getTranslations()

  const wordsListData = await getWordsList()
  const locale = (await getLocale()) as Locale

  const {
    green,
    red,
    yellow,
    count: { wordsPerYear },
    words,
  } = wordsListData

  const getFlagsLocale = () => {
    if (!user) {
      return locales.filter((_, i) => i <= 2)
    }

    return locales.filter(
      (l) => user.locale !== l && user.profile?.localeToLearn !== l,
    )
  }

  const averageScore = Number(
    (
      words.reduce((acc, w) => acc + w.avgAccuracyScore, 0) / words.length
    ).toFixed(0),
  )

  return (
    <div className="mx-auto min-h-full bg-white dark:bg-zinc-900 border md:mb-0 mb-20 border-zinc-200  dark:border-zinc-800 w-full shadow-xl rounded-xl ">
      <div className="bg-[url('/assets/svgs/radiant-gradient.svg')] bg-cover min-h-full h-full p-4 rounded-xl">
        <div className="w-full flex flex-col items-center justify-center h-full">
          <div className="p-4 bg-gradient-to-tr relative from-zinc-800 flex items-end justify-end to-violet-400/10 rounded-xl h-[200px] w-full ">
            <Button
              asChild
              variant="secondary"
              className="absolute top-4 left-4 border border-zinc-700"
            >
              <Link href="/dashboard">
                <ChevronLeftIcon className="w-4 " />
                <span className="hidden ml-2 sm:inline-block">
                  {t('Return to dashboard')}
                </span>
              </Link>
            </Button>
            <Image
              alt="Dog"
              src="/assets/imgs/dog.png"
              width="150"
              height="100"
              className="opacity-15"
            />
          </div>
          <div className=" grid grid-cols-11 flex-wrap items-center justify-start gap-4 w-full mt-4">
            <div className="relative py-4 px-2 md:p-4  col-span-11 md:col-span-4 lg:col-span-3 bg-gradient-to-t from-zinc-800 h-full to-violet-400/30 rounded-xl ">
              <Intensive
                value={0}
                className="flex items-center justify-center absolute -top-2 -right-2 px-4"
              />
              <div className="p-1 rounded-full mx-auto shrink-0 sm:min-w-max min-w-[100px] max-w-min  mt-4 bg-gradient-to-tr from-violet-200 via-violet-600 to-fuchsia-600">
                {user?.image && (
                  <Image
                    alt={user.fullName}
                    src={user.image}
                    width="150"
                    height="150"
                    className="rounded-full"
                  />
                )}
              </div>
              <h3 className="text-xl text-center font-semibold leading-normal mb-2 text-zinc-200 mt-3">
                {user?.fullName}
              </h3>
            </div>
            <div className="bg-gradient-to-tr col-span-11 md:col-span-7 lg:col-span-8  rounded-xl w-full md:w-auto from-zinc-800 to-zinc-800/10   px-1 md:px-4  flex-1">
              <div className="flex  flex-wrap w-full justify-between">
                <div className="mr-4 p-3 text-center flex-1">
                  <span className="text-xl font-bold block uppercase tracking-wide text-green-300">
                    {green.words.length}
                  </span>
                  <span className="text-sm text-zinc-400 inline-block max-w-[180px]">
                    {t('Words with high scores')}
                  </span>
                </div>
                <div className="mr-4 p-3 text-center flex-1">
                  <span className="text-xl font-bold block uppercase tracking-wide text-yellow-200">
                    {yellow.words.length}
                  </span>
                  <span className="text-sm text-zinc-400 inline-block max-w-[180px]">
                    {t('Words with average scores')}
                  </span>
                </div>
                <div className="lg:mr-4 p-3 text-center flex-1">
                  <span className="text-xl font-bold block uppercase tracking-wide text-red-400">
                    {red.words.length}
                  </span>
                  <span className="text-sm text-zinc-400 inline-block max-w-[180px]">
                    {t('Words with low scores')}
                  </span>
                </div>
              </div>

              <YourPerformance
                wordsListData={wordsListData}
                t={t}
                className="[&_#bg]:!bg-none [&_#gradient]:!bg-none !bg-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 w-full mt-4 gap-4">
            <div className="bg-gradient-to-tr col-span-3 md:col-span-1 min-h-[200px] rounded-xl from-zinc-800 to-zinc-800/10 border border-zinc-600 relative">
              <div className="bg-[url('/assets/svgs/bg-700.svg')] h-full w-full relative">
                <div className="bg-[url('/assets/imgs/octopus.png')] bg-[length:150px_100px] lg:bg-[length:200px_130px] opacity-15 bg-center bg-no-repeat h-full w-full absolute top-0 right-0"></div>
                <Badge
                  variant="secondary"
                  className="absolute tracking-wider dark:bg-zinc-600 font-normal top-2 right-2"
                >
                  {t('Disabled')}
                </Badge>
                <div className="z-20 relative h-full flex flex-col justify-between  p-4 pt-8">
                  <h1 className={`${pixelatedFont()} text-3xl`}>
                    {t("We noticed that you still don't have a plan")}
                  </h1>

                  <Button
                    asChild
                    className="border border-pink-600 relative ml-auto mt-8"
                    variant="secondary"
                  >
                    <Link href="/profile/plans">
                      <Badge
                        variant="discount"
                        className="absolute tracking-widest font-normal -top-2 -right-2"
                      >
                        30%
                      </Badge>
                      {t('To create a plan')}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            <div className="col-span-3 md:col-span-1 rounded-xl bg-zinc-800 p-4">
              {user?.profile?.localeToLearn && (
                <>
                  <div className="flex flex-wrap gap-2 justify-between">
                    <div className="flex items-center  gap-2">
                      <Image
                        src={imagesSrc[user.profile.localeToLearn as Locale]}
                        width={100}
                        height={100}
                        className="w-[70px] h-[70px] lg:w-[100px] lg:h-[100px]"
                        alt="Country"
                      />

                      <div>
                        <h1
                          className={`text-xl md:text-2xl ${pixelatedFont()} whitespace-nowrap`}
                        >
                          {langs(t, user.profile.localeToLearn as Locale)}
                        </h1>
                        <div className="mt-2 text-xs  whitespace-nowrap">
                          <span className="text-zinc-400">{wordsPerYear}</span>{' '}
                          /{' '}
                          <span className="text-zinc-400">{words.length}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="p-0.5 rounded-full bg-gradient-to-tr from-orange-800 to-orange-400">
                        <div className="rounded-full bg-zinc-800 py-1 px-4 text-xs">
                          {(words.length / wordsPerYear) * 100 || 0}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h1 className={`${pixelatedFont()} text-xl`}>
                      {t('Learn other languages')}
                    </h1>

                    {getFlagsLocale().map((locale) => (
                      <Button variant="secondary" size="icon" key={locale}>
                        <Image
                          src={imagesSrc[locale]}
                          width={25}
                          height={25}
                          className="w-[25px] h-[25px]"
                          alt="Country"
                        />
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="bg-gradient-to-tr col-span-3 md:col-span-1 rounded-xl from-zinc-800 to-zinc-800/10 ">
              <div className="bg-[url('/assets/svgs/bg-700.svg')] flex flex-col h-full w-full relative p-4">
                <h1 className={`${pixelatedFont()} text-2xl`}>
                  {t('Set a new system language')}
                </h1>
                <div className="flex flex-wrap gap-4 h-full items-start justify-between">
                  <SetLang
                    className="mt-2 dark:bg-zinc-700 dark:hover:bg-zinc-600/50 backdrop-blur-xl"
                    collateral
                  />
                  <div className="self-end">
                    <Image
                      src={imagesSrc[locale]}
                      width={100}
                      height={100}
                      className="w-[70px] h-[70px] lg:w-[100px]  lg:h-[100px]"
                      alt="Country"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            data-color={scoreColor(averageScore)}
            className="mt-4 p-4 rounded-xl w-full bg-gradient-to-tr to-zinc-800  from-zinc-700/20  flex-1 h-full relative"
          >
            <div className=" rounded-xl h-full bg-[url('/assets/imgs/sakura.png')] bg-[100%_100%] bg-no-repeat bg-[length:200px_134px] md:bg-[length:auto] absolute w-full opacity-20"></div>

            <div className="z-20 relative">
              <div className="flex gap-4 justify-between">
                <div>
                  <h1 className={`${pixelatedFont()} text-2xl`}>
                    {t('Words that you had contact with')}
                  </h1>
                  <h2
                    className={`${pixelatedFont()} tracking-wider text-md md:text-lg text-zinc-500`}
                  >
                    {t('Your average score is {points} points', {
                      points: averageScore,
                    })}{' '}
                  </h2>
                </div>
                <Dialog wordsListData={wordsListData} />
              </div>

              <div className="overflow-x-auto w-full">
                <Command className="dark:bg-transparent">
                  <CommandList className="pr-4 [&>div]:flex [&>div]:flex-wrap [&>div]:gap-x-2 overflow-y-hidden max-h-[200px] md:max-h-[340px]">
                    <CommandEmpty>{t('No results found')}.</CommandEmpty>

                    {words.reverse().map((word) => (
                      <CommmandItemComponent
                        variant="popover"
                        word={word}
                        key={word.word}
                        style={{
                          flexBasis: [
                            '16rem',
                            '14rem',
                            '10rem',
                            '20rem',
                            '18rem',
                          ][Math.floor(Math.random() * 5)],
                        }}
                        className="basis-64 grow bg-zinc-900/30 dark:aria-selected:bg-zinc-900/40 backdrop-blur-sm"
                      />
                    ))}
                  </CommandList>
                </Command>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
