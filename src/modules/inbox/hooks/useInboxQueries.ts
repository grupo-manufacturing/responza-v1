import { useQuery, useQueryClient } from '@tanstack/react-query'

import type { InboxPlatformFilter } from '@/modules/inbox/inbox.constants'
import { InboxService } from '@/modules/inbox/inbox.service'
import { getApiErrorCode } from '@/shared/utils/api-error'

const LIST_REFRESH_MS = 8000
const THREAD_REFRESH_MS = 5000

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
    refetchInterval: enabled ? LIST_REFRESH_MS : false,
    enabled,
  })
}

export function useInboxThread(conversationId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: inboxKeys.thread(conversationId ?? ''),
    queryFn: () => InboxService.getConversation(conversationId!),
    refetchInterval: enabled && conversationId !== null ? THREAD_REFRESH_MS : false,
    enabled: enabled && conversationId !== null,
  })
}

export function useInboxQueryClient() {
  return useQueryClient()
}
