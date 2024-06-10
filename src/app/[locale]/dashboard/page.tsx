import { Metadata } from 'next'

import { getWordsList } from '@/actions/conversations/get-words-list'
import { ProfileLink } from '@/components/profile-link'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { Suspense } from 'react'
import { Goal } from './components/goal'

export const metadata: Metadata = {
  title: 'Lingos AI | Dashboard',
  description: 'Lingos AI dashboard',
}

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const wordsListData = await getWordsList()
  const t = await getTranslations()

  return (
    <>
      <div className="flex-col flex bg-[url('/assets/svgs/bg.svg')] bg-repeat h-full">
        <div className="p-4 md:p-8 flex flex-col h-full overflow-auto">
          <div className="grid gap-4 grid-cols-7 mb-4 flex-1">
            <Card className="bg-gradient-to-tr col-span-7 h-full dark:from-zinc-920 dark:to-zinc-800/70 relative">
              <div className="bg-[url('/assets/svgs/radiant-gradient.svg')] bg-cover rounded-xl h-full">
                {/* <div className="bg-[url('/assets/svgs/layered-steps.svg')] h-full bg-repeat-y rounded-xl"> */}
                <div className="bg-[url('/assets/imgs/sakura.png')] bg-[length:200px_134px] md:bg-[length:auto]  bg-[100%_100%]  h-full w-full bg-no-repeat rounded-xl absolute top-0 left-0 right-0 bottom-0"></div>
                <div className="h-full z-20 relative">
                  <div className="p-4 grid">
                    <Suspense fallback={<p>Loading...</p>}>
                      <ProfileLink className="ml-auto" />
                    </Suspense>
                  </div>
                </div>
                {/* </div> */}
              </div>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-3">
            <Goal t={t} wordsListData={wordsListData} />
            <Card className="bg-gradient-to-tr col-span-3 md:col-span-2  dark:from-zinc-920 dark:to-zinc-900">
              <div className="h-full md:bg-none bg-[url('/assets/svgs/layered-steps.svg')] w-full bg-repeat-y rounded-xl ">
                <CardHeader className="mb-2">
                  <CardTitle
                    className={`text-2xl font-medium ${pixelatedFont()}`}
                  >
                    Crie seu tutor AI ou use um existente
                  </CardTitle>
                  <CardDescription>
                    O tutor AI é um modelo de aprendizado treinado para fornecer
                    ensino e orientação.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <div className="basis-60 flex-basis group bg-gradient-to-tr hover:shadow-[inset_0_0px_30px_#7c3aed50] cursor-pointer hover:border-violet-500  from-zinc-900 to-zinc-800 rounded-lg border border-violet-600 flex-1 flex items-center justify-center relative">
                    <Badge
                      variant="recommended"
                      className="absolute top-0 right-0 -translate-y-1/2 translate-x-2"
                    >
                      Recomendado
                    </Badge>

                    <div className="bg-[url('/assets/svgs/bg.svg')]">
                      <div className="p-4">
                        <p
                          className={`text-lg group-hover:animate-float group-hover:delay-700  ${pixelatedFont()}`}
                        >
                          - Oi, eu sou o Ioua.
                        </p>
                        <p
                          className={`text-lg group-hover:animate-float group-hover:delay-500 ${pixelatedFont()}`}
                        >
                          - Comigo você pode falar o que quiser.
                        </p>
                      </div>
                      <Image
                        src="/assets/imgs/tutor-ai-02.png"
                        className="group-hover:animate-float mx-auto"
                        width={300}
                        height={200}
                        alt="Tutor AI"
                      />
                    </div>
                  </div>
                  <div className="basis-60 bg-gradient-to-tr cursor-pointer hover:border-zinc-500/40  transition-all from-zinc-900 to-zinc-800 rounded-lg border border-zinc-800 flex-1 flex items-center justify-center">
                    <div className="bg-[url('/assets/svgs/bg.svg')]">
                      <div className="p-4">
                        <p className={`text-lg ${pixelatedFont()} `}>
                          - Oi, eu sou a Luna.
                        </p>
                        <p className={`text-lg ${pixelatedFont()} `}>
                          - Quer aprender a se comunicar em uma entrevista?
                        </p>
                      </div>
                      <Image
                        src="/assets/imgs/tutor-ai-01.png"
                        width={300}
                        height={200}
                        className="mx-auto"
                        alt="Tutor AI"
                      />
                    </div>
                  </div>

                  <div className="basis-60 bg-gradient-to-tr cursor-pointer hover:border-zinc-500/40  from-zinc-900 to-zinc-800 rounded-lg border border-zinc-800 flex-1 flex items-center justify-center">
                    <div className="bg-[url('/assets/svgs/bg.svg')]">
                      <div className="p-4">
                        <p className={`text-lg ${pixelatedFont()}`}>
                          - Oi, eu sou o Ukki.
                        </p>
                        <p className={`text-lg ${pixelatedFont()}`}>
                          - Quer aprender a se comunicar em um restaurante?
                        </p>
                      </div>
                      <Image
                        src="/assets/imgs/tutor-ai-03.png"
                        width={300}
                        className="mx-auto"
                        height={200}
                        alt="Tutor AI"
                      />
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
