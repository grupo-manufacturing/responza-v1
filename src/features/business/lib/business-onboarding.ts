export type BusinessOnboardingFormData = {
  brandName: string
  websiteUrl: string
  instagramPageUrl: string
  businessDescription: string
  referralCode: string
}

export type BusinessOnboardingFieldErrors = Partial<Record<keyof BusinessOnboardingFormData, string>>

export const EMPTY_BUSINESS_ONBOARDING_FORM: BusinessOnboardingFormData = {
  brandName: '',
  websiteUrl: '',
  instagramPageUrl: '',
  businessDescription: '',
  referralCode: '',
}

export const CATALOGUE_ACCEPT =
  '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain'

export const CATALOGUE_MAX_FILES = 5
const CATALOGUE_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

const CATALOGUE_ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt']

export function validateCatalogueFileBeforeUpload(file: File): string | null {
  const extension = file.name.includes('.') ? (file.name.split('.').pop()?.toLowerCase() ?? '') : ''

  if (!CATALOGUE_ALLOWED_EXTENSIONS.includes(extension)) {
    return `"${file.name}" is not a supported file type. Please upload a PDF, Word, Excel, PowerPoint, or text file.`
  }

  if (file.size === 0) {
    return `"${file.name}" appears to be empty. Please choose a file with content.`
  }

  if (file.size > CATALOGUE_MAX_FILE_SIZE_BYTES) {
    return `"${file.name}" is larger than 10 MB. Try compressing it or splitting it into smaller files.`
  }

  return null
}

export const BRAND_NAME_MAX_LENGTH = 200
export const BUSINESS_DESCRIPTION_MIN_LENGTH = 20
export const BUSINESS_DESCRIPTION_MAX_LENGTH = 5000
export const REFERRAL_CODE_MIN_LENGTH = 2
export const REFERRAL_CODE_MAX_LENGTH = 32

const REFERRAL_CODE_PATTERN = /^[A-Za-z0-9_-]+$/

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

function validateReferralCode(value: string): string | undefined {
  const trimmed = value.trim()
  if (trimmed.length === 0) {
    return undefined
  }

  if (trimmed.length < REFERRAL_CODE_MIN_LENGTH) {
    return `Referral code must be at least ${REFERRAL_CODE_MIN_LENGTH} characters`
  }

  if (trimmed.length > REFERRAL_CODE_MAX_LENGTH) {
    return `Referral code must be ${REFERRAL_CODE_MAX_LENGTH} characters or less`
  }

  if (!REFERRAL_CODE_PATTERN.test(trimmed)) {
    return 'Use only letters, numbers, hyphens, and underscores'
  }

  return undefined
}

export function canSubmitBusinessOnboarding(formData: BusinessOnboardingFormData): boolean {
  return !hasBusinessOnboardingFieldErrors(validateBusinessOnboardingForm(formData))
}

export function validateBusinessOnboardingForm(
  formData: BusinessOnboardingFormData,
): BusinessOnboardingFieldErrors {
  const errors: BusinessOnboardingFieldErrors = {}

  const brandName = formData.brandName.trim()
  if (brandName.length === 0) {
    errors.brandName = 'Enter your brand name'
  } else if (brandName.length > BRAND_NAME_MAX_LENGTH) {
    errors.brandName = `Brand name must be ${BRAND_NAME_MAX_LENGTH} characters or less`
  }

  const description = formData.businessDescription.trim()
  if (description.length < BUSINESS_DESCRIPTION_MIN_LENGTH) {
    errors.businessDescription = `Tell us a bit more — at least ${BUSINESS_DESCRIPTION_MIN_LENGTH} characters`
  } else if (description.length > BUSINESS_DESCRIPTION_MAX_LENGTH) {
    errors.businessDescription = `Business description must be ${BUSINESS_DESCRIPTION_MAX_LENGTH} characters or less`
  }

  if (!isValidOptionalUrl(formData.websiteUrl)) {
    errors.websiteUrl = 'Enter a full website link starting with https:// (e.g. https://yourshop.com)'
  }

  if (!isValidOptionalUrl(formData.instagramPageUrl)) {
    errors.instagramPageUrl =
      'Enter a full Instagram link starting with https:// (e.g. https://instagram.com/yourpage)'
  }

  const referralError = validateReferralCode(formData.referralCode)
  if (referralError !== undefined) {
    errors.referralCode = referralError
  }

  return errors
}

export function hasBusinessOnboardingFieldErrors(errors: BusinessOnboardingFieldErrors): boolean {
  return Object.keys(errors).length > 0
}

