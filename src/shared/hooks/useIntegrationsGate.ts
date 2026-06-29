import { useQuery } from '@tanstack/react-query'

import { IntegrationsService } from '@/modules/integrations/integrations.service'

export const integrationsGateKeys = {
  all: ['integrations', 'gate'] as const,
}

function hasConnectedIntegration(
  integrations: Awaited<ReturnType<typeof IntegrationsService.listIntegrations>>['integrations'],
): boolean {
  return integrations.some((integration) => integration.status === 'connected')
}

export function useIntegrationsGate(subscriptionRequired: boolean) {
  const query = useQuery({
    queryKey: integrationsGateKeys.all,
    queryFn: () => IntegrationsService.listIntegrations(),
    enabled: !subscriptionRequired,
    staleTime: 30_000,
  })

  const connected =
    query.data !== undefined ? hasConnectedIntegration(query.data.integrations) : false

  const integrationsLoading = !subscriptionRequired && query.isLoading
  const integrationsRequired =
    !subscriptionRequired && query.isSuccess && !connected

  return {
    integrationsLoading,
    integrationsRequired,
    hasConnectedIntegration: connected,
  }
}
