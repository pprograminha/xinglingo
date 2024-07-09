'use server'

import { getAuth, withAuth } from '@/lib/auth/get-auth'
import { Conversation, User } from '@/lib/db/drizzle/types'
import { db } from '@/lib/db/drizzle/query'
import { conversations, users } from '@/lib/db/drizzle/schema'
import { InferInsertModel, eq } from 'drizzle-orm'
import crypto from 'node:crypto'

export async function createConversation({
  text,
  authorId,
}: Omit<InferInsertModel<typeof conversations>, 'id'>): Promise<
  | (Conversation & {
      author: User | null
    })
  | null
> {
  return (
    await withAuth(async () => {
      const { user } = await getAuth()

      if (!user) throw new Error('User does not exist')
      const [conversation] = (await db
        .insert(conversations)
        .values([
          {
            id: crypto.randomUUID(),
            recipientId: user.id,
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

      return conversation as
        | (Conversation & {
            author: User | null
          })
        | null
    }, null)
  )()
}
