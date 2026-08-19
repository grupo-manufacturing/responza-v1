import type { GmailMessageDetail } from '@/features/gmail/api/gmail.types'
import {
  extractEmailAddress,
  formatGmailDetailTimestamp,
  formatGmailSender,
} from '@/features/gmail/constants'
import { GMAIL_AVATAR_CLASS } from '@/features/gmail/lib/gmail-ui'
import { INBOX_ICON_BUTTON_CLASS, INBOX_PANEL_HEADER_CLASS } from '@/features/inbox/lib/inbox-ui'

type GmailMessageHeaderProps = {
  message: GmailMessageDetail | null
  onBack?: () => void
}

function senderInitial(name: string): string {
  const trimmed = name.trim()
  return trimmed.length > 0 ? trimmed.charAt(0).toUpperCase() : '?'
}

export function GmailMessageHeader({ message, onBack }: GmailMessageHeaderProps) {
  if (message === null) {
    return null
  }

  const senderName = formatGmailSender(message.from)

  return (
    <div className={INBOX_PANEL_HEADER_CLASS}>
      <div className="flex items-start gap-2">
        {onBack !== undefined && (
          <button
            type="button"
            onClick={onBack}
            className={[INBOX_ICON_BUTTON_CLASS, 'lg:hidden'].join(' ')}
            aria-label="Back to inbox"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold leading-snug text-ink">{message.subject}</h2>

          <div className="mt-3 flex items-start gap-3">
            <div className={GMAIL_AVATAR_CLASS} aria-hidden>
              {senderInitial(senderName)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{senderName}</p>
                  <p className="truncate text-xs text-ink-muted">{extractEmailAddress(message.from)}</p>
                </div>
                <time
                  className="shrink-0 text-xs leading-5 text-ink-muted"
                  dateTime={message.receivedAt}
                >
                  {formatGmailDetailTimestamp(message.receivedAt)}
                </time>
              </div>

              <p className="mt-1.5 truncate text-xs text-ink-muted">
                to <span className="font-medium text-ink">{extractEmailAddress(message.to)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
