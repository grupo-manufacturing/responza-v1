import api from '@/shared/api/client'

export type SourceChunkSummary = {
  source_type: string
  chunk_count: number
}

export type KnowledgeBaseResult = {
  organizationId: string
  chunks_created: number
  sources_processed: number
  embedding_model: string
  embedding_dimensions: number
  chunks_by_source: SourceChunkSummary[]
}

export type AskSource = {
  id: string
  source_type: string
  source_ref: string | null
  similarity: number
  content_preview: string
}

export type AskResult = {
  organizationId: string
  question: string
  answer: string
  is_fallback: boolean
  sources: AskSource[]
}

const ASK_TIMEOUT_MS = 60_000

export class KnowledgeService {
  static async getKnowledgeBase(): Promise<KnowledgeBaseResult> {
    const response = await api.get<KnowledgeBaseResult>('/knowledge/knowledge-base')
    return response.data
  }

  static async ask(question: string): Promise<AskResult> {
    const response = await api.post<AskResult>(
      '/knowledge/ask',
      { question },
      { timeout: ASK_TIMEOUT_MS },
    )
    return response.data
  }
}
