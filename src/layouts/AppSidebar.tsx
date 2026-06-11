import { NavLink, useNavigate } from 'react-router-dom'

import { clearSessionCache, useSession } from '@/shared/hooks/useSession'
import { SessionStorage } from '@/shared/session/storage'

import { SIDEBAR_NAVIGATION } from './sidebar.config'
import { SidebarAccountFooter } from './SidebarAccountFooter'

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
  const { me, loading: sessionLoading } = useSession()
  const storedOrg = SessionStorage.getStoredOrganization()
  const organizationName = me?.organization.name ?? storedOrg?.name ?? ''
  const subscriptionStatus = me?.subscription.status ?? SessionStorage.getStoredSubscription()?.status ?? ''
  const isProfileLoading = sessionLoading && organizationName.length === 0

  const handleLogout = () => {
    SessionStorage.clearTokens()
    clearSessionCache()
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
          <div className={['flex min-w-0 items-center gap-3', collapsed ? 'lg:justify-center' : ''].join(' ')}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-sm font-bold text-white shadow-md">
              R
            </div>
            <span className={['truncate text-xl font-semibold text-neutral-900', collapsed ? 'lg:hidden' : ''].join(' ')}>
              Responza AI
            </span>
          </div>
          {onToggleCollapse !== undefined && (
            <div className={collapsed ? 'shrink-0 lg:hidden' : 'shrink-0'}>
              <SidebarCollapseButton collapsed={collapsed} onToggle={onToggleCollapse} variant="header" />
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
            <SidebarCollapseButton collapsed={collapsed} onToggle={onToggleCollapse} variant="nav" />
          </div>
        )}
        {SIDEBAR_NAVIGATION.map((item) => (
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
                    'shrink-0',
                    collapsed ? 'lg:mr-0' : 'mr-3',
                    isActive ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-900',
                  ].join(' ')}
                >
                  {item.icon}
                </span>
                <span className={['truncate', collapsed ? 'lg:hidden' : ''].join(' ')}>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <SidebarAccountFooter
        collapsed={collapsed}
        organizationName={organizationName}
        subscriptionStatus={subscriptionStatus}
        isProfileLoading={isProfileLoading}
        onLogout={handleLogout}
      />
    </aside>
  )
}
