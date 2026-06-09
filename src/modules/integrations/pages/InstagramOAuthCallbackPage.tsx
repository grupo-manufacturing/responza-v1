import { useEffect } from 'react'

import { handleInstagramOAuthCallback } from '@/modules/integrations/lib/instagramOAuth'

export function InstagramOAuthCallbackPage() {
  useEffect(() => {
    // Handle the OAuth callback when the component mounts
    handleInstagramOAuthCallback()
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#405DE6] to-[#E1306C]">
      <div className="text-center text-white">
        <div className="mx-auto mb-6 h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
        <h1 className="mb-2 text-2xl font-semibold">Completing Instagram OAuth...</h1>
        <p className="text-white/90">Please wait while we finalize your Instagram connection.</p>
      </div>
    </div>
  )
}