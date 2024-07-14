import { Metadata } from 'next'

import { getWordsList } from '@/actions/conversations/get-words-list'
import { getAuth } from '@/lib/auth/get-auth'
import { getTranslations } from 'next-intl/server'
import { Goal } from './components/goal'
import { Sakura } from './components/sakura'
import { Welcome } from './components/welcome'
import { Petutors } from './components/petutors'
import { Bubble } from '@/components/bubble'
import { getModels } from '@/actions/models/get-models'
import { getProducts } from '@/actions/stripe/get-products'

export const metadata: Metadata = {
  title: 'Xinglingo | Dashboard',
  description: 'Xinglingo dashboard',
}

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const { user } = await getAuth()

  const [wordsListData, modelsData, t, products] = await Promise.all([
    getWordsList(),
    getModels(user),
    getTranslations(),
    getProducts(),
  ])

  return (
    <>
      <div className="flex-col flex bg-[url('/assets/svgs/bg.svg')] bg-repeat h-full">
        <div className="p-4 md:p-8 flex flex-col h-full overflow-auto">
          <div className="grid gap-4 grid-cols-2 mb-4 flex-1">
            <Welcome
              t={t}
              user={user}
              wordsListData={wordsListData}
              modelsData={modelsData}
              products={products}
            />
            <Sakura t={t} user={user} products={products} />
          </div>

          <div className="grid gap-4 grid-cols-4 lg:grid-cols-3">
            <Goal t={t} wordsListData={wordsListData} />
            <Petutors
              t={t}
              user={user}
              modelsData={modelsData}
              products={products}
            />
          </div>
        </div>
      </div>
      <Bubble />
    </>
  )
}
