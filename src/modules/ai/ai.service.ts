import api from '@/shared/api/client'

export interface RewriteDraftResponse {
  rewritten: string
}

export class AiService {
  static async rewriteDraft(draft: string): Promise<RewriteDraftResponse> {
    const response = await api.post<RewriteDraftResponse>('/ai/rewrite', { draft })
    return response.data
  }
}
