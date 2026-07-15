import api from '@/shared/api/client'

import type { IntegrationPlatform } from '@/features/integrations/constants'
import type { MessageContentType, MessageDirection, MessageStatus } from '@/features/inbox/constants'

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
  contentType: MessageContentType
  mediaUrl: string | null
  mimeType: string | null
  status: MessageStatus
  createdAt: string
}

export interface ListConversationsParams {
  platform?: IntegrationPlatform
  limit?: number
  cursor?: string
}

export interface ListConversationsResponse {
  conversations: ConversationListItem[]
  nextCursor: string | null
  hasMore: boolean
}

export interface GetConversationParams {
  messageLimit?: number
  before?: string
}

export interface ConversationDetailResponse {
  conversation: Conversation
  participants: Participant[]
  messages: Message[]
  messagesNextCursor: string | null
  hasMoreMessages: boolean
}

interface SendTextMessagePayload {
  content: string
  contentType?: 'text'
}

interface SendMediaMessagePayload {
  content?: string
  contentType: Exclude<MessageContentType, 'text'>
  storagePath: string
  mimeType: string
  fileSizeBytes: number
  filename?: string
}

type SendMessagePayload = SendTextMessagePayload | SendMediaMessagePayload

export interface UploadOutboundMediaResponse {
  media: {
    storagePath: string
    mimeType: string
    fileSizeBytes: number
    filename: string | null
  }
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

  static async getConversation(
    id: string,
    params: GetConversationParams = {},
  ): Promise<ConversationDetailResponse> {
    const response = await api.get<ConversationDetailResponse>(`/conversations/${id}`, { params })
    return response.data
  }

  static async uploadOutboundMedia(
    conversationId: string,
    input: {
      file: File
      contentType: Exclude<MessageContentType, 'text'>
      filename?: string
    },
  ): Promise<UploadOutboundMediaResponse> {
    const formData = new FormData()
    formData.append('file', input.file)
    formData.append('contentType', input.contentType)
    if (input.filename !== undefined && input.filename.length > 0) {
      formData.append('filename', input.filename)
    }

    const response = await api.post<UploadOutboundMediaResponse>(
      `/conversations/${conversationId}/messages/media`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60_000,
      },
    )

    return response.data
  }

  static async sendMessage(
    conversationId: string,
    payload: SendMessagePayload,
  ): Promise<SendMessageResponse> {
    const response = await api.post<SendMessageResponse>(
      `/conversations/${conversationId}/messages`,
      payload,
      {
        timeout: 'storagePath' in payload ? 60_000 : 10_000,
      },
    )
    return response.data
  }
}
