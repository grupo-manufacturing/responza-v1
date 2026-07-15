import type { InfiniteData } from '@tanstack/react-query'

import type {
  ConversationDetailResponse,
  ConversationListItem,
  ListConversationsResponse,
  Message,
} from '@/features/inbox/api/inbox.service'

export type ThreadInfiniteData = InfiniteData<ConversationDetailResponse, string | undefined>
export type ConversationsInfiniteData = InfiniteData<ListConversationsResponse, string | undefined>

export function flattenThreadMessages(data: ThreadInfiniteData | undefined): Message[] {
  if (data === undefined) {
    return []
  }

  return [...data.pages].reverse().flatMap((page) => page.messages)
}

export function flattenConversations(
  data: ConversationsInfiniteData | undefined,
): ConversationListItem[] {
  if (data === undefined) {
    return []
  }

  return data.pages.flatMap((page) => page.conversations)
}

export function updateThreadFirstPage(
  current: ThreadInfiniteData,
  updater: (page: ConversationDetailResponse) => ConversationDetailResponse,
): ThreadInfiniteData {
  if (current.pages.length === 0) {
    return current
  }

  const pages = [...current.pages]
  pages[0] = updater(pages[0])
  return { ...current, pages }
}

export function bumpConversationInList(
  current: ConversationsInfiniteData,
  conversationId: string,
  patch: Partial<ConversationListItem>,
): ConversationsInfiniteData {
  if (current.pages.length === 0) {
    return current
  }

  let bumped: ConversationListItem | null = null
  const pages = current.pages.map((page) => ({
    ...page,
    conversations: page.conversations.filter((item) => {
      if (item.id === conversationId) {
        bumped = { ...item, ...patch }
        return false
      }
      return true
    }),
  }))

  if (bumped === null) {
    return current
  }

  pages[0] = {
    ...pages[0],
    conversations: [bumped, ...pages[0].conversations],
  }

  return { ...current, pages }
}
