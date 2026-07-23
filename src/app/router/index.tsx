import { Navigate, createBrowserRouter } from 'react-router-dom'

import { ProtectedRoute } from '@/app/guards/ProtectedRoute'
import { RouteErrorElement } from '@/app/router/RouteErrorElement'
import { PageSuspense } from '@/shared/ui/primitives/Spinner'
import { AppLayout } from '@/layouts/AppLayout'
import { isGmailFeatureEnabled } from '@/shared/config/features'
import { lazyWithRetry } from '@/shared/utils/lazyWithRetry'

const LandingPage = lazyWithRetry(() =>
  import('@/features/landing/pages/LandingPage').then((m) => ({ default: m.LandingPage })),
)
const PrivacyPolicyPage = lazyWithRetry(() =>
  import('@/features/landing/pages/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage })),
)
const TermsPage = lazyWithRetry(() =>
  import('@/features/landing/pages/TermsPage').then((m) => ({ default: m.TermsPage })),
)
const AuthPage = lazyWithRetry(() =>
  import('@/features/auth/pages/AuthPage').then((m) => ({ default: m.AuthPage })),
)
const OtpVerificationPage = lazyWithRetry(() =>
  import('@/features/auth/pages/OtpVerificationPage').then((m) => ({ default: m.OtpVerificationPage })),
)
const GoogleOAuthCallbackPage = lazyWithRetry(() =>
  import('@/features/auth/pages/GoogleOAuthCallbackPage').then((m) => ({ default: m.GoogleOAuthCallbackPage })),
)
const BusinessOnboardingPage = lazyWithRetry(() =>
  import('@/features/business/pages/BusinessOnboardingPage').then((m) => ({
    default: m.BusinessOnboardingPage,
  })),
)
const DashboardPage = lazyWithRetry(() =>
  import('@/features/dashboard/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const WhatsAppPage = lazyWithRetry(() =>
  import('@/features/whatsapp/pages/WhatsAppPage').then((m) => ({ default: m.WhatsAppPage })),
)
const InstagramPage = lazyWithRetry(() =>
  import('@/features/instagram/pages/InstagramPage').then((m) => ({ default: m.InstagramPage })),
)
const IntegrationsPage = lazyWithRetry(() =>
  import('@/features/integrations/pages/IntegrationsPage').then((m) => ({ default: m.IntegrationsPage })),
)
const GmailPage = lazyWithRetry(() =>
  import('@/features/gmail/pages/GmailPage').then((m) => ({ default: m.GmailPage })),
)
const InstagramOAuthCallbackPage = lazyWithRetry(() =>
  import('@/features/integrations/pages/InstagramOAuthCallbackPage').then((m) => ({
    default: m.InstagramOAuthCallbackPage,
  })),
)
const GmailOAuthCallbackPage = lazyWithRetry(() =>
  import('@/features/integrations/pages/GmailOAuthCallbackPage').then((m) => ({
    default: m.GmailOAuthCallbackPage,
  })),
)
const SettingsPage = lazyWithRetry(() =>
  import('@/features/settings/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)
const AdminPage = lazyWithRetry(() =>
  import('@/features/admin/pages/AdminPage').then((m) => ({ default: m.AdminPage })),
)
const AdminLoginPage = lazyWithRetry(() =>
  import('@/features/admin/pages/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })),
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
      { path: '/oauth/gmail/callback', element: suspense(<GmailOAuthCallbackPage />) },
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
              { path: '/whatsapp', element: <WhatsAppPage /> },
              { path: '/instagram', element: <InstagramPage /> },
              { path: '/gmail', element: isGmailFeatureEnabled() ? <GmailPage /> : <Navigate to="/dashboard" replace /> },
              { path: '/leads', element: <Navigate to="/whatsapp" replace /> },
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
