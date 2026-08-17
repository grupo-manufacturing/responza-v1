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
  animationDelayMs = 0,
}: ComingSoonIntegrationCardProps) {
  return (
    <article
      className="animate-step-in rounded-[var(--radius-card)] border border-border bg-white/70 px-4 py-3.5 shadow-soft"
      style={{ animationDelay: `${animationDelayMs}ms` }}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-muted/80 p-1.5">
          <img src={logo} alt="" className={comingSoonIntegrationLogoClass(platform)} />
        </div>
        <h2 className="min-w-0 flex-1 truncate text-base font-semibold text-ink">{label}</h2>
        <span className="inline-flex shrink-0 items-center rounded-[var(--radius-pill)] border border-border bg-surface-muted/80 px-2.5 py-1 text-[11px] font-medium text-ink-muted">
          Coming soon
        </span>
      </div>
    </article>
  )
}
