import { createConversation } from '@/actions/conversations/create-conversation'
import { deleteConversation } from '@/actions/conversations/delete-conversation'
import { getConversations as getConversationsAction } from '@/actions/conversations/get-conversations'
import { updateConversation } from '@/actions/conversations/update-conversation'
import { create } from 'zustand'

export type Conversations = Awaited<ReturnType<typeof getConversationsAction>>

type ConversationsCallback = (conversations: Conversations) => Conversations
type ConversationData = Omit<
  Conversations[number],
  | 'author'
  | 'pronunciationAssessment'
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'lessonId'
  | 'authorId'
> & {
  id?: Conversations[number]['id']
  lessonId?: Conversations[number]['lessonId']
  authorId?: Conversations[number]['authorId']
}
type ConversationUpsertType = 'create' | 'update'
export type ConversationUpsertData<T> = {
  type: T
  data: T extends 'create' ? ConversationData : Partial<ConversationData>
}

type GetConversationsParams = Parameters<typeof getConversationsAction>[number]

type Either<T> = [Error | null, T?]

interface ConversationState {
  isFetching: boolean
  isCreating: boolean
  isUpdating: boolean

  conversations: Conversations
  getConversations: (params?: GetConversationsParams) => Promise<Either<void>>
  setConversations: (
    conversations: Conversations | ConversationsCallback,
  ) => void
  upsertConversation: <T extends ConversationUpsertType>(
    conversationUpsertData: ConversationUpsertData<T>,
  ) => Promise<Either<Conversations[number]>>
  removeConversation: (conversationId: string) => Promise<Either<void>>
}

export const useConversations = create<ConversationState>((set, get) => ({
  conversations: [],

  isFetching: false,
  isCreating: false,
  isUpdating: false,

  getConversations: async (params: GetConversationsParams) => {
    set({
      conversations: [],
      isFetching: true,
    })
    try {
      const conversations = await getConversationsAction(params)

      set({
        conversations,
      })
      return [null]
    } catch (error) {
      return [error as Error]
    } finally {
      set({
        isFetching: false,
      })
    }
  },
  setConversations: (conversations: Conversations | ConversationsCallback) => {
    const newConversations =
      typeof conversations === 'function'
        ? conversations(get().conversations)
        : conversations

    set(() => ({
      conversations: newConversations,
    }))
  },
  removeConversation: async (conversationId: string) => {
    const state = get()

    const cs = state.conversations
    const conversationIndex = cs.findIndex((c) => c.id === conversationId)

    if (conversationIndex !== -1) {
      cs.splice(conversationIndex, 1)

      state.setConversations([...cs])
    }

    try {
      await deleteConversation(conversationId)

      return [null]
    } catch (error) {
      return [error as Error]
    }
  },

  upsertConversation: async <T extends ConversationUpsertType>({
    data: conversationUpsertData,
  }: ConversationUpsertData<T>) => {
    const state = get()

    const cs = state.conversations
    const conversationIndex = conversationUpsertData.id
      ? cs.findIndex((c) => c.id === conversationUpsertData.id)
      : -1
    let conversations: Conversations | null = null

    if (conversationIndex !== -1) {
      cs[conversationIndex] = {
        ...cs[conversationIndex],
        ...conversationUpsertData,
      }

      conversations = [...cs]

      state.setConversations(conversations)

      try {
        set({ isUpdating: true })
        const updatedConversation = await updateConversation({
          conversationId: conversationUpsertData.id!,
          ...conversationUpsertData,
        })
        return [null, updatedConversation]
      } catch (error) {
        return [error as Error]
      } finally {
        set({ isUpdating: false })
      }
    }

    set({ isCreating: true })

    try {
      const createdConversation = await createConversation({
        text: conversationUpsertData.text!,
        recipientId: conversationUpsertData.recipientId!,
        ...conversationUpsertData,
      })

      conversations = [createdConversation, ...cs]
      state.setConversations(conversations)

      return [null, createdConversation]
    } catch (error) {
      return [error as Error]
    } finally {
      set({ isCreating: false })
    }
  },
}))
