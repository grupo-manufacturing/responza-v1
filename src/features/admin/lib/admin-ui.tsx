import type { ReactNode } from 'react'

import { Alert } from '@/shared/ui/primitives/Alert'
import { SpinnerSection } from '@/shared/ui/primitives/Spinner'

export function formatAdminDate(value: string | null): string {
  if (value === null) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function AdminStatusPill({ status }: { readonly status: string }) {
  const styles =
    status === 'active'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : status === 'trialing'
        ? 'bg-amber-50 text-amber-800 border-amber-200'
        : 'bg-red-50 text-red-700 border-red-200'

  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${styles}`}>
      {status}
    </span>
  )
}

export function AdminMetricCard({ label, value }: { readonly label: string; readonly value: number }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-white px-4 py-4">
      <p className="text-xs font-medium text-ink-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-ink">{value}</p>
    </div>
  )
}

export function AdminSignOutButton({ onClick }: { readonly onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Sign out"
      aria-label="Sign out"
      className="inline-flex shrink-0 items-center justify-center rounded-xl p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
    >
      <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
    </button>
  )
}

export function AdminDashboardQueryState<T>({
  loading,
  error,
  data,
  loadingMinHeightClassName = 'min-h-[40vh]',
  children,
}: {
  readonly loading: boolean
  readonly error: string | null
  readonly data: T | null
  readonly loadingMinHeightClassName?: string
  readonly children: (data: T) => ReactNode
}) {
  if (loading) {
    return <SpinnerSection minHeightClassName={loadingMinHeightClassName} />
  }

  if (error !== null) {
    return <Alert variant="error">{error}</Alert>
  }

  if (data === null) {
    return null
  }

  return children(data)
}
