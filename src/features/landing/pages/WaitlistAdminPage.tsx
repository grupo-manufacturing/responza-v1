import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'

import { SEO_PAGES } from '@/shared/seo/seo.constants'
import { usePageMeta } from '@/shared/seo/usePageMeta'
import { LandingButton, LandingLogo, Reveal } from '@/shared/ui/brand-ui'
import { SiteFooter } from '@/shared/ui/site-chrome'

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:4000').replace(/\/+$/, '')
const TOKEN_STORAGE_KEY = 'responza.adminToken'

type WaitlistSignup = {
  readonly email: string
  readonly createdAt: string
}

type LoadState =
  | { readonly kind: 'idle' }
  | { readonly kind: 'loading' }
  | { readonly kind: 'ready'; readonly total: number; readonly signups: readonly WaitlistSignup[] }
  | { readonly kind: 'error'; readonly message: string }

function readStoredToken(): string {
  try {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

function writeStoredToken(token: string): void {
  try {
    if (token.length === 0) {
      sessionStorage.removeItem(TOKEN_STORAGE_KEY)
      return
    }
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token)
  } catch {
    // Ignore storage failures (private mode, etc.)
  }
}

function formatJoinedAt(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function toCsv(signups: readonly WaitlistSignup[]): string {
  const rows = ['email,created_at', ...signups.map((row) => `${JSON.stringify(row.email)},${JSON.stringify(row.createdAt)}`)]
  return `${rows.join('\n')}\n`
}

export function WaitlistAdminPage() {
  usePageMeta(SEO_PAGES.waitlistAdmin)

  const [tokenInput, setTokenInput] = useState('')
  const [token, setToken] = useState('')
  const [query, setQuery] = useState('')
  const [state, setState] = useState<LoadState>({ kind: 'idle' })

  const loadSignups = useCallback(async (adminToken: string) => {
    setState({ kind: 'loading' })
    try {
      const response = await fetch(`${API_URL}/waitlist`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      })

      if (response.status === 401) {
        writeStoredToken('')
        setToken('')
        setState({ kind: 'error', message: 'Invalid admin token. Try again.' })
        return
      }

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: { message?: string } } | null
        setState({
          kind: 'error',
          message: body?.error?.message ?? 'Could not load the waitlist. Please try again.',
        })
        return
      }

      const body = (await response.json()) as {
        total: number
        signups: WaitlistSignup[]
      }
      setState({ kind: 'ready', total: body.total, signups: body.signups })
    } catch {
      setState({ kind: 'error', message: 'Could not reach the server. Check your connection and try again.' })
    }
  }, [])

  useEffect(() => {
    const stored = readStoredToken()
    if (stored.length === 0) return
    setToken(stored)
    setTokenInput(stored)
    void loadSignups(stored)
  }, [loadSignups])

  const filtered = useMemo(() => {
    if (state.kind !== 'ready') return []
    const needle = query.trim().toLowerCase()
    if (needle.length === 0) return state.signups
    return state.signups.filter((row) => row.email.includes(needle))
  }, [query, state])

  function handleUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = tokenInput.trim()
    if (next.length === 0) {
      setState({ kind: 'error', message: 'Enter the admin token.' })
      return
    }
    writeStoredToken(next)
    setToken(next)
    void loadSignups(next)
  }

  function handleLock() {
    writeStoredToken('')
    setToken('')
    setTokenInput('')
    setQuery('')
    setState({ kind: 'idle' })
  }

  function handleExport() {
    if (state.kind !== 'ready') return
    const blob = new Blob([toCsv(state.signups)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `responza-waitlist-${new Date().toISOString().slice(0, 10)}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const unlocked = token.length > 0

  return (
    <div className="flex min-h-screen flex-col bg-surface-light">
      <header className="fixed top-0 right-0 left-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
        <div className="glass-strong mx-auto flex h-14 max-w-5xl items-center justify-between rounded-2xl px-4 shadow-soft sm:px-6 lg:rounded-[var(--radius-pill)]">
          <LandingLogo className="h-[13px] sm:h-[15px]" />
          <div className="flex items-center gap-2">
            {unlocked && (
              <button
                type="button"
                onClick={handleLock}
                className="rounded-[var(--radius-pill)] px-3 py-1.5 text-sm text-on-dark-muted transition-colors hover:text-on-dark"
              >
                Lock
              </button>
            )}
            <LandingButton to="/" variant="secondary" className="py-2">
              Back to home
            </LandingButton>
          </div>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-5xl flex-1 px-4 pt-28 pb-16 sm:px-6 sm:pt-32 sm:pb-20">
        <div
          className="pointer-events-none absolute top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-glow-mint/15 blur-[110px]"
          aria-hidden
        />

        <Reveal className="relative">
          <p className="text-[11px] font-medium tracking-[0.16em] text-ink-faint uppercase">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-5xl">
            Waitlist <span className="text-accent-gradient">signups</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
            Private list of emails collected from the landing page waitlist form.
          </p>
        </Reveal>

        {!unlocked ? (
          <Reveal delay={80} className="relative mt-10">
            <form
              onSubmit={handleUnlock}
              className="card-surface mx-auto max-w-md rounded-[var(--radius-card-lg)] p-6 sm:p-8"
            >
              <label htmlFor="admin-token" className="block text-sm font-medium text-on-dark">
                Admin token
              </label>
              <p className="mt-1 text-xs text-ink-faint">
                Same value as <code className="text-on-dark-muted">ADMIN_TOKEN</code> on the API.
              </p>
              <input
                id="admin-token"
                type="password"
                autoComplete="current-password"
                value={tokenInput}
                onChange={(event) => setTokenInput(event.target.value)}
                className="mt-4 h-12 w-full rounded-[var(--radius-pill)] border border-border-dark bg-ink/[0.04] px-5 text-sm text-on-dark outline-none transition-colors placeholder:text-on-dark-muted/70 focus:border-accent/60 focus:bg-ink/[0.07]"
                placeholder="Paste admin token"
              />
              <button
                type="submit"
                className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-[var(--radius-pill)] bg-btn px-6 text-sm font-medium text-btn-fg transition-colors hover:bg-btn-hover"
              >
                Unlock waitlist
              </button>
              {state.kind === 'error' && (
                <p className="mt-3 text-center text-sm text-accent-warm" role="alert">
                  {state.message}
                </p>
              )}
            </form>
          </Reveal>
        ) : (
          <Reveal delay={80} className="relative mt-10 space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-[var(--radius-pill)] border border-border-dark bg-ink/[0.04] px-4 py-2 text-sm text-on-dark">
                  {state.kind === 'ready' ? (
                    <>
                      <span className="font-semibold text-accent-gradient">{state.total.toLocaleString('en-IN')}</span>
                      <span className="text-on-dark-muted"> total</span>
                    </>
                  ) : (
                    <span className="text-on-dark-muted">Loading…</span>
                  )}
                </div>
                {state.kind === 'ready' && query.trim().length > 0 && (
                  <p className="text-xs text-ink-faint">
                    Showing {filtered.length.toLocaleString('en-IN')} match
                    {filtered.length === 1 ? '' : 'es'}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void loadSignups(token)}
                  className="rounded-[var(--radius-pill)] border border-border-dark bg-ink/[0.04] px-4 py-2 text-sm text-on-dark transition-colors hover:bg-ink/[0.07]"
                >
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  disabled={state.kind !== 'ready' || state.signups.length === 0}
                  className="rounded-[var(--radius-pill)] bg-btn px-4 py-2 text-sm font-medium text-btn-fg transition-colors hover:bg-btn-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Export CSV
                </button>
              </div>
            </div>

            <label htmlFor="waitlist-search" className="sr-only">
              Search emails
            </label>
            <input
              id="waitlist-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by email…"
              className="h-12 w-full rounded-[var(--radius-pill)] border border-border-dark bg-ink/[0.04] px-5 text-sm text-on-dark outline-none transition-colors placeholder:text-on-dark-muted/70 focus:border-accent/60 focus:bg-ink/[0.07]"
            />

            {state.kind === 'loading' && (
              <div className="card-surface rounded-[var(--radius-card-lg)] px-6 py-12 text-center text-sm text-on-dark-muted">
                Loading signups…
              </div>
            )}

            {state.kind === 'error' && (
              <div className="card-surface rounded-[var(--radius-card-lg)] px-6 py-8 text-center" role="alert">
                <p className="text-sm text-accent-warm">{state.message}</p>
                <button
                  type="button"
                  onClick={() => void loadSignups(token)}
                  className="mt-4 text-sm font-medium text-on-dark underline underline-offset-2"
                >
                  Try again
                </button>
              </div>
            )}

            {state.kind === 'ready' && filtered.length === 0 && (
              <div className="card-surface rounded-[var(--radius-card-lg)] px-6 py-12 text-center text-sm text-on-dark-muted">
                {state.total === 0 ? 'No waitlist signups yet.' : 'No emails match that search.'}
              </div>
            )}

            {state.kind === 'ready' && filtered.length > 0 && (
              <div className="card-surface overflow-hidden rounded-[var(--radius-card-lg)]">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-border-dark bg-ink/[0.03] text-[11px] font-medium tracking-[0.12em] text-ink-faint uppercase">
                      <tr>
                        <th className="px-5 py-3.5">Email</th>
                        <th className="px-5 py-3.5 whitespace-nowrap">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-dark">
                      {filtered.map((row) => (
                        <tr key={`${row.email}-${row.createdAt}`} className="transition-colors hover:bg-ink/[0.03]">
                          <td className="px-5 py-3.5 font-medium break-all text-on-dark">{row.email}</td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-on-dark-muted">
                            {formatJoinedAt(row.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Reveal>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
