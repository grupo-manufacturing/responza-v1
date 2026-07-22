import { useEffect } from 'react'

import { handleGmailOAuthCallback } from '@/features/integrations/lib/gmailOAuth'
import { Spinner } from '@/shared/ui/primitives/Spinner'

export function GmailOAuthCallbackPage() {
  useEffect(() => {
    handleGmailOAuthCallback()
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#C5221F] to-[#EA4335] px-4">
      <div className="text-center text-white">
        <Spinner size="lg" variant="white" />
        <h1 className="mt-4 text-xl font-semibold sm:text-2xl">Gmail connected</h1>
        <p className="mt-1 text-sm text-white/90">Finishing setup. This window will close automatically.</p>
      </div>
    </div>
  )
}
