import { useEffect, useState } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'

import { PageSuspense, SpinnerOverlay } from '@/components/ui/Spinner'
import { AppSidebar } from '@/layouts/AppSidebar'
import { AppTopbar } from '@/layouts/AppTopbar'
import { SIDEBAR_COLLAPSED_STORAGE_KEY } from '@/shared/constants/sidebar'
import AuthService from '@/shared/services/auth.service'
import BusinessService from '@/shared/services/business.service'

function readSidebarCollapsed(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function AppLayout() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(readSidebarCollapsed)
  const [isReady, setIsReady] = useState(false)

  const toggleSidebarCollapsed = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(next))
      } catch {
        /* ignore storage errors */
      }
      return next
    })
  }

  useEffect(() => {
    let cancelled = false

    void BusinessService.getBusiness()
      .then(({ profile }) => {
        if (cancelled) return

        if (!profile.completed) {
          AuthService.setBusinessDetailsCompleted(false)
          navigate('/business', { replace: true })
          return
        }

        AuthService.setBusinessDetailsCompleted(true)
        setIsReady(true)
      })
      .catch(() => {
        if (!cancelled) {
          setIsReady(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [navigate])

  if (!AuthService.isBusinessDetailsCompleted()) {
    return <Navigate to="/business" replace />
  }

  if (!isReady) {
    return <SpinnerOverlay label="Loading your workspace..." className="bg-neutral-50" />
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-neutral-900/40 lg:hidden"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AppSidebar
        mobileOpen={sidebarOpen}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapsed}
      />
      <AppTopbar collapsed={sidebarCollapsed} onMenuClick={() => setSidebarOpen(true)} />

      <main
        className={[
          'min-h-screen w-full pt-16 transition-[padding] duration-300 ease-in-out',
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72',
        ].join(' ')}
      >
        <div className="p-6">
          <PageSuspense label="Loading page...">
            <Outlet />
          </PageSuspense>
        </div>
      </main>
    </div>
  )
}
