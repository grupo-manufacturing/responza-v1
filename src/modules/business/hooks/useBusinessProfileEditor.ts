import { useCallback, useEffect, useState } from 'react'

import {
  businessProfileToFormData,
  canSubmitBusinessOnboarding,
  formDataToBusinessPayload,
  isSameBusinessFormData,
  type BusinessOnboardingFormData,
} from '@/modules/business/business-onboarding'
import { BusinessService, type CatalogueFile } from '@/modules/business/business.service'
import { getApiErrorMessage } from '@/shared/utils/api-error'

export function useBusinessProfileEditor() {
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [formData, setFormData] = useState<BusinessOnboardingFormData | null>(null)
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
        text: getApiErrorMessage(err, 'Could not remove catalogue file. Please try again.'),
      })
    } finally {
      setRemovingCatalogueId(null)
    }
  }

  const handleSave = async () => {
    if (formData === null || !canSubmitBusinessOnboarding(formData)) {
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
      setSaveMessage({
        variant: 'success',
        text: 'Business profile updated.',
      })
    } catch (err: unknown) {
      setSaveMessage({
        variant: 'error',
        text: getApiErrorMessage(err, 'Could not save business profile. Please try again.'),
      })
    } finally {
      setIsSaving(false)
    }
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
    setFormData,
    catalogueFiles,
    uploadingCatalogue,
    removingCatalogueId,
    isSaving,
    saveMessage,
    canSave,
    handleUploadCatalogue,
    handleRemoveCatalogue,
    handleSave,
  }
}
