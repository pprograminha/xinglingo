import { Conversation } from '@/lib/db/drizzle/@types'
import { create } from 'zustand'

interface RecordConversationState {
  conversation?: Conversation | null
  toggleRecord: (conversation?: Conversation | null) => void
}

export const useRecordConversation = create<RecordConversationState>((set) => ({
  conversation: undefined,
  toggleRecord: (conversation?: Conversation | null) =>
    set((state) => ({
      conversation: state.conversation
        ? state.conversation.id === conversation?.id
          ? null
          : conversation
        : conversation || null,
    })),
}))
