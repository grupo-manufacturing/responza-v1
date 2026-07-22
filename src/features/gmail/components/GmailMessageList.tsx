import { useEffect, useRef } from 'react'

import type { GmailMessageListItem } from '@/features/gmail/api/gmail.types'
import { GmailEmptyState } from '@/features/gmail/components/GmailEmptyState'
import { formatGmailSender, formatGmailTimestamp } from '@/features/gmail/constants'
import { gmailListItemSelectedClass, GMAIL_SCROLL_AREA_CLASS } from '@/features/gmail/lib/gmail-ui'
import { Spinner } from '@/shared/ui/primitives/Spinner'

type GmailMessageListProps = {
  messages: GmailMessageListItem[]
  selectedMessageId: string | null
  loading: boolean
  loadingMore: boolean
  hasMore: boolean
  onSelect: (messageId: string) => void
  onLoadMore: () => void
}

export function GmailMessageList({
  messages,
  selectedMessageId,
  loading,
  loadingMore,
  hasMore,
  onSelect,
  onLoadMore,
}: GmailMessageListProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (sentinel === null || !hasMore || loadingMore) {
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

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-12">
        <Spinner />
      </div>
    )
  }

  if (messages.length === 0) {
    return <GmailEmptyState />
  }

  return (
    <div className={`min-h-0 flex-1 ${GMAIL_SCROLL_AREA_CLASS}`}>
      <ul className="divide-y divide-border">
        {messages.map((message) => {
          const isSelected = message.id === selectedMessageId
          return (
            <li key={message.id}>
              <button
                type="button"
                onClick={() => onSelect(message.id)}
                className={[
                  'w-full px-4 py-3 text-left transition-colors',
                  gmailListItemSelectedClass(isSelected),
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="truncate text-sm font-medium text-ink">
                    {formatGmailSender(message.from)}
                  </p>
                  <span className="shrink-0 text-xs text-ink-muted">
                    {formatGmailTimestamp(message.receivedAt)}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm font-medium text-ink">{message.subject}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-muted">
                  {message.snippet}
                </p>
              </button>
            </li>
          )
        })}
      </ul>

      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-4">
          {loadingMore && <Spinner size="sm" />}
        </div>
      )}
    </div>
  )
}
