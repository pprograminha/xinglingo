import { Conversation } from '@/lib/db/drizzle/@types'
import { toast } from 'sonner'
import { create } from 'zustand'

interface RecordConversationState {
  conversation?: Conversation | null
  oldConversation?: Conversation | null
  toggleRecord: (conversation?: Conversation | null) => void
  retryRecord: () => void
}

export const useRecordConversation = create<RecordConversationState>(
  (set, get) => ({
    conversation: undefined,
    oldConversation: undefined,
    retryRecord: () => {
      const state = get()

      if (!state.oldConversation) {
        return toast('Unable to retry', {
          action: {
            label: 'Undo',
            onClick: () => {},
          },
        })
      }

      set((state) => ({
        conversation: state.oldConversation,
      }))
    },
    toggleRecord: (conversation?: Conversation | null) =>
      set((state) => ({
        oldConversation: state.conversation,
        conversation: state.conversation
          ? state.conversation.id === conversation?.id
            ? null
            : conversation
          : conversation || null,
      })),
  }),
)
