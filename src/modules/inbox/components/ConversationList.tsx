import { useEffect, useRef } from 'react'

import { Spinner } from '@/components/ui/Spinner'
import { ContactAvatar } from '@/modules/inbox/components/ContactAvatar'
import { InboxEmptyState } from '@/modules/inbox/components/InboxEmptyState'
import { formatInboxTimestamp } from '@/modules/inbox/inbox.constants'
import { listItemSelectedClass } from '@/modules/inbox/inbox-ui'
import type { ConversationListItem } from '@/modules/inbox/inbox.service'

type ConversationListProps = {
  readonly conversations: ConversationListItem[]
  readonly selectedId: string | null
  readonly hasMore: boolean
  readonly loadingMore: boolean
  readonly onLoadMore: () => void
  readonly onSelect: (conversation: ConversationListItem) => void
}

export function ConversationList({
  conversations,
  selectedId,
  hasMore,
  loadingMore,
  onLoadMore,
  onSelect,
}: ConversationListProps) {
  const sentinelRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (!hasMore || loadingMore) {
      return
    }

    const sentinel = sentinelRef.current
    if (sentinel === null) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore()
        }
      },
      { rootMargin: '120px' },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loadingMore, onLoadMore])

  if (conversations.length === 0) {
    return <InboxEmptyState />
  }

  return (
    <ul className="min-h-0 flex-1 divide-y divide-border overflow-y-auto">
      {conversations.map((conversation) => {
        const isSelected = conversation.id === selectedId

        return (
          <li key={conversation.id}>
            <button
              type="button"
              onClick={() => onSelect(conversation)}
              className={[
                'flex w-full items-center gap-3 px-3 py-3 text-left transition-colors sm:px-4',
                listItemSelectedClass(conversation.platform, isSelected),
              ].join(' ')}
            >
              <ContactAvatar
                displayName={conversation.displayName}
                avatarUrl={conversation.avatarUrl}
                platform={conversation.platform}
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{conversation.displayName}</p>
                {conversation.lastMessage !== null && conversation.lastMessage.length > 0 && (
                  <p className="mt-0.5 truncate text-xs text-ink-muted">{conversation.lastMessage}</p>
                )}
              </div>

              <span className="shrink-0 self-center text-xs leading-none whitespace-nowrap text-ink-faint">
                {formatInboxTimestamp(conversation.lastMessageAt)}
              </span>
            </button>
          </li>
        )
      })}

      {hasMore && (
        <li ref={sentinelRef} className="flex justify-center py-4">
          {loadingMore && <Spinner size="sm" variant="muted" />}
        </li>
      )}
    </ul>
  )
}
