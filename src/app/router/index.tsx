import { lazy } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'

import { ProtectedRoute } from '@/app/guards/ProtectedRoute'
import { PageSuspense } from '@/components/ui/Spinner'
import { AppLayout } from '@/layouts/AppLayout'

const LandingPage = lazy(() =>
  import('@/modules/landing/pages/LandingPage').then((m) => ({ default: m.LandingPage })),
)
const AuthPage = lazy(() => import('@/modules/auth/pages/AuthPage').then((m) => ({ default: m.AuthPage })))
const BusinessOnboardingPage = lazy(() =>
  import('@/modules/business/pages/BusinessOnboardingPage').then((m) => ({
    default: m.BusinessOnboardingPage,
  })),
)
const DashboardPage = lazy(() =>
  import('@/modules/dashboard/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const LeadsPage = lazy(() =>
  import('@/modules/leads/pages/LeadsPage').then((m) => ({ default: m.LeadsPage })),
)
const InboxPage = lazy(() =>
  import('@/modules/inbox/pages/InboxPage').then((m) => ({ default: m.InboxPage })),
)
const IntegrationsPage = lazy(() =>
  import('@/modules/integrations/pages/IntegrationsPage').then((m) => ({ default: m.IntegrationsPage })),
)
const InstagramOAuthCallbackPage = lazy(() =>
  import('@/modules/integrations/pages/InstagramOAuthCallbackPage').then((m) => ({ default: m.InstagramOAuthCallbackPage })),
)
const SettingsPage = lazy(() =>
  import('@/modules/settings/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)

function suspense(element: React.ReactNode, label?: string) {
  return <PageSuspense label={label}>{element}</PageSuspense>
}

export const router = createBrowserRouter([
  { path: '/', element: suspense(<LandingPage />, 'Loading...') },
  { path: '/auth', element: suspense(<AuthPage />, 'Loading sign in...') },
  { path: '/login', element: <Navigate to="/auth?mode=login" replace /> },
  { path: '/register', element: <Navigate to="/auth?mode=register" replace /> },
  { path: '/subscription', element: <Navigate to="/settings?tab=subscription" replace /> },
  { path: '/oauth/instagram/callback', element: suspense(<InstagramOAuthCallbackPage />, 'Completing Instagram OAuth...') },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/business',
        element: suspense(<BusinessOnboardingPage />, 'Preparing your setup...'),
      },
      {
        path: '/business-details',
        element: <Navigate to="/business" replace />,
      },
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/leads', element: <LeadsPage /> },
          { path: '/inbox', element: <InboxPage /> },
          { path: '/integrations', element: <IntegrationsPage /> },
          { path: '/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
])
