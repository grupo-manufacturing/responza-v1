export type BusinessOnboardingFormData = {
  brandName: string
  websiteUrl: string
  facebookPageUrl: string
  instagramPageUrl: string
  businessDescription: string
}

export type BusinessOnboardingFieldErrors = Partial<Record<keyof BusinessOnboardingFormData, string>>

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

export const INVALID_HTTP_URL_MESSAGE = 'Must be a valid http or https URL'

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
    formData.businessDescription.trim().length >= BUSINESS_DESCRIPTION_MIN_LENGTH
  )
}

export function validateBusinessOnboardingForm(
  formData: BusinessOnboardingFormData,
): BusinessOnboardingFieldErrors {
  const errors: BusinessOnboardingFieldErrors = {}

  if (formData.brandName.trim().length === 0) {
    errors.brandName = 'Brand name is required'
  }

  const description = formData.businessDescription.trim()
  if (description.length === 0) {
    errors.businessDescription = 'Business description is required'
  } else if (description.length < BUSINESS_DESCRIPTION_MIN_LENGTH) {
    errors.businessDescription = `Business description must be at least ${BUSINESS_DESCRIPTION_MIN_LENGTH} characters`
  }

  if (!isValidOptionalUrl(formData.websiteUrl)) {
    errors.websiteUrl = INVALID_HTTP_URL_MESSAGE
  }

  if (!isValidOptionalUrl(formData.facebookPageUrl)) {
    errors.facebookPageUrl = INVALID_HTTP_URL_MESSAGE
  }

  if (!isValidOptionalUrl(formData.instagramPageUrl)) {
    errors.instagramPageUrl = INVALID_HTTP_URL_MESSAGE
  }

  return errors
}

export function hasBusinessOnboardingFieldErrors(errors: BusinessOnboardingFieldErrors): boolean {
  return Object.keys(errors).length > 0
}

export function optionalUrlForPayload(value: string): string | null {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export function businessProfileToFormData(profile: {
  brandName: string | null
  websiteUrl: string | null
  facebookPageUrl: string | null
  instagramPageUrl: string | null
  businessDescription: string | null
}): BusinessOnboardingFormData {
  return {
    brandName: profile.brandName ?? '',
    websiteUrl: profile.websiteUrl ?? '',
    facebookPageUrl: profile.facebookPageUrl ?? '',
    instagramPageUrl: profile.instagramPageUrl ?? '',
    businessDescription: profile.businessDescription ?? '',
  }
}

export function formDataToBusinessPayload(
  formData: BusinessOnboardingFormData,
): {
  brandName: string
  websiteUrl: string | null
  facebookPageUrl: string | null
  instagramPageUrl: string | null
  businessDescription: string
} {
  return {
    brandName: formData.brandName.trim(),
    websiteUrl: optionalUrlForPayload(formData.websiteUrl),
    facebookPageUrl: optionalUrlForPayload(formData.facebookPageUrl),
    instagramPageUrl: optionalUrlForPayload(formData.instagramPageUrl),
    businessDescription: formData.businessDescription.trim(),
  }
}

export function isSameBusinessFormData(
  left: BusinessOnboardingFormData,
  right: BusinessOnboardingFormData,
): boolean {
  return (
    left.brandName === right.brandName &&
    left.websiteUrl === right.websiteUrl &&
    left.facebookPageUrl === right.facebookPageUrl &&
    left.instagramPageUrl === right.instagramPageUrl &&
    left.businessDescription === right.businessDescription
  )
}

export const BUSINESS_ONBOARDING_FIELD_LABELS: Record<keyof BusinessOnboardingFormData, string> = {
  brandName: 'Brand name',
  websiteUrl: 'Website URL',
  facebookPageUrl: 'Facebook page link',
  instagramPageUrl: 'Instagram page link',
  businessDescription: 'Business description',
}

export function mapApiFieldErrorsToBusinessForm(
  fieldErrors: Record<string, string>,
): BusinessOnboardingFieldErrors {
  const mapped: BusinessOnboardingFieldErrors = {}

  for (const key of Object.keys(BUSINESS_ONBOARDING_FIELD_LABELS) as Array<keyof BusinessOnboardingFormData>) {
    const message = fieldErrors[key]
    if (typeof message === 'string' && message.length > 0) {
      mapped[key] = message
    }
  }

  return mapped
}
