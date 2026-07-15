import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

const CHUNK_RELOAD_KEY = 'responza:chunk-reload'

export function isChunkLoadError(error: unknown): boolean {
  if (!(error instanceof Error)) return false

  const message = error.message
  return (
    error.name === 'ChunkLoadError' ||
    /Failed to fetch dynamically imported module/i.test(message) ||
    /error loading dynamically imported module/i.test(message) ||
    /Importing a module script failed/i.test(message) ||
    /Loading chunk [\d]+ failed/i.test(message)
  )
}

export function reloadOnceForChunkError(): boolean {
  try {
    if (sessionStorage.getItem(CHUNK_RELOAD_KEY) === '1') {
      sessionStorage.removeItem(CHUNK_RELOAD_KEY)
      return false
    }
    sessionStorage.setItem(CHUNK_RELOAD_KEY, '1')
  } catch {
    // ignore
  }

  window.location.reload()
  return true
}

function clearChunkReloadFlag() {
  try {
    sessionStorage.removeItem(CHUNK_RELOAD_KEY)
  } catch {
    // ignore
  }
}

export function lazyWithRetry<T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>,
): LazyExoticComponent<T> {
  return lazy(async () => {
    try {
      const module = await factory()
      clearChunkReloadFlag()
      return module
    } catch (error) {
      if (isChunkLoadError(error) && reloadOnceForChunkError()) {
        return new Promise(() => {})
      }
      throw error
    }
  })
}
