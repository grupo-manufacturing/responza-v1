import { INTEGRATION_PLATFORM_LOGOS } from '@/modules/integrations/integrations.constants'
import type { DashboardStats } from '@/modules/dashboard/dashboard.service'
import { formatDurationSeconds } from '@/modules/dashboard/utils/formatDuration'

type DashboardStatsRowProps = {
  readonly stats: DashboardStats
}

function StatCard({
  label,
  value,
  children,
}: {
  readonly label: string
  readonly value: string
  readonly children?: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-neutral-600">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">{value}</p>
      {children !== undefined && <div className="mt-3">{children}</div>}
    </div>
  )
}

export function DashboardStatsRow({ stats }: DashboardStatsRowProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard label="Total conversations" value={String(stats.totalConversations)} />

      <StatCard label="Conversations by platform" value={String(stats.totalConversations)}>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <img
              src={INTEGRATION_PLATFORM_LOGOS.whatsapp}
              alt=""
              className="h-5 w-5 object-contain"
              aria-hidden
            />
            <span className="text-sm text-neutral-700">
              <span className="font-semibold text-neutral-900">{stats.conversationsByPlatform.whatsapp}</span>{' '}
              WhatsApp
            </span>
          </div>
          <div className="flex items-center gap-2">
            <img
              src={INTEGRATION_PLATFORM_LOGOS.instagram}
              alt=""
              className="h-5 w-5 object-contain"
              aria-hidden
            />
            <span className="text-sm text-neutral-700">
              <span className="font-semibold text-neutral-900">{stats.conversationsByPlatform.instagram}</span>{' '}
              Instagram
            </span>
          </div>
        </div>
      </StatCard>

      <StatCard
        label="Avg. response time"
        value={formatDurationSeconds(stats.avgResponseTimeSeconds)}
      />
    </div>
  )
}
