import { relations } from 'drizzle-orm'
import {
  doublePrecision,
  pgEnum,
  pgTable,
  primaryKey,
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
  locale: text('locale').notNull().default('pt'),
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
export const speechClientEnum = pgEnum('client', ['cloudflare-s3'])

export const speechsToConversations = pgTable(
  'speechsToConversations',
  {
    speechId: uuid('speechId')
      .references(() => speechs.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    conversationId: uuid('conversationId')
      .references(() => conversations.id, {
        onDelete: 'cascade',
      })
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.speechId, t.conversationId] }),
  }),
)

export const speechs = pgTable('speechs', {
  id: uuid('id').primaryKey(),
  speech: text('speech').notNull(),
  voice: text('voice').notNull(),
  speed: doublePrecision('speed').notNull().default(1),
  client: speechClientEnum('client').default('cloudflare-s3').notNull(),
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

export const speechsToConversationsRelations = relations(
  speechsToConversations,
  ({ one }) => ({
    speechs: one(speechs, {
      fields: [speechsToConversations.speechId],
      references: [speechs.id],
    }),
    conversations: one(conversations, {
      fields: [speechsToConversations.conversationId],
      references: [conversations.id],
    }),
  }),
)

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

export const speechsRelations = relations(speechs, ({ many }) => ({
  speechsToConversations: many(speechsToConversations),
}))

export const conversationsRelations = relations(
  conversations,
  ({ one, many }) => ({
    pronunciationAssessment: one(pronunciationsAssessment),
    speechsToConversations: many(speechsToConversations),
    author: one(users, {
      fields: [conversations.authorId],
      references: [users.id],
    }),
  }),
)

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
