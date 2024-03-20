import { Loader2, Sparkles } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { Button, ButtonProps } from '../ui/button'
import { generatePhraseWithAi } from './actions/generate-phrase-with-ai'
import { toast } from '../ui/use-toast'

type ChatFormProps = {
  onPhrase: (phrase: string) => void
}

type ButtonActionProps = ButtonProps

function ButtonAction(props: ButtonActionProps) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" {...props} disabled={pending}>
      {pending ? <Loader2 className="w-4 animate-spin" /> : props.children}
    </Button>
  )
}

export const PhraseGenerator = ({ onPhrase }: ChatFormProps) => {
  async function phraseForm() {
    const generatedPhrase = await generatePhraseWithAi()

    if (!generatedPhrase) {
      return toast({
        title: 'Generate Pharase Error',
        variant: 'destructive',
      })
    }

    onPhrase(generatedPhrase)
  }

  return (
    <form action={phraseForm}>
      <ButtonAction>
        <Sparkles className="w-4" />
      </ButtonAction>
    </form>
  )
}
