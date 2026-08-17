import { useEffect } from 'react'

import { handleGmailOAuthCallback } from '@/features/integrations/lib/gmailOAuth'
import { OAuthCallbackSplash } from '@/features/integrations/pages/OAuthCallbackSplash'

export function GmailOAuthCallbackPage() {
  useEffect(() => {
    handleGmailOAuthCallback()
  }, [])

  return (
    <OAuthCallbackSplash
      title="Gmail connected"
      className="bg-gradient-to-br from-[#C5221F] to-[#EA4335]"
    />
  )
}
