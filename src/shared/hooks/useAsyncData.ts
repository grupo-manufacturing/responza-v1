import { useCallback, useEffect, useState } from 'react'

import { getApiErrorMessage } from '@/shared/utils/api-error'

type UseAsyncDataOptions = {
  onError?: (error: unknown) => boolean
  errorFallback?: string
}

export function useAsyncData<T>(
  loader: () => Promise<T>,
  deps: unknown[],
  options: UseAsyncDataOptions = {},
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(
    async (silent = false) => {
      if (!silent) {
        setLoading(true)
        setError(null)
      }

      try {
        const result = await loader()
        setData(result)
      } catch (err) {
        if (options.onError?.(err)) {
          return
        }

        setError(getApiErrorMessage(err, options.errorFallback ?? 'Something went wrong.'))
      } finally {
        if (!silent) {
          setLoading(false)
        }
      }
    },
    [loader, options.errorFallback, options.onError],
  )

  useEffect(() => {
    void load()
  }, [load, ...deps])

  return { data, loading, error, reload: load, setData }
}
