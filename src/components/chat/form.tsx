import { Conversation } from '@/lib/db/drizzle/@types'
import { uid } from '@/lib/get-uid'
import { Loader2 } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { z } from 'zod'
import { Button, ButtonProps } from '../ui/button'
import { Input } from '../ui/input'
import { createConversation } from '../../actions/conversations/create-conversation'

type ChatFormProps = {
  onPublicFromClientHandler: (conversation: Conversation) => void
  messageText: string
  onMessageText: (messageText: string) => void
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
  onPublicFromClientHandler,
  onMessageText,
  messageText,
}: ChatFormProps) => {
  async function createConversationForm(formData: FormData) {
    const messageText = z.string().safeParse(formData.get('text'))

    if (messageText.success) {
      const conversation = await createConversation({
        text: messageText.data,
        authorId: uid(),
      })
      onMessageText('')
      onPublicFromClientHandler(conversation)

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
        placeholder="Type your message"
        name="text"
        value={messageText}
        onChange={(e) => onMessageText(e.target.value)}
      />
      <ButtonAction disabled={!messageText}>Send</ButtonAction>
    </form>
  )
}
