import { relations } from 'drizzle-orm'
import {
  AnyPgColumn,
  bigint,
  boolean,
  doublePrecision,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('role', ['superadmin', 'admin', 'user'])

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  fullName: text('fullName').notNull(),
  email: text('email').notNull().unique(),
  image: text('image').unique(),
  googleId: text('googleId').unique(),
  locale: text('locale').notNull().default('pt'),
  billingAddress: jsonb('billingAddress'),
  paymentMethod: jsonb('paymentMethod'),
  role: userRoleEnum('role').default('user').notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export const customers = pgTable('customers', {
  id: uuid('id')
    .primaryKey()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  stripeCustomerId: text('stripeCustomerId'),
})

export const texts = pgTable('texts', {
  id: uuid('id').primaryKey(),

  text: text('text').notNull(),
  parentTextId: uuid('parentId').references((): AnyPgColumn => texts.id, {
    onDelete: 'cascade',
  }),
  locale: text('locale').notNull(),

  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

// Products Table
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  active: boolean('active'),
  name: text('name'),
  description: text('description'),
  image: text('image'),
  metadata: jsonb('metadata'),
})

export const pricesTypeEnum = pgEnum('type', ['one_time', 'recurring'])
export const pricesIntervalVariantEnum = pgEnum('intervalVariant', [
  'day',
  'week',
  'month',
  'year',
])

export const prices = pgTable('prices', {
  id: text('id').primaryKey(),
  productId: text('productId').references(() => products.id, {
    onDelete: 'cascade',
  }),
  active: boolean('active'),
  description: text('description'),
  unitAmount: bigint('unitAmount', {
    mode: 'bigint',
  }),
  currency: text('currency'),
  type: pricesTypeEnum('type'),
  intervalVariant: pricesIntervalVariantEnum('intervalVariant'),
  intervalCount: integer('intervalCount'),
  trialPeriodDays: integer('trialPeriodDays'),
  metadata: jsonb('metadata'),
})

export const subscriptionsStatusEnum = pgEnum('status', [
  'trialing',
  'active',
  'canceled',
  'incomplete',
  'incomplete_expired',
  'past_due',
  'unpaid',
  'paused',
])

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: uuid('userId').references(() => users.id, {
    onDelete: 'cascade',
  }),
  status: subscriptionsStatusEnum('status'),
  metadata: jsonb('metadata'),
  priceId: text('priceId').references(() => prices.id, {
    onDelete: 'cascade',
  }),
  coupons: jsonb('coupons').notNull().$type<string[]>().default([]),
  quantity: integer('quantity'),
  cancelAtPeriodEnd: boolean('cancelAtPeriodEnd'),
  created: timestamp('created').defaultNow(),
  currentPeriodStart: timestamp('currentPeriodStart').defaultNow(),
  currentPeriodEnd: timestamp('currentPeriodEnd').defaultNow(),
  endedAt: timestamp('endedAt').defaultNow(),
  cancelAt: timestamp('cancelAt').defaultNow(),
  canceledAt: timestamp('canceledAt').defaultNow(),
  trialStart: timestamp('trialStart').defaultNow(),
  trialEnd: timestamp('trialEnd').defaultNow(),
})

export const couponsDurationEnum = pgEnum('duration', [
  'forever',
  'once',
  'repeating',
])

export const coupons = pgTable('coupons', {
  id: text('id').primaryKey(),
  amountOff: integer('amountOff'),
  created: integer('created').notNull(),
  currency: text('currency'),
  deleted: boolean('deleted').notNull().default(false),
  duration: couponsDurationEnum('duration').notNull(),
  durationInMonths: integer('durationInMonths'),
  livemode: boolean('livemode').notNull(),
  maxRedemptions: integer('maxRedemptions'),
  metadata: jsonb('metadata'),
  name: text('name'),
  percentOff: integer('percentOff'),
  redeemBy: integer('redeemBy'),
  timesRedeemed: integer('timesRedeemed').notNull(),
  valid: boolean('valid').notNull(),
})
export const promotionCodes = pgTable('promotionCodes', {
  id: text('id').primaryKey(),
  code: text('code'),
  coupon: text('coupon'),
  created: integer('created').notNull(),
  livemode: boolean('livemode').notNull(),
  maxRedemptions: integer('maxRedemptions'),
  metadata: jsonb('metadata'),
  expiresAt: integer('expiresAt'),
  timesRedeemed: integer('timesRedeemed').notNull(),
  active: boolean('active'),
})

