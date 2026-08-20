import api from '@/shared/api/client'

export interface AssistantAskResponse {
  answer: string
}

export class AssistantService {
  static async ask(question: string): Promise<AssistantAskResponse> {
    const response = await api.post<AssistantAskResponse>('/assistant/ask', { question })
    return response.data
  }
}
