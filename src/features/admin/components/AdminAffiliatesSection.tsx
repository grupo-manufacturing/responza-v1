import { Fragment, useCallback, useEffect, useState } from 'react'

import { Alert } from '@/shared/ui/primitives/Alert'
import { Spinner } from '@/shared/ui/primitives/Spinner'
import {
  AdminService,
  type AdminAffiliate,
  type AdminAffiliateReferral,
} from '@/features/admin/api/admin.service'
import { getApiErrorMessage } from '@/shared/utils/api-error'

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

export function AdminAffiliatesSection() {
  const [affiliates, setAffiliates] = useState<AdminAffiliate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [notes, setNotes] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [referralsById, setReferralsById] = useState<Record<string, AdminAffiliateReferral[]>>({})
  const [referralsLoadingId, setReferralsLoadingId] = useState<string | null>(null)
  const [actionBusyId, setActionBusyId] = useState<string | null>(null)

  const loadAffiliates = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await AdminService.listAffiliates()
      setAffiliates(result.affiliates)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load affiliates'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadAffiliates()
  }, [loadAffiliates])

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()
    setCreating(true)
    setCreateError(null)
    try {
      await AdminService.createAffiliate({
        name: name.trim(),
        code: code.trim().toUpperCase(),
        notes: notes.trim().length > 0 ? notes.trim() : undefined,
      })
      setName('')
      setCode('')
      setNotes('')
      await loadAffiliates()
    } catch (err) {
      setCreateError(getApiErrorMessage(err, 'Failed to create affiliate'))
    } finally {
      setCreating(false)
    }
  }

  const toggleReferrals = async (affiliateId: string) => {
    if (expandedId === affiliateId) {
      setExpandedId(null)
      return
    }

    setExpandedId(affiliateId)
    if (referralsById[affiliateId] !== undefined) {
      return
    }

    setReferralsLoadingId(affiliateId)
    try {
      const result = await AdminService.getAffiliateReferrals(affiliateId)
      setReferralsById((prev) => ({ ...prev, [affiliateId]: result.referrals }))
      setAffiliates((prev) =>
        prev.map((row) => (row.id === affiliateId ? result.affiliate : row)),
      )
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load referrals'))
    } finally {
      setReferralsLoadingId(null)
    }
  }

  const toggleActive = async (affiliate: AdminAffiliate) => {
    setActionBusyId(affiliate.id)
    try {
      const result = await AdminService.updateAffiliate(affiliate.id, {
        isActive: !affiliate.isActive,
      })
      setAffiliates((prev) =>
        prev.map((row) => (row.id === affiliate.id ? result.affiliate : row)),
      )
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to update affiliate'))
    } finally {
      setActionBusyId(null)
    }
  }

  return (
    <section>
      <h2 className="text-lg font-semibold tracking-tight text-ink">Affiliates</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Create influencer codes and track referred organizations. Payouts are handled outside the app.
      </p>

      <form
        onSubmit={handleCreate}
        className="mt-4 grid gap-3 rounded-[var(--radius-card)] border border-border bg-white p-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div>
          <label htmlFor="affiliate-name" className="mb-1 block text-xs font-medium text-ink-muted">
            Name
          </label>
          <input
            id="affiliate-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink/30"
            placeholder="Priya Sharma"
          />
        </div>
        <div>
          <label htmlFor="affiliate-code" className="mb-1 block text-xs font-medium text-ink-muted">
            Code
          </label>
          <input
            id="affiliate-code"
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            required
            minLength={2}
            maxLength={32}
            pattern="[A-Za-z0-9_-]+"
            className="w-full rounded-xl border border-border bg-white px-3 py-2 font-mono text-sm uppercase text-ink outline-none focus:border-ink/30"
            placeholder="PRIYA50"
          />
        </div>
        <div>
          <label htmlFor="affiliate-notes" className="mb-1 block text-xs font-medium text-ink-muted">
            Notes
          </label>
          <input
            id="affiliate-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink/30"
            placeholder="Optional"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={creating}
            className="inline-flex h-10 w-full items-center justify-center rounded-[var(--radius-pill)] bg-ink px-4 text-sm font-medium text-on-dark transition-colors hover:bg-ink/90 disabled:opacity-60"
          >
            {creating ? 'Creating…' : 'Create affiliate'}
          </button>
        </div>
        {createError !== null && (
          <div className="sm:col-span-2 lg:col-span-4">
            <Alert variant="error">{createError}</Alert>
          </div>
        )}
      </form>

      {loading && (
        <div className="mt-4 flex justify-center py-10">
          <Spinner />
        </div>
      )}

      {!loading && error !== null && (
        <div className="mt-4">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      {!loading && error === null && (
        <div className="mt-4 overflow-x-auto rounded-[var(--radius-card)] border border-border bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-muted/60 text-xs uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Affiliate</th>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Referrals</th>
                <th className="px-4 py-3 font-medium">Active paid</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {affiliates.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-ink-muted">
                    No affiliates yet. Create a code above.
                  </td>
                </tr>
              )}
              {affiliates.map((affiliate) => {
                const isExpanded = expandedId === affiliate.id
                const referrals = referralsById[affiliate.id] ?? []

                return (
                  <Fragment key={affiliate.id}>
                    <tr className="border-b border-border">
                      <td className="px-4 py-3">
                        <p className="font-medium text-ink">{affiliate.name}</p>
                        {affiliate.notes !== null && affiliate.notes.length > 0 && (
                          <p className="mt-0.5 text-xs text-ink-muted">{affiliate.notes}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-ink">{affiliate.code}</td>
                      <td className="px-4 py-3 text-ink">{affiliate.referralCount}</td>
                      <td className="px-4 py-3 text-ink">{affiliate.activePaidReferralCount}</td>
                      <td className="px-4 py-3">
                        <span
                          className={[
                            'inline-flex rounded-full border px-2 py-0.5 text-xs font-medium',
                            affiliate.isActive
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                              : 'border-border bg-surface-muted text-ink-muted',
                          ].join(' ')}
                        >
                          {affiliate.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => void toggleReferrals(affiliate.id)}
                            className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
                          >
                            {isExpanded ? 'Hide referrals' : 'View referrals'}
                          </button>
                          <button
                            type="button"
                            disabled={actionBusyId === affiliate.id}
                            onClick={() => void toggleActive(affiliate)}
                            className="text-sm font-medium text-ink-muted transition-colors hover:text-ink disabled:opacity-60"
                          >
                            {affiliate.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="border-b border-border bg-surface-muted/30">
                        <td colSpan={6} className="px-4 py-4">
                          {referralsLoadingId === affiliate.id ? (
                            <div className="flex justify-center py-4">
                              <Spinner />
                            </div>
                          ) : referrals.length === 0 ? (
                            <p className="text-sm text-ink-muted">No referred organizations yet.</p>
                          ) : (
                            <div className="overflow-x-auto rounded-xl border border-border bg-white">
                              <table className="min-w-full text-left text-sm">
                                <thead className="border-b border-border text-xs uppercase tracking-wide text-ink-muted">
                                  <tr>
                                    <th className="px-3 py-2 font-medium">Organization</th>
                                    <th className="px-3 py-2 font-medium">Plan</th>
                                    <th className="px-3 py-2 font-medium">Status</th>
                                    <th className="px-3 py-2 font-medium">Referred</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {referrals.map((referral) => (
                                    <tr key={referral.id} className="border-b border-border last:border-0">
                                      <td className="px-3 py-2">
                                        <p className="font-medium text-ink">{referral.name}</p>
                                        <p className="text-xs text-ink-muted">{referral.email}</p>
                                      </td>
                                      <td className="px-3 py-2 capitalize text-ink">{referral.plan}</td>
                                      <td className="px-3 py-2">
                                        <StatusPill status={referral.status} />
                                      </td>
                                      <td className="px-3 py-2 text-ink-muted">
                                        {formatDate(referral.referredAt)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
