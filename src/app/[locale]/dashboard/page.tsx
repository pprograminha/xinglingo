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
import { Goal } from './components/goal'
import { getAuth } from '@/lib/auth/get-auth'
import { Typing } from './components/welcome/typing'

export const metadata: Metadata = {
  title: 'Lingos AI | Dashboard',
  description: 'Lingos AI dashboard',
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
            <Card className="bg-gradient-to-tr col-span-2 md:col-span-1 h-full dark:from-zinc-920 dark:to-zinc-800/70 relative">
              <div className="bg-[url('/assets/svgs/radiant-gradient.svg')] bg-cover rounded-xl h-full">
                <div className="h-full flex flex-col justify-between py-2 px-2 md:px-6">
                  <h1
                    className={`text-2xl my-4 md:text-6xl ${pixelatedFont()}`}
                  >
                    Bem-vindo(a)!! {user?.fullName}
                  </h1>
                  <div className="relative select-none">
                    <div className="absolute -top-[180px] -right-[30px]">
                      <Image
                        src="/assets/svgs/dialogue.svg"
                        width={250}
                        className="ml-auto animate-in"
                        height={100}
                        alt="Tutor AI"
                      />

                      <p
                        className={`text-md typing-animation leading-4 absolute top-[calc(50%_+_-20px)] right-8 -translate-y-1/2 min-w-[200px] max-w-[200px] p-5 pl-8 ${pixelatedFont()}`}
                      >
                        <Typing
                          text={`Nossa meta é ajudar você a se tornar fluente em 1 a 2 anos. Vamos estudar juntos para alcançar esse objetivo.`}
                        />
                      </p>
                    </div>
                    <Image
                      src="/assets/imgs/tutor-ai-04.png"
                      width={300}
                      className="ml-auto"
                      height={200}
                      alt="Tutor AI"
                    />
                  </div>
                </div>
              </div>
            </Card>
            <Card className="bg-gradient-to-tr col-span-2 md:col-span-1 h-full dark:from-zinc-920 dark:to-zinc-800/70 relative">
              <div className="bg-[url('/assets/svgs/radiant-gradient.svg')] bg-cover rounded-xl h-full">
                <div className="bg-[url('/assets/imgs/sakura.png')] bg-[length:200px_134px] md:bg-[length:auto]  bg-[100%_100%]  h-full w-full bg-no-repeat rounded-xl absolute top-0 left-0 right-0 bottom-0"></div>
                <div className="h-full z-20 relative p-4">
                  <div className="grid">
                    <ProfileLink className="ml-auto" />
                  </div>
                </div>
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
