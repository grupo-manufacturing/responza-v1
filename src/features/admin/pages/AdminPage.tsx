import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { AdminAffiliatesSection } from '@/features/admin/components/AdminAffiliatesSection'
import { AdminService } from '@/features/admin/api/admin.service'
import type { AdminDashboardResponse } from '@/features/admin/api/admin.types'
import { AdminSessionStorage } from '@/features/admin/lib/adminSession'
import {
  AdminDashboardQueryState,
  AdminMetricCard,
  AdminPagination,
  AdminSignOutButton,
  AdminStatusPill,
  formatAdminDate,
} from '@/features/admin/lib/admin-ui'
import { getVercelAnalyticsUrl, getVercelSpeedInsightsUrl } from '@/shared/config/env'
import { Spinner } from '@/shared/ui/primitives/Spinner'
import { getApiErrorMessage } from '@/shared/utils/api-error'
import { BrandMark } from '@/shared/ui/brand-ui'

type AdminTab = 'overview' | 'analytics' | 'affiliates'

const ADMIN_TABS: ReadonlyArray<{ id: AdminTab; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'affiliates', label: 'Affiliates' },
]

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

function AnalyticsTab({ data }: { readonly data: AdminDashboardResponse }) {
  const analyticsUrl = getVercelAnalyticsUrl()
  const speedInsightsUrl = getVercelSpeedInsightsUrl()
  const hasAnyLink = analyticsUrl.length > 0 || speedInsightsUrl.length > 0

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-xl font-semibold tracking-tight text-ink">Analytics</h1>
        <p className="mt-1 text-sm text-ink-muted">Live counts across all organizations.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AdminMetricCard label="Organizations" value={data.overview.organizationCount} />
          <AdminMetricCard label="Trialing" value={data.overview.trialCount} />
          <AdminMetricCard label="Active paid" value={data.overview.activeCount} />
          <AdminMetricCard label="Expired" value={data.overview.expiredCount} />
          <AdminMetricCard label="Conversations today" value={data.overview.conversationsToday} />
          <AdminMetricCard label="Conversations this week" value={data.overview.conversationsThisWeek} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-tight text-ink">Website traffic</h2>
        <p className="mt-1 text-sm text-ink-muted">Website traffic lives in Vercel for now. Open the dashboards below.</p>
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
    </div>
  )
}

function OverviewTab({
  data,
  orgLoading,
  onPageChange,
}: {
  readonly data: AdminDashboardResponse
  readonly orgLoading: boolean
  readonly onPageChange: (page: number) => void
}) {
  return (
    <section>
      <h1 className="text-xl font-semibold tracking-tight text-ink">Overview</h1>
      <p className="mt-1 text-sm text-ink-muted">Plan, subscription status, and connected channels.</p>

      <div className="relative mt-4 overflow-x-auto rounded-[var(--radius-card)] border border-border bg-white">
        {orgLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
            <Spinner />
          </div>
        )}
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
                  <AdminStatusPill status={org.status} />
                  <p className="mt-1 text-xs text-ink-faint">
                    {org.status === 'trialing'
                      ? `Trial ends ${formatAdminDate(org.trialEndsAt)}`
                      : org.status === 'active'
                        ? `Period ends ${formatAdminDate(org.subscriptionPeriodEndsAt)}`
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
                <td className="px-4 py-3 text-ink-muted">{formatAdminDate(org.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <AdminPagination
          pagination={data.pagination}
          onPageChange={onPageChange}
          disabled={orgLoading}
        />
      </div>
    </section>
  )
}

export function AdminPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [orgPage, setOrgPage] = useState(1)
  const [data, setData] = useState<AdminDashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [orgLoading, setOrgLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const username = AdminSessionStorage.getUsername()
  const hasLoadedDashboardRef = useRef(false)

  useEffect(() => {
    if (!AdminSessionStorage.isAuthenticated()) return

    let cancelled = false
    const isInitialLoad = !hasLoadedDashboardRef.current

    void (async () => {
      if (isInitialLoad) {
        setLoading(true)
      } else {
        setOrgLoading(true)
      }
      setError(null)
      try {
        const dashboard = await AdminService.getDashboard({ page: orgPage })
        if (!cancelled) {
          setData(dashboard)
        }
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err, 'Failed to load admin dashboard'))
        }
      } finally {
        if (!cancelled) {
          hasLoadedDashboardRef.current = true
          setLoading(false)
          setOrgLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [orgPage])

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

          <div className="flex items-center gap-2 sm:gap-3">
            <nav className="flex items-center gap-1 overflow-x-auto" aria-label="Admin sections">
              {ADMIN_TABS.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setActiveTab(tab.id)}
                    className={[
                      'shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-surface-muted text-ink'
                        : 'text-ink-muted hover:bg-surface-muted/70 hover:text-ink',
                    ].join(' ')}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </nav>
            <AdminSignOutButton onClick={handleLogout} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {activeTab === 'overview' && (
          <AdminDashboardQueryState loading={loading} error={error} data={data}>
            {(dashboard) => (
              <OverviewTab
                data={dashboard}
                orgLoading={orgLoading}
                onPageChange={setOrgPage}
              />
            )}
          </AdminDashboardQueryState>
        )}

        {activeTab === 'analytics' && (
          <AdminDashboardQueryState
            loading={loading}
            error={error}
            data={data}
            loadingMinHeightClassName="min-h-[12rem]"
          >
            {(dashboard) => <AnalyticsTab data={dashboard} />}
          </AdminDashboardQueryState>
        )}

        {activeTab === 'affiliates' && <AdminAffiliatesSection />}
      </main>
    </div>
  )
}
