import { getWordsList } from '@/actions/conversations/get-words-list'
import { getAuth } from '@/lib/auth/get-auth'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { DailyWords } from '../dashboard/components/daily-words'
import { getTranslations } from 'next-intl/server'

const UserProfile = async () => {
  const { user } = await getAuth()

  if (!user) redirect('/')

  const t = await getTranslations()

  const { green, red, yellow, words } = await getWordsList({
    user,
  })

  return (
    <div className="h-full p-2 md:p-4 w-full bg-white dark:bg-zinc-900">
      <div className="mx-auto h-full overflow-y-auto  bg-white dark:bg-zinc-950 border border-zinc-200  dark:border-zinc-800 w-full shadow-xl rounded-lg ">
        <div className="relative flex flex-col min-w-0 break-words ">
          <div className="px-6">
            <div className="flex flex-wrap justify-center">
              <div className="w-full px-4 flex justify-center">
                <div className="relative">
                  {user.image && (
                    <Image
                      alt={user.fullName}
                      src={user.image}
                      width="150"
                      height="150"
                      className="shadow-xl rounded-full mt-4"
                    />
                  )}
                </div>
              </div>
              <div className="w-full px-4 text-center mt-20">
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
            </div>
            <div className="text-center mt-12">
              <h3 className="text-xl font-semibold leading-normal mb-2 text-zinc-700">
                {user.fullName}
              </h3>
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
            <div className="mt-10 py-10 border-t border-zinc-200 text-center">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-9/12 px-4">
                  <DailyWords
                    greenWords={green.words}
                    redWords={red.words}
                    yellowWords={yellow.words}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
