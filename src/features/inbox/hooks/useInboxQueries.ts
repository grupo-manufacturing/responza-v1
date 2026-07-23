import { useInfiniteQuery, useQueryClient, type InfiniteData } from '@tanstack/react-query'

import type { MessagingPlatform } from '@/features/inbox/constants'
import {
  InboxService,
  type ConversationDetailResponse,
  type ListConversationsResponse,
} from '@/features/inbox/api/inbox.service'
import { getApiErrorCode } from '@/shared/utils/api-error'

export const inboxKeys = {
  conversations: (platform: MessagingPlatform) => ['inbox', 'conversations', platform] as const,
  thread: (id: string) => ['inbox', 'thread', id] as const,
}

export function isIntegrationsRequiredError(error: unknown): boolean {
  return getApiErrorCode(error) === 'INTEGRATIONS_REQUIRED'
}

export function useInboxConversations(platform: MessagingPlatform, enabled: boolean) {
  return useInfiniteQuery<
    ListConversationsResponse,
    Error,
    InfiniteData<ListConversationsResponse, string | undefined>,
    ReturnType<typeof inboxKeys.conversations>,
    string | undefined
  >({
    queryKey: inboxKeys.conversations(platform),
    queryFn: ({ pageParam }) =>
      InboxService.listConversations({
        platform,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
    enabled,
    refetchOnWindowFocus: true,
  })
}

export function useInboxThread(conversationId: string | null, enabled: boolean) {
  return useInfiniteQuery<
    ConversationDetailResponse,
    Error,
    InfiniteData<ConversationDetailResponse, string | undefined>,
    ReturnType<typeof inboxKeys.thread>,
    string | undefined
  >({
    queryKey: inboxKeys.thread(conversationId ?? ''),
    queryFn: ({ pageParam }) =>
      InboxService.getConversation(conversationId!, {
        before: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMoreMessages ? (lastPage.messagesNextCursor ?? undefined) : undefined,
    enabled: enabled && conversationId !== null,
    refetchOnWindowFocus: true,
  })
}

export function useInboxQueryClient() {
  return useQueryClient()
}
