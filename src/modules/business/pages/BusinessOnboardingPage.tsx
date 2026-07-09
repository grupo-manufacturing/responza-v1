import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { Alert } from '@/components/ui/Alert'
import { SpinnerOverlay } from '@/components/ui/Spinner'
import { BusinessOnboardingWizard } from '@/modules/business/components/BusinessOnboardingWizard'
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
} from '@/modules/business/business-onboarding'
import { BusinessService, type CatalogueFile } from '@/modules/business/business.service'
import { AppCard, AppFlowLayout } from '@/shared/ui/app-ui'
import { LandingLogo } from '@/shared/ui/brand-ui'
import { SessionStorage } from '@/shared/session/storage'
import { getApiErrorMessage, getApiValidationFieldErrors } from '@/shared/utils/api-error'

export function BusinessOnboardingPage() {
  const navigate = useNavigate()
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
      throw new Error(getApiErrorMessage(err, 'Could not upload catalogue file. Please try again.'))
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
      setError(getApiErrorMessage(err, 'Could not remove catalogue file. Please try again.'))
    } finally {
      setRemovingCatalogueId(null)
    }
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
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      const apiFieldErrors = getApiValidationFieldErrors(err)
      if (apiFieldErrors !== null) {
        const mappedErrors = mapApiFieldErrorsToBusinessForm(apiFieldErrors)
        setFieldErrors(mappedErrors)
        setStepIndex(findFirstOnboardingStepWithErrors(mappedErrors))
        setError(null)
      } else {
        setError(getApiErrorMessage(err, 'Something went wrong. Please try again.'))
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
    return <Navigate to="/dashboard" replace />
  }

  return (
    <AppFlowLayout maxWidthClass="max-w-xl">
      <div className="flex flex-col gap-5 sm:gap-6">
        <header className="shrink-0 text-center">
          <div className="mb-4 flex justify-center">
            <LandingLogo variant="light" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Set up your <span className="text-accent-gradient">business profile</span>
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            A quick guided setup so Responza AI understands your brand before you start replying.
          </p>
        </header>

        <AppCard padding="default" className="overflow-hidden sm:p-8">
          {error !== null && (
            <div className="mb-4">
              <Alert variant="error">{error}</Alert>
            </div>
          )}

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
        </AppCard>
      </div>
    </AppFlowLayout>
  )
}
