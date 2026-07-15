import { Link } from 'react-router-dom'

import type { DashboardStats } from '@/modules/dashboard/dashboard.service'
import { formatDurationSeconds } from '@/modules/dashboard/utils/formatDuration'
import { AppCard } from '@/shared/ui/app-ui'

type DashboardStatsRowProps = {
  readonly stats: DashboardStats
  readonly needsReplyCount: number
  readonly toNudgeCount: number
}

type SummaryCardProps = {
  readonly label: string
  readonly value: string
  readonly hint: string
  readonly href: string
  readonly accentClass: string
}

function SummaryCard({ label, value, hint, href, accentClass }: SummaryCardProps) {
  return (
    <Link to={href} className="group block">
      <AppCard
        padding="compact"
        className="hover-lift transition-colors group-hover:border-accent/25"
      >
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 h-9 w-1 shrink-0 rounded-full ${accentClass}`} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ink-muted">{label}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-ink">{value}</p>
            <p className="mt-1 text-xs text-ink-faint">{hint}</p>
          </div>
        </div>
      </AppCard>
    </Link>
  )
}

export function DashboardStatsRow({
  stats,
  needsReplyCount,
  toNudgeCount,
}: DashboardStatsRowProps) {
  const avgResponse =
    stats.avgResponseTimeSeconds !== null
      ? formatDurationSeconds(stats.avgResponseTimeSeconds)
      : '—'

  const platformParts: string[] = []
  if (stats.conversationsByPlatform.whatsapp > 0) {
    platformParts.push(`${stats.conversationsByPlatform.whatsapp} WhatsApp`)
  }
  if (stats.conversationsByPlatform.instagram > 0) {
    platformParts.push(`${stats.conversationsByPlatform.instagram} Instagram`)
  }
  const platformHint =
    platformParts.length > 0 ? platformParts.join(' · ') : 'No platform breakdown yet'

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <SummaryCard
        label="Awaiting your reply"
        value={String(needsReplyCount)}
        hint={needsReplyCount === 1 ? '1 conversation waiting' : `${needsReplyCount} conversations waiting`}
        href="/inbox"
        accentClass="bg-accent"
      />
      <SummaryCard
        label="Quiet conversations"
        value={String(toNudgeCount)}
        hint="Customers who may need a nudge"
        href="/inbox"
        accentClass="bg-accent-warm"
      />
      <AppCard padding="compact">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-9 w-1 shrink-0 rounded-full bg-ink/20" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ink-muted">Workspace overview</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-ink">
              {stats.totalConversations}
              <span className="ml-1.5 text-sm font-medium text-ink-muted">conversations</span>
            </p>
            <p className="mt-1 text-xs text-ink-faint">
              Avg. reply {avgResponse} · {platformHint}
            </p>
          </div>
        </div>
      </AppCard>
    </div>
  )
}
