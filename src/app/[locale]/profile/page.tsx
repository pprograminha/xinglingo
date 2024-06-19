import { getWordsList } from '@/actions/conversations/get-words-list'
import { getAuth } from '@/lib/auth/get-auth'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

const UserProfile = async () => {
  const { user } = await getAuth()

  const t = await getTranslations()

  const { green, red, yellow, words } = await getWordsList()

  return (
    <div className="mx-auto min-h-full bg-white dark:bg-zinc-900 border border-zinc-200  dark:border-zinc-800 w-full shadow-xl rounded-xl ">
      <div className="bg-[url('/assets/svgs/radiant-gradient.svg')] bg-cover min-h-full p-4 rounded-xl">
        <div className="w-full flex flex-col items-center justify-center">
          <div className="p-4 bg-gradient-to-tr from-zinc-800 to-violet-400/10 backdrop-blur-md rounded-xl h-[200px] w-full "></div>
          <div className="relative">
            <div className="p-1 rounded-full  mt-4 bg-gradient-to-tr from-violet-200 via-violet-600 to-fuchsia-600">
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
          </div>
          <h3 className="text-xl font-semibold leading-normal mb-2 text-zinc-200 mt-3">
            {user?.fullName}
          </h3>
        </div>
        <div className="w-full px-4 text-center mt-6">
          <div className="flex justify-center py-4 lg:pt-4 pt-8">
            <div className="mr-4 p-3 text-center">
              <span className="text-xl font-bold block uppercase tracking-wide text-green-300">
                {green.words.length}
              </span>
              <span className="text-sm text-zinc-400">
                {t('Words with high scores')}
              </span>
            </div>
            <div className="mr-4 p-3 text-center">
              <span className="text-xl font-bold block uppercase tracking-wide text-yellow-200">
                {yellow.words.length}
              </span>
              <span className="text-sm text-zinc-400">
                {t('Words with average scores')}
              </span>
            </div>
            <div className="lg:mr-4 p-3 text-center">
              <span className="text-xl font-bold block uppercase tracking-wide text-red-400">
                {red.words.length}
              </span>
              <span className="text-sm text-zinc-400">
                {t('Words with low scores')}
              </span>
            </div>
          </div>
        </div>
        <div className="text-center mt-12">
          <div className="text-sm leading-normal mt-0 mb-2 text-zinc-400 font-bold uppercase">
            {t('Your average score is')}{' '}
            <span>
              {(
                words.reduce((acc, w) => acc + w.avgAccuracyScore, 0) /
                words.length
              ).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
