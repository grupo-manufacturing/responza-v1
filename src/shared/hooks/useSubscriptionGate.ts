import { useCallback, useState } from 'react'

import { isSubscriptionRequiredError } from '@/shared/utils/api-error'

export function useSubscriptionGate() {
  const [subscriptionRequired, setSubscriptionRequired] = useState(false)

  const handleError = useCallback((error: unknown): boolean => {
    if (!isSubscriptionRequiredError(error)) {
      return false
    }

    setSubscriptionRequired(true)
    return true
  }, [])

  const reset = useCallback(() => {
    setSubscriptionRequired(false)
  }, [])

  return {
    subscriptionRequired,
    handleError,
    reset,
  }
}
