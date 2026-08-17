import type { ReactNode } from 'react'

type IntegrationRowLayoutProps = {
  readonly logo: string
  readonly logoClassName: string
  readonly title: string
  readonly status: ReactNode
  readonly meta: ReactNode
  readonly actions: ReactNode
}

export function IntegrationRowLayout({
  logo,
  logoClassName,
  title,
  status,
  meta,
  actions,
}: IntegrationRowLayoutProps) {
  return (
    <article className="px-5 py-4 sm:px-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-muted/80 p-2">
          <img src={logo} alt="" className={logoClassName} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex h-9 min-w-0 items-center gap-3">
                <h2 className="truncate text-base font-semibold text-ink">{title}</h2>
                {status}
              </div>
              <div className="mt-1.5 flex h-9 min-w-0 items-center">{meta}</div>
            </div>

            <div className="flex h-9 w-full shrink-0 items-center justify-start gap-2 sm:w-[13.5rem] sm:justify-end">
              {actions}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export function IntegrationStatusDot({
  connected,
}: {
  readonly connected: boolean
}) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-ink-muted">
      <span
        className={['h-1.5 w-1.5 rounded-full', connected ? 'bg-emerald-500' : 'bg-border'].join(' ')}
        aria-hidden
      />
      {connected ? 'Connected' : 'Not connected'}
    </span>
  )
}
