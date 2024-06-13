import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import {
  conversations,
  phonemes,
  pronunciationsAssessment,
  speechs,
  users,
  usersAvailability,
  usersProfile,
  words,
} from './schema'

export type User = InferSelectModel<typeof users> & {
  profile?: InferSelectModel<typeof usersProfile>
  availability?: InferSelectModel<typeof usersAvailability>
}
export type PronunciationAssessment = InferSelectModel<
  typeof pronunciationsAssessment
>
export type Word = InferSelectModel<typeof words>
export type Phoneme = InferSelectModel<typeof phonemes>

export type Conversation = InferSelectModel<typeof conversations> & {
  author: User | null
}
export type Speech = InferSelectModel<typeof speechs>
export type NewUser = InferInsertModel<typeof users>
