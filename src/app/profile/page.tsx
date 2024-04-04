import { getWordsList } from '@/actions/conversations/get-words-list'
import { getAuth } from '@/lib/auth/get-auth'
import { DailyWords } from '@/modules/dashboard/components/daily-words'
import Image from 'next/image'
import { redirect } from 'next/navigation'

const UserProfile = async () => {
  const { user } = await getAuth()

  if (!user) redirect('/')

  const { green, red, yellow, words } = await getWordsList({
    user,
  })

  return (
    <section className="h-screen">
      <div className="w-full lg:w-4/6 px-4 pb-8 mx-auto">
        <div className="relative flex flex-col min-w-0 break-words bg-white dark:bg-zinc-950 w-full mb-6 shadow-xl rounded-lg mt-24">
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
                      className="shadow-xl rounded-full -mt-16"
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
                      Palavras com melhores pontuações
                    </span>
                  </div>
                  <div className="mr-4 p-3 text-center">
                    <span className="text-xl font-bold block uppercase tracking-wide text-yellow-200">
                      {yellow.words.length}
                    </span>
                    <span className="text-sm text-zinc-400">
                      {' '}
                      Palavras com pontuações medianas
                    </span>
                  </div>
                  <div className="lg:mr-4 p-3 text-center">
                    <span className="text-xl font-bold block uppercase tracking-wide text-red-400">
                      {red.words.length}
                    </span>
                    <span className="text-sm text-zinc-400">
                      {' '}
                      Palavras com as piores pontuações
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
                Sua pontuação média é de{' '}
                <span>
                  {(
                    words.reduce((acc, w) => acc + w.avgAccuracyScore, 0) /
                    words.length
                  ).toFixed(2)}
                </span>
              </div>
              <div className="mb-2 text-zinc-600 mt-10">
                <i className="fas fa-briefcase mr-2 text-lg text-zinc-400" />
                Solution Manager - Creative Tim Officer
              </div>
              <div className="mb-2 text-zinc-600">
                <i className="fas fa-university mr-2 text-lg text-zinc-400" />
                University of Computer Science
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
    </section>
  )
}

export default UserProfile
