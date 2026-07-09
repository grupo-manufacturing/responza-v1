import {
  INTEGRATION_PLATFORM_LABELS,
  INTEGRATION_PLATFORM_LOGOS,
  type IntegrationPlatform,
} from '@/modules/integrations/integrations.constants'

type PlatformBadgeProps = {
  readonly platform: IntegrationPlatform
  readonly size?: 'sm' | 'md'
  readonly showLabel?: boolean
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
} as const

const platformTextClass: Record<IntegrationPlatform, string> = {
  whatsapp: 'text-brand-whatsapp',
  instagram: 'text-brand-instagram',
}

export function PlatformBadge({ platform, size = 'sm', showLabel = false }: PlatformBadgeProps) {
  const label = INTEGRATION_PLATFORM_LABELS[platform]

  return (
    <span className={['inline-flex items-center gap-1.5', platformTextClass[platform]].join(' ')} title={label}>
      <img
        src={INTEGRATION_PLATFORM_LOGOS[platform]}
        alt=""
        className={[sizeClasses[size], 'shrink-0 object-contain'].join(' ')}
        aria-hidden
      />
      {showLabel && <span className="text-xs font-medium">{label}</span>}
    </span>
  )
}

export { platformTabActiveClass } from '@/modules/inbox/inbox-ui'
