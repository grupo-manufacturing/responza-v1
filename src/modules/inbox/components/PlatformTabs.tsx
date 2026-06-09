import {
  INBOX_PLATFORM_FILTERS,
  inboxPlatformFilterLabel,
  type InboxPlatformFilter,
} from '@/shared/constants/inbox'

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
              'flex flex-1 items-center justify-center rounded-lg px-1 py-2 text-xs font-medium transition-colors',
              isActive
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900',
            ].join(' ')}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
