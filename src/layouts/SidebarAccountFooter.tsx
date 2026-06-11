import { Spinner } from '@/components/ui/Spinner'
import { subscriptionStatusLabel } from '@/shared/utils/subscription-display'

function SignOutIconButton({ onClick }: { readonly onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Sign out"
      aria-label="Sign out"
      className="inline-flex shrink-0 items-center justify-center rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
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
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900">
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
    <div className={['shrink-0 border-t border-neutral-200 p-4', collapsed ? 'lg:p-2' : ''].join(' ')}>
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
                <span className="text-sm text-neutral-500">Loading...</span>
              </div>
            ) : (
              <>
                <p className="truncate text-base font-medium leading-tight text-neutral-900">
                  {organizationName || 'Organization'}
                </p>
                <p className="truncate text-sm leading-tight text-neutral-500">
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
