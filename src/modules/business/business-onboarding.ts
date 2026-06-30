export type BusinessOnboardingFormData = {
  brandName: string
  websiteUrl: string
  facebookPageUrl: string
  instagramPageUrl: string
  businessDescription: string
}

export const EMPTY_BUSINESS_ONBOARDING_FORM: BusinessOnboardingFormData = {
  brandName: '',
  websiteUrl: '',
  facebookPageUrl: '',
  instagramPageUrl: '',
  businessDescription: '',
}

export const CATALOGUE_ACCEPT =
  '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain'

export const BUSINESS_DESCRIPTION_MIN_LENGTH = 20

function isValidOptionalUrl(value: string): boolean {
  const trimmed = value.trim()
  if (trimmed.length === 0) {
    return true
  }

  try {
    const url = new URL(trimmed)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function canSubmitBusinessOnboarding(formData: BusinessOnboardingFormData): boolean {
  return (
    formData.brandName.trim().length > 0 &&
    formData.businessDescription.trim().length >= BUSINESS_DESCRIPTION_MIN_LENGTH &&
    isValidOptionalUrl(formData.websiteUrl) &&
    isValidOptionalUrl(formData.facebookPageUrl) &&
    isValidOptionalUrl(formData.instagramPageUrl)
  )
}

export function optionalUrlForPayload(value: string): string | null {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}
