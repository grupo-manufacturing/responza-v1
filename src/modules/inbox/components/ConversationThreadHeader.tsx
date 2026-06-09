import type { Conversation, Participant } from '@/shared/services/inbox.service'

type PendingContact = {
  readonly displayName: string
  readonly avatarUrl: string | null
}

type ConversationThreadHeaderProps = {
  readonly conversation: Conversation | null
  readonly participants: Participant[]
  readonly pendingContact?: PendingContact | null
  readonly onBack?: () => void
}

function contactDisplayName(
  participants: Participant[],
  conversation: Conversation | null,
  pendingContact: PendingContact | null | undefined,
): string {
  if (participants.length > 0) {
    return participants[0].displayName
  }

  if (pendingContact !== null && pendingContact !== undefined) {
    return pendingContact.displayName
  }

  return conversation?.externalId ?? 'Select a conversation'
}

export function ConversationThreadHeader({
  conversation,
  participants,
  pendingContact,
  onBack,
}: ConversationThreadHeaderProps) {
  const displayName = contactDisplayName(participants, conversation, pendingContact)

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
