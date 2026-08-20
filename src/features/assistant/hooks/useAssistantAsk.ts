import { useMutation } from '@tanstack/react-query'

import { AssistantService } from '@/features/assistant/api/assistant.service'
import { getApiErrorMessage } from '@/shared/utils/api-error'

export function useAssistantAsk() {
  return useMutation({
    mutationFn: (question: string) => AssistantService.ask(question),
  })
}

export function getAssistantAskErrorMessage(error: unknown): string {
  return getApiErrorMessage(error, 'Could not get an answer. Please try again.')
}
