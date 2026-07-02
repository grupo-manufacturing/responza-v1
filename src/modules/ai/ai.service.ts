import api from '@/shared/api/client'

export interface TranslateMessageResponse {
  translated: string
  targetLanguage: string
  original: string
}

export interface SuggestReplyResponse {
  suggestions: string[]
}

export interface ConversationAnalyticsResponse {
  leadScore: number
  suggestedActions: string[]
  customerHistory: string
  conversationSummary: string
}

type AiJobEnqueueResponse = {
  jobId: string
  status: 'pending'
}

type AiJobPollResponse = {
  jobId: string
  status: 'pending' | 'completed' | 'failed'
  type: string
  result?: unknown
  error?: {
    code: string
    message: string
  }
}

const POLL_INTERVAL_MS = 500
const MAX_POLL_ATTEMPTS = 60

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

async function pollAiJob<T>(jobId: string): Promise<T> {
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
    const response = await api.get<AiJobPollResponse>(`/ai/jobs/${jobId}`)
    const data = response.data

    if (data.status === 'completed') {
      return data.result as T
    }

    if (data.status === 'failed') {
      throw new Error(data.error?.message ?? 'AI request failed')
    }

    await sleep(POLL_INTERVAL_MS)
  }

  throw new Error('AI request timed out')
}

async function runAiJob<T>(path: string, body: unknown): Promise<T> {
  const response = await api.post<AiJobEnqueueResponse>(path, body)
  return pollAiJob<T>(response.data.jobId)
}

export class AiService {
  static async translateMessage(messageId: string): Promise<TranslateMessageResponse> {
    return runAiJob<TranslateMessageResponse>('/ai/translate', { messageId })
  }

  static async suggestReply(conversationId: string): Promise<SuggestReplyResponse> {
    return runAiJob<SuggestReplyResponse>('/ai/suggest-reply', { conversationId })
  }

  static async analyzeConversation(
    conversationId: string,
  ): Promise<ConversationAnalyticsResponse> {
    return runAiJob<ConversationAnalyticsResponse>('/ai/conversation-analytics', {
      conversationId,
    })
  }
}
