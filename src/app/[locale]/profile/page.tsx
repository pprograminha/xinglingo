import { getWordsList } from '@/actions/conversations/get-words-list'
import { getAuth } from '@/lib/auth/get-auth'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { YourPerformance } from '../dashboard/components/welcome/your-performance'

const UserProfile = async () => {
  const { user } = await getAuth()

  const t = await getTranslations()

  const wordsListData = await getWordsList()

  const { green, red, yellow } = wordsListData

  return (
    <div className="mx-auto min-h-full bg-white dark:bg-zinc-900 border border-zinc-200  dark:border-zinc-800 w-full shadow-xl rounded-xl ">
      <div className="bg-[url('/assets/svgs/radiant-gradient.svg')] bg-cover min-h-full p-4 rounded-xl">
        <div className="w-full flex flex-col items-center justify-center">
          <div className="p-4 bg-gradient-to-tr from-zinc-800 flex items-end justify-end to-violet-400/10 rounded-xl h-[200px] w-full ">
            <Image
              alt="Dog"
              src="/assets/imgs/dog.png"
              width="150"
              height="150"
              className="opacity-15"
            />
          </div>

          <div className=" grid grid-cols-11 flex-wrap items-center justify-start gap-4 w-full mt-4">
            <div className="p-4 col-span-11 md:col-span-4 lg:col-span-3 bg-gradient-to-t from-zinc-800 h-full to-violet-400/30 rounded-xl ">
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
            <div className="bg-gradient-to-tr col-span-11 md:col-span-7 lg:col-span-8  rounded-xl w-full md:w-auto from-zinc-800 to-zinc-800/10   px-4 text-center flex-1">
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
        </div>
        {/* <div className="text-center mt-12">
          <div className="text-sm leading-normal mt-0 mb-2 text-zinc-400 font-bold uppercase">
            {t('Your average score is')}{' '}
            <span>
              {(
                words.reduce((acc, w) => acc + w.avgAccuracyScore, 0) /
                words.length
              ).toFixed(2)}
            </span>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default UserProfile
