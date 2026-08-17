import { useEffect } from 'react'

import { handleInstagramOAuthCallback } from '@/features/integrations/lib/instagramOAuth'
import { OAuthCallbackSplash } from '@/features/integrations/pages/OAuthCallbackSplash'

export function InstagramOAuthCallbackPage() {
  useEffect(() => {
    handleInstagramOAuthCallback()
  }, [])

  return (
    <OAuthCallbackSplash
      title="Instagram connected"
      className="bg-gradient-to-br from-[#405DE6] to-brand-instagram"
    />
  )
}
