import { Spinner } from '@/shared/ui/primitives/Spinner'
import { ContactAvatar } from '@/features/inbox/components/ContactAvatar'
import { INBOX_ICON_BUTTON_CLASS } from '@/features/inbox/lib/inbox-ui'
import type { Conversation, Participant } from '@/features/inbox/api/inbox.service'
import {
  INTEGRATION_PLATFORM_LABELS,
  type IntegrationPlatform,
} from '@/features/integrations/constants'

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
        d="M3 13.125v6.75A1.125 1.125 0 004.125 21h2.25A1.125 1.125 0 007.5 19.875v-6.75A1.125 1.125 0 006.375 12H4.125A1.125 1.125 0 003 13.125zM9.75 8.625v11.25A1.125 1.125 0 0010.875 21h2.25A1.125 1.125 0 0014.25 19.875V8.625A1.125 1.125 0 0013.125 7.5h-2.25A1.125 1.125 0 009.75 8.625zM16.5 4.125v15.75A1.125 1.125 0 0017.625 21h2.25A1.125 1.125 0 0021 19.875V4.125A1.125 1.125 0 0019.875 3h-2.25A1.125 1.125 0 0016.5 4.125z"
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
  platform = null,
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
            className={[INBOX_ICON_BUTTON_CLASS, 'lg:hidden'].join(' ')}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <ContactAvatar
          displayName={displayName}
          avatarUrl={avatarUrl}
          size="md"
          platform={platform ?? undefined}
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink sm:text-base">{displayName}</p>
          {platform !== null && (
            <p className="truncate text-xs text-ink-faint">{INTEGRATION_PLATFORM_LABELS[platform]}</p>
          )}
        </div>
      </div>

      {onAnalyze !== undefined && (
        <button
          type="button"
          onClick={onAnalyze}
          disabled={analyticsDisabled || analyticsLoading}
          aria-label={analyticsLoading ? 'Analyzing conversation' : 'Open conversation analytics'}
          title="AI Analytics"
          className={[
            INBOX_ICON_BUTTON_CLASS,
            !analyticsDisabled && !analyticsLoading
              ? 'text-accent-violet hover:bg-accent-violet/10 hover:text-accent-violet'
              : '',
          ].join(' ')}
        >
          {analyticsLoading ? <Spinner size="sm" variant="muted" /> : <AnalyticsIcon />}
        </button>
      )}
    </div>
  )
}
