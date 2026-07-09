import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { SpinnerOverlay } from '@/components/ui/Spinner'
import { getOnboardingWelcomeVideoId } from '@/shared/config/env'
import { AppButton, AppCard, AppFlowLayout } from '@/shared/ui/app-ui'
import { LandingLogo } from '@/shared/ui/brand-ui'
import { SessionStorage } from '@/shared/session/storage'

function WelcomeVideo({ videoId }: { readonly videoId: string }) {
  if (videoId.length === 0) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed border-border bg-surface-muted/80 px-6 text-center">
        <p className="text-sm text-ink-muted">
          Product walkthrough video will appear here once configured.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-ink shadow-card">
      <div className="relative aspect-video w-full">
        <iframe
          title="How to use Responza AI"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  )
}

export function OnboardingWelcomePage() {
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)
  const videoId = getOnboardingWelcomeVideoId()

  useEffect(() => {
    if (!SessionStorage.isBusinessDetailsCompleted()) {
      navigate('/business', { replace: true })
      return
    }

    if (SessionStorage.isOnboardingWelcomeSeen()) {
      navigate('/dashboard', { replace: true })
      return
    }

    setIsChecking(false)
  }, [navigate])

  const goToDashboard = () => {
    SessionStorage.setOnboardingWelcomeSeen(true)
    navigate('/dashboard', { replace: true })
  }

  if (isChecking) {
    return <SpinnerOverlay />
  }

  if (!SessionStorage.isBusinessDetailsCompleted()) {
    return <Navigate to="/business" replace />
  }

  if (SessionStorage.isOnboardingWelcomeSeen()) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <AppFlowLayout maxWidthClass="max-w-3xl">
      <div className="flex flex-col gap-5 sm:gap-6">
        <header className="text-center">
          <div className="mb-4 flex justify-center">
            <LandingLogo variant="light" />
          </div>
          <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
            You&apos;re all set
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
            Welcome to <span className="text-accent-gradient">Responza AI</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
            Watch a quick walkthrough below to see how to use Responza modules — inbox, leads,
            integrations, and AI tools.
          </p>
        </header>

        <AppCard padding="default" className="sm:p-8">
          <p className="mb-4 text-center text-sm font-medium text-ink">
            How to use Responza modules
          </p>

          <WelcomeVideo videoId={videoId} />

          <div className="mt-8 flex flex-col items-center gap-3 border-t border-border pt-6">
            <AppButton type="button" className="w-full sm:w-auto" onClick={goToDashboard}>
              Skip to Dashboard
            </AppButton>
          </div>
        </AppCard>
      </div>
    </AppFlowLayout>
  )
}
