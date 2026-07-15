import {
  comingSoonIntegrationLogoClass,
  type ComingSoonIntegration,
} from '@/features/integrations/constants'

type ComingSoonIntegrationRowProps = ComingSoonIntegration

export function ComingSoonIntegrationRow({
  platform,
  label,
  logo,
  description,
}: ComingSoonIntegrationRowProps) {
  return (
    <article className="px-5 py-5 sm:px-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-muted/80 p-2">
            <img
              src={logo}
              alt=""
              className={comingSoonIntegrationLogoClass(platform)}
            />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-ink">{label}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{description}</p>
          </div>
        </div>

        <div className="flex shrink-0 sm:pl-4">
          <span className="inline-flex items-center rounded-[var(--radius-pill)] border border-border bg-surface-muted/80 px-3 py-1.5 text-xs font-medium text-ink-muted">
            Coming soon
          </span>
        </div>
      </div>
    </article>
  )
}
