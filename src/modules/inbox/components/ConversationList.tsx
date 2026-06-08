import type { InboxPlatformFilter } from '@/shared/constants/inbox'
import { INBOX_PLATFORM_FILTERS } from '@/shared/constants/inbox'
import type { Conversation } from '@/shared/services/inbox.service'

import {
  formatInboxTime,
  getConversationPlatformLabel,
  getConversationTitle,
  getMessagePreview,
} from '@/modules/inbox/inbox-display'

type ConversationListProps = {
  conversations: Conversation[]
  selectedId: string | null
  loading: boolean
  loadingMore: boolean
  hasMore: boolean
  platformFilter: InboxPlatformFilter
  onPlatformFilterChange: (platform: InboxPlatformFilter) => void
  onSelect: (conversation: Conversation) => void
  onLoadMore: () => void
}

export function ConversationList({
  conversations,
  selectedId,
  loading,
  loadingMore,
  hasMore,
  platformFilter,
  onPlatformFilterChange,
  onSelect,
  onLoadMore,
}: ConversationListProps) {
  return (
    <div className="flex h-full min-h-0 flex-col border-neutral-200 bg-white lg:border-r">
      <div className="shrink-0 border-b border-neutral-200 p-4">
        <h2 className="mb-3 text-sm font-semibold text-neutral-900">Conversations</h2>

        <div className="flex flex-wrap gap-2">
          {INBOX_PLATFORM_FILTERS.map((filter) => {
            const active = platformFilter === filter.value
            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => onPlatformFilterChange(filter.value)}
                className={[
                  'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                  active
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
                ].join(' ')}
              >
                {filter.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading && conversations.length === 0 && (
          <p className="p-4 text-sm text-neutral-500">Loading conversations…</p>
        )}

        {!loading && conversations.length === 0 && (
          <div className="p-4 text-sm text-neutral-600">
            <p>No conversations yet.</p>
            <p className="mt-2 text-neutral-500">
              Threads appear automatically when customers message you on a connected platform.
            </p>
          </div>
        )}

        <ul className="divide-y divide-neutral-100">
          {conversations.map((conversation) => {
            const selected = conversation.id === selectedId
            const title = getConversationTitle(conversation)
            const preview = getMessagePreview(conversation.latestMessage)
            const time = formatInboxTime(conversation.lastMessageAt ?? conversation.createdAt)

            return (
              <li key={conversation.id}>
                <button
                  type="button"
                  onClick={() => onSelect(conversation)}
                  className={[
                    'flex w-full gap-3 px-4 py-3 text-left transition-colors',
                    selected ? 'bg-neutral-100' : 'hover:bg-neutral-50',
                  ].join(' ')}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-sm font-semibold text-neutral-700">
                    {title.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-medium text-neutral-900">{title}</p>
                      {time.length > 0 && (
                        <span className="shrink-0 text-xs text-neutral-500">{time}</span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-neutral-500">{preview}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                        {getConversationPlatformLabel(conversation)}
                      </span>
                      {conversation.unreadCount > 0 && (
                        <span className="rounded-full bg-neutral-900 px-1.5 py-0.5 text-[10px] font-medium text-white">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>

        {hasMore && (
          <div className="border-t border-neutral-100 p-3">
            <button
              type="button"
              disabled={loadingMore}
              onClick={onLoadMore}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 disabled:opacity-50"
            >
              {loadingMore ? 'Loading…' : 'Load more'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
