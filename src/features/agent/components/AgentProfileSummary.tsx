import type { BusinessResponse } from '@/features/business/api/business.service'
import { AppCard } from '@/shared/ui/app-ui'

type AgentProfileSummaryProps = {
  readonly business: BusinessResponse
}

export function AgentProfileSummary({ business }: AgentProfileSummaryProps) {
  const { profile } = business

  return (
    <AppCard className="space-y-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">Business profile</p>
        <h2 className="mt-1 text-lg font-semibold text-ink">{profile.brandName ?? 'Your business'}</h2>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        {profile.websiteUrl !== null && profile.websiteUrl.length > 0 && (
          <div>
            <dt className="text-ink-faint">Website</dt>
            <dd className="mt-0.5 break-all text-ink">{profile.websiteUrl}</dd>
          </div>
        )}
        {profile.instagramPageUrl !== null && profile.instagramPageUrl.length > 0 && (
          <div>
            <dt className="text-ink-faint">Instagram</dt>
            <dd className="mt-0.5 break-all text-ink">{profile.instagramPageUrl}</dd>
          </div>
        )}
        <div className="sm:col-span-2">
          <dt className="text-ink-faint">Catalogue files</dt>
          <dd className="mt-0.5 text-ink">{profile.catalogueFiles.length} file(s)</dd>
        </div>
        {profile.businessDescription !== null && profile.businessDescription.length > 0 && (
          <div className="sm:col-span-2">
            <dt className="text-ink-faint">Description</dt>
            <dd className="mt-0.5 line-clamp-3 text-ink-muted">{profile.businessDescription}</dd>
          </div>
        )}
      </dl>
    </AppCard>
  )
}
