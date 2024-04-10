import { textToSpeech } from '@/actions/ai/text-to-speech'
import { cn } from '@/lib/utils'
import { AudioLines, Loader2 } from 'lucide-react'
import { HtmlHTMLAttributes } from 'react'
import { useFormStatus } from 'react-dom'
import { Button, ButtonProps } from '../../../components/ui/button'
import { toast } from '../../../components/ui/use-toast'
import { Howl } from 'howler'
type SpeechGeneratorProps = HtmlHTMLAttributes<HTMLButtonElement> & {
  conversationId: string
  onSoundEnd: () => void
  onSoundStart: () => void
}

type ButtonActionProps = ButtonProps

function ButtonAction({ className, ...props }: ButtonActionProps) {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      size="icon"
      variant="outline"
      className={cn(
        'flex-shrink-0 w-9 dark:data-[on=true]:border-red-500 data-[on=true]:border-red-500 data-[on=true]:animate-pulse data-[on=true]:duration-700 data-[on=true]:cursor-not-allowed',
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
  conversationId,
  onSoundEnd,
  onSoundStart,
  ...props
}: SpeechGeneratorProps) => {
  async function phraseForm() {
    try {
      const { signedUrl } = await textToSpeech({
        conversationId,
        speed: 1,
        voice: 'echo',
      })
      onSoundStart()

      const sound = new Howl({
        src: [signedUrl],
      })

      sound.play()
      sound.on('end', () => {
        onSoundEnd()
      })
    } catch (error) {
      console.log({
        error,
      })
      return toast({
        title: 'Falha ao tentar gerar a fala',
        variant: 'destructive',
      })
    }
  }

  return (
    <form action={phraseForm}>
      <ButtonAction {...props}>
        <AudioLines className="w-4" />
      </ButtonAction>
    </form>
  )
}