export const usersProfile = pgTable('usersProfile', {
  id: uuid('id').primaryKey(),
  userId: uuid('userId')
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull()
    .unique(),
  localeToLearn: text('localeToLearn').notNull().default('en'),
  communicationLevel: text('communicationLevel').notNull().default('basics'),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export const usersAvailability = pgTable('usersAvailability', {
  id: uuid('id').primaryKey(),
  userId: uuid('userId')
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull()
    .unique(),
  times: jsonb('times').array(9).notNull().$type<string[]>(),
  days: jsonb('days').array(7).notNull().$type<string[]>(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export const conversations = pgTable('conversations', {
  id: text('id').primaryKey(),
  text: text('text'),
  content: jsonb('content').array(), // .$type<{}>(),
  authorId: uuid('authorId').references(() => users.id, {
    onDelete: 'cascade',
  }),
  lessonId: text('lessonId').references(() => lessons.id, {
    onDelete: 'set null',
  }),
  parentConversationId: text('parentConversationId').references(
    (): AnyPgColumn => conversations.id,
    {
      onDelete: 'cascade',
    },
  ),
  recipientId: uuid('recipientId')
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  role: text('role').default('user').notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export const pronunciationsAssessment = pgTable('pronunciationsAssessment', {
  id: uuid('id').primaryKey(),

  text: text('text'),
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

export const models = pgTable('models', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  slug: text('slug').notNull(),
  image: text('image').notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export const units = pgTable('units', {
  id: text('id').primaryKey(),
  modelId: text('modelId')
    .references(() => models.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  title: uuid('title')
    .references(() => texts.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  prompt: uuid('prompt')
    .references(() => texts.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  slug: uuid('slug')
    .references(() => texts.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  description: uuid('description').references(() => texts.id, {
    onDelete: 'cascade',
  }),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export const userUnits = pgTable('userUnits', {
  id: text('id').primaryKey(),
  unitId: text('unitId')
    .references(() => units.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  userId: uuid('userId')
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  completed: boolean('completed').notNull(),
  current: boolean('current').notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export const sectionsVariantEnum = pgEnum('variant', ['default', 'book'])
export const sections = pgTable('sections', {
  id: text('id').primaryKey(),
  unitId: text('unitId')
    .references(() => units.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  title: uuid('title')
    .references(() => texts.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  prompt: uuid('prompt')
    .references(() => texts.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  slug: uuid('slug').references(() => texts.id, {
    onDelete: 'cascade',
  }),
  description: uuid('description').references(() => texts.id, {
    onDelete: 'cascade',
  }),
  variant: sectionsVariantEnum('variant').notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export const userSections = pgTable('userSections', {
  id: text('id').primaryKey(),
  userUnitId: text('userUnitId')
    .references(() => userUnits.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  userId: uuid('userId')
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  sectionId: text('sectionId')
    .references(() => sections.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  completed: boolean('completed').notNull(),
  current: boolean('current').notNull(),

  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})
export const lessons = pgTable('lessons', {
  id: text('id').primaryKey(),
  title: uuid('title')
    .references(() => texts.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  prompt: uuid('prompt').references(() => texts.id, {
    onDelete: 'cascade',
  }),
  description: uuid('description').references(() => texts.id, {
    onDelete: 'cascade',
  }),

  sectionId: text('sectionId')
    .references(() => sections.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export const userLessons = pgTable('userLessons', {
  id: text('id').primaryKey(),
  lessonId: text('lessonId')
    .references(() => lessons.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  userId: uuid('userId')
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  userSectionId: text('userSectionId')
    .references(() => userSections.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  completed: boolean('completed'),
  current: boolean('current'),

  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export const histories = pgTable('histories', {
  id: text('id').primaryKey(),

  userId: uuid('userId')
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  modelId: text('modelId')
    .references(() => models.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export const speechClientEnum = pgEnum('client', ['cloudflare_s3'])

export const speechs = pgTable('speechs', {
  id: uuid('id').primaryKey(),
  speech: text('speech').notNull(),
  voice: text('voice').notNull(),
  speed: doublePrecision('speed').notNull().default(1),
  client: speechClientEnum('client').default('cloudflare_s3').notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export const words = pgTable('words', {
  id: uuid('id').primaryKey(),
  locale: text('locale').notNull().default('en'),
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

export const unitsRelations = relations(units, ({ one, many }) => ({
  model: one(models, {
    fields: [units.modelId],
    references: [models.id],
  }),
  promptText: one(texts, {
    fields: [units.prompt],
    references: [texts.id],
  }),
  titleText: one(texts, {
    fields: [units.title],
    references: [texts.id],
  }),
  descriptionText: one(texts, {
    fields: [units.description],
    references: [texts.id],
  }),
  slugText: one(texts, {
    fields: [units.slug],
    references: [texts.id],
  }),
  userUnits: many(userUnits),
  sections: many(sections),
}))

export const textsRelations = relations(texts, ({ one, many }) => ({
  parentText: one(texts, {
    fields: [texts.parentTextId],
    references: [texts.id],
  }),
  units: many(units),
}))

export const userUnitsRelations = relations(userUnits, ({ one, many }) => ({
  unit: one(units, {
    fields: [userUnits.unitId],
    references: [units.id],
  }),
  user: one(users, {
    fields: [userUnits.userId],
    references: [users.id],
  }),
  sections: many(userSections),
}))

export const sectionsRelations = relations(sections, ({ one, many }) => ({
  unit: one(units, {
    fields: [sections.unitId],
    references: [units.id],
  }),
  userSections: many(userSections),
  lessons: many(lessons),
}))

export const userSectionsRelations = relations(
  userSections,
  ({ one, many }) => ({
    section: one(sections, {
      fields: [userSections.sectionId],
      references: [sections.id],
    }),
    user: one(users, {
      fields: [userSections.userId],
      references: [users.id],
    }),
    userUnit: one(userUnits, {
      fields: [userSections.userUnitId],
      references: [userUnits.id],
    }),
    lessons: many(userLessons),
  }),
)
export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  section: one(sections, {
    fields: [lessons.sectionId],
    references: [sections.id],
  }),
  conversations: many(conversations),
  userLessons: many(userLessons),
}))

export const userLessonsRelations = relations(userLessons, ({ one }) => ({
  lesson: one(lessons, {
    fields: [userLessons.lessonId],
    references: [lessons.id],
  }),
  user: one(users, {
    fields: [userLessons.userId],
    references: [users.id],
  }),
  userSection: one(userSections, {
    fields: [userLessons.userSectionId],
    references: [userSections.id],
  }),
}))

export const historiesRelations = relations(histories, ({ one }) => ({
  user: one(users, {
    fields: [histories.userId],
    references: [users.id],
  }),
  model: one(models, {
    fields: [histories.modelId],
    references: [models.id],
  }),
}))

export const modelsRelations = relations(models, ({ many }) => ({
  histories: many(histories),
  units: many(units),
}))

// export const speechsToConversationsRelations = relations(
//   speechsToConversations,
//   ({ one }) => ({
//     speechs: one(speechs, {
//       fields: [speechsToConversations.speechId],
//       references: [speechs.id],
//     }),
//     conversations: one(conversations, {
//       fields: [speechsToConversations.conversationId],
//       references: [conversations.id],
//     }),
//   }),
// )

export const wordsRelations = relations(words, ({ many, one }) => ({
  pronunciationAssessment: one(pronunciationsAssessment, {
    fields: [words.pronunciationAssessmentId],
    references: [pronunciationsAssessment.id],
  }),
  phonemes: many(phonemes),
}))

export const usersRelations = relations(users, ({ many, one }) => ({
  authorConversations: many(conversations, {
    relationName: 'author',
  }),
  conversations: many(conversations, {
    relationName: 'recipient',
  }),
  availability: one(usersAvailability),
  profile: one(usersProfile),
  customer: one(customers),
  histories: many(histories),
  lessons: many(userLessons),
  sections: many(userSections),
  units: many(userUnits),
  pronunciationsAssessment: many(pronunciationsAssessment),
  subscriptions: many(subscriptions),
}))

export const usersAvailabilityRelations = relations(
  usersAvailability,
  ({ one }) => ({
    user: one(users, {
      fields: [usersAvailability.userId],
      references: [users.id],
    }),
  }),
)
export const usersProfileRelations = relations(usersProfile, ({ one }) => ({
  user: one(users, {
    fields: [usersProfile.userId],
    references: [users.id],
  }),
}))

export const customersRelations = relations(customers, ({ one }) => ({
  user: one(users, {
    fields: [customers.id],
    references: [users.id],
  }),
}))

export const conversationsRelations = relations(conversations, ({ one }) => ({
  pronunciationAssessment: one(pronunciationsAssessment),
  author: one(users, {
    fields: [conversations.authorId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [conversations.lessonId],
    references: [lessons.id],
  }),
  recipient: one(users, {
    fields: [conversations.recipientId],
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
    words: many(words),
  }),
)

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  price: one(prices, {
    fields: [subscriptions.priceId],
    references: [prices.id],
  }),
}))

export const pricesRelations = relations(prices, ({ one, many }) => ({
  product: one(products, {
    fields: [prices.productId],
    references: [products.id],
  }),
  subscriptions: many(subscriptions),
}))

export const productsRelations = relations(products, ({ many }) => ({
  prices: many(prices),
}))

export const phonemesRelations = relations(phonemes, ({ one }) => ({
  word: one(words, {
    fields: [phonemes.wordId],
    references: [words.id],
  }),
}))
