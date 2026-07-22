import type { GmailMessageDetail } from '@/features/gmail/api/gmail.types'
import { formatGmailTimestamp } from '@/features/gmail/constants'
import { GMAIL_PANEL_HEADER_CLASS } from '@/features/gmail/lib/gmail-ui'

type GmailMessageHeaderProps = {
  message: GmailMessageDetail | null
  onBack?: () => void
}

export function GmailMessageHeader({ message, onBack }: GmailMessageHeaderProps) {
  return (
    <div className={GMAIL_PANEL_HEADER_CLASS}>
      <div className="flex items-start gap-2">
        {onBack !== undefined && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink lg:hidden"
            aria-label="Back to inbox"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-semibold text-ink">
            {message?.subject ?? 'Select an email'}
          </h2>
          {message !== null && (
            <div className="mt-1 space-y-0.5 text-xs text-ink-muted">
              <p className="truncate">
                <span className="font-medium text-ink-muted">From:</span> {message.from}
              </p>
              <p className="truncate">
                <span className="font-medium text-ink-muted">To:</span> {message.to}
              </p>
              <p>{formatGmailTimestamp(message.receivedAt)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
