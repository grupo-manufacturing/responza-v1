import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { SubscriptionRequired } from '@/components/common/SubscriptionRequired'
import { PageSuspense, SpinnerOverlay } from '@/components/ui/Spinner'
import { BusinessService } from '@/modules/business/business.service'
import { AppSidebar } from '@/layouts/AppSidebar'
import { AppTopbar } from '@/layouts/AppTopbar'
import { SIDEBAR_COLLAPSED_STORAGE_KEY } from '@/layouts/sidebar.config'
import { useSession } from '@/shared/hooks/useSession'
import { SessionStorage } from '@/shared/session/storage'

function readSidebarCollapsed(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

function isSubscriptionExemptPath(pathname: string): boolean {
  return pathname.startsWith('/settings')
}

export function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { hasSubscriptionAccess, loading: sessionLoading } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(readSidebarCollapsed)
  const [isReady, setIsReady] = useState(false)

  const toggleSidebarCollapsed = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(next))
      } catch {
        return prev
      }
      return next
    })
  }

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const { profile } = await BusinessService.getBusiness()
        if (cancelled) return

        if (!profile.completed) {
          SessionStorage.setBusinessDetailsCompleted(false)
          navigate('/business', { replace: true })
          return
        }

        SessionStorage.setBusinessDetailsCompleted(true)
        setIsReady(true)
      } catch {
        if (!cancelled) {
          setIsReady(true)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [navigate])

  if (!SessionStorage.isBusinessDetailsCompleted()) {
    return <Navigate to="/business" replace />
  }

  if (!isReady || sessionLoading) {
    return <SpinnerOverlay label="Loading your workspace..." />
  }

  const showSubscriptionGate =
    !hasSubscriptionAccess && !isSubscriptionExemptPath(location.pathname)

  return (
    <div className="bg-surface-muted min-h-screen">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-[2px] lg:hidden"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AppSidebar
        mobileOpen={sidebarOpen}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapsed}
        onNavigate={() => setSidebarOpen(false)}
      />
      <AppTopbar collapsed={sidebarCollapsed} onMenuClick={() => setSidebarOpen(true)} />

      <main
        className={[
          'min-h-screen w-full pt-16 transition-[padding] duration-300 ease-in-out',
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72',
        ].join(' ')}
      >
        <div className="p-4 sm:p-6">
          {showSubscriptionGate ? (
            <SubscriptionRequired />
          ) : (
            <PageSuspense label="Loading page...">
              <Outlet />
            </PageSuspense>
          )}
        </div>
      </main>
    </div>
  )
}
