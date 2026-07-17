import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { Alert } from '@/shared/ui/primitives/Alert'
import { SpinnerSection } from '@/shared/ui/primitives/Spinner'
import { AdminAffiliatesSection } from '@/features/admin/components/AdminAffiliatesSection'
import { AdminService, type AdminDashboardResponse } from '@/features/admin/api/admin.service'
import { AdminSessionStorage } from '@/features/admin/lib/adminSession'
import { getVercelAnalyticsUrl, getVercelSpeedInsightsUrl } from '@/shared/config/env'
import { getApiErrorMessage } from '@/shared/utils/api-error'
import { BrandMark } from '@/shared/ui/brand-ui'

function formatDate(value: string | null): string {
  if (value === null) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function StatusPill({ status }: { readonly status: string }) {
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

function ConnectedDot({ connected, label }: { readonly connected: boolean; readonly label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
      <span
        className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-ink-faint'}`}
        aria-hidden
      />
      {label}
    </span>
  )
}

function OverviewCard({ label, value }: { readonly label: string; readonly value: number }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-white px-4 py-4">
      <p className="text-xs font-medium text-ink-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-ink">{value}</p>
    </div>
  )
}

function ExternalLinkButton({ href, children }: { readonly href: string; readonly children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center rounded-[var(--radius-pill)] border border-border bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-muted"
    >
      {children}
    </a>
  )
}

function VercelLinksSection() {
  const analyticsUrl = getVercelAnalyticsUrl()
  const speedInsightsUrl = getVercelSpeedInsightsUrl()
  const hasAnyLink = analyticsUrl.length > 0 || speedInsightsUrl.length > 0

  return (
    <section>
      <h2 className="text-lg font-semibold tracking-tight text-ink">Website traffic</h2>
      <p className="mt-1 text-sm text-ink-muted">
        View pageviews and visitors in Vercel. Numbers stay in Vercel for now.
      </p>
      {hasAnyLink ? (
        <div className="mt-4 flex flex-wrap gap-3">
          {analyticsUrl.length > 0 && (
            <ExternalLinkButton href={analyticsUrl}>Open Vercel Analytics</ExternalLinkButton>
          )}
          {speedInsightsUrl.length > 0 && (
            <ExternalLinkButton href={speedInsightsUrl}>Open Speed Insights</ExternalLinkButton>
          )}
        </div>
      ) : (
        <p className="mt-4 rounded-[var(--radius-card)] border border-border bg-white px-4 py-3 text-sm text-ink-muted">
          Set <code className="text-ink">VITE_VERCEL_ANALYTICS_URL</code> (and optionally{' '}
          <code className="text-ink">VITE_VERCEL_SPEED_INSIGHTS_URL</code>) in the frontend env, then redeploy.
        </p>
      )}
    </section>
  )
}

export function AdminPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<AdminDashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const username = AdminSessionStorage.getUsername()

  useEffect(() => {
    if (!AdminSessionStorage.isAuthenticated()) return

    let cancelled = false

    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const dashboard = await AdminService.getDashboard()
        if (!cancelled) {
          setData(dashboard)
        }
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err, 'Failed to load admin dashboard'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  if (!AdminSessionStorage.isAuthenticated()) {
    return <Navigate to="/admin/login" replace />
  }

  const handleLogout = () => {
    AdminSessionStorage.clear()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-surface-muted">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <BrandMark />
            <div>
              <p className="text-sm font-semibold text-ink">Admin</p>
              <p className="text-xs text-ink-muted">
                {username !== null ? `Signed in as ${username}` : 'Read-only product overview'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm font-medium text-ink-muted transition-colors hover:text-ink">
              Home
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        {loading && <SpinnerSection minHeightClassName="min-h-[40vh]" />}

        {!loading && error !== null && <Alert variant="error">{error}</Alert>}

        {!loading && error === null && data !== null && (
          <>
            <VercelLinksSection />

            <AdminAffiliatesSection />

            <section>
              <h1 className="text-xl font-semibold tracking-tight text-ink">Overview</h1>
              <p className="mt-1 text-sm text-ink-muted">Live counts across all organizations.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <OverviewCard label="Organizations" value={data.overview.organizationCount} />
                <OverviewCard label="Trialing" value={data.overview.trialCount} />
                <OverviewCard label="Active paid" value={data.overview.activeCount} />
                <OverviewCard label="Expired" value={data.overview.expiredCount} />
                <OverviewCard label="Conversations today" value={data.overview.conversationsToday} />
                <OverviewCard label="Conversations this week" value={data.overview.conversationsThisWeek} />
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-tight text-ink">Organizations</h2>
              <p className="mt-1 text-sm text-ink-muted">
                Plan, subscription status, and connected channels.
              </p>

              <div className="mt-4 overflow-x-auto rounded-[var(--radius-card)] border border-border bg-white">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-border bg-surface-muted/60 text-xs uppercase tracking-wide text-ink-muted">
                    <tr>
                      <th className="px-4 py-3 font-medium">Organization</th>
                      <th className="px-4 py-3 font-medium">Plan</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Limit</th>
                      <th className="px-4 py-3 font-medium">Integrations</th>
                      <th className="px-4 py-3 font-medium">Billing</th>
                      <th className="px-4 py-3 font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.organizations.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-ink-muted">
                          No organizations yet.
                        </td>
                      </tr>
                    )}
                    {data.organizations.map((org) => (
                      <tr key={org.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3">
                          <p className="font-medium text-ink">{org.name}</p>
                          <p className="text-xs text-ink-muted">{org.email}</p>
                          {!org.emailVerified && (
                            <p className="mt-0.5 text-xs text-amber-700">Email unverified</p>
                          )}
                        </td>
                        <td className="px-4 py-3 capitalize text-ink">{org.plan}</td>
                        <td className="px-4 py-3">
                          <StatusPill status={org.status} />
                          <p className="mt-1 text-xs text-ink-faint">
                            {org.status === 'trialing'
                              ? `Trial ends ${formatDate(org.trialEndsAt)}`
                              : org.status === 'active'
                                ? `Period ends ${formatDate(org.subscriptionPeriodEndsAt)}`
                                : 'No access'}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-ink-muted">{org.conversationLimit ?? '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <ConnectedDot connected={org.whatsappConnected} label="WhatsApp" />
                            <ConnectedDot connected={org.instagramConnected} label="Instagram" />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-ink-muted">
                          {org.razorpaySubscriptionId !== null ? (
                            <span className="break-all font-mono">{org.razorpaySubscriptionId}</span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="px-4 py-3 text-ink-muted">{formatDate(org.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}
