import type { QueryClient } from '@tanstack/react-query'

import type { MessageContentType, MessageDirection, MessageStatus } from '@/modules/inbox/inbox.constants'
import { inboxKeys } from '@/modules/inbox/hooks/useInboxQueries'
import { isMediaContentType } from '@/modules/inbox/inbox.preview'
import type { ConversationDetailResponse, Message } from '@/modules/inbox/inbox.service'
import {
  type ThreadInfiniteData,
  updateThreadFirstPage,
} from '@/modules/inbox/lib/inboxQueryData'

function mapRealtimeMessage(row: Record<string, unknown>): Message | null {
  const id = row.id
  const conversationId = row.conversation_id
  const content = row.content
  const createdAt = row.created_at

  if (
    typeof id !== 'string' ||
    typeof conversationId !== 'string' ||
    typeof content !== 'string' ||
    typeof createdAt !== 'string'
  ) {
    return null
  }

  return {
    id,
    organizationId: typeof row.organization_id === 'string' ? row.organization_id : '',
    conversationId,
    participantId: typeof row.participant_id === 'string' ? row.participant_id : null,
    direction: row.direction as MessageDirection,
    platformMessageId:
      typeof row.platform_message_id === 'string' ? row.platform_message_id : null,
    content,
    contentType:
      typeof row.content_type === 'string' ? (row.content_type as MessageContentType) : 'text',
    mediaUrl: null,
    mimeType: typeof row.mime_type === 'string' ? row.mime_type : null,
    status: row.status as MessageStatus,
    customerReaction:
      typeof row.customer_reaction === 'string' ? row.customer_reaction : null,
    agentReaction: typeof row.agent_reaction === 'string' ? row.agent_reaction : null,
    createdAt,
  }
}

function mergeRealtimeMessage(existing: Message | undefined, incoming: Message): Message {
  if (existing === undefined) {
    return incoming
  }

  return {
    ...incoming,
    mediaUrl: incoming.mediaUrl ?? existing.mediaUrl,
    mimeType: incoming.mimeType ?? existing.mimeType,
  }
}

function upsertMessageInList(messages: Message[], incoming: Message): Message[] {
  const index = messages.findIndex(
    (item) =>
      item.id === incoming.id ||
      (incoming.platformMessageId !== null &&
        item.platformMessageId === incoming.platformMessageId),
  )

  if (index === -1) {
    return [...messages, incoming]
  }

  const next = [...messages]
  next[index] = mergeRealtimeMessage(next[index], incoming)
  return next
}

function updateThreadCache(
  queryClient: QueryClient,
  conversationId: string,
  updater: (page: ConversationDetailResponse) => ConversationDetailResponse,
): void {
  queryClient.setQueryData(
    inboxKeys.thread(conversationId),
    (current: ThreadInfiniteData | undefined) => {
      if (current === undefined || current.pages.length === 0) {
        return current
      }

      return updateThreadFirstPage(current, updater)
    },
  )
}

export function upsertThreadMessage(
  queryClient: QueryClient,
  conversationId: string,
  message: Message,
): void {
  updateThreadCache(queryClient, conversationId, (current) => ({
    ...current,
    messages: upsertMessageInList(current.messages, message),
  }))
}

export function appendThreadMessage(
  queryClient: QueryClient,
  conversationId: string,
  message: Message,
): void {
  updateThreadCache(queryClient, conversationId, (current) => ({
    ...current,
    messages: [...current.messages, message],
  }))
}

export function removeThreadMessagesById(
  queryClient: QueryClient,
  conversationId: string,
  messageIds: string[],
): void {
  if (messageIds.length === 0) {
    return
  }

  const ids = new Set(messageIds)

  updateThreadCache(queryClient, conversationId, (current) => ({
    ...current,
    messages: current.messages.filter((message) => !ids.has(message.id)),
  }))
}

export function replaceOptimisticThreadMessage(
  queryClient: QueryClient,
  conversationId: string,
  optimisticId: string,
  message: Message,
): void {
  updateThreadCache(queryClient, conversationId, (current) => {
    const withoutOptimistic = current.messages.filter((item) => item.id !== optimisticId)
    return {
      ...current,
      messages: upsertMessageInList(withoutOptimistic, message),
    }
  })
}

export function applyMessageInsert(
  queryClient: QueryClient,
  input: {
    selectedConversationId: string | null
    row: Record<string, unknown>
  },
): void {
  const message = mapRealtimeMessage(input.row)
  if (message === null) {
    return
  }

  if (isMediaContentType(message.contentType)) {
    invalidateInboxQueries(queryClient, input.selectedConversationId)
    return
  }

  if (
    input.selectedConversationId !== null &&
    message.conversationId === input.selectedConversationId
  ) {
    updateThreadCache(queryClient, input.selectedConversationId, (current) => ({
      ...current,
      messages: upsertMessageInList(current.messages, message),
    }))
  }

  void queryClient.invalidateQueries({ queryKey: ['inbox', 'conversations'] })
}

export function applyMessageUpdate(
  queryClient: QueryClient,
  input: {
    selectedConversationId: string | null
    row: Record<string, unknown>
  },
): void {
  const message = mapRealtimeMessage(input.row)
  if (message === null || input.selectedConversationId === null) {
    return
  }

  if (message.conversationId !== input.selectedConversationId) {
    return
  }

  updateThreadCache(queryClient, input.selectedConversationId, (current) => {
    const index = current.messages.findIndex(
      (item) =>
        item.id === message.id ||
        (message.platformMessageId !== null &&
          item.platformMessageId === message.platformMessageId),
    )

    if (index === -1) {
      return {
        ...current,
        messages: upsertMessageInList(current.messages, message),
      }
    }

    const messages = [...current.messages]
    messages[index] = mergeRealtimeMessage(messages[index], message)
    return { ...current, messages }
  })
}

export function invalidateInboxQueries(
  queryClient: QueryClient,
  selectedConversationId: string | null,
): void {
  void queryClient.invalidateQueries({ queryKey: ['inbox', 'conversations'] })

  if (selectedConversationId !== null) {
    void queryClient.invalidateQueries({ queryKey: inboxKeys.thread(selectedConversationId) })
  }
}
