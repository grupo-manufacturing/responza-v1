import { Navigate } from 'react-router-dom'

import { SessionStorage } from '@/shared/session/storage'

import { AuthLayout } from '../auth-ui'
import { AuthForm } from '../components/AuthForm'

export function AuthPage() {
  const from = '/dashboard'
  const postAuthPath = SessionStorage.isBusinessDetailsCompleted() ? from : '/business'

  if (SessionStorage.isAuthenticated()) {
    return <Navigate to={postAuthPath} replace />
  }

  return (
    <AuthLayout>
      <AuthForm />
    </AuthLayout>
  )
}
