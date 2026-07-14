import { Navigate, createBrowserRouter } from 'react-router-dom'

import { ProtectedRoute } from '@/app/guards/ProtectedRoute'
import { RouteErrorElement } from '@/app/router/RouteErrorElement'
import { PageSuspense } from '@/components/ui/Spinner'
import { AppLayout } from '@/layouts/AppLayout'
import { lazyWithRetry } from '@/shared/utils/lazyWithRetry'

const LandingPage = lazyWithRetry(() =>
  import('@/modules/landing/pages/LandingPage').then((m) => ({ default: m.LandingPage })),
)
const PrivacyPolicyPage = lazyWithRetry(() =>
  import('@/modules/landing/pages/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage })),
)
const TermsPage = lazyWithRetry(() =>
  import('@/modules/landing/pages/TermsPage').then((m) => ({ default: m.TermsPage })),
)
const AuthPage = lazyWithRetry(() =>
  import('@/modules/auth/pages/AuthPage').then((m) => ({ default: m.AuthPage })),
)
const OtpVerificationPage = lazyWithRetry(() =>
  import('@/modules/auth/pages/OtpVerificationPage').then((m) => ({ default: m.OtpVerificationPage })),
)
const GoogleOAuthCallbackPage = lazyWithRetry(() =>
  import('@/modules/auth/pages/GoogleOAuthCallbackPage').then((m) => ({ default: m.GoogleOAuthCallbackPage })),
)
const BusinessOnboardingPage = lazyWithRetry(() =>
  import('@/modules/business/pages/BusinessOnboardingPage').then((m) => ({
    default: m.BusinessOnboardingPage,
  })),
)
const DashboardPage = lazyWithRetry(() =>
  import('@/modules/dashboard/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const LeadsPage = lazyWithRetry(() =>
  import('@/modules/leads/pages/LeadsPage').then((m) => ({ default: m.LeadsPage })),
)
const InboxPage = lazyWithRetry(() =>
  import('@/modules/inbox/pages/InboxPage').then((m) => ({ default: m.InboxPage })),
)
const IntegrationsPage = lazyWithRetry(() =>
  import('@/modules/integrations/pages/IntegrationsPage').then((m) => ({ default: m.IntegrationsPage })),
)
const InstagramOAuthCallbackPage = lazyWithRetry(() =>
  import('@/modules/integrations/pages/InstagramOAuthCallbackPage').then((m) => ({
    default: m.InstagramOAuthCallbackPage,
  })),
)
const SettingsPage = lazyWithRetry(() =>
  import('@/modules/settings/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)
const AdminPage = lazyWithRetry(() =>
  import('@/modules/admin/pages/AdminPage').then((m) => ({ default: m.AdminPage })),
)
const AdminLoginPage = lazyWithRetry(() =>
  import('@/modules/admin/pages/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })),
)

function suspense(element: React.ReactNode) {
  return <PageSuspense>{element}</PageSuspense>
}

export const router = createBrowserRouter([
  {
    errorElement: <RouteErrorElement />,
    children: [
      { path: '/', element: suspense(<LandingPage />) },
      { path: '/auth', element: suspense(<AuthPage />) },
      { path: '/auth/verify', element: suspense(<OtpVerificationPage />) },
      { path: '/auth/google/callback', element: suspense(<GoogleOAuthCallbackPage />) },
      { path: '/login', element: <Navigate to="/auth?mode=login" replace /> },
      { path: '/register', element: <Navigate to="/auth?mode=register" replace /> },
      { path: '/subscription', element: <Navigate to="/settings?tab=subscription" replace /> },
      { path: '/oauth/instagram/callback', element: suspense(<InstagramOAuthCallbackPage />) },
      { path: '/privacy-policy', element: suspense(<PrivacyPolicyPage />) },
      { path: '/terms-conditions', element: suspense(<TermsPage />) },
      { path: '/privacy', element: <Navigate to="/privacy-policy" replace /> },
      { path: '/terms', element: <Navigate to="/terms-conditions" replace /> },
      { path: '/pricing', element: <Navigate to={{ pathname: '/', hash: 'pricing' }} replace /> },
      { path: '/admin/login', element: suspense(<AdminLoginPage />) },
      { path: '/admin', element: suspense(<AdminPage />) },

      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/business',
            element: suspense(<BusinessOnboardingPage />),
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
    ],
  },
])
