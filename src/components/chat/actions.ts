'use server'

import { Conversation, User } from '@/lib/db/drizzle/@types'
import { db } from '@/lib/db/drizzle/query'
import { conversations, users } from '@/lib/db/drizzle/schema'
import { InferInsertModel, eq } from 'drizzle-orm'
import crypto from 'node:crypto'
import { cache } from 'react'
const getConversations = cache(async function getConversations(): Promise<
  Conversation[]
> {
  const conversationsData = await db
    .select()
    .from(conversations)
    .leftJoin(users, eq(conversations.authorId, users.id))

  return conversationsData.map((c) => {
    return {
      ...c.conversations,
      author: c.users,
    }
  })
})

export { getConversations }

export async function createConversation({
  text,
  authorId,
}: Omit<InferInsertModel<typeof conversations>, 'id'>): Promise<
  Conversation & {
    author: User | null
  }
> {
  const [conversation] = (await db
    .insert(conversations)
    .values([
      {
        id: crypto.randomUUID(),
        text,
        authorId,
      },
    ])
    .returning()) as [
    Conversation & {
      author: User | null
    },
  ]

  if (conversation.authorId) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, conversation.authorId))

    conversation.author = user
  }

  return conversation
}
