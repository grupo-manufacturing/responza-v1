import { useEffect } from 'react'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

import { Spinner } from '@/shared/ui/primitives/Spinner'
import { AppButton } from '@/shared/ui/app-ui'
import { isChunkLoadError, reloadOnceForChunkError } from '@/shared/utils/lazyWithRetry'

export function RouteErrorElement() {
  const error = useRouteError()
  const chunkError = isChunkLoadError(error)

  useEffect(() => {
    if (chunkError) {
      reloadOnceForChunkError()
    }
  }, [chunkError])

  if (chunkError) {
    return (
      <div className="bg-surface-muted flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
        <Spinner size="lg" />
        <p className="text-ink-muted text-sm">Updating to the latest version…</p>
      </div>
    )
  }

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Something went wrong'

  return (
    <div className="bg-surface-muted flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-ink text-lg font-medium">Something went wrong</h1>
      <p className="text-ink-muted max-w-md text-sm">{message}</p>
      <AppButton type="button" onClick={() => window.location.assign('/')}>
        Go home
      </AppButton>
    </div>
  )
}
