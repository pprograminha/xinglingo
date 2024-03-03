import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { conversations, users } from './schema'

export type User = InferSelectModel<typeof users>
export type Conversation = InferSelectModel<typeof conversations> & {
  author: User | null
}
export type NewUser = InferInsertModel<typeof users>
