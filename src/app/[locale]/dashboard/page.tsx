import { Metadata } from 'next'

import { getWordsList } from '@/actions/conversations/get-words-list'
import { ProfileLink } from '@/components/profile-link'
import { Card } from '@/components/ui/card'
import { getAuth } from '@/lib/auth/get-auth'
import { getTranslations } from 'next-intl/server'
import { Goal } from './components/goal'
import { Welcome } from './components/welcome'
import { Tutors } from './components/tutors'

export const metadata: Metadata = {
  title: 'Xinglingo | Dashboard',
  description: 'Xinglingo dashboard',
}

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const wordsListData = await getWordsList()
  const { user } = await getAuth()
  const t = await getTranslations()

  return (
    <>
      <div className="flex-col flex bg-[url('/assets/svgs/bg.svg')] bg-repeat h-full">
        <div className="p-4 md:p-8 flex flex-col h-full overflow-auto">
          <div className="grid gap-4 grid-cols-2 mb-4 flex-1">
            <Welcome t={t} user={user} />
            <Card className="bg-gradient-to-tr col-span-2 md:col-span-1 h-full dark:from-zinc-920 dark:to-zinc-800/70 relative">
              <div className="bg-[url('/assets/svgs/radiant-gradient.svg')] bg-cover rounded-xl h-full">
                <div className="bg-[url('/assets/imgs/sakura.png')] bg-[length:200px_134px] md:bg-[length:auto]  bg-[100%_100%]  h-full w-full bg-no-repeat rounded-xl absolute top-0 left-0 right-0 bottom-0"></div>
                <div className="h-full z-20 relative p-4">
                  <div className="grid">
                    <ProfileLink className="ml-auto max-w-none lg:max-w-xs" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-3">
            <Goal t={t} wordsListData={wordsListData} />
            <Tutors />
          </div>
        </div>
      </div>
    </>
  )
}
