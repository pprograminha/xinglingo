import { Card } from '@/components/ui/card'
import { User } from '@/lib/db/drizzle/types'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { Locale, imagesSrc, langs } from '@/lib/intl/locales'
import { ChevronRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

type WelcomeProps = {
  user: User | null
  t: Awaited<ReturnType<typeof getTranslations>>
}

export const Welcome = ({ user, t }: WelcomeProps) => {
  return (
    <Card className="bg-gradient-to-tr col-span-2 md:col-span-1 h-full dark:from-zinc-920 dark:to-zinc-800/70 relative">
      <div className="bg-[url('/assets/svgs/radiant-gradient.svg')] bg-cover rounded-xl h-full">
        <div className="h-full flex flex-col justify-between px-4 pt-4 pb-10">
          <div className="bg-gradient-to-tr from-zinc-800 h-full via-zinc-800 to-violet-200/10 rounded-xl w-full p-4">
            {user?.profile?.localeToLearn && (
              <>
                <Image
                  src={imagesSrc[user.profile.localeToLearn as Locale]}
                  width={100}
                  height={100}
                  alt="Country"
                />
                {langs(t, user.profile.localeToLearn as Locale)}
              </>
            )}
          </div>
          <div>
            <h1 className={`text-4xl my-4 md:text-6xl ${pixelatedFont()}`}>
              Bem-vindo(a)!! {user?.fullName}
            </h1>
            <div>
              <div className="flex flex-col gap-2">
                <h2 className={`text-zinc-400 text-2xl ${pixelatedFont()}`}>
                  Continuar de onde parou?
                </h2>
              </div>

              <div className="flex flex-wrap justify-between items-center gap-2">
                <div className="md:perspective-4 flex flex-wrap md:flex-nowrap md:w-[200px] md:-translate-x-9 mt-6">
                  <div className="cursor-pointer relative flex flex-col place-items-center md:flex-none  bg-gradient-to-tr dark:from-zinc-800 dark:to-violet-300/10 border border-zinc-900 z-40 transition-all md:-rotate-y-40 rounded-xl shadow-md min-w-[100px] md:min-w-[200px] h-[100px] md:h-[200px] md:hover:-rotate-y-40 md:hover:-translate-y-5">
                    <ChevronRight className="md:w-6 w-4 md:relative md:top-2 absolute top-0 right-0 text-zinc-500" />
                    <Image
                      src="/assets/imgs/tutor-ai-01.png"
                      width={150}
                      className="m-auto md:w-[150px] md:h-[150px] w-[100px] h-[70px]"
                      height={150}
                      alt="Tutor AI"
                    />
                  </div>
                  <div className="cursor-pointer relative flex flex-col place-items-center md:flex-none  bg-gradient-to-tr dark:from-zinc-800 dark:to-violet-300/10 border border-zinc-900 z-30 md:-rotate-y-40 md:-translate-x-[180px] rounded-xl shadow-md min-w-[100px] md:min-w-[200px] h-[100px] md:h-[200px] transition-all md:hover:-rotate-y-40 md:hover:-translate-y-5">
                    <ChevronRight className="md:w-6 w-4 md:relative md:top-2 absolute top-0 right-0 text-zinc-500" />

                    <Image
                      src="/assets/imgs/tutor-ai-02.png"
                      className="m-auto md:w-[150px] md:h-[150px] w-[100px] h-[70px]"
                      width={150}
                      height={150}
                      alt="Tutor AI"
                    />
                  </div>
                  <div className="cursor-pointer relative flex flex-col place-items-center md:flex-none  bg-gradient-to-tr dark:from-zinc-800 dark:to-violet-300/10 border border-zinc-900 z-20 md:-rotate-y-40 md:-translate-x-[360px] rounded-xl shadow-md min-w-[100px] md:min-w-[200px] h-[100px] md:h-[200px] transition-all md:hover:-rotate-y-40 md:hover:-translate-y-5">
                    <ChevronRight className="md:w-6 w-4 md:relative md:top-2 absolute top-0 right-0 text-zinc-500" />

                    <Image
                      src="/assets/imgs/tutor-ai-03.png"
                      className="m-auto md:w-[150px] md:h-[150px] w-[100px] h-[70px]"
                      width={150}
                      height={150}
                      alt="Tutor AI"
                    />
                  </div>
                </div>
                <div className="p-4">
                  {/* <div className="p-8 rounded-full  mt-2 relative">
                    <div className="absolute -top-[30px] w-[60px] h-[60px] rounded-full border-2 border-zinc-700 overflow-hidden">
                      <Image
                        src="/assets/svgs/flags/brazil.svg"
                        width={60}
                        className="scale-[1.6]"
                        height={60}
                        alt="Brazil"
                      />
                    </div>
                    <div className=" absolute top-0 right-0 w-[40px] h-[40px] rounded-full border-2 border-zinc-700 overflow-hidden">
                      <Image
                        src="/assets/svgs/flags/usa.svg"
                        width={40}
                        className="scale-[1.6]"
                        height={40}
                        alt="Usa"
                      />
                    </div>
                    <div className="absolute bottom-[20px] -right-[20px] w-[53px] h-[53px] rounded-full border-2 border-zinc-700 overflow-hidden">
                      <Image
                        src="/assets/svgs/flags/spain.svg"
                        width={53}
                        className="scale-[1.6]"
                        height={53}
                        alt="Spain"
                      />
                    </div>
                    <div className="absolute -bottom-[0px] left-[15px] w-[35px] h-[35px] rounded-full border-2 border-zinc-700 overflow-hidden">
                      <Image
                        src="/assets/svgs/flags/france.svg"
                        width={35}
                        className="scale-[1.6]"
                        height={35}
                        alt="France"
                      />
                    </div>

                    <div className="absolute bottom-[70px] -left-[20px] w-[40px] h-[40px] rounded-full border-2 border-zinc-700 overflow-hidden">
                      <Image
                        src="/assets/svgs/flags/italian.svg"
                        width={40}
                        className="scale-[1.6]"
                        height={40}
                        alt="Usa"
                      />
                    </div>
                    <Image
                      src="/assets/imgs/tutor-ai-05.png"
                      width={100}
                      className="m-auto w-[100px] h-[100px]"
                      height={100}
                      alt="Tutor AI"
                    />
                  </div> */}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-2 justify-between">
            {/* <div className="relative flex-col shrink-0 flex justify-center items-center select-none h-[500px]">
              <div className="relative">
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
                    text={`Sabia que dá pra aprender uma nova lingua em até 1 ano?`}
                  />
                </p>
              </div>

              <Image
                src="/assets/imgs/tutor-ai-04.png"
                width={200}
                height={200}
                alt="Tutor AI"
              />
            </div> */}
          </div>
        </div>
      </div>
    </Card>
  )
}
