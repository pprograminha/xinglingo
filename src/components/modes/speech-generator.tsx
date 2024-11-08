import { textToSpeech } from '@/actions/ai/text-to-speech'
import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Howl } from 'howler'
import { Loader2, Volume2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { HtmlHTMLAttributes } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'

type SpeechGeneratorProps = HtmlHTMLAttributes<HTMLButtonElement> & {
  text?: string
  voice?: string
  speechKey?: string
  t: ReturnType<typeof useTranslations>
  onSoundEnd?: (key: string) => void
  onSoundStart?: () => void
}

type ButtonActionProps = ButtonProps

function ButtonAction({ className, ...props }: ButtonActionProps) {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      size="icon"
      variant="ghost"
      className={cn(
        'flex-shrink-0 w-9  dark:data-[on=true]:text-red-500 data-[on=true]:text-red-500 data-[on=true]:animate-pulse data-[on=true]:duration-700 data-[on=true]:cursor-not-allowed',
        className,
      )}
      {...props}
      disabled={pending}
    >
      {pending ? <Loader2 className="w-4 animate-spin" /> : props.children}
    </Button>
  )
}

export const SpeechGenerator = ({
  onSoundEnd,
  onSoundStart,
  t,
  speechKey,
  voice,
  text,
  ...props
}: SpeechGeneratorProps) => {
  async function phraseForm() {
    try {
      // if (text?.split(' ').length === 1) {
      //   const result = await searchSerper({
      //     input: `https://glosbe.com: ${text}. Inglês para Português.`,
      //     locale: 'pt-br',
      //   })

      //   console.log(result)
      //   return
      // }

      const { signedUrl, key } = await textToSpeech({
        key: speechKey,
        text,
        speed: 1,
        voice: voice as Parameters<typeof textToSpeech>[0]['voice'],
      })

      onSoundStart?.()

      const sound = new Howl({
        src: [signedUrl],
      })

      sound.play()

      if (onSoundEnd)
        sound.on('end', () => {
          onSoundEnd(key)
        })
    } catch (error) {
      console.log(error)
      return toast(t('An error occurred while generating speech'))
    }
  }

  return (
    <form action={phraseForm}>
      <ButtonAction {...props}>
        <Volume2Icon className="w-4" />
      </ButtonAction>
    </form>
  )
}
