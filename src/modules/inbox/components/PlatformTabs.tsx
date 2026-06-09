import {
  INBOX_PLATFORM_FILTERS,
  inboxPlatformFilterLabel,
  type InboxPlatformFilter,
} from '@/shared/constants/inbox'
import { platformTabActiveClass } from '@/modules/inbox/components/PlatformBadge'

type PlatformTabsProps = {
  readonly value: InboxPlatformFilter
  readonly onChange: (value: InboxPlatformFilter) => void
}

export function PlatformTabs({ value, onChange }: PlatformTabsProps) {
  return (
    <div className="w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex min-w-max gap-1">
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
                'shrink-0 rounded-lg px-2.5 py-2 text-xs font-medium whitespace-nowrap transition-colors',
                platformTabActiveClass(filter, isActive),
              ].join(' ')}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
