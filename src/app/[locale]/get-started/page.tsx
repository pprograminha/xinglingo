import { getTranslations } from 'next-intl/server'
import { LangLevelStep } from './components/lang-level-step'

const GetStarted = async () => {
  const t = await getTranslations()

  return (
    <>
      <div className="relative bg-yellow-50 dark:bg-zinc-900 h-screen">
        {/* <StartStep t={t} /> */}
        <LangLevelStep t={t} />
        <div className="bg-[url('/assets/chat-bg.svg')] -z-0 absolute bg-contain top-0 left-0 bottom-0 right-0" />
      </div>
    </>
  )
}

export default GetStarted
