import { Navigate } from 'react-router-dom'

import { SessionStorage } from '@/shared/session/storage'

import { AuthLayout } from '../auth-ui'
import { OtpVerificationForm } from '../components/OtpVerificationForm'

export function OtpVerificationPage() {
  const postAuthPath = SessionStorage.isBusinessDetailsCompleted() ? '/dashboard' : '/business'

  if (SessionStorage.isAuthenticated()) {
    return <Navigate to={postAuthPath} replace />
  }

  return (
    <AuthLayout>
      <OtpVerificationForm />
    </AuthLayout>
  )
}
