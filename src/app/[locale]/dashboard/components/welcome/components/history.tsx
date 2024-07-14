import { getWordsList } from '@/actions/conversations/get-words-list'
import { getModels } from '@/actions/models/get-models'
import { User } from '@/lib/db/drizzle/types'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { getTranslations } from 'next-intl/server'
import { YourPerformance } from '../your-performance'
import { Petutor } from './petutor'
import { getProducts } from '@/actions/stripe/get-products'

type HistoryProps = {
  t: Awaited<ReturnType<typeof getTranslations>>
  user: User | null
  modelsData: Awaited<ReturnType<typeof getModels>>
  products: Awaited<ReturnType<typeof getProducts>>

  wordsListData: Awaited<ReturnType<typeof getWordsList>>
}
export const History = ({
  modelsData,
  t,
  user,
  products,
  wordsListData,
}: HistoryProps) => {
  return (
    <div>
      <h1 className={`text-4xl my-4 md:text-5xl ${pixelatedFont()}`}>
        {t('Welcome!! {userFullName}', {
          userFullName: user?.fullName,
        })}
      </h1>

      <div className="flex flex-col lg:flex-row justify-between items-start gap-2 lg:gap-4">
        <div>
          <div className="flex flex-col gap-2">
            <h2 className={`text-zinc-400 text-2xl ${pixelatedFont()}`}>
              {!modelsData.recommended
                ? t('Continue where you left off?')
                : t('Recommended (plural)')}
            </h2>
          </div>
          <div className="flex flex-wrap md:flex-nowrap md:w-[210px] mt-6 gap-1 md:gap-0">
            {modelsData.histories.map((history, i) => (
              <Petutor
                key={history.id}
                history={history}
                index={i}
                products={products}
                modelsData={modelsData}
                user={user}
              />
            ))}
          </div>
        </div>
        <YourPerformance t={t} wordsListData={wordsListData} />
      </div>
    </div>
  )
}
