import { getConversations } from '@/actions/conversations/get-conversations'
import { create } from 'zustand'

type Conversations = Awaited<ReturnType<typeof getConversations>>
interface ChannelState {
  channelIndex: number
  groupConversationsPerDay: Conversations[]

  onChannelIndex: (channelIndex: number) => void
  onGroupConversationsPerDay: (
    groupConversationsPerDay: Conversations[],
  ) => void
}

export const useChannels = create<ChannelState>((set) => ({
  channelIndex: 0,
  groupConversationsPerDay: [],

  onGroupConversationsPerDay: (groupConversationsPerDay: Conversations[]) =>
    set(() => ({
      groupConversationsPerDay,
    })),
  onChannelIndex: (channelIndex: number) =>
    set(() => ({
      channelIndex,
    })),
}))
