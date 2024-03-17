'use server'

import { db } from '@/lib/db/drizzle/query'
import { conversations } from '@/lib/db/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function deleteConversation(convesationId: string): Promise<void> {
  await db.delete(conversations).where(eq(conversations.id, convesationId))
}
