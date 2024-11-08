'use server'
import { createConversation } from './create-conversation'
import { getConversations } from './get-conversations'
import { updateConversation } from './update-conversation'

type Conversations = Awaited<ReturnType<typeof getConversations>>

type ConversationData = Omit<
  Conversations[number],
  | 'author'
  | 'pronunciationAssessment'
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'lessonId'
  | 'authorId'
> & {
  lessonId?: Conversations[number]['lessonId']
  authorId?: Conversations[number]['authorId']
}
type CID = Conversations[number]['id'] | undefined

type ConversationUpsertData = Partial<ConversationData> & {
  conversationId?: CID
}

export async function upsertConversation({
  conversationId,
  ...conversationUpsertData
}: ConversationUpsertData) {
  if (conversationId) {
    const updatedConversation = await updateConversation({
      conversationId,
      ...conversationUpsertData,
    })

    return updatedConversation
  }

  if (
    !(
      'text' in conversationUpsertData &&
      'recipientId' in conversationUpsertData
    )
  )
    throw new Error('Text and recipient required to creation')

  const createdConversation = await createConversation(
    conversationUpsertData as ConversationData,
  )

  return createdConversation
}
