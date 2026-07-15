import {
  INBOX_PLATFORM_FILTERS,
  inboxPlatformFilterLabel,
  type InboxPlatformFilter,
} from '@/features/inbox/constants'
import { platformTabActiveClass } from '@/features/inbox/lib/inbox-ui'

type PlatformTabsProps = {
  readonly value: InboxPlatformFilter
  readonly onChange: (value: InboxPlatformFilter) => void
}

export function PlatformTabs({ value, onChange }: PlatformTabsProps) {
  return (
    <div className="w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex min-w-max gap-1.5">
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
                'shrink-0 rounded-[var(--radius-pill)] px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-200',
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
