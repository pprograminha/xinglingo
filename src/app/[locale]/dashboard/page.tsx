import { Metadata } from 'next'

import { getWordsList } from '@/actions/conversations/get-words-list'
import { getAuth } from '@/lib/auth/get-auth'
import { getTranslations } from 'next-intl/server'
import { Goal } from './components/goal'
import { Sakura } from './components/sakura'
import { Welcome } from './components/welcome'
import { Petutors } from './components/petutors'
import { Bubble } from '@/components/bubble'

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
            <Welcome t={t} user={user} wordsListData={wordsListData} />
            <Sakura t={t} />
          </div>

          <div className="grid gap-4 grid-cols-4 lg:grid-cols-3">
            <Goal t={t} wordsListData={wordsListData} />
            <Petutors t={t} />
          </div>
        </div>
      </div>
      <Bubble />
    </>
  )
}
