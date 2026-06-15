import { useQuery, useQueryClient } from '@tanstack/react-query'

import type { InboxPlatformFilter } from '@/modules/inbox/inbox.constants'
import { InboxService } from '@/modules/inbox/inbox.service'
import { getApiErrorCode } from '@/shared/utils/api-error'

export const inboxKeys = {
  conversations: (filter: InboxPlatformFilter) => ['inbox', 'conversations', filter] as const,
  thread: (id: string) => ['inbox', 'thread', id] as const,
}

export function isIntegrationsRequiredError(error: unknown): boolean {
  return getApiErrorCode(error) === 'INTEGRATIONS_REQUIRED'
}

export function useInboxConversations(filter: InboxPlatformFilter, enabled: boolean) {
  return useQuery({
    queryKey: inboxKeys.conversations(filter),
    queryFn: () =>
      InboxService.listConversations({
        platform: filter === 'all' ? undefined : filter,
      }),
    enabled,
    refetchOnWindowFocus: true,
  })
}

export function useInboxThread(conversationId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: inboxKeys.thread(conversationId ?? ''),
    queryFn: () => InboxService.getConversation(conversationId!),
    enabled: enabled && conversationId !== null,
    refetchOnWindowFocus: true,
  })
}

export function useInboxQueryClient() {
  return useQueryClient()
}
