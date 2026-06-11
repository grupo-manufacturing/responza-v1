import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { Spinner, SpinnerOverlay } from '@/components/ui/Spinner'
import { BusinessService } from '@/modules/business/business.service'
import { SessionStorage } from '@/shared/session/storage'
import { getApiErrorMessage } from '@/shared/utils/api-error'

import { BusinessStepForm } from '../components/BusinessStepForm'
import {
  BUSINESS_ONBOARDING_STEPS,
  EMPTY_BUSINESS_FORM,
  buildCompletePayload,
  businessPrimaryButtonClassName,
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
    return <SpinnerOverlay label="Preparing your setup..." className="bg-neutral-50" />
  }

  if (alreadyCompleted) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-neutral-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-neutral-200/40 blur-3xl" />
        <div className="absolute -right-16 bottom-1/4 h-80 w-80 rounded-full bg-neutral-300/30 blur-3xl" />
        <div className="absolute left-1/2 top-8 h-56 w-56 -translate-x-1/2 rounded-full bg-white blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-6 py-6 sm:gap-6 sm:px-8 sm:py-8">
        <header className="shrink-0 text-center">
          <Link to="/" className="inline-flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-sm font-bold text-white shadow-md">
              R
            </div>
            <span className="text-lg font-semibold text-neutral-900">Responza AI</span>
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-neutral-900 sm:text-3xl">
            Set up your business details
          </h1>
        </header>

        <div className="flex shrink-0 items-center gap-3">
          <div className="relative h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full rounded-full bg-neutral-900 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="shrink-0 text-sm font-semibold text-neutral-600">
            Step {currentStep + 1} of {BUSINESS_ONBOARDING_STEPS.length}
          </span>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-lg shadow-neutral-900/5 sm:gap-5 sm:p-8">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <BusinessStepForm
            step={currentStepData}
            stepIndex={currentStep}
            formData={formData}
            onChange={setFormData}
          />

          <div className="mt-2 flex items-center justify-between gap-3 border-t border-neutral-200 pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 0 || isLoading}
              className="inline-flex items-center rounded-xl border border-neutral-200 bg-white px-5 py-3 text-base font-medium text-neutral-600 transition-all duration-300 hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>

            {isLastStep ? (
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={!canProceed || isLoading}
                className={businessPrimaryButtonClassName}
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" variant="white" />
                    Saving...
                  </>
                ) : (
                  'Save & finish setup'
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed}
                className={businessPrimaryButtonClassName}
              >
                Next
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
