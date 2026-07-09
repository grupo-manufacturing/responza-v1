import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { Alert } from '@/components/ui/Alert'
import { Spinner, SpinnerOverlay } from '@/components/ui/Spinner'
import { BusinessOnboardingForm } from '@/modules/business/components/BusinessOnboardingForm'
import {
  BUSINESS_DESCRIPTION_MIN_LENGTH,
  EMPTY_BUSINESS_ONBOARDING_FORM,
  businessProfileToFormData,
  canSubmitBusinessOnboarding,
  formDataToBusinessPayload,
  hasBusinessOnboardingFieldErrors,
  mapApiFieldErrorsToBusinessForm,
  validateBusinessOnboardingForm,
  type BusinessOnboardingFieldErrors,
  type BusinessOnboardingFormData,
} from '@/modules/business/business-onboarding'
import { BusinessService, type CatalogueFile } from '@/modules/business/business.service'
import { AppButton, AppCard, AppFlowLayout } from '@/shared/ui/app-ui'
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
        setFieldErrors(mapApiFieldErrorsToBusinessForm(apiFieldErrors))
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

  const canSubmit = canSubmitBusinessOnboarding(formData)

  if (isHydrating) {
    return <SpinnerOverlay />
  }

  if (alreadyCompleted) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <AppFlowLayout maxWidthClass="max-w-3xl">
      <div className="flex flex-col gap-5 sm:gap-6">
        <header className="shrink-0 text-center">
          <div className="mb-4 flex justify-center">
            <LandingLogo variant="light" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Tell us about your <span className="text-accent-gradient">business</span>
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            A few thoughtful details help our AI understand your brand before you start replying to
            customers.
          </p>
        </header>

        <AppCard padding="default" className="sm:p-8">
          {error !== null && (
            <div className="mb-4">
              <Alert variant="error">{error}</Alert>
            </div>
          )}

          <BusinessOnboardingForm
            formData={formData}
            catalogueFiles={catalogueFiles}
            uploadingCatalogue={uploadingCatalogue}
            removingCatalogueId={removingCatalogueId}
            fieldErrors={fieldErrors}
            onChange={setFormData}
            onFieldEdit={handleFieldEdit}
            onUploadCatalogue={handleUploadCatalogue}
            onRemoveCatalogue={handleRemoveCatalogue}
          />

          <div className="mt-8 flex justify-end border-t border-border pt-5">
            <AppButton onClick={() => void handleSave()} disabled={!canSubmit || isLoading}>
              {isLoading ? (
                <>
                  <Spinner size="sm" variant="white" />
                  Saving...
                </>
              ) : (
                'Save & finish setup'
              )}
            </AppButton>
          </div>

          {!canSubmit && (
            <p className="mt-3 text-right text-xs text-ink-faint">
              Enter your brand name and at least {BUSINESS_DESCRIPTION_MIN_LENGTH} characters about your
              business to continue.
            </p>
          )}
        </AppCard>
      </div>
    </AppFlowLayout>
  )
}
