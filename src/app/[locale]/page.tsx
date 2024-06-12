import { EnglishIcon } from '@/components/icons/english'
import { FrenchIcon } from '@/components/icons/french'
import { ItalianIcon } from '@/components/icons/italian'
import { PortugueseIcon } from '@/components/icons/portuguese'
import { SpanishIcon } from '@/components/icons/spanish'
import { WppIcon } from '@/components/icons/wpp'
import { Logo } from '@/components/logo'
import { SetLang } from '@/components/set-lang'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { Locale } from '@/lib/intl/locales'
import { Link } from '@/navigation'
import { ArrowRightIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

type LangData = {
  id: Locale
  title: string
  description: string
  icon: React.FC<React.HtmlHTMLAttributes<SVGElement>>
}

export default async function Home() {
  const t = await getTranslations()

  const langs: LangData[] = [
    {
      id: 'es',
      title: t('Spanish'),
      description: t(
        'Learning Spanish opens doors to immerse yourself in the vibrant Hispanic culture, enjoy new career opportunities in Spanish-speaking countries, and explore fascinating destinations like Barcelona, with its stunning architecture and rich history',
      ),
      icon: SpanishIcon,
    },
    {
      id: 'fr',
      title: t('French'),
      description: t(
        'Learning French allows you to immerse yourself in the sophisticated French culture, open doors to international career opportunities, and explore charming settings like the lush gardens of Versailles',
      ),
      icon: FrenchIcon,
    },
    {
      id: 'it-IT',
      title: t('Italian'),
      description: t(
        "Learning Italian allows you to appreciate Italy's rich culture, explore career opportunities in Italy, and immerse yourself in the history and art of iconic cities like Rome and Florence",
      ),
      icon: ItalianIcon,
    },
    {
      id: 'en',
      title: t('English'),
      description: t(
        'Learning English opens doors to global opportunities, enhances your career prospects, expands access to information, and makes international travel easier',
      ),
      icon: EnglishIcon,
    },
    // {
    //   id: 'zh-cn',
    //   title: t('Chinese (Mandarin)'),
    //   description: 'desc',
    //   icon: MandarinIcon,
    // },
    {
      id: 'pt',
      title: t('Portuguese'),
      description: t(
        'Learning Portuguese provides immersion in the rich Lusophone culture, opens up career opportunities in Portuguese-speaking countries, and allows exploration of stunning landscapes like the paradise beaches of Brazil',
      ),
      icon: PortugueseIcon,
    },
  ]

  return (
    <div className="grid h-full bg-[url('/assets/svgs/layered-steps.svg')] bg-repeat-y overflow-y-auto">
      <header className="px-4 lg:px-6 h-14 flex justify-between items-center">
        <Logo />
        <div className="flex gap-2 items-center">
          <SetLang />
          <Button asChild variant="secondary">
            <Link href="/get-started/1">{t('Get Started')}</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 h-full grid">
        <div className="px-4 md:px-12">
          <section className="py-12 md:py-24 lg:py-32 flex flex-col-reverse lg:flex-row justify-between gap-8 ">
            <div className="grid max-w-[800px] gap-4 sm:gap-6 md:gap-8">
              <h1
                className={`${pixelatedFont()} tracking-wide whitespace-normal text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl`}
              >
                {t(
                  'Simplify your studies of a new language using artificial intelligence',
                )}
              </h1>
              <p className="text-zinc-500 md:text-md">
                {t(
                  'Our platform leverages artificial intelligence to make learning a new language simpler and more effective By using advanced AI algorithms, we provide personalized learning experiences that adapt to your individual needs and pace',
                )}
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                <Button
                  asChild
                  variant="default"
                  className="p-8 py-6 gap-2 font-bold dark:bg-green-300 hover:dark:bg-green-400"
                >
                  <Link href="/get-started/1">
                    {t('Get Started')}
                    <ArrowRightIcon />
                  </Link>
                </Button>
              </div>
            </div>
            <Image
              alt="Panda"
              className="max-h-[241px] shrink-0 md:max-h-[361px] min-h-[180px] min-w-[150px] max-w-[200px] md:max-w-[300px]"
              src="/assets/imgs/panda-3.png"
              width={300}
              height={361}
            />
          </section>
          <section className="pb-12 md:pb-24 lg:pb-32 grid gap-2">
            <h1 className={`${pixelatedFont()} text-3xl pb-1`}>
              {t('What do you want to learn?')}
            </h1>
            <div className="flex flex-wrap gap-2">
              {langs.map((langData) => (
                <Link
                  key={langData.id}
                  href={`/get-started/1?subject=${langData.id}`}
                  className="flex-1 basis-[400px]"
                >
                  <Card className="hover:-translate-y-1 transition-all h-full bg-[url('/assets/svgs/bg.svg')] bg-cover">
                    <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
                      <langData.icon className="w-12 h-12 shrink-0" />
                      <div>
                        <h1 className={`${pixelatedFont()} text-3xl pb-1`}>
                          {langData.title}
                        </h1>
                        <p className="text-xs dark:text-zinc-500 pb-2">
                          {langData.description}
                        </p>
                      </div>
                      <Button className="gap-2 dark:bg-green-300 hover:dark:bg-green-400 ml-auto py-6 px-5">
                        <ArrowRightIcon className="w-4 h-4 " />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-zinc-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          &copy; 2024 {t('Lingos AI')}. {t('All rights reserved')}
        </p>
        <nav className="sm:ml-auto flex items-center gap-4 sm:gap-6">
          <ul>
            <WppIcon />
          </ul>
          <div>
            <ul className="flex flex-row gap-2">
              <Link
                href="/terms-of-service"
                className="text-xs font-bold hover:underline underline-offset-4"
              >
                {t('Terms of Service')}
              </Link>
              <Link
                href="/privacy-policy"
                className="text-xs font-bold hover:underline underline-offset-4"
              >
                {t('Privacy')}
              </Link>
            </ul>
            <Link
              href="mailto:support@lingos.life"
              className="text-xs hover:underline underline-offset-4"
            >
              {t('Need help?')}{' '}
              <span className="font-bold">{t('Contact Us')}</span>
            </Link>
          </div>
        </nav>
      </footer>
    </div>
  )
}
