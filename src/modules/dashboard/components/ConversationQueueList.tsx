import { Link } from 'react-router-dom'

import { ContactAvatar } from '@/modules/inbox/components/ContactAvatar'
import { formatInboxTimestamp } from '@/modules/inbox/inbox.constants'
import type { ConversationListItem } from '@/modules/inbox/inbox.service'
import type { IntegrationPlatform } from '@/modules/integrations/integrations.constants'

const MAX_VISIBLE_ITEMS = 5

const QUEUE_ACTION_CLASS =
  'inline-flex items-center rounded-[var(--radius-pill)] border border-border bg-white/80 px-3 py-1.5 text-xs font-medium leading-none text-ink transition-colors hover:border-accent/30 hover:bg-accent/5 hover:text-accent'

type ConversationQueueListProps = {
  readonly conversations: ConversationListItem[]
  readonly emptyMessage: string
  readonly actionLabel: string
}

function isIntegrationPlatform(value: string): value is IntegrationPlatform {
  return value === 'whatsapp' || value === 'instagram' || value === 'indiamart'
}

export function ConversationQueueList({
  conversations,
  emptyMessage,
  actionLabel,
}: ConversationQueueListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-6 py-10 text-center">
        <p className="text-sm text-ink-muted">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-border">
      {conversations.slice(0, MAX_VISIBLE_ITEMS).map((conversation) => {
        const platform = isIntegrationPlatform(conversation.platform)
          ? conversation.platform
          : undefined

        return (
          <li key={conversation.id}>
            <div className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-surface-muted/60">
              <ContactAvatar
                displayName={conversation.displayName}
                avatarUrl={conversation.avatarUrl}
                platform={platform}
                size="md"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{conversation.displayName}</p>
                {conversation.lastMessage !== null && conversation.lastMessage.length > 0 && (
                  <p className="mt-0.5 truncate text-xs text-ink-muted">{conversation.lastMessage}</p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className="text-xs leading-none whitespace-nowrap text-ink-faint">
                  {formatInboxTimestamp(conversation.lastMessageAt)}
                </span>
                <Link to={`/inbox?conversation=${conversation.id}`} className={QUEUE_ACTION_CLASS}>
                  {actionLabel}
                </Link>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
