import { useCallback, useEffect, useState } from 'react'

import {
  businessProfileToFormData,
  canSubmitBusinessOnboarding,
  formDataToBusinessPayload,
  hasBusinessOnboardingFieldErrors,
  isSameBusinessFormData,
  mapApiFieldErrorsToBusinessForm,
  validateBusinessOnboardingForm,
  type BusinessOnboardingFieldErrors,
  type BusinessOnboardingFormData,
} from '@/modules/business/business-onboarding'
import { BusinessService, type CatalogueFile } from '@/modules/business/business.service'
import { getApiErrorMessage, getApiValidationFieldErrors } from '@/shared/utils/api-error'

export function useBusinessProfileEditor() {
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [formData, setFormData] = useState<BusinessOnboardingFormData | null>(null)
  const [fieldErrors, setFieldErrors] = useState<BusinessOnboardingFieldErrors>({})
  const [savedFormData, setSavedFormData] = useState<BusinessOnboardingFormData | null>(null)
  const [catalogueFiles, setCatalogueFiles] = useState<CatalogueFile[]>([])
  const [uploadingCatalogue, setUploadingCatalogue] = useState(false)
  const [removingCatalogueId, setRemovingCatalogueId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{
    variant: 'success' | 'error'
    text: string
  } | null>(null)

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
    setSaveMessage(null)

    try {
      const result = await BusinessService.uploadCatalogue(file)
      setCatalogueFiles(result.profile.catalogueFiles)
      setSaveMessage({
        variant: 'success',
        text: 'Catalogue file uploaded.',
      })
    } catch (err: unknown) {
      throw new Error(
        getApiErrorMessage(err, 'We could not upload this file right now. Please try again in a moment.'),
      )
    } finally {
      setUploadingCatalogue(false)
    }
  }

  const handleRemoveCatalogue = async (fileId: string) => {
    setRemovingCatalogueId(fileId)
    setSaveMessage(null)

    try {
      const result = await BusinessService.deleteCatalogue(fileId)
      setCatalogueFiles(result.profile.catalogueFiles)
      setSaveMessage({
        variant: 'success',
        text: 'Catalogue file removed.',
      })
    } catch (err: unknown) {
      setSaveMessage({
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
    setSaveMessage(null)

    try {
      const result = await BusinessService.updateBusiness(formDataToBusinessPayload(formData))
      const nextFormData = businessProfileToFormData(result.profile)
      setFormData(nextFormData)
      setSavedFormData(nextFormData)
      setCatalogueFiles(result.profile.catalogueFiles)
      setFieldErrors({})
      setSaveMessage({
        variant: 'success',
        text: 'Business profile updated.',
      })
    } catch (err: unknown) {
      const apiFieldErrors = getApiValidationFieldErrors(err)
      if (apiFieldErrors !== null) {
        setFieldErrors(mapApiFieldErrorsToBusinessForm(apiFieldErrors))
        setSaveMessage(null)
      } else {
        setSaveMessage({
          variant: 'error',
          text: getApiErrorMessage(err, 'We could not save your changes right now. Please try again in a moment.'),
        })
      }
    } finally {
      setIsSaving(false)
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
    setSaveMessage(null)
  }

  const handleFormChange = (nextFormData: BusinessOnboardingFormData) => {
    setFormData(nextFormData)
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
    saveMessage,
    canSave,
    handleFieldEdit,
    handleUploadCatalogue,
    handleRemoveCatalogue,
    handleSave,
  }
}
