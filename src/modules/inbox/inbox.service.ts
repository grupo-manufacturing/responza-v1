import api from '@/shared/api/client'

import type { IntegrationPlatform } from '@/modules/integrations/integrations.constants'
import type { MessageDirection, MessageStatus } from './inbox.constants'

export interface ConversationListItem {
  id: string
  organizationId: string
  channelId: string
  platform: IntegrationPlatform
  channelDisplayName: string
  externalId: string
  displayName: string
  avatarUrl: string | null
  lastMessage: string | null
  lastMessageAt: string
  createdAt: string
}

export interface Conversation {
  id: string
  organizationId: string
  channelId: string
  externalId: string
  lastMessageAt: string
  createdAt: string
}

export interface Participant {
  id: string
  organizationId: string
  conversationId: string
  platformUserId: string
  displayName: string
  avatarUrl: string | null
  createdAt: string
}

export interface Message {
  id: string
  organizationId: string
  conversationId: string
  participantId: string | null
  direction: MessageDirection
  platformMessageId: string | null
  content: string
  status: MessageStatus
  createdAt: string
}

export interface ListConversationsParams {
  platform?: IntegrationPlatform
}

export interface ListConversationsResponse {
  conversations: ConversationListItem[]
}

export interface ConversationDetailResponse {
  conversation: Conversation
  participants: Participant[]
  messages: Message[]
}

export interface SendMessagePayload {
  content: string
}

export interface SendMessageResponse {
  message: Message
}

export class InboxService {
  static async listConversations(
    params: ListConversationsParams = {},
  ): Promise<ListConversationsResponse> {
    const response = await api.get<ListConversationsResponse>('/conversations', { params })
    return response.data
  }

  static async getConversation(id: string): Promise<ConversationDetailResponse> {
    const response = await api.get<ConversationDetailResponse>(`/conversations/${id}`)
    return response.data
  }

  static async sendMessage(
    conversationId: string,
    payload: SendMessagePayload,
  ): Promise<SendMessageResponse> {
    const response = await api.post<SendMessageResponse>(
      `/conversations/${conversationId}/messages`,
      payload,
    )
    return response.data
  }
}
