import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { Alert } from '@/components/ui/Alert'
import { Spinner, SpinnerOverlay } from '@/components/ui/Spinner'
import { BusinessService } from '@/modules/business/business.service'
import { AppButton, AppCard, AppFlowLayout, AppProgressBar } from '@/shared/ui/app-ui'
import { LandingLogo } from '@/shared/ui/brand-ui'
import { SessionStorage } from '@/shared/session/storage'
import { getApiErrorMessage } from '@/shared/utils/api-error'

import { BusinessStepForm } from '../components/BusinessStepForm'
import {
  BUSINESS_ONBOARDING_STEPS,
  EMPTY_BUSINESS_FORM,
  buildCompletePayload,
  canProceedStep,
  type BusinessDetailsFormData,
} from '../business-steps'

export function BusinessOnboardingPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isHydrating, setIsHydrating] = useState(true)
  const [alreadyCompleted, setAlreadyCompleted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<BusinessDetailsFormData>(EMPTY_BUSINESS_FORM)

  useEffect(() => {
    let cancelled = false

    void BusinessService.getBusiness()
      .then(({ profile }) => {
        if (cancelled) return
        if (profile.completed) {
          setAlreadyCompleted(true)
        }
      })
      .catch(() => {
      })
      .finally(() => {
        if (!cancelled) {
          setIsHydrating(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleNext = () => {
    setError(null)
    if (currentStep < BUSINESS_ONBOARDING_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await BusinessService.completeBusiness(buildCompletePayload(formData))
      SessionStorage.setBusinessDetailsCompleted(true)
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Something went wrong. Please try again.'))
    } finally {
      setIsLoading(false)
    }
  }

  const currentStepData = BUSINESS_ONBOARDING_STEPS[currentStep]
  const isLastStep = currentStep === BUSINESS_ONBOARDING_STEPS.length - 1
  const progress = ((currentStep + 1) / BUSINESS_ONBOARDING_STEPS.length) * 100
  const canProceed = canProceedStep(currentStepData, formData)

  if (isHydrating) {
    return <SpinnerOverlay label="Preparing your setup..." />
  }

  if (alreadyCompleted) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <AppFlowLayout maxWidthClass="max-w-4xl">
      <div className="flex flex-col gap-5 sm:gap-6">
        <header className="shrink-0 text-center">
          <div className="mb-4 flex justify-center">
            <LandingLogo variant="light" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Set up your <span className="text-accent-gradient">business details</span>
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Help Responza learn your brand voice for smarter replies.
          </p>
        </header>

        <AppProgressBar
          value={progress}
          label={`Step ${currentStep + 1} of ${BUSINESS_ONBOARDING_STEPS.length}`}
        />

        <AppCard padding="default" className="sm:p-8">
          {error !== null && (
            <div className="mb-4">
              <Alert variant="error">{error}</Alert>
            </div>
          )}

          <BusinessStepForm
            step={currentStepData}
            stepIndex={currentStep}
            formData={formData}
            onChange={setFormData}
          />

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-5">
            <AppButton
              variant="secondary"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 0 || isLoading}
            >
              Back
            </AppButton>

            {isLastStep ? (
              <AppButton onClick={() => void handleSave()} disabled={!canProceed || isLoading}>
                {isLoading ? (
                  <>
                    <Spinner size="sm" variant="white" />
                    Saving...
                  </>
                ) : (
                  'Save & finish setup'
                )}
              </AppButton>
            ) : (
              <AppButton onClick={handleNext} disabled={!canProceed}>
                Next
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </AppButton>
            )}
          </div>
        </AppCard>
      </div>
    </AppFlowLayout>
  )
}
