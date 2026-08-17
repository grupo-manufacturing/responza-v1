import {
  comingSoonIntegrationLogoClass,
  type ComingSoonIntegration,
} from '@/features/integrations/constants'
import { IntegrationRowLayout } from '@/features/integrations/components/IntegrationRowLayout'

type ComingSoonIntegrationRowProps = ComingSoonIntegration

export function ComingSoonIntegrationRow({
  platform,
  label,
  logo,
}: ComingSoonIntegrationRowProps) {
  return (
    <IntegrationRowLayout
      logo={logo}
      logoClassName={comingSoonIntegrationLogoClass(platform)}
      title={label}
      status={
        <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-ink-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-border" aria-hidden />
          Coming soon
        </span>
      }
      meta={<p className="truncate text-sm text-ink-faint">Available soon</p>}
      actions={
        <span className="inline-flex h-9 items-center rounded-[var(--radius-pill)] border border-border bg-surface-muted/80 px-4 text-sm font-medium text-ink-muted">
          Coming soon
        </span>
      }
    />
  )
}
