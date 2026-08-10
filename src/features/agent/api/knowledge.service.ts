import api from '@/shared/api/client'

export type KnowledgeJobStatus = 'pending' | 'running' | 'completed' | 'failed'
export type KnowledgeJobType = 'ingest' | 'index'

export type KnowledgeJob = {
  id: string
  organizationId: string
  type: KnowledgeJobType
  status: KnowledgeJobStatus
  error: string | null
  attempts: number
  maxAttempts: number
  createdAt: string
  startedAt: string | null
  completedAt: string | null
  updatedAt: string
}

export type KnowledgeJobCreatedResponse = {
  job: KnowledgeJob
  message: string
}

export type IngestedSource = {
  id: string
  source_type: string
  source_ref: string | null
  char_count: number
  content_preview: string
  created_at: string
}

export type IngestionResult = {
  organizationId: string
  sources_ingested: number
  total_characters: number
  sources: IngestedSource[]
  errors: string[]
}

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

const JOB_POLL_TIMEOUT_MS = 15_000
const ASK_TIMEOUT_MS = 60_000

export class KnowledgeService {
  static async startIngest(): Promise<KnowledgeJobCreatedResponse> {
    const response = await api.post<KnowledgeJobCreatedResponse>('/knowledge/ingest')
    return response.data
  }

  static async startIndex(): Promise<KnowledgeJobCreatedResponse> {
    const response = await api.post<KnowledgeJobCreatedResponse>('/knowledge/index')
    return response.data
  }

  static async getJob(jobId: string): Promise<KnowledgeJob> {
    const response = await api.get<KnowledgeJob>(`/knowledge/jobs/${jobId}`, {
      timeout: JOB_POLL_TIMEOUT_MS,
    })
    return response.data
  }

  static async getIngestion(): Promise<IngestionResult> {
    const response = await api.get<IngestionResult>('/knowledge/ingestion')
    return response.data
  }

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
