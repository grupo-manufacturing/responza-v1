import { useCallback, useEffect, useState } from 'react'

import { useToast } from '@/shared/ui/toast'
import { AiService, type ConversationAnalyticsResponse } from '@/features/ai/api/ai.service'
import { getApiErrorMessage } from '@/shared/utils/api-error'
import { canAccessAiAnalytics } from '@/shared/utils/subscription-access'
import type { SubscriptionLike } from '@/shared/utils/subscription-access'

type UseConversationAnalyticsInput = {
  readonly conversationId: string | null
  readonly threadLoading: boolean
  readonly subscription: SubscriptionLike | null | undefined
}

export function useConversationAnalytics({
  conversationId,
  threadLoading,
  subscription,
}: UseConversationAnalyticsInput) {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [locked, setLocked] = useState(false)
  const [data, setData] = useState<ConversationAnalyticsResponse | null>(null)

  useEffect(() => {
    setOpen(false)
    setLocked(false)
    setData(null)
    setLoading(false)
  }, [conversationId])

  const close = useCallback(() => {
    setOpen(false)
  }, [])

  const analyze = useCallback(async () => {
    if (conversationId === null || loading || threadLoading) {
      return
    }

    setOpen(true)

    if (!canAccessAiAnalytics(subscription)) {
      setLocked(true)
      setData(null)
      setLoading(false)
      return
    }

    setLocked(false)
    setLoading(true)

    try {
      const result = await AiService.analyzeConversation(conversationId)
      setData(result)
    } catch (err: unknown) {
      setData(null)
      toast.error(
        getApiErrorMessage(err, 'Could not generate conversation analytics. Please try again.'),
      )
    } finally {
      setLoading(false)
    }
  }, [conversationId, loading, subscription, threadLoading, toast])

  return {
    open,
    loading,
    locked,
    data,
    analyze,
    close,
  }
}
