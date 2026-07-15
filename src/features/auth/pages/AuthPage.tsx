import { Navigate } from 'react-router-dom'

import { SessionStorage } from '@/shared/session/storage'
import { resolvePostAuthPath } from '@/shared/utils/subscription-access'

import { AuthLayout } from '@/features/auth/components/auth-ui'
import { AuthForm } from '../components/AuthForm'

export function AuthPage() {
  const postAuthPath = resolvePostAuthPath(
    SessionStorage.isBusinessDetailsCompleted(),
    SessionStorage.getStoredSubscription(),
  )

  if (SessionStorage.isAuthenticated()) {
    return <Navigate to={postAuthPath} replace />
  }

  return (
    <AuthLayout>
      <AuthForm />
    </AuthLayout>
  )
}
