'use server'

import {
  Conversations,
  ConversationUpsertData,
} from '@/hooks/use-conversations'
import { db } from '@/lib/db/drizzle/query'
import { conversations, users } from '@/lib/db/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function updateConversation({
  conversationId,
  text,
  recipientId,
  lessonId,
  authorId,
  role,
}: Omit<ConversationUpsertData<'update'>['data'], 'id'> & {
  conversationId: string
}): Promise<Conversations[number]> {
  const [updatedConversation] = (await db
    .update(conversations)
    .set({
      text,
      lessonId,
      recipientId,
      authorId,
      role,
      updatedAt: new Date(),
    })

    .where(eq(conversations.id, conversationId))
    .returning()) as Conversations

  if (updatedConversation.authorId) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, updatedConversation.authorId))

    updatedConversation.author = user
  }

  return updatedConversation
}
