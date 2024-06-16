import { Logo } from '@/components/logo'
import { ProfileLink } from '@/components/profile-link'
import { Typing } from '@/components/typing'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { ChevronRightIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

type SakuraProps = {
  t: Awaited<ReturnType<typeof getTranslations>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Sakura = ({ t }: SakuraProps) => {
  return (
    <Card className="bg-gradient-to-tr col-span-2 md:col-span-1 h-full dark:from-zinc-920 dark:to-zinc-800/70 relative">
      <div className="bg-[url('/assets/svgs/radiant-gradient.svg')] bg-cover rounded-xl h-full">
        <div className="bg-[url('/assets/imgs/sakura.png')] bg-[length:200px_134px] md:bg-[length:auto]  bg-[100%_100%]  h-full w-full bg-no-repeat rounded-xl absolute top-0 left-0 right-0 bottom-0"></div>
        <div className="h-full z-20 flex flex-col gap-2 relative p-4">
          <div className="flex flex-wrap gap-2">
            <div className="bg-zinc-800 flex-1 rounded-xl p-4 flex flex-col justify-between">
              <Logo className="text-2xl self-start" />

              <div>
                <p className="text-zinc-500 text-xs">
                  Selecione um novo idioma para aprender{' '}
                </p>

                <Button
                  variant="secondary"
                  className="border border-zinc-700 mt-2 flex gap-2 items-center"
                >
                  Novo idioma <ChevronRightIcon className="w-4" />
                </Button>
              </div>
            </div>
            <ProfileLink className="ml-auto max-w-none lg:max-w-xs" />
          </div>
          <div className="relative flex-1 bg-zinc-800/90 flex flex-col justify-between border border-pink-500/50  p-4 rounded-xl">
            <Badge variant="shortly" className="absolute -top-2 -right-2">
              Em breve
            </Badge>
            <h1
              className={`text-2xl ${pixelatedFont()} flex gap-1 items-center`}
            >
              Novos Petutors AI
              <Badge variant="shortly" className="px-4 ml-2 text-sm">
                Em breve
              </Badge>
            </h1>
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="basis-48 bg-gradient-to-tr cursor-not-allowed rounded-lg  transition-all from-zinc-900 backdrop-blur-sm  to-zinc-600/10 border border-zinc-800 flex-1 flex items-center justify-center">
                <div className="bg-[url('/assets/svgs/bg.svg')]">
                  <div className="p-4">
                    <p className={`min-h-[56px] text-lg ${pixelatedFont()} `}>
                      <Typing
                        text="- Logo estarei apto a compartilhar conhecimentos sobre história com você."
                        startDelay={100}
                      />
                    </p>
                  </div>
                  <Image
                    src="/assets/imgs/tutor-ai-04.png"
                    width={150}
                    height={164}
                    className="mx-auto"
                    alt="Tutor AI"
                  />
                </div>
              </div>
              <div className="basis-48 bg-gradient-to-tr cursor-not-allowed backdrop-blur-sm transition-all from-zinc-900 to-zinc-600/10 rounded-lg border border-zinc-800 flex-1 flex items-center justify-center">
                <div className="bg-[url('/assets/svgs/bg.svg')]">
                  <div className="p-4">
                    <p className={`min-h-[56px] text-lg ${pixelatedFont()} `}>
                      <Typing
                        text="- Em breve estarei disponível para compartilhar conhecimentos sobre tecnologia com você."
                        startDelay={50}
                      />
                    </p>
                  </div>
                  <Image
                    src="/assets/imgs/tutor-ai-05.png"
                    width={150}
                    height={164}
                    className="mx-auto"
                    alt="Tutor AI"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
