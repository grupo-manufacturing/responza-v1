import {
  INBOX_PLATFORM_FILTERS,
  inboxPlatformFilterLabel,
  inboxPlatformLogo,
  type InboxPlatformFilter,
} from '@/shared/constants/inbox'
import { platformTabActiveClass } from '@/modules/inbox/components/PlatformBadge'

type PlatformTabsProps = {
  readonly value: InboxPlatformFilter
  readonly onChange: (value: InboxPlatformFilter) => void
}

export function PlatformTabs({ value, onChange }: PlatformTabsProps) {
  return (
    <div className="flex w-full items-stretch gap-1">
      {INBOX_PLATFORM_FILTERS.map((filter) => {
        const isActive = value === filter
        const label = inboxPlatformFilterLabel(filter)

        return (
          <button
            key={filter}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(filter)}
            className={[
              'flex flex-1 items-center justify-center gap-1 rounded-lg px-1 py-2 text-xs font-medium transition-colors',
              platformTabActiveClass(filter, isActive),
            ].join(' ')}
          >
            {filter !== 'all' && (
              <img
                src={inboxPlatformLogo(filter)}
                alt=""
                className="h-3.5 w-3.5 shrink-0 object-contain"
                aria-hidden
              />
            )}
            <span className="truncate">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
