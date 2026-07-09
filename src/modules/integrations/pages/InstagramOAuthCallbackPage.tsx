import { useEffect } from 'react'

import { handleInstagramOAuthCallback } from '@/modules/integrations/lib/instagramOAuth'
import { Spinner } from '@/components/ui/Spinner'

export function InstagramOAuthCallbackPage() {
  useEffect(() => {
    handleInstagramOAuthCallback()
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#405DE6] to-brand-instagram px-4">
      <div className="text-center text-white">
        <Spinner size="lg" variant="white" />
        <h1 className="mt-4 text-xl font-semibold sm:text-2xl">Instagram connected</h1>
        <p className="mt-1 text-sm text-white/90">Finishing setup. This window will close automatically.</p>
      </div>
    </div>
  )
}
