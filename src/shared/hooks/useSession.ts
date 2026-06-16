import { useEffect, useState } from 'react'

import { AuthService } from '@/modules/auth/auth.service'
import type { MeResponse } from '@/modules/auth/auth.types'
import { SessionStorage } from '@/shared/session/storage'

let cachedMe: MeResponse | null = null
let inflight: Promise<MeResponse> | null = null
const listeners = new Set<() => void>()

function notifyListeners(): void {
  for (const listener of listeners) {
    listener()
  }
}

export function loadSession(): Promise<MeResponse> {
  if (cachedMe !== null) {
    return Promise.resolve(cachedMe)
  }

  if (inflight !== null) {
    return inflight
  }

  inflight = AuthService.getMe()
    .then((me) => {
      SessionStorage.saveSessionProfile(me)
      cachedMe = me
      notifyListeners()
      return me
    })
    .finally(() => {
      inflight = null
    })

  return inflight
}

export function getCachedSession(): MeResponse | null {
  return cachedMe
}

export function applySessionProfile(me: MeResponse): void {
  SessionStorage.saveSessionProfile(me)
  cachedMe = me
  notifyListeners()
}

export function clearSessionCache(): void {
  cachedMe = null
  inflight = null
  notifyListeners()
}

export function useSession() {
  const [, tick] = useState(0)

  useEffect(() => {
    const listener = () => tick((value) => value + 1)
    listeners.add(listener)

    if (cachedMe === null && inflight === null) {
      void loadSession()
    }

    return () => {
      listeners.delete(listener)
    }
  }, [])

  const stored = SessionStorage.getStoredSubscription()

  return {
    me: cachedMe,
    loading: cachedMe === null && inflight !== null,
    hasSubscriptionAccess: cachedMe?.subscription.hasAccess ?? stored?.hasAccess ?? true,
  }
}
