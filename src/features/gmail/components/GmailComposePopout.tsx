import { useEffect, useState } from 'react'

import type { GmailComposeMode } from '@/features/gmail/constants'
import { GMAIL_PRIMARY_BUTTON_CLASS } from '@/features/gmail/lib/gmail-ui'
import { AppButton } from '@/shared/ui/app-ui'
import { Alert } from '@/shared/ui/primitives/Alert'

type GmailComposePopoutProps = {
  open: boolean
  mode: GmailComposeMode
  initialTo: string
  initialSubject: string
  sending: boolean
  error: string | null
  onClose: () => void
  onSend: (input: { to: string; subject: string; body: string }) => void
}

const COMPOSE_FIELD_CLASS =
  'w-full border-0 bg-transparent px-4 py-2 text-sm text-ink outline-none placeholder:text-ink-faint disabled:opacity-60'

export function GmailComposePopout({
  open,
  mode,
  initialTo,
  initialSubject,
  sending,
  error,
  onClose,
  onSend,
}: GmailComposePopoutProps) {
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

  const title = mode === 'reply' ? 'Reply' : 'New Message'

  return (
    <div
      className="animate-step-in absolute right-3 bottom-3 z-20 flex max-h-[min(340px,42dvh)] w-[min(30rem,calc(100%-1.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-[0_8px_32px_rgb(0_0_0_/_0.16)]"
      role="dialog"
      aria-modal="false"
      aria-labelledby="gmail-compose-title"
    >
      <div className="flex items-center justify-between bg-[#323232] px-4 py-2.5 text-white">
        <h2 id="gmail-compose-title" className="text-sm font-medium">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          disabled={sending}
          className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
          aria-label="Close compose"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="min-h-0 flex-1 overflow-y-auto">
          {error !== null && (
            <div className="px-4 pt-2">
              <Alert variant="error">{error}</Alert>
            </div>
          )}

          <div className="border-b border-border">
            <input
              id="gmail-compose-to"
              type="email"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              disabled={sending || mode === 'reply'}
              required
              className={COMPOSE_FIELD_CLASS}
              placeholder="Recipients"
            />
          </div>

          <div className="border-b border-border">
            <input
              id="gmail-compose-subject"
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              disabled={sending || mode === 'reply'}
              required
              className={COMPOSE_FIELD_CLASS}
              placeholder="Subject"
            />
          </div>

          <textarea
            id="gmail-compose-body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            disabled={sending}
            required
            rows={3}
            className={`${COMPOSE_FIELD_CLASS} min-h-[72px] resize-none py-2.5`}
            placeholder=""
          />
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-4 py-2.5">
          <AppButton type="button" variant="secondary" disabled={sending} onClick={onClose}>
            Discard
          </AppButton>
          <AppButton type="submit" disabled={sending} className={GMAIL_PRIMARY_BUTTON_CLASS}>
            {sending ? 'Sending…' : 'Send'}
          </AppButton>
        </div>
      </form>
    </div>
  )
}
