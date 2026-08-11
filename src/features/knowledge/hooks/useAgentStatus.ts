import { useCallback, useEffect, useRef, useState } from 'react'

import { KnowledgeService, type AgentStatusResponse } from '@/features/knowledge/api/knowledge.service'

const POLL_INTERVAL_MS = 4_000

export function useAgentStatus(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true
  const [status, setStatus] = useState<AgentStatusResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const requestIdRef = useRef(0)

  const refetch = useCallback(async () => {
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId

    try {
      const nextStatus = await KnowledgeService.getAgentStatus()
      if (requestIdRef.current !== requestId) {
        return nextStatus
      }

      setStatus(nextStatus)
      setLoadError(null)
      return nextStatus
    } catch {
      if (requestIdRef.current !== requestId) {
        return null
      }

      setLoadError('Could not load agent status.')
      return null
    } finally {
      if (requestIdRef.current === requestId) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      return
    }

    void refetch()
  }, [enabled, refetch])

  useEffect(() => {
    if (!enabled || status?.status !== 'building') {
      return
    }

    const intervalId = window.setInterval(() => {
      void refetch()
    }, POLL_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [enabled, refetch, status?.status])

  return {
    status,
    isLoading,
    loadError,
    refetch,
  }
}
