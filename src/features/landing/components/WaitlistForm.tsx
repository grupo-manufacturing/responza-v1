import { useState, type FormEvent } from 'react'

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:4000').replace(/\/+$/, '')
const WAITLIST_COUNT = 2511

type Status =
  | { readonly kind: 'idle' }
  | { readonly kind: 'submitting' }
  | { readonly kind: 'joined' }
  | { readonly kind: 'error'; readonly message: string }

function WaitlistCountLine() {
  return (
    <p className="mt-4 text-center text-sm text-ink sm:text-[15px]">
      Join{' '}
      <span className="text-[1.15em] font-bold tracking-tight text-waitlist-count">
        {WAITLIST_COUNT.toLocaleString('en-IN')}
      </span>{' '}
      others on the waitlist.
    </p>
  )
}

export function WaitlistForm({ align = 'center' }: { readonly align?: 'center' | 'left' }) {
  const alignClass = align === 'center' ? 'mx-auto' : ''
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const payload = {
      email: String(form.get('email') ?? ''),
      website: String(form.get('website') ?? ''),
    }

    setStatus({ kind: 'submitting' })
    try {
      const response = await fetch(`${API_URL}/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setStatus({ kind: 'joined' })
        return
      }

      const body = (await response.json().catch(() => null)) as {
        error?: { message?: string; details?: { email?: string[] } }
      } | null
      setStatus({
        kind: 'error',
        message: body?.error?.details?.email?.[0] ?? body?.error?.message ?? 'Something went wrong. Please try again.',
      })
    } catch {
      setStatus({ kind: 'error', message: 'Could not reach the server. Check your connection and try again.' })
    }
  }

  if (status.kind === 'joined') {
    return (
      <div className={`${alignClass} max-w-lg`}>
        <div
          className={`glass-dark rounded-[var(--radius-card-lg)] px-6 py-6 ${align === 'center' ? 'text-center' : 'text-left'}`}
          role="status"
        >
          <p className="text-lg font-semibold text-on-dark">You&apos;re on the list!</p>
          <p className="mt-2 text-sm text-on-dark-muted">
            Thanks for your interest. We&apos;ll email you as soon as Responza is ready to download.
          </p>
        </div>
        <WaitlistCountLine />
      </div>
    )
  }

  const submitting = status.kind === 'submitting'

  return (
    <div className={`${alignClass} max-w-lg`}>
      <form onSubmit={handleSubmit} noValidate className="relative">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="waitlist-email" className="sr-only">
            Email address
          </label>
          <input
            id="waitlist-email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            placeholder="you@business.com"
            aria-invalid={status.kind === 'error'}
            aria-describedby={status.kind === 'error' ? 'waitlist-error' : undefined}
            className="h-12 min-w-0 flex-1 rounded-[var(--radius-pill)] border border-border-dark bg-ink/[0.04] px-5 text-sm text-on-dark outline-none transition-colors placeholder:text-on-dark-muted/70 focus:border-accent/60 focus:bg-ink/[0.07] sm:h-12"
          />
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-[var(--radius-pill)] bg-btn px-6 text-sm font-medium text-btn-fg transition-colors hover:bg-btn-hover disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? 'Joining…' : 'Join the waitlist'}
          </button>
        </div>

        <div className="absolute -left-[9999px]" aria-hidden>
          <label htmlFor="waitlist-website">Website</label>
          <input id="waitlist-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {status.kind === 'error' && (
          <p
            id="waitlist-error"
            className={`mt-3 text-sm text-accent-warm ${align === 'center' ? 'text-center' : ''}`}
            role="alert"
          >
            {status.message}
          </p>
        )}
      </form>
      <WaitlistCountLine />
    </div>
  )
}
