import { relations } from 'drizzle-orm'
import {
  doublePrecision,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('role', [
  'superadmin',
  'admin',
  'subscriber',
  'user',
])

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  fullName: text('fullName').notNull(),
  email: text('email').notNull().unique(),
  image: text('image').unique(),
  role: userRoleEnum('role').default('user').notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export const conversationRoleEnum = pgEnum('role', [
  'assistant',
  'tool',
  'user',
])

export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey(),
  text: text('text').notNull(),
  authorId: uuid('authorId').references(() => users.id, {
    onDelete: 'cascade',
  }),
  role: conversationRoleEnum('role').default('user').notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export const pronunciationsAssessment = pgTable('pronunciationsAssessment', {
  id: uuid('id').primaryKey(),

  text: text('text'),
  conversationId: uuid('conversationId').references(() => conversations.id, {
    onDelete: 'set null',
  }),
  creatorId: uuid('creatorId').references(() => users.id, {
    onDelete: 'cascade',
  }),
  accuracyScore: doublePrecision('accuracyScore').notNull(),
  completenessScore: doublePrecision('completenessScore').notNull(),
  fluencyScore: doublePrecision('fluencyScore').notNull(),
  pronScore: doublePrecision('pronScore').notNull(),
  prosodyScore: doublePrecision('prosodyScore').notNull(),

  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export const words = pgTable('words', {
  id: uuid('id').primaryKey(),

  word: text('word').notNull(),
  pronunciationAssessmentId: uuid('pronunciationAssessmentId')
    .references(() => pronunciationsAssessment.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  accuracyScore: doublePrecision('accuracyScore').notNull(),

  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export const phonemes = pgTable('phonemes', {
  id: uuid('id').primaryKey(),
  phoneme: text('phoneme').notNull(),
  wordId: uuid('wordId')
    .references(() => words.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  accuracyScore: doublePrecision('accuracyScore').notNull(),

  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export const wordsRelations = relations(words, ({ many, one }) => ({
  pronunciationAssessment: one(pronunciationsAssessment, {
    fields: [words.pronunciationAssessmentId],
    references: [pronunciationsAssessment.id],
  }),
  phonemes: many(phonemes),
}))

export const usersRelations = relations(users, ({ many }) => ({
  conversations: many(conversations),
  pronunciationsAssessment: many(pronunciationsAssessment),
}))

export const conversationsRelations = relations(conversations, ({ one }) => ({
  pronunciationAssessment: one(pronunciationsAssessment),
  author: one(users, {
    fields: [conversations.authorId],
    references: [users.id],
  }),
}))

export const pronunciationsAssessmentRelations = relations(
  pronunciationsAssessment,
  ({ one, many }) => ({
    user: one(users, {
      fields: [pronunciationsAssessment.creatorId],
      references: [users.id],
    }),
    conversation: one(conversations, {
      fields: [pronunciationsAssessment.conversationId],
      references: [conversations.id],
    }),
    words: many(words),
  }),
)

export const phonemesRelations = relations(phonemes, ({ one }) => ({
  word: one(words, {
    fields: [phonemes.wordId],
    references: [words.id],
  }),
}))
