import { formatInboxContactDisplayName } from '@/modules/inbox/lib/contactDisplay'
import type { IntegrationPlatform } from '@/shared/constants/integrations'
import type { Conversation, Participant } from '@/shared/services/inbox.service'

type PendingContact = {
  readonly displayName: string
  readonly avatarUrl: string | null
}

type ConversationThreadHeaderProps = {
  readonly conversation: Conversation | null
  readonly participants: Participant[]
  readonly platform?: IntegrationPlatform | null
  readonly pendingContact?: PendingContact | null
  readonly onBack?: () => void
}

function contactDisplayName(
  participants: Participant[],
  conversation: Conversation | null,
  pendingContact: PendingContact | null | undefined,
  platform: IntegrationPlatform | null | undefined,
): string {
  let rawName: string | null = null

  if (participants.length > 0) {
    rawName = participants[0].displayName
  } else if (pendingContact !== null && pendingContact !== undefined) {
    rawName = pendingContact.displayName
  } else if (conversation !== null) {
    rawName = conversation.externalId
  }

  if (rawName === null || rawName.length === 0) {
    return 'Select a conversation'
  }

  if (platform !== null && platform !== undefined) {
    return formatInboxContactDisplayName(platform, rawName)
  }

  return rawName
}

export function ConversationThreadHeader({
  conversation,
  participants,
  platform = null,
  pendingContact,
  onBack,
}: ConversationThreadHeaderProps) {
  const displayName = contactDisplayName(participants, conversation, pendingContact, platform)

  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      {onBack !== undefined && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to conversations"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 lg:hidden"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <p className="min-w-0 truncate text-base font-bold text-neutral-900">{displayName}</p>
    </div>
  )
}
