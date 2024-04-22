import { getConversations } from '@/actions/conversations/get-conversations'
import { isSameDay } from 'date-fns'
import { create } from 'zustand'

type Conversations = Awaited<ReturnType<typeof getConversations>>

type Channel = {
  id: number
  channelIndex: number
  conversations: Conversations
}
type ConversationsCallback = (conversations: Conversations) => Conversations

interface ChannelState {
  currentChannelIndex: number
  channels: Channel[]
  conversations: Conversations
  onChannelIndex: (channelIndex: number) => void
  setConversations: (
    conversations: Conversations | ConversationsCallback,
  ) => void
  upsertConversation: (conversation: Conversations[0]) => void
  removeConversation: (conversationId: string) => void
}

const getGroupConversationsPerDay = (conversations: Conversations) => {
  return conversations
    .reduce((allConversations, conversation) => {
      for (const allConversationIndex in allConversations) {
        const dayConversations = allConversations[Number(allConversationIndex)]

        const dayConversationIndex = dayConversations.findLastIndex(
          (dayConversations) =>
            isSameDay(dayConversations.createdAt, conversation.createdAt),
        )

        if (dayConversationIndex !== -1) {
          allConversations[allConversationIndex].push(conversation)

          return allConversations
        }
      }

      return [...allConversations, [conversation]]
    }, [] as Conversations[])
    .map((conversations, index) => ({
      id: index + 1,
      channelIndex: index,
      conversations: conversations.reverse(),
    }))
}

export const useChannels = create<ChannelState>((set, get) => ({
  currentChannelIndex: 0,
  channels: [],
  conversations: [],
  setConversations: (conversations: Conversations | ConversationsCallback) => {
    const newConversations =
      typeof conversations === 'function'
        ? conversations(get().conversations)
        : conversations

    set(() => ({
      conversations: newConversations,
      channels: getGroupConversationsPerDay(newConversations || []),
    }))
  },
  removeConversation: (conversationId: string) => {
    const state = get()

    const cs = state.conversations
    const conversationIndex = cs.findIndex((c) => c.id === conversationId)

    if (conversationIndex !== -1) {
      cs.splice(conversationIndex, 1)

      state.setConversations([...cs])
    }
  },
  upsertConversation: (conversation: Conversations[0]) => {
    const state = get()

    const cs = state.conversations
    const conversationIndex = cs.findIndex((c) => c.id === conversation.id)

    let conversations: Conversations | null = null

    if (conversationIndex !== -1) {
      cs[conversationIndex] = conversation

      conversations = [...cs]
    }

    conversations = conversations || [conversation, ...cs]

    state.setConversations(conversations)
  },

  onChannelIndex: (currentChannelIndex: number) =>
    set(() => ({
      currentChannelIndex,
    })),
}))
