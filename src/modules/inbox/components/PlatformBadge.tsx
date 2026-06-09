import {
  inboxPlatformLogo,
  inboxPlatformLabel,
  type InboxPlatformFilter,
} from '@/shared/constants/inbox'
import type { IntegrationPlatform } from '@/shared/constants/integrations'

type PlatformBadgeProps = {
  readonly platform: IntegrationPlatform
  readonly size?: 'sm' | 'md'
  readonly showLabel?: boolean
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
} as const

export function PlatformBadge({ platform, size = 'sm', showLabel = false }: PlatformBadgeProps) {
  const label = inboxPlatformLabel(platform)

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5',
        platform === 'whatsapp'
          ? 'text-[#128C7E]'
          : platform === 'instagram'
            ? 'text-[#E1306C]'
            : 'text-neutral-600',
      ].join(' ')}
      title={label}
    >
      <img
        src={inboxPlatformLogo(platform)}
        alt=""
        className={[sizeClasses[size], 'shrink-0 object-contain'].join(' ')}
        aria-hidden
      />
      {showLabel && <span className="text-xs font-medium">{label}</span>}
    </span>
  )
}

export function platformTabActiveClass(filter: InboxPlatformFilter, isActive: boolean): string {
  if (!isActive) {
    return 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
  }

  if (filter === 'whatsapp') {
    return 'bg-[#128C7E] text-white'
  }

  if (filter === 'instagram') {
    return 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white'
  }

  if (filter === 'indiamart') {
    return 'bg-[#2E3192] text-white'
  }

  return 'bg-neutral-900 text-white'
}
