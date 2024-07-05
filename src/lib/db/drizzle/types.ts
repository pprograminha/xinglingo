import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import {
  conversations,
  customers,
  phonemes,
  prices,
  products,
  pronunciationsAssessment,
  speechs,
  subscriptions,
  users,
  usersAvailability,
  usersProfile,
  words,
} from './schema'

export type User = InferSelectModel<typeof users> & {
  profile?: InferSelectModel<typeof usersProfile> | null
  availability?: InferSelectModel<typeof usersAvailability> | null
}

export type PronunciationAssessment = InferSelectModel<
  typeof pronunciationsAssessment
>
export type Word = InferSelectModel<typeof words>
export type Phoneme = InferSelectModel<typeof phonemes>
export type Subscription = InferSelectModel<typeof subscriptions>
export type Price = InferSelectModel<typeof prices>
export type Product = InferSelectModel<typeof products>
export type Customer = InferSelectModel<typeof customers>

export type Conversation = InferSelectModel<typeof conversations> & {
  author: User | null
}
export type Speech = InferSelectModel<typeof speechs>
export type NewUser = InferInsertModel<typeof users>
