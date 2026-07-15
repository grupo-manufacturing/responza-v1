import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'

import {
  applyMessageInsert,
  applyMessageUpdate,
  invalidateInboxQueries,
} from '@/features/inbox/lib/mergeInboxCache'
import { getRealtimeSupabaseClient, isRealtimeConfigured } from '@/shared/realtime/supabase'

type UseInboxRealtimeInput = {
  organizationId: string | null
  selectedConversationId: string | null
  enabled: boolean
}

export function useInboxRealtime({
  organizationId,
  selectedConversationId,
  enabled,
}: UseInboxRealtimeInput): void {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!enabled || organizationId === null || !isRealtimeConfigured()) {
      return
    }

    let cancelled = false
    let supabase: SupabaseClient | null = null
    let channel: RealtimeChannel | null = null

    void (async () => {
      const client = await getRealtimeSupabaseClient()
      if (client === null || cancelled) {
        return
      }

      supabase = client

      const nextChannel = client
        .channel(`inbox:${organizationId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `organization_id=eq.${organizationId}`,
          },
          (payload) => {
            applyMessageInsert(queryClient, {
              selectedConversationId,
              row: payload.new as Record<string, unknown>,
            })
          },
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'messages',
            filter: `organization_id=eq.${organizationId}`,
          },
          (payload) => {
            applyMessageUpdate(queryClient, {
              selectedConversationId,
              row: payload.new as Record<string, unknown>,
            })
          },
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'conversations',
            filter: `organization_id=eq.${organizationId}`,
          },
          () => {
            invalidateInboxQueries(queryClient, selectedConversationId)
          },
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            invalidateInboxQueries(queryClient, selectedConversationId)
          }
        })

      if (cancelled) {
        void client.removeChannel(nextChannel)
        return
      }

      channel = nextChannel
    })()

    return () => {
      cancelled = true
      if (supabase !== null && channel !== null) {
        void supabase.removeChannel(channel)
      }
    }
  }, [enabled, organizationId, queryClient, selectedConversationId])
}
