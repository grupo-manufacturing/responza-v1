import { ContactAvatar } from '@/modules/inbox/components/ContactAvatar'
import { InboxEmptyState } from '@/modules/inbox/components/InboxEmptyState'
import {
  conversationListSelectedBorderClass,
  formatInboxContactDisplayName,
} from '@/modules/inbox/lib/contactDisplay'
import type { InboxPlatformFilter } from '@/shared/constants/inbox'
import { formatInboxTimestamp } from '@/shared/constants/inbox'
import type { ConversationListItem } from '@/shared/services/inbox.service'

type ConversationListProps = {
  readonly conversations: ConversationListItem[]
  readonly selectedId: string | null
  readonly platformFilter?: InboxPlatformFilter
  readonly onSelect: (conversation: ConversationListItem) => void
}

export function ConversationList({
  conversations,
  selectedId,
  platformFilter = 'all',
  onSelect,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return <InboxEmptyState platformFilter={platformFilter} />
  }

  return (
    <ul className="divide-y divide-neutral-100 overflow-y-auto">
      {conversations.map((conversation) => {
        const isSelected = conversation.id === selectedId
        const contactName = formatInboxContactDisplayName(
          conversation.platform,
          conversation.displayName,
        )

        return (
          <li key={conversation.id}>
            <button
              type="button"
              onClick={() => onSelect(conversation)}
              className={[
                'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors',
                isSelected ? 'bg-neutral-100' : 'hover:bg-neutral-50',
                conversationListSelectedBorderClass(conversation.platform, isSelected),
              ].join(' ')}
            >
              <ContactAvatar
                displayName={contactName}
                avatarUrl={conversation.avatarUrl}
                platform={conversation.platform}
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-neutral-900">{contactName}</p>
                  <span className="shrink-0 text-xs text-neutral-500">
                    {formatInboxTimestamp(conversation.lastMessageAt)}
                  </span>
                </div>
                {conversation.lastMessage !== null && conversation.lastMessage.length > 0 && (
                  <p className="mt-0.5 truncate text-xs text-neutral-500">
                    {conversation.lastMessage}
                  </p>
                )}
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
