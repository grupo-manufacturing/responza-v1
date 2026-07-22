import { useEffect, useState } from 'react'

import type { GmailComposeMode } from '@/features/gmail/constants'
import { AppButton, AppLabel, APP_INPUT_CLASS, APP_TEXTAREA_CLASS } from '@/shared/ui/app-ui'
import { Alert } from '@/shared/ui/primitives/Alert'

type GmailComposeModalProps = {
  open: boolean
  mode: GmailComposeMode
  initialTo: string
  initialSubject: string
  sending: boolean
  error: string | null
  onClose: () => void
  onSend: (input: { to: string; subject: string; body: string }) => void
}

export function GmailComposeModal({
  open,
  mode,
  initialTo,
  initialSubject,
  sending,
  error,
  onClose,
  onSend,
}: GmailComposeModalProps) {
  const [to, setTo] = useState(initialTo)
  const [subject, setSubject] = useState(initialSubject)
  const [body, setBody] = useState('')

  useEffect(() => {
    if (!open) {
      return
    }

    setTo(initialTo)
    setSubject(initialSubject)
    setBody('')
  }, [initialSubject, initialTo, open])

  if (!open) {
    return null
  }

  const title = mode === 'reply' ? 'Reply' : 'Compose'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center">
      <div
        className="flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-[var(--radius-card-lg)] border border-border bg-white shadow-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gmail-compose-title"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 id="gmail-compose-title" className="text-lg font-semibold text-ink">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink disabled:opacity-50"
            aria-label="Close compose"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(event) => {
            event.preventDefault()
            onSend({ to: to.trim(), subject: subject.trim(), body: body.trim() })
          }}
        >
          <div className="space-y-4 overflow-y-auto px-5 py-4">
            {error !== null && <Alert variant="error">{error}</Alert>}

            <div>
              <AppLabel htmlFor="gmail-compose-to">To</AppLabel>
              <input
                id="gmail-compose-to"
                type="email"
                value={to}
                onChange={(event) => setTo(event.target.value)}
                disabled={sending || mode === 'reply'}
                required
                className={APP_INPUT_CLASS}
                placeholder="recipient@example.com"
              />
            </div>

            <div>
              <AppLabel htmlFor="gmail-compose-subject">Subject</AppLabel>
              <input
                id="gmail-compose-subject"
                type="text"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                disabled={sending || mode === 'reply'}
                required
                className={APP_INPUT_CLASS}
                placeholder="Email subject"
              />
            </div>

            <div>
              <AppLabel htmlFor="gmail-compose-body">Message</AppLabel>
              <textarea
                id="gmail-compose-body"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                disabled={sending}
                required
                rows={10}
                className={APP_TEXTAREA_CLASS}
                placeholder="Write your message"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-border px-5 py-4">
            <AppButton type="button" variant="secondary" disabled={sending} onClick={onClose}>
              Cancel
            </AppButton>
            <AppButton type="submit" disabled={sending} className="!bg-[#C5221F] hover:!bg-[#A91B1B]">
              {sending ? 'Sending…' : 'Send'}
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  )
}
