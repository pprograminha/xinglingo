'use server'

import { Conversations } from '@/hooks/use-conversations'
import { db } from '@/lib/db/drizzle/query'
import { conversations, users } from '@/lib/db/drizzle/schema'
import { snowflakeId } from '@/lib/snowflake'
import { InferInsertModel, eq } from 'drizzle-orm'
export async function createConversation({
  text,
  recipientId,
  role,
  lessonId,
  authorId,
}: Omit<InferInsertModel<typeof conversations>, 'id'>): Promise<
  Conversations[number]
> {
  const [conversation] = (await db
    .insert(conversations)
    .values([
      {
        id: snowflakeId(),
        recipientId,
        role,
        lessonId,
        text,
        authorId,
      },
    ])
    .returning()) as Conversations

  if (conversation.authorId) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, conversation.authorId))

    conversation.author = user
  }

  return conversation
}
