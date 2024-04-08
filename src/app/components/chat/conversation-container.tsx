import { getConversations } from '../../../actions/conversations/get-conversations'
import { Conversations } from './conversations'

export async function ConversationContainer() {
  const conversations = await getConversations()

  return <Conversations conversations={conversations} />
}
