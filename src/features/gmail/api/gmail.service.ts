import api from '@/shared/api/client'

import type {
  GetGmailMessageResponse,
  ListGmailMessagesResponse,
  ReplyGmailMessagePayload,
  SendGmailMessagePayload,
  SentGmailMessageResponse,
} from '@/features/gmail/api/gmail.types'

export class GmailService {
  static async listMessages(input?: {
    pageToken?: string
    maxResults?: number
  }): Promise<ListGmailMessagesResponse> {
    const response = await api.get<ListGmailMessagesResponse>('/gmail/messages', {
      params: {
        ...(input?.pageToken !== undefined ? { pageToken: input.pageToken } : {}),
        ...(input?.maxResults !== undefined ? { maxResults: input.maxResults } : {}),
      },
    })
    return response.data
  }

  static async getMessage(messageId: string): Promise<GetGmailMessageResponse> {
    const response = await api.get<GetGmailMessageResponse>(
      `/gmail/messages/${encodeURIComponent(messageId)}`,
    )
    return response.data
  }

  static async sendMessage(payload: SendGmailMessagePayload): Promise<SentGmailMessageResponse> {
    const response = await api.post<SentGmailMessageResponse>('/gmail/messages/send', payload)
    return response.data
  }

  static async replyToMessage(
    messageId: string,
    payload: ReplyGmailMessagePayload,
  ): Promise<SentGmailMessageResponse> {
    const response = await api.post<SentGmailMessageResponse>(
      `/gmail/messages/${encodeURIComponent(messageId)}/reply`,
      payload,
    )
    return response.data
  }
}
