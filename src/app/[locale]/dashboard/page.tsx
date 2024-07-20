import { Metadata } from 'next'

import { getWordsList } from '@/actions/conversations/get-words-list'
import { getModels } from '@/actions/models/get-models'
import { getProducts } from '@/actions/stripe/get-products'
import { Bubble } from '@/components/bubble'
import { getAuth } from '@/lib/auth/get-auth'
import { getTranslations } from 'next-intl/server'
import { Petutors } from './components/petutors'
import { Sakura } from './components/sakura'
import { Welcome } from './components/welcome'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()

  const metadata: Metadata = {
    title: t('Dashboard'),
  }

  return metadata
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
          {/* grid gap-4 grid-cols-4 lg:grid-cols-3 */}
          <div className="">
            {/* <Goal t={t} wordsListData={wordsListData} /> */}
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
