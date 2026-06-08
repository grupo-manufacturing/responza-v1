import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import AuthService from '@/shared/services/auth.service'

export function ProtectedRoute() {
  const location = useLocation()
  const isAuthenticated = AuthService.isAuthenticated()

  useEffect(() => {
    if (!isAuthenticated) return

    void AuthService.getMe()
      .then((me) => {
        AuthService.saveSessionProfile(me)
      })
      .catch(() => {
        /* 401 handled by API interceptor */
      })
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return <Navigate to="/auth?mode=login" state={{ from: location }} replace />
  }

  return <Outlet />
}
