import { getLanguages } from '@/actions/languages/get-langs'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { getTranslations } from 'next-intl/server'
import { ContainerLanguage } from './components/container-language'
import { withSubscription } from '@/lib/subscription/with-subscription'

export const revalidate = 3600

export default async function LanguagesPage() {
  await withSubscription('/profile')
  const languages = await getLanguages()
  const t = await getTranslations()

  return (
    <section className="min-h-full w-full overflow-x-auto bg-zinc-900 border border-zinc-800 rounded-xl items-center justify-center md:mb-0 mb-20">
      <div className="bg-[url('/assets/svgs/radiant-gradient.svg')] bg-cover min-h-full h-full p-4 rounded-xl">
        <div className="mb-6">
          <h1 className={`${pixelatedFont.className} text-4xl`}>
            {t('Select a new language to learn')}
          </h1>
          <p className="text-xs text-zinc-400 mt-2">
            {t('All languages are available to you')}
          </p>
        </div>
        <ContainerLanguage languages={languages} />
      </div>
    </section>
  )
}
