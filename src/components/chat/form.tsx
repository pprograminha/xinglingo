import { uid } from '@/lib/get-uid'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { createConversation } from './actions'

type ChatFormProps = {
  onPublicFromClientHandler: () => void
  messageText: string
  onMessageText: (messageText: string) => void
}

export const ChatForm = ({
  onPublicFromClientHandler,
  onMessageText,
  messageText,
}: ChatFormProps) => {
  return (
    <form className="flex items-center justify-center w-full space-x-2">
      <Input
        placeholder="Type your message"
        value={messageText}
        onChange={(e) => onMessageText(e.target.value)}
      />
      <Button
        type="submit"
        onClick={async (e) => {
          e.preventDefault()
          onMessageText('')
          onPublicFromClientHandler()
          await createConversation({
            text: messageText,
            authorId: uid(),
          })
        }}
      >
        Send
      </Button>
    </form>
  )
}
