import { Link } from 'react-router-dom'

import { ContactAvatar } from '@/modules/inbox/components/ContactAvatar'
import { formatInboxTimestamp } from '@/modules/inbox/inbox.constants'
import type { ConversationListItem } from '@/modules/inbox/inbox.service'
import type { IntegrationPlatform } from '@/modules/integrations/integrations.constants'

const MAX_VISIBLE_ITEMS = 5

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
        <p className="text-sm text-neutral-600">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-neutral-100">
      {conversations.slice(0, MAX_VISIBLE_ITEMS).map((conversation) => {
        const platform = isIntegrationPlatform(conversation.platform)
          ? conversation.platform
          : undefined

        return (
          <li key={conversation.id}>
            <div className="flex items-center gap-3 px-5 py-3">
              <ContactAvatar
                displayName={conversation.displayName}
                avatarUrl={conversation.avatarUrl}
                platform={platform}
                size="md"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-neutral-900">
                    {conversation.displayName}
                  </p>
                  <span className="shrink-0 text-xs text-neutral-500">
                    {formatInboxTimestamp(conversation.lastMessageAt)}
                  </span>
                </div>
                {conversation.lastMessage !== null && conversation.lastMessage.length > 0 && (
                  <p className="mt-0.5 truncate text-xs text-neutral-500">{conversation.lastMessage}</p>
                )}
              </div>

              <Link
                to={`/inbox?conversation=${conversation.id}`}
                className="shrink-0 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-900 transition-colors hover:bg-neutral-50"
              >
                {actionLabel}
              </Link>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