function optionalUrlForPayload(value: string): string | null {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export function businessProfileToFormData(profile: {
  brandName: string | null
  websiteUrl: string | null
  instagramPageUrl: string | null
  businessDescription: string | null
}): BusinessOnboardingFormData {
  return {
    brandName: profile.brandName ?? '',
    websiteUrl: profile.websiteUrl ?? '',
    instagramPageUrl: profile.instagramPageUrl ?? '',
    businessDescription: profile.businessDescription ?? '',
    referralCode: '',
  }
}

export function formDataToBusinessPayload(
  formData: BusinessOnboardingFormData,
): {
  brandName: string
  websiteUrl: string | null
  instagramPageUrl: string | null
  businessDescription: string
  referralCode?: string | null
} {
  const referralCode = formData.referralCode.trim()
  return {
    brandName: formData.brandName.trim(),
    websiteUrl: optionalUrlForPayload(formData.websiteUrl),
    instagramPageUrl: optionalUrlForPayload(formData.instagramPageUrl),
    businessDescription: formData.businessDescription.trim(),
    referralCode: referralCode.length > 0 ? referralCode : null,
  }
}

export function formDataToBusinessUpdatePayload(
  formData: BusinessOnboardingFormData,
): {
  brandName: string
  websiteUrl: string | null
  instagramPageUrl: string | null
  businessDescription: string
} {
  return {
    brandName: formData.brandName.trim(),
    websiteUrl: optionalUrlForPayload(formData.websiteUrl),
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
    left.instagramPageUrl === right.instagramPageUrl &&
    left.businessDescription === right.businessDescription &&
    left.referralCode === right.referralCode
  )
}

export const BUSINESS_ONBOARDING_FIELD_LABELS: Record<keyof BusinessOnboardingFormData, string> = {
  brandName: 'Brand name',
  websiteUrl: 'Website URL',
  instagramPageUrl: 'Instagram page link',
  businessDescription: 'Business description',
  referralCode: 'Referral code',
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

export type BusinessOnboardingStepId =
  | 'brandName'
  | 'websiteUrl'
  | 'catalogue'
  | 'instagramPageUrl'
  | 'businessDescription'

export type BusinessOnboardingStep = {
  readonly id: BusinessOnboardingStepId
  readonly title: string
  readonly subtitle: string
  readonly required: boolean
  readonly field?: keyof BusinessOnboardingFormData
}

export const BUSINESS_ONBOARDING_STEPS: readonly BusinessOnboardingStep[] = [
  {
    id: 'brandName',
    title: 'What is your brand name?',
    subtitle: 'This is how customers know you — and how Responza AI will refer to your business.',
    required: true,
    field: 'brandName',
  },
  {
    id: 'websiteUrl',
    title: "Your shop's website",
    subtitle: 'Optional, but helps the AI learn about your products and policies from your site.',
    required: false,
    field: 'websiteUrl',
  },
  {
    id: 'catalogue',
    title: 'Upload your catalogue',
    subtitle: 'Share brochures or product lists so the AI can answer with accurate details. Up to 5 files, 10 MB each.',
    required: false,
  },
  {
    id: 'instagramPageUrl',
    title: 'Instagram page link',
    subtitle: 'Optional. Your Instagram profile gives the AI extra context about your brand voice.',
    required: false,
    field: 'instagramPageUrl',
  },
  {
    id: 'businessDescription',
    title: 'Tell us about your business',
    subtitle:
      'What you sell, who you serve, your tone, policies, and common questions — the more detail, the smarter the AI.',
    required: true,
    field: 'businessDescription',
  },
] as const

export function validateBusinessOnboardingStep(
  stepId: BusinessOnboardingStepId,
  formData: BusinessOnboardingFormData,
): BusinessOnboardingFieldErrors {
  if (stepId === 'catalogue') {
    return {}
  }

  const allErrors = validateBusinessOnboardingForm(formData)
  const errors: BusinessOnboardingFieldErrors = {}

  if (stepId === 'businessDescription') {
    if (allErrors.businessDescription !== undefined) {
      errors.businessDescription = allErrors.businessDescription
    }
    if (allErrors.referralCode !== undefined) {
      errors.referralCode = allErrors.referralCode
    }
    return errors
  }

  const step = BUSINESS_ONBOARDING_STEPS.find((item) => item.id === stepId)
  if (step?.field === undefined) {
    return {}
  }

  const message = allErrors[step.field]
  if (message === undefined) {
    return {}
  }

  return { [step.field]: message }
}

export function canProceedFromOnboardingStep(
  stepId: BusinessOnboardingStepId,
  formData: BusinessOnboardingFormData,
): boolean {
  return !hasBusinessOnboardingFieldErrors(validateBusinessOnboardingStep(stepId, formData))
}

export function findFirstOnboardingStepWithErrors(errors: BusinessOnboardingFieldErrors): number {
  if (errors.referralCode !== undefined) {
    const descriptionStepIndex = BUSINESS_ONBOARDING_STEPS.findIndex(
      (step) => step.id === 'businessDescription',
    )
    if (descriptionStepIndex >= 0) {
      return descriptionStepIndex
    }
  }

  for (let index = 0; index < BUSINESS_ONBOARDING_STEPS.length; index += 1) {
    const step = BUSINESS_ONBOARDING_STEPS[index]
    if (step.field !== undefined && errors[step.field] !== undefined) {
      return index
    }
  }

  return 0
}
