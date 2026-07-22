import { useQuery } from '@tanstack/react-query'

import { IntegrationsService } from '@/features/integrations/api/integrations.service'
import { gmailKeys } from '@/features/gmail/constants'

export function useGmailConnection(enabled: boolean) {
  return useQuery({
    queryKey: gmailKeys.connection,
    queryFn: () => IntegrationsService.getGmailStatus(),
    enabled,
    staleTime: 30_000,
  })
}
