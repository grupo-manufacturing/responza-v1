import { useEffect } from 'react'

import { getCloudflareAnalyticsToken } from '@/shared/config/env'

const BEACON_SRC = 'https://static.cloudflareinsights.com/beacon.min.js'
const SCRIPT_ID = 'cloudflare-web-analytics'

export function CloudflareWebAnalytics() {
  useEffect(() => {
    const token = getCloudflareAnalyticsToken()
    if (token.length === 0) return
    if (document.getElementById(SCRIPT_ID) !== null) return

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.defer = true
    script.src = BEACON_SRC
    script.setAttribute('data-cf-beacon', JSON.stringify({ token, spa: true }))
    document.body.appendChild(script)

    return () => {
      document.getElementById(SCRIPT_ID)?.remove()
    }
  }, [])

  return null
}
