import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

import { DashboardService } from '@/features/dashboard/api/dashboard.service'
import { useIntegrationsGate } from '@/shared/hooks/useIntegrationsGate'
import { useSubscriptionGate } from '@/shared/hooks/useSubscriptionGate'
import { getApiErrorMessage } from '@/shared/utils/api-error'

const dashboardKeys = {
  all: ['dashboard'] as const,
}

export function useDashboard() {
  const { subscriptionRequired, handleError, reset } = useSubscriptionGate()
  const { integrationsLoading, integrationsRequired } = useIntegrationsGate(subscriptionRequired)

  const queryEnabled =
    !subscriptionRequired && !integrationsRequired && !integrationsLoading

  const query = useQuery({
    queryKey: dashboardKeys.all,
    queryFn: () => DashboardService.getDashboard(),
    enabled: queryEnabled,
    refetchOnWindowFocus: true,
  })

  useEffect(() => {
    reset()
  }, [reset])

  useEffect(() => {
    if (query.error !== null) {
      handleError(query.error)
    }
  }, [handleError, query.error])

  const error =
    query.error !== null && !subscriptionRequired
      ? getApiErrorMessage(query.error, 'Could not load dashboard. Please try again.')
      : null

  return {
    data: query.data,
    loading: query.isLoading,
    error,
    subscriptionRequired,
    integrationsLoading,
    integrationsRequired,
    refetch: query.refetch,
  }
}
