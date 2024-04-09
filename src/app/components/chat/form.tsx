import { Conversation } from '@/lib/db/drizzle/@types'
import { Loader2 } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { z } from 'zod'
import { Button, ButtonProps } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { createConversation } from '../../../actions/conversations/create-conversation'
import { useAuth } from '@/hooks/use-auth'

type ChatFormProps = {
  onSendMessageHandler: (conversation: Conversation) => void
  messageText: string
  onMessageText: (messageText: string) => void
  uid: ReturnType<typeof useAuth>['uid']
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

export const ChatForm = ({
  onSendMessageHandler,
  onMessageText,
  messageText,
  uid,
}: ChatFormProps) => {
  async function createConversationForm(formData: FormData) {
    const messageText = z.string().safeParse(formData.get('text'))

    if (messageText.success) {
      const conversation = await createConversation({
        text: messageText.data,
        authorId: uid(),
      })

      onMessageText('')

      if (conversation) onSendMessageHandler(conversation)

      return conversation
    }

    return null
  }

  return (
    <form
      className="flex items-center justify-center w-full space-x-2"
      action={createConversationForm}
    >
      <Input
        placeholder="Digite sua mensagem"
        name="text"
        value={messageText}
        onChange={(e) => onMessageText(e.target.value)}
      />
      <ButtonAction disabled={!messageText}>Enviar</ButtonAction>
    </form>
  )
}
