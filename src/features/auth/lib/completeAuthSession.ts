import type { NavigateFunction } from 'react-router-dom'

import type { AuthSession } from '@/features/auth/api/auth.types'
import { SessionStorage } from '@/shared/session/storage'
import {
  resolveDefaultAppPath,
  sanitizePostAuthDestination,
} from '@/shared/utils/subscription-access'

export function completeAuthSession(
  response: AuthSession,
  navigate: NavigateFunction,
  from?: string,
): void {
  SessionStorage.saveTokens(response.accessToken, response.refreshToken)
  SessionStorage.saveSessionProfile(response)

  if (!response.businessDetails.completed) {
    navigate('/business', { replace: true })
    return
  }

  const destination = sanitizePostAuthDestination(
    from ?? resolveDefaultAppPath(response.subscription),
    response.subscription,
  )
  navigate(destination, { replace: true })
}
