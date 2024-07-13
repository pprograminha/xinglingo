import { getLanguages } from '@/actions/languages/get-langs'
import { getServerAuth } from '@/actions/users/get-server-auth'
import { updateUser } from '@/actions/users/update-user'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { debounce } from '@/lib/debounce'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { toast } from 'sonner'

type Lang = Awaited<ReturnType<typeof getLanguages>>[number]

type LanguageProps = {
  lang: Lang
  langs: Lang[]
  onLanguages: (langs: Lang[]) => void
}

export const Language = ({ lang, langs, onLanguages }: LanguageProps) => {
  const t = useTranslations()
  const changeLanguageHandler = async () => {
    let languages = langs
    const langIndex = languages.indexOf(lang)

    languages = languages.map((lang) => ({
      ...lang,
      current: false,
    }))

    languages[langIndex] = { ...lang, current: true }

    onLanguages([...languages])

    debounce(async () => {
      const { user } = await getServerAuth()

      if (user) {
        await updateUser({
          userId: user.id,
          profile: {
            localeToLearn: lang.locale,
          },
        })
        toast(t('You have successfully set up a new language to learn!'), {
          description: t("Don't forget to study with the Petutors"),
        })
      }
    }, 2000)()
  }

  return (
    <div
      data-current={lang.current}
      className="
        p-4
        rounded-xl
        w-full
        flex
        text-left
        flex-col
        justify-between
        group
        bg-zinc-800
        data-[current=true]:border
        data-[current=true]:bg-gradient-to-tr
        data-[current=true]:from-zinc-800
        data-[current=true]:to-orange-600/10
        data-[current=true]:border-orange-400/40
        relative
      "
    >
      {lang.current && (
        <Badge className="absolute top-2 right-2 dark:bg-orange-500/80 dark:text-white">
          {t('Current')}
        </Badge>
      )}

      <div className="flex gap-4 flex-wrap items-center justify-between">
        <div className="flex gap-4 flex-wrap">
          <Image
            src={lang.imageUrl}
            width={80}
            height={80}
            className="w-[80px] h-[80px]"
            alt="Country"
          />
          <div>
            <h1 className={`${pixelatedFont()} text-4xl mb-2`}>{lang.name}</h1>
            <p className="text-xs text-zinc-400">
              {lang.count.wordsToLearn} / {lang.count.words}
            </p>
          </div>
        </div>
        {!lang.current && (
          <Button
            variant="secondary"
            className="border border-zinc-700"
            onClick={() => changeLanguageHandler()}
          >
            {t('Select language')}
          </Button>
        )}
      </div>

      {lang.progress !== 0 && (
        <div className="flex flex-col items-start mt-2 gap-2 w-full">
          <span className="text-xs">{lang.progress.toFixed(2)}%</span>
          <Progress value={lang.progress} />
        </div>
      )}
    </div>
  )
}
