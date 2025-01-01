import { createHistory } from '@/actions/models/create-history'
import { getModels } from '@/actions/models/get-models'
import { getProducts } from '@/actions/stripe/get-products'
import { ButtonWithAccessChecker } from '@/components/button-with-access-checker'
import { User } from '@/lib/db/drizzle/types'
import { getCurrentLocale } from '@/lib/intl/get-current-locale'
import { retrieveActiveSubscription } from '@/lib/subscription'
import { redirect } from '@/navigation'
import { ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'

type PetutorProps = {
  user: User | null
  modelsData: Awaited<ReturnType<typeof getModels>>
  products: Awaited<ReturnType<typeof getProducts>>
  history: Awaited<ReturnType<typeof getModels>>['histories'][number]
  index: number
}

export const Petutor = ({
  user,
  modelsData,
  products,
  history,
  index,
}: PetutorProps) => {
  const classNames = [
    `relative flex flex-col place-items-center md:flex-none backdrop-blur-sm rounded-xl bg-gradient-to-tr md:bg-none md:rounded-none dark:from-zinc-800 dark:via-zinc-800/80 dark:to-violet-300/5 transition-all min-w-[100px] md:min-w-[170px] h-[100px] md:h-[170px] md:hover:-translate-y-5 md:-translate-x-[0px]`,
    `relative flex flex-col place-items-center md:flex-none backdrop-blur-sm rounded-xl bg-gradient-to-tr md:bg-none md:rounded-none dark:from-zinc-800 dark:via-zinc-800/80 dark:to-violet-300/5 transition-all min-w-[100px] md:min-w-[170px] h-[100px] md:h-[170px] md:hover:-translate-y-5 md:-translate-x-[150px]`,
    `relative flex flex-col place-items-center md:flex-none backdrop-blur-sm rounded-xl bg-gradient-to-tr md:bg-none md:rounded-none dark:from-zinc-800 dark:via-zinc-800/80 dark:to-violet-300/5 transition-all min-w-[100px] md:min-w-[170px] h-[100px] md:h-[170px] md:hover:-translate-y-5 md:-translate-x-[300px]`,
  ]

  return (
    <form
      action={async () => {
        'use server'
        if (user && retrieveActiveSubscription(user)) {
          createHistory({
            userId: user.id,
            modelId: history.id,
          })

          redirect({
            href: `/board/${history.id}`,
            locale: await getCurrentLocale(),
          })
        }
      }}
      style={{
        zIndex: modelsData.histories.length - index,
      }}
      className={classNames[index]}
    >
      <ChevronRightIcon className="pointer-events-none md:w-6 w-4 md:relative absolute top-0 md:top-1/2 md:-translate-y-1/2 right-0 md:-right-[70px] text-white" />
      <ButtonWithAccessChecker
        user={user}
        products={products}
        className="w-full h-full cursor-pointer"
        type="submit"
      >
        <Image
          src={history.imageUrl}
          width={180}
          className="m-auto md:w-[180px] md:h-[120px] w-[100px] h-[70px]"
          height={150}
          alt="Petutor AI"
        />
      </ButtonWithAccessChecker>
    </form>
  )
}
