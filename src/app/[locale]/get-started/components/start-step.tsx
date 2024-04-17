import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { Combobox } from './combobox'

type StartStepProps = {
  t: Awaited<ReturnType<typeof getTranslations>>
}

export const StartStep = ({ t }: StartStepProps) => {
  return (
    <div className="container m-auto px-6 pt-32 md:px-12 lg:pt-[4.8rem] lg:px-7 h-full">
      <div className="flex items-center justify-between px-2 md:px-0 h-full">
        <div className="relative lg:w-6/12 lg:py-24 xl:py-32">
          <div>
            <h1 className="font-bold text-4xl dark:text-yellow-50 md:text-5xl lg:w-10/12">
              {t('Find the right AI tutor for you.')}
            </h1>
            <p className="mt-8 text-zinc-700 dark:text-zinc-200 lg:w-10/12">
              {t(
                'Tell us how you’d like to learn to get a personalized choice of AI tutors',
              )}
            </p>
          </div>
          <div className="mt-10 w-full flex flex-col">
            <span>{t('What do you want to learn?')}</span>
            <form className="mt-2 flex gap-2 items-center flex-col md:flex-row w-full">
              <Combobox />
              <Button className="flex gap-2 font-bold p-6 dark:bg-green-300 hover:dark:bg-green-400 md:w-auto w-full">
                {t('Get started')}
                <ArrowRight />
              </Button>
            </form>
          </div>
        </div>

        <div className="lg:block hidden">
          <Image
            src="/assets/panda.png"
            alt={t('Get started')}
            width={650}
            height={650}
          />
        </div>
      </div>
    </div>
  )
}
