import { useCallback, useEffect, useState } from 'react'

import {
  businessProfileToFormData,
  canSubmitBusinessOnboarding,
  formDataToBusinessUpdatePayload,
  hasBusinessOnboardingFieldErrors,
  isSameBusinessFormData,
  mapApiFieldErrorsToBusinessForm,
  validateBusinessOnboardingForm,
  type BusinessOnboardingFieldErrors,
  type BusinessOnboardingFormData,
} from '@/features/business/lib/business-onboarding'
import { BusinessService, type CatalogueFile } from '@/features/business/api/business.service'
import { getApiErrorMessage, getApiValidationFieldErrors } from '@/shared/utils/api-error'

export function useBusinessProfileEditor(options?: {
  onProfileMutated?: () => void
  onFeedback?: (feedback: { variant: 'success' | 'error'; text: string }) => void
}) {
  const onProfileMutated = options?.onProfileMutated
  const onFeedback = options?.onFeedback
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [formData, setFormData] = useState<BusinessOnboardingFormData | null>(null)
  const [fieldErrors, setFieldErrors] = useState<BusinessOnboardingFieldErrors>({})
  const [savedFormData, setSavedFormData] = useState<BusinessOnboardingFormData | null>(null)
  const [catalogueFiles, setCatalogueFiles] = useState<CatalogueFile[]>([])
  const [uploadingCatalogue, setUploadingCatalogue] = useState(false)
  const [removingCatalogueId, setRemovingCatalogueId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const loadProfile = useCallback(async () => {
    const { profile } = await BusinessService.getBusiness()
    const nextFormData = businessProfileToFormData(profile)
    setFormData(nextFormData)
    setSavedFormData(nextFormData)
    setCatalogueFiles(profile.catalogueFiles)
    return profile
  }, [])

  useEffect(() => {
    let cancelled = false

    void loadProfile()
      .catch(() => {
        if (!cancelled) {
          setLoadError('Could not load business profile.')
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [loadProfile])

  const handleUploadCatalogue = async (file: File) => {
    setUploadingCatalogue(true)

    try {
      const result = await BusinessService.uploadCatalogue(file)
      setCatalogueFiles(result.profile.catalogueFiles)
      onFeedback?.({
        variant: 'success',
        text: 'Catalogue file uploaded.',
      })
      onProfileMutated?.()
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

    try {
      const result = await BusinessService.deleteCatalogue(fileId)
      setCatalogueFiles(result.profile.catalogueFiles)
      onFeedback?.({
        variant: 'success',
        text: 'Catalogue file removed.',
      })
      onProfileMutated?.()
    } catch (err: unknown) {
      onFeedback?.({
        variant: 'error',
        text: getApiErrorMessage(err, 'We could not remove this file right now. Please try again in a moment.'),
      })
    } finally {
      setRemovingCatalogueId(null)
    }
  }

  const handleSave = async () => {
    if (formData === null) {
      return
    }

    const nextFieldErrors = validateBusinessOnboardingForm(formData)
    setFieldErrors(nextFieldErrors)

    if (hasBusinessOnboardingFieldErrors(nextFieldErrors)) {
      return
    }

    setIsSaving(true)

    try {
      const result = await BusinessService.updateBusiness(formDataToBusinessUpdatePayload(formData))
      const nextFormData = businessProfileToFormData(result.profile)
      setFormData(nextFormData)
      setSavedFormData(nextFormData)
      setCatalogueFiles(result.profile.catalogueFiles)
      setFieldErrors({})
      onFeedback?.({
        variant: 'success',
        text: 'Business profile updated.',
      })
      onProfileMutated?.()
    } catch (err: unknown) {
      const apiFieldErrors = getApiValidationFieldErrors(err)
      if (apiFieldErrors !== null) {
        setFieldErrors(mapApiFieldErrorsToBusinessForm(apiFieldErrors))
      } else {
        onFeedback?.({
          variant: 'error',
          text: getApiErrorMessage(err, 'We could not save your changes right now. Please try again in a moment.'),
        })
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleFormChange = (nextFormData: BusinessOnboardingFormData) => {
    setFormData(nextFormData)
    setFieldErrors(validateBusinessOnboardingForm(nextFormData))
  }

  const isDirty =
    formData !== null &&
    savedFormData !== null &&
    !isSameBusinessFormData(formData, savedFormData)

  const canSave =
    formData !== null && canSubmitBusinessOnboarding(formData) && isDirty && !isSaving

  return {
    isLoading,
    loadError,
    formData,
    setFormData: handleFormChange,
    fieldErrors,
    catalogueFiles,
    uploadingCatalogue,
    removingCatalogueId,
    isSaving,
    canSave,
    handleUploadCatalogue,
    handleRemoveCatalogue,
    handleSave,
  }
}
