import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { loadSession } from '@/shared/hooks/useSession'
import { SessionStorage } from '@/shared/session/storage'

export function ProtectedRoute() {
  const location = useLocation()
  const isAuthenticated = SessionStorage.isAuthenticated()

  useEffect(() => {
    if (!isAuthenticated) return
    void loadSession()
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return <Navigate to="/auth?mode=login" state={{ from: location }} replace />
  }

  return <Outlet />
}
