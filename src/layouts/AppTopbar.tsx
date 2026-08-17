interface AppTopbarProps {
  onMenuClick?: () => void
}

export function AppTopbar({ onMenuClick }: AppTopbarProps) {
  return (
    <header
      className={[
        'glass-light fixed top-0 right-0 left-0 z-40 flex h-16 w-full items-center lg:hidden',
        'border-b border-border px-4 sm:px-6',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-xl p-2 text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink lg:hidden"
        aria-label="Open menu"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </header>
  )
}
