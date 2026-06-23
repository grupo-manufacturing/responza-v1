import type { DashboardStats } from '@/modules/dashboard/dashboard.service'
import { formatDurationSeconds } from '@/modules/dashboard/utils/formatDuration'
import { PlatformConversationsChart } from '@/modules/dashboard/components/PlatformConversationsChart'

type DashboardStatsRowProps = {
  readonly stats: DashboardStats
}

function StatCard({
  label,
  value,
  children,
  hideValue = false,
}: {
  readonly label: string
  readonly value?: string
  readonly children?: React.ReactNode
  readonly hideValue?: boolean
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-neutral-600">{label}</p>
      {!hideValue && value !== undefined && (
        <p className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">{value}</p>
      )}
      {children !== undefined && <div className="mt-3">{children}</div>}
    </div>
  )
}

export function DashboardStatsRow({ stats }: DashboardStatsRowProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard label="Total conversations" value={String(stats.totalConversations)} />

      <StatCard label="Conversations by platform" hideValue>
        <PlatformConversationsChart
          conversationsByPlatform={stats.conversationsByPlatform}
          totalConversations={stats.totalConversations}
        />
      </StatCard>

      <StatCard
        label="Avg. response time"
        value={formatDurationSeconds(stats.avgResponseTimeSeconds)}
      />
    </div>
  )
}
