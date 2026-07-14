import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { Spinner } from '@/components/ui/Spinner'
import { AdminService } from '@/modules/admin/admin.service'
import { AdminSessionStorage } from '@/modules/admin/adminSession'
import { getApiErrorMessage } from '@/shared/utils/api-error'
import { BrandMark } from '@/shared/ui/brand-ui'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (AdminSessionStorage.isAuthenticated()) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await AdminService.login(username, password)
      AdminSessionStorage.saveSession(result.accessToken, result.username)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(getApiErrorMessage(err, 'Invalid admin credentials'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <div className="w-full max-w-sm rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-soft">
        <div className="mb-6 flex items-center gap-3">
          <BrandMark />
          <div>
            <p className="text-sm font-semibold text-ink">Admin</p>
            <p className="text-xs text-ink-muted">Sign in with admin credentials</p>
          </div>
        </div>

        <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
          <div>
            <label htmlFor="admin-username" className="mb-1.5 block text-xs font-medium text-ink-muted">
              Username
            </label>
            <input
              id="admin-username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
              required
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="mb-1.5 block text-xs font-medium text-ink-muted">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
              required
            />
          </div>

          {error !== null && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-ink px-5 py-2.5 text-sm font-medium text-on-dark transition-all hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <Spinner size="sm" /> : null}
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
