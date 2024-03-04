import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import {
  conversations,
  phonemes,
  pronunciationsAssessment,
  users,
  words,
} from './schema'

export type User = InferSelectModel<typeof users>
export type PronunciationAssessment = InferSelectModel<
  typeof pronunciationsAssessment
>
export type Word = InferSelectModel<typeof words>
export type Phoneme = InferSelectModel<typeof phonemes>

export type Conversation = InferSelectModel<typeof conversations> & {
  author: User | null
}
export type NewUser = InferInsertModel<typeof users>
