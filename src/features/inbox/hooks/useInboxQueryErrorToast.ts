import { useCallback, useEffect } from 'react'

import { useToast } from '@/shared/ui/toast'
import { isIntegrationsRequiredError } from '@/features/inbox/hooks/useInboxQueries'
import { getApiErrorMessage } from '@/shared/utils/api-error'

type InboxQueryError = {
  readonly error: unknown
  readonly fallbackMessage: string
}

type UseInboxQueryErrorToastInput = {
  readonly subscriptionRequired: boolean
  readonly handleError: (error: unknown) => void
  readonly queryErrors: readonly InboxQueryError[]
}

export function useInboxQueryErrorToast({
  subscriptionRequired,
  handleError,
  queryErrors,
}: UseInboxQueryErrorToastInput): void {
  const toast = useToast()

  const showQueryErrorToast = useCallback(
    (error: unknown, fallbackMessage: string) => {
      handleError(error)

      if (!subscriptionRequired && !isIntegrationsRequiredError(error)) {
        toast.error(getApiErrorMessage(error, fallbackMessage))
      }
    },
    [handleError, subscriptionRequired, toast],
  )

  useEffect(() => {
    for (const { error, fallbackMessage } of queryErrors) {
      if (error) {
        showQueryErrorToast(error, fallbackMessage)
      }
    }
  }, [queryErrors, showQueryErrorToast])
}
