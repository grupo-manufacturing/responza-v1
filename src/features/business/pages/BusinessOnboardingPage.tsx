import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { Alert } from '@/shared/ui/primitives/Alert'
import { SpinnerOverlay } from '@/shared/ui/primitives/Spinner'
import { BusinessConnectChannelsStep } from '@/features/business/components/BusinessConnectChannelsStep'
import { BusinessOnboardingWizard } from '@/features/business/components/BusinessOnboardingWizard'
import {
  EMPTY_BUSINESS_ONBOARDING_FORM,
  businessProfileToFormData,
  findFirstOnboardingStepWithErrors,
  formDataToBusinessPayload,
  hasBusinessOnboardingFieldErrors,
  mapApiFieldErrorsToBusinessForm,
  validateBusinessOnboardingForm,
  type BusinessOnboardingFieldErrors,
  type BusinessOnboardingFormData,
} from '@/features/business/lib/business-onboarding'
import { BusinessService, type CatalogueFile } from '@/features/business/api/business.service'
import { AppCard, AppFlowLayout } from '@/shared/ui/app-ui'
import { LandingLogo } from '@/shared/ui/brand-ui'
import { SessionStorage } from '@/shared/session/storage'
import { getApiErrorMessage, getApiValidationFieldErrors } from '@/shared/utils/api-error'
import { resolveDefaultAppPath } from '@/shared/utils/subscription-access'

type OnboardingPhase = 'profile' | 'connect'

export function BusinessOnboardingPage() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<OnboardingPhase>('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [isHydrating, setIsHydrating] = useState(true)
  const [alreadyCompleted, setAlreadyCompleted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<BusinessOnboardingFormData>(EMPTY_BUSINESS_ONBOARDING_FORM)
  const [fieldErrors, setFieldErrors] = useState<BusinessOnboardingFieldErrors>({})
  const [stepIndex, setStepIndex] = useState(0)
  const [catalogueFiles, setCatalogueFiles] = useState<CatalogueFile[]>([])
  const [uploadingCatalogue, setUploadingCatalogue] = useState(false)
  const [removingCatalogueId, setRemovingCatalogueId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    void BusinessService.getBusiness()
      .then(({ profile }) => {
        if (cancelled) return

        if (profile.completed) {
          if (SessionStorage.isPostOnboardingConnectPending()) {
            setPhase('connect')
            return
          }

          setAlreadyCompleted(true)
          return
        }

        setFormData(businessProfileToFormData(profile))
        setCatalogueFiles(profile.catalogueFiles)
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

  const handleUploadCatalogue = async (file: File) => {
    setUploadingCatalogue(true)
    setError(null)

    try {
      const result = await BusinessService.uploadCatalogue(file)
      setCatalogueFiles(result.profile.catalogueFiles)
    } catch (err: unknown) {
      throw new Error(
        getApiErrorMessage(err, 'Could not upload this file. Try a file under 10 MB.'),
      )
    } finally {
      setUploadingCatalogue(false)
    }
  }

  const handleRemoveCatalogue = async (fileId: string) => {
    setRemovingCatalogueId(fileId)
    setError(null)

    try {
      const result = await BusinessService.deleteCatalogue(fileId)
      setCatalogueFiles(result.profile.catalogueFiles)
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'We could not remove this file right now. Please try again in a moment.'))
    } finally {
      setRemovingCatalogueId(null)
    }
  }

  const enterApp = () => {
    SessionStorage.clearPostOnboardingConnectPending()
    navigate(resolveDefaultAppPath(SessionStorage.getStoredSubscription()), { replace: true })
  }

  const handleSave = async () => {
    const nextFieldErrors = validateBusinessOnboardingForm(formData)
    setFieldErrors(nextFieldErrors)

    if (hasBusinessOnboardingFieldErrors(nextFieldErrors)) {
      setStepIndex(findFirstOnboardingStepWithErrors(nextFieldErrors))
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await BusinessService.completeBusiness(formDataToBusinessPayload(formData))
      SessionStorage.setBusinessDetailsCompleted(true)
      SessionStorage.setPostOnboardingConnectPending(true)
      setPhase('connect')
    } catch (err: unknown) {
      const apiFieldErrors = getApiValidationFieldErrors(err)
      if (apiFieldErrors !== null) {
        const mappedErrors = mapApiFieldErrorsToBusinessForm(apiFieldErrors)
        setFieldErrors(mappedErrors)
        setStepIndex(findFirstOnboardingStepWithErrors(mappedErrors))
        setError(null)
      } else {
        setError(
          getApiErrorMessage(
            err,
            'We could not finish setting up your profile right now. Please try again in a moment — your answers are still here.',
          ),
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleFieldEdit = (field: keyof BusinessOnboardingFormData) => {
    setFieldErrors((current) => {
      if (current[field] === undefined) {
        return current
      }

      const next = { ...current }
      delete next[field]
      return next
    })
    setError(null)
  }

  if (isHydrating) {
    return <SpinnerOverlay />
  }

  if (alreadyCompleted) {
    return <Navigate to={resolveDefaultAppPath(SessionStorage.getStoredSubscription())} replace />
  }

  return (
    <AppFlowLayout maxWidthClass="max-w-xl" compact>
      <div className="flex flex-col gap-3">
        <header className="shrink-0 text-center">
          <div className="mb-2.5 flex justify-center">
            <LandingLogo variant="light" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {phase === 'connect' ? (
              <>
                Connect your <span className="text-accent-gradient">channels</span>
              </>
            ) : (
              <>
                Set up your <span className="text-accent-gradient">business profile</span>
              </>
            )}
          </h1>
        </header>

        <AppCard padding="compact" className="overflow-hidden">
          {error !== null && phase === 'profile' && (
            <div className="mb-3">
              <Alert variant="error">{error}</Alert>
            </div>
          )}

          {phase === 'connect' ? (
            <BusinessConnectChannelsStep onContinue={enterApp} />
          ) : (
            <BusinessOnboardingWizard
              formData={formData}
              catalogueFiles={catalogueFiles}
              uploadingCatalogue={uploadingCatalogue}
              removingCatalogueId={removingCatalogueId}
              fieldErrors={fieldErrors}
              initialStepIndex={stepIndex}
              isSaving={isLoading}
              onChange={setFormData}
              onFieldEdit={handleFieldEdit}
              onUploadCatalogue={handleUploadCatalogue}
              onRemoveCatalogue={handleRemoveCatalogue}
              onComplete={() => void handleSave()}
            />
          )}
        </AppCard>
      </div>
    </AppFlowLayout>
  )
}
