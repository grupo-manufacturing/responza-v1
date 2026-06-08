import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { Spinner } from '@/components/ui/Spinner'
import { subscriptionStatusLabel } from '@/shared/utils/subscription-display'
import AuthService from '@/shared/services/auth.service'

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
  badge?: string
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM14 12a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7zM4 14a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1v-5z"
        />
      </svg>
    ),
  },
  {
    name: 'Inbox',
    href: '/inbox',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    ),
    badge: '3',
  },
  {
    name: 'Leads',
    href: '/leads',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    name: 'Integrations',
    href: '/integrations',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    ),
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

type AppSidebarProps = {
  readonly mobileOpen?: boolean
  readonly collapsed?: boolean
  readonly onToggleCollapse?: () => void
}

function SidebarPanelIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1.75} />
      <path strokeLinecap="round" strokeWidth={1.75} d="M9 3v18" />
    </svg>
  )
}

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

function SidebarCollapseButton({
  collapsed,
  onToggle,
  variant = 'header',
}: {
  readonly collapsed: boolean
  readonly onToggle: () => void
  readonly variant?: 'header' | 'nav'
}) {
  if (variant === 'nav') {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-expanded={!collapsed}
        className="group relative flex w-full items-center justify-center rounded-lg px-2 py-2.5 text-neutral-500 transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-900"
      >
        <SidebarPanelIcon />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      aria-expanded={!collapsed}
      className="inline-flex shrink-0 items-center justify-center rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
    >
      <SidebarPanelIcon />
    </button>
  )
}

export function AppSidebar({ mobileOpen = false, collapsed = false, onToggleCollapse }: AppSidebarProps) {
  const navigate = useNavigate()
  const storedOrg = AuthService.getStoredOrganization()
  const storedSub = AuthService.getStoredSubscription()
  const [organizationName, setOrganizationName] = useState(storedOrg?.name ?? '')
  const [subscriptionStatus, setSubscriptionStatus] = useState(storedSub?.status)
  const [isProfileLoading, setIsProfileLoading] = useState(!storedOrg?.name)

  useEffect(() => {
    if (!AuthService.isAuthenticated()) return

    let cancelled = false
    setIsProfileLoading(!AuthService.getStoredOrganization()?.name)

    void AuthService.getMe()
      .then((me) => {
        if (cancelled) return
        AuthService.saveSessionProfile(me)
        setOrganizationName(me.organization.name)
        setSubscriptionStatus(me.subscription.status)
      })
      .catch(() => {
        /* keep cached values from login */
      })
      .finally(() => {
        if (!cancelled) setIsProfileLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const orgInitial = (organizationName.trim().charAt(0) || 'O').toUpperCase()

  const handleLogout = () => {
    AuthService.clearTokens()
    navigate('/auth?mode=login')
  }

  return (
    <aside
      className={[
        'fixed inset-y-0 left-0 z-50 flex h-screen flex-col',
        'border-r border-neutral-200 bg-white backdrop-blur-md',
        'w-72 transition-[width,transform] duration-300 ease-in-out',
        collapsed ? 'lg:w-20' : 'lg:w-72',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0',
      ].join(' ')}
    >
      <div
        className={[
          'flex h-16 shrink-0 items-center border-b border-neutral-200',
          collapsed ? 'justify-center px-2 lg:px-2' : 'px-4',
        ].join(' ')}
      >
        <div
          className={[
            'flex w-full items-center gap-2',
            collapsed ? 'lg:justify-center' : 'justify-between',
          ].join(' ')}
        >
          <div
            className={[
              'flex min-w-0 items-center gap-3',
              collapsed ? 'lg:justify-center' : '',
            ].join(' ')}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-sm font-bold text-white shadow-md">
              R
            </div>
            <span
              className={[
                'truncate text-xl font-semibold text-neutral-900',
                collapsed ? 'lg:hidden' : '',
              ].join(' ')}
            >
              Responza AI
            </span>
          </div>
          {onToggleCollapse !== undefined && (
            <div className={collapsed ? 'shrink-0 lg:hidden' : 'shrink-0'}>
              <SidebarCollapseButton
                collapsed={collapsed}
                onToggle={onToggleCollapse}
                variant="header"
              />
            </div>
          )}
        </div>
      </div>

      <nav
        className={['flex-1 space-y-1 overflow-y-auto py-4 px-4', collapsed ? 'lg:px-2' : ''].join(' ')}
        aria-label="Main navigation"
      >
        {onToggleCollapse !== undefined && collapsed && (
          <div className="mb-1 hidden lg:block">
            <SidebarCollapseButton
              collapsed={collapsed}
              onToggle={onToggleCollapse}
              variant="nav"
            />
          </div>
        )}
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            title={collapsed ? item.name : undefined}
            className={({ isActive }) =>
              [
                'group relative flex items-center rounded-lg px-3 py-2.5 text-base font-medium transition-all duration-200',
                collapsed ? 'lg:justify-center lg:px-2' : '',
                isActive
                  ? 'bg-neutral-900 text-white shadow-md'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={[
                    'relative shrink-0',
                    collapsed ? 'lg:mr-0' : 'mr-3',
                    isActive ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-900',
                  ].join(' ')}
                >
                  {item.icon}
                  {item.badge && (
                    <span
                      className={[
                        'absolute -right-0.5 -top-0.5 hidden h-4 min-w-4 items-center justify-center rounded-full px-0.5 text-[10px] font-bold',
                        collapsed ? 'lg:flex' : 'lg:hidden',
                        isActive ? 'bg-white text-neutral-900' : 'bg-neutral-900 text-white',
                      ].join(' ')}
                    >
                      {item.badge}
                    </span>
                  )}
                </span>
                <span className={['truncate', collapsed ? 'lg:hidden' : ''].join(' ')}>{item.name}</span>
                {item.badge && (
                  <span
                    className={[
                      'ml-auto inline-flex min-w-[1.5rem] items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold',
                      collapsed ? 'lg:hidden' : '',
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-neutral-200 text-neutral-800 group-hover:bg-neutral-300',
                    ].join(' ')}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className={['shrink-0 border-t border-neutral-200 p-4', collapsed ? 'lg:p-2' : ''].join(' ')}>
        {/* Collapsed rail: sign-out icon only */}
        <div
          className={[
            'hidden items-center justify-center',
            collapsed ? 'lg:flex' : '',
          ].join(' ')}
        >
          <SignOutIconButton onClick={handleLogout} />
        </div>

        {/* Expanded: avatar + name/trial on left, sign-out icon on right — one row */}
        <div
          className={[
            'flex items-center gap-2',
            collapsed ? 'lg:hidden' : '',
          ].join(' ')}
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <AccountAvatar initial={orgInitial} />
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
                    {subscriptionStatusLabel(subscriptionStatus ?? '')}
                  </p>
                </>
              )}
            </div>
          </div>
          <SignOutIconButton onClick={handleLogout} />
        </div>
      </div>
    </aside>
  )
}
