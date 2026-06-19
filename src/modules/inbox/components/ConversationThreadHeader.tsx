import { Spinner } from '@/components/ui/Spinner'
import { ContactAvatar } from '@/modules/inbox/components/ContactAvatar'
import type { Conversation, Participant } from '@/modules/inbox/inbox.service'

type PendingContact = {
  readonly displayName: string
  readonly avatarUrl: string | null
}

type ConversationThreadHeaderProps = {
  readonly conversation: Conversation | null
  readonly participants: Participant[]
  readonly pendingContact?: PendingContact | null
  readonly onBack?: () => void
  readonly analyticsLoading?: boolean
  readonly analyticsDisabled?: boolean
  readonly onAnalyze?: () => void
}

function AnalyticsIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
      />
    </svg>
  )
}

function resolveContactPresentation(
  participants: Participant[],
  conversation: Conversation | null,
  pendingContact: PendingContact | null | undefined,
): { displayName: string; avatarUrl: string | null } {
  if (participants.length > 0) {
    return {
      displayName: participants[0].displayName,
      avatarUrl: participants[0].avatarUrl,
    }
  }

  if (pendingContact !== null && pendingContact !== undefined) {
    return {
      displayName: pendingContact.displayName,
      avatarUrl: pendingContact.avatarUrl,
    }
  }

  return {
    displayName: conversation?.externalId ?? 'Select a conversation',
    avatarUrl: null,
  }
}

export function ConversationThreadHeader({
  conversation,
  participants,
  pendingContact,
  onBack,
  analyticsLoading = false,
  analyticsDisabled = false,
  onAnalyze,
}: ConversationThreadHeaderProps) {
  const { displayName, avatarUrl } = resolveContactPresentation(
    participants,
    conversation,
    pendingContact,
  )

  return (
    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
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

        <ContactAvatar displayName={displayName} avatarUrl={avatarUrl} size="md" />
        <p className="min-w-0 truncate text-base font-bold text-neutral-900">{displayName}</p>
      </div>

      {onAnalyze !== undefined && (
        <button
          type="button"
          onClick={onAnalyze}
          disabled={analyticsDisabled || analyticsLoading}
          aria-label={analyticsLoading ? 'Analyzing conversation' : 'Open conversation analytics'}
          title="AI Analytics"
          className={[
            'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-violet-600 transition-colors',
            !analyticsDisabled && !analyticsLoading
              ? 'hover:bg-violet-50 hover:text-violet-700'
              : 'cursor-not-allowed opacity-40',
          ].join(' ')}
        >
          {analyticsLoading ? <Spinner size="sm" variant="muted" /> : <AnalyticsIcon />}
        </button>
      )}
    </div>
  )
}
