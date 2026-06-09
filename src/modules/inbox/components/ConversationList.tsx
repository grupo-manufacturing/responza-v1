import { ContactAvatar } from '@/modules/inbox/components/ContactAvatar'
import { InboxEmptyState } from '@/modules/inbox/components/InboxEmptyState'
import { PlatformBadge } from '@/modules/inbox/components/PlatformBadge'
import { formatInboxTimestamp } from '@/shared/constants/inbox'
import type { ConversationListItem } from '@/shared/services/inbox.service'

type ConversationListProps = {
  readonly conversations: ConversationListItem[]
  readonly selectedId: string | null
  readonly onSelect: (conversation: ConversationListItem) => void
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  if (conversations.length === 0) {
    return <InboxEmptyState />
  }

  return (
    <ul className="divide-y divide-neutral-100 overflow-y-auto">
      {conversations.map((conversation) => {
        const isSelected = conversation.id === selectedId

        return (
          <li key={conversation.id}>
            <button
              type="button"
              onClick={() => onSelect(conversation)}
              className={[
                'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors',
                isSelected ? 'bg-neutral-100' : 'hover:bg-neutral-50',
                conversation.platform === 'whatsapp' && isSelected ? 'border-l-2 border-[#25D366]' : '',
              ].join(' ')}
            >
              <ContactAvatar
                displayName={conversation.displayName}
                avatarUrl={conversation.avatarUrl}
                platform={conversation.platform}
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <p className="truncate text-sm font-medium text-neutral-900">
                      {conversation.displayName}
                    </p>
                    <PlatformBadge platform={conversation.platform} />
                  </div>
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
