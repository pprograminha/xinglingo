import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  fullName: text('fullName').notNull(),
  email: text('email').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey(),
  text: text('text').notNull(),
  authorId: uuid('authorId').references(() => users.id),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})
