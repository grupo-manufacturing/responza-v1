import { AppButtonLink, AppCard } from '@/shared/ui/app-ui'

type DashboardActionPanelProps = {
  readonly title: string
  readonly description: string
  readonly viewAllHref?: string
  readonly viewAllLabel?: string
  readonly children: React.ReactNode
}

export function DashboardActionPanel({
  title,
  description,
  viewAllHref,
  viewAllLabel = 'View all',
  children,
}: DashboardActionPanelProps) {
  return (
    <AppCard padding="none" className="flex min-h-[280px] flex-col overflow-hidden">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-ink">{title}</h2>
            <p className="mt-1 text-sm text-ink-muted">{description}</p>
          </div>
          {viewAllHref !== undefined && (
            <AppButtonLink
              to={viewAllHref}
              variant="ghost"
              className="!px-2 !py-1 text-xs font-medium text-accent hover:text-accent"
            >
              {viewAllLabel}
            </AppButtonLink>
          )}
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </AppCard>
  )
}
