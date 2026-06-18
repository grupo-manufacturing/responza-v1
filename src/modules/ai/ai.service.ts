import api from '@/shared/api/client'

export interface RewriteDraftResponse {
  rewritten: string
}

export interface TranslateMessageResponse {
  translated: string
  targetLanguage: string
  original: string
}

export interface SuggestReplyResponse {
  suggestions: string[]
}

export class AiService {
  static async rewriteDraft(draft: string): Promise<RewriteDraftResponse> {
    const response = await api.post<RewriteDraftResponse>('/ai/rewrite', { draft })
    return response.data
  }

  static async translateMessage(messageId: string): Promise<TranslateMessageResponse> {
    const response = await api.post<TranslateMessageResponse>('/ai/translate', { messageId })
    return response.data
  }

  static async suggestReply(conversationId: string): Promise<SuggestReplyResponse> {
    const response = await api.post<SuggestReplyResponse>('/ai/suggest-reply', { conversationId })
    return response.data
  }
}
