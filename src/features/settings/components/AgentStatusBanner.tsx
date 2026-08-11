import { Alert } from '@/shared/ui/primitives/Alert'
import { Spinner } from '@/shared/ui/primitives/Spinner'
import type { AgentStatusResponse } from '@/features/knowledge/api/knowledge.service'

type AgentStatusBannerProps = {
  readonly status: AgentStatusResponse | null
  readonly isLoading: boolean
  readonly loadError: string | null
}

function formatLastBuiltAt(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function AgentStatusBanner({ status, isLoading, loadError }: AgentStatusBannerProps) {
  if (isLoading) {
    return (
      <div className="mb-4 flex items-center gap-2 rounded-xl border border-border bg-surface-muted/60 px-4 py-3 text-sm text-ink-muted">
        <Spinner size="sm" variant="muted" />
        Checking agent status...
      </div>
    )
  }

  if (loadError !== null) {
    return (
      <div className="mb-4">
        <Alert variant="error">{loadError}</Alert>
      </div>
    )
  }

  if (status === null) {
    return null
  }

  if (status.status === 'building') {
    return (
      <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <Spinner size="sm" variant="muted" />
        <div>
          <p className="font-medium">Agent knowledge base is building</p>
          <p className="mt-1 text-amber-900/80">
            We are updating your business knowledge from your profile. This usually takes a few
            minutes.
          </p>
        </div>
      </div>
    )
  }

  if (status.status === 'ready') {
    return (
      <div className="mb-4">
        <Alert variant="success">
          <span className="font-medium">Agent knowledge base is ready.</span>
          {status.lastBuiltAt !== null && (
            <span className="mt-1 block text-emerald-900/80">
              Last built {formatLastBuiltAt(status.lastBuiltAt)}.
            </span>
          )}
        </Alert>
      </div>
    )
  }

  if (status.status === 'failed') {
    return (
      <div className="mb-4">
        <Alert variant="error">
          <span className="font-medium">Agent knowledge base build failed.</span>
          {status.lastError !== null && (
            <span className="mt-1 block">{status.lastError}</span>
          )}
          <span className="mt-1 block">Save your profile again to retry.</span>
        </Alert>
      </div>
    )
  }

  return (
    <div className="mb-4">
      <Alert variant="warning">
        <span className="font-medium">Agent knowledge base is not built yet.</span>
        <span className="mt-1 block">
          Save your business profile to build the knowledge base used for AI draft replies.
        </span>
      </Alert>
    </div>
  )
}
