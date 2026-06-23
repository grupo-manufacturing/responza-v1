import { Link } from 'react-router-dom'

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
    <section className="flex min-h-[280px] flex-col rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="border-b border-neutral-100 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
            <p className="mt-1 text-sm text-neutral-600">{description}</p>
          </div>
          {viewAllHref !== undefined && (
            <Link
              to={viewAllHref}
              className="shrink-0 text-sm font-medium text-neutral-900 underline underline-offset-2 hover:text-neutral-700"
            >
              {viewAllLabel}
            </Link>
          )}
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </section>
  )
}
