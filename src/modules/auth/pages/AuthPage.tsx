import { Navigate } from 'react-router-dom'

import { SessionStorage } from '@/shared/session/storage'

import { AuthForm } from '../components/AuthForm'

export function AuthPage() {
  const from = '/dashboard'
  const postAuthPath = SessionStorage.isBusinessDetailsCompleted() ? from : '/business'

  if (SessionStorage.isAuthenticated()) {
    return <Navigate to={postAuthPath} replace />
  }

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-neutral-50 p-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-neutral-200/40 blur-3xl" />
        <div className="absolute -right-16 bottom-1/4 h-80 w-80 rounded-full bg-neutral-300/30 blur-3xl" />
        <div className="absolute left-1/2 top-8 h-56 w-56 -translate-x-1/2 rounded-full bg-white blur-3xl" />
      </div>

      <AuthForm />
    </div>
  )
}
