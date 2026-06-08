import api from '@/shared/api/client'

import type { InboxPlatform } from '@/shared/constants/inbox'

export interface MessageSnippet {
  id: string
  direction: 'inbound' | 'outbound'
  contentType: string
  body: string | null
  status: string
  createdAt: string
}

export interface Participant {
  id: string
  conversationId: string
  platformUserId: string
  displayName: string | null
  avatarUrl: string | null
  metadata: Record<string, unknown>
  firstMessageAt: string | null
  lastMessageAt: string | null
  createdAt: string
  updatedAt: string
}

export interface Conversation {
  id: string
  organizationId: string
  channelId: string
  platform: InboxPlatform | null
  externalId: string
  lastMessageAt: string | null
  unreadCount: number
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
  participants?: Participant[]
  latestMessage?: MessageSnippet | null
}

export interface Message {
  id: string
  conversationId: string
  participantId: string | null
  direction: 'inbound' | 'outbound'
  platformMessageId: string | null
  contentType: string
  body: string | null
  fileUrl: string | null
  metadata: Record<string, unknown>
  status: string
  createdAt: string
  updatedAt: string
}

export interface ListInboxParams {
  limit?: number
  cursor?: string
  platform?: InboxPlatform
}

export interface ListInboxResponse {
  conversations: Conversation[]
  page: {
    nextCursor: string | null
    limit: number
  }
}

export interface ListMessagesParams {
  limit?: number
  cursor?: string
  direction?: 'inbound' | 'outbound'
}

export interface ListMessagesResponse {
  messages: Message[]
  page: {
    nextCursor: string | null
    limit: number
  }
}

export interface CreateMessagePayload {
  body?: string
  contentType?: 'text' | 'image' | 'video' | 'audio' | 'document'
  fileUrl?: string
}

export class InboxService {
  static async listInbox(params: ListInboxParams = {}): Promise<ListInboxResponse> {
    const response = await api.get<ListInboxResponse>('/inbox', { params })
    return response.data
  }

  static async getConversation(id: string): Promise<{ conversation: Conversation }> {
    const response = await api.get<{ conversation: Conversation }>(`/conversations/${id}`)
    return response.data
  }

  static async listMessages(
    conversationId: string,
    params: ListMessagesParams = {},
  ): Promise<ListMessagesResponse> {
    const response = await api.get<ListMessagesResponse>(`/conversations/${conversationId}/messages`, {
      params,
    })
    return response.data
  }

  static async sendMessage(
    conversationId: string,
    payload: CreateMessagePayload,
  ): Promise<{ message: Message }> {
    const response = await api.post<{ message: Message }>(
      `/conversations/${conversationId}/messages`,
      payload,
    )
    return response.data
  }
}

export default InboxService
