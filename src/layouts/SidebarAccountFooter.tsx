import { Spinner } from '@/shared/ui/primitives/Spinner'
import { subscriptionStatusLabel } from '@/shared/utils/subscription-display'

function SignOutIconButton({ onClick }: { readonly onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Sign out"
      aria-label="Sign out"
      className="inline-flex shrink-0 items-center justify-center rounded-xl p-2 text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
    >
      <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
    </button>
  )
}

function AccountAvatar({ initial }: { readonly initial: string }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-soft via-accent to-accent-violet">
      <span className="text-sm font-medium text-white">{initial}</span>
    </div>
  )
}

type SidebarAccountFooterProps = {
  collapsed: boolean
  organizationName: string
  subscriptionStatus: string
  isProfileLoading: boolean
  onLogout: () => void
}

export function SidebarAccountFooter({
  collapsed,
  organizationName,
  subscriptionStatus,
  isProfileLoading,
  onLogout,
}: SidebarAccountFooterProps) {
  return (
    <div className={['shrink-0 border-t border-border p-3', collapsed ? 'lg:p-2' : ''].join(' ')}>
      <div className={['hidden items-center justify-center', collapsed ? 'lg:flex' : ''].join(' ')}>
        <SignOutIconButton onClick={onLogout} />
      </div>

      <div className={['flex items-center gap-2', collapsed ? 'lg:hidden' : ''].join(' ')}>
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <AccountAvatar initial={(organizationName.trim().charAt(0) || 'O').toUpperCase()} />
          <div className="min-w-0 flex-1">
            {isProfileLoading && !organizationName ? (
              <div className="flex items-center gap-2 py-1" role="status" aria-label="Loading profile">
                <Spinner size="sm" variant="muted" />
                <span className="text-sm text-ink-muted">Loading...</span>
              </div>
            ) : (
              <>
                <p className="truncate text-sm font-medium leading-tight text-ink">
                  {organizationName || 'Organization'}
                </p>
                <p className="truncate text-xs leading-tight text-ink-muted">
                  {subscriptionStatusLabel(subscriptionStatus)}
                </p>
              </>
            )}
          </div>
        </div>
        <SignOutIconButton onClick={onLogout} />
      </div>
    </div>
  )
}
