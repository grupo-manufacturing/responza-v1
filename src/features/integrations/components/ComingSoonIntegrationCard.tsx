import {
  comingSoonIntegrationLogoClass,
  type ComingSoonIntegration,
} from '@/features/integrations/constants'

type ComingSoonIntegrationCardProps = ComingSoonIntegration & {
  animationDelayMs?: number
}

export function ComingSoonIntegrationCard({
  platform,
  label,
  logo,
  description,
  animationDelayMs = 0,
}: ComingSoonIntegrationCardProps) {
  return (
    <article
      className="animate-step-in flex h-full flex-col rounded-[var(--radius-card)] border border-border bg-white/70 p-5 shadow-soft"
      style={{ animationDelay: `${animationDelayMs}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-muted/80 p-2">
          <img src={logo} alt="" className={comingSoonIntegrationLogoClass(platform)} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold text-ink">{label}</h2>
            <span className="inline-flex items-center rounded-[var(--radius-pill)] border border-border bg-surface-muted/80 px-2.5 py-0.5 text-[11px] font-medium text-ink-muted">
              Coming soon
            </span>
          </div>
        </div>
      </div>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-muted">{description}</p>
    </article>
  )
}
