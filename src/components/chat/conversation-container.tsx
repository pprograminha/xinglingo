import { getConversations } from './actions'
import { Conversations } from './conversations'

export async function ConversationContainer() {
  const conversations = await getConversations()

  return <Conversations conversations={conversations} />
}
