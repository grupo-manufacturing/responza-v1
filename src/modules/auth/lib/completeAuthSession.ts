import type { NavigateFunction } from 'react-router-dom'

import type { AuthSession } from '@/modules/auth/auth.types'
import { SessionStorage } from '@/shared/session/storage'

export function completeAuthSession(
  response: AuthSession,
  navigate: NavigateFunction,
  from = '/dashboard',
): void {
  SessionStorage.saveTokens(response.accessToken, response.refreshToken)
  SessionStorage.saveSessionProfile(response)

  if (!response.businessDetails.completed) {
    navigate('/business', { replace: true })
    return
  }

  navigate(from, { replace: true })
}
