import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import {
  conversations,
  coupons,
  customers,
  histories,
  lessons,
  models,
  phonemes,
  prices,
  products,
  promotionCodes,
  pronunciationsAssessment,
  sections,
  speechs,
  subscriptions,
  units,
  users,
  usersAvailability,
  usersProfile,
  words,
} from './schema'

export type Price = InferSelectModel<typeof prices>
export type Product = InferSelectModel<typeof products>

export type User = InferSelectModel<typeof users> & {
  profile?: InferSelectModel<typeof usersProfile> | null
  availability?: InferSelectModel<typeof usersAvailability> | null
  subscriptions?: (InferSelectModel<typeof subscriptions> & {
    price?:
      | (Price & {
          product?: Product | null
        })
      | null
  })[]
}

export type PronunciationAssessment = InferSelectModel<
  typeof pronunciationsAssessment
>
export type Word = InferSelectModel<typeof words>
export type Unit = InferSelectModel<typeof units>
export type Section = InferSelectModel<typeof sections>
export type Lesson = InferSelectModel<typeof lessons>
export type Phoneme = InferSelectModel<typeof phonemes>
export type Subscription = InferSelectModel<typeof subscriptions>
export type Customer = InferSelectModel<typeof customers>
export type Coupon = InferSelectModel<typeof coupons>
export type Model = InferSelectModel<typeof models>
export type History = InferSelectModel<typeof histories>
export type PromotionCode = InferSelectModel<typeof promotionCodes>

export type Conversation = InferSelectModel<typeof conversations> & {
  author: User | null
}
export type Speech = InferSelectModel<typeof speechs>
export type NewUser = InferInsertModel<typeof users>
