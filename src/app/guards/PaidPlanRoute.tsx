import { Navigate, Outlet } from 'react-router-dom'

import { useSession } from '@/shared/hooks/useSession'
import { SessionStorage } from '@/shared/session/storage'
import { isTrialSubscription } from '@/shared/utils/subscription-access'

export function PaidPlanRoute() {
  const { me } = useSession()
  const subscription = me?.subscription ?? SessionStorage.getStoredSubscription()

  if (isTrialSubscription(subscription)) {
    return <Navigate to="/inbox" replace />
  }

  return <Outlet />
}
