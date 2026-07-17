export type BusinessOnboardingFormData = {
  brandName: string
  websiteUrl: string
  facebookPageUrl: string
  instagramPageUrl: string
  businessDescription: string
  referralCode: string
}

export type BusinessOnboardingFieldErrors = Partial<Record<keyof BusinessOnboardingFormData, string>>

export const EMPTY_BUSINESS_ONBOARDING_FORM: BusinessOnboardingFormData = {
  brandName: '',
  websiteUrl: '',
  facebookPageUrl: '',
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

export const BUSINESS_DESCRIPTION_MIN_LENGTH = 20

const INVALID_HTTP_URL_MESSAGE =
  'Please enter a full link starting with https:// (e.g., https://yourshop.com)'

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

function optionalUrlForPayload(value: string): string | null {
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
    referralCode: '',
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
  referralCode?: string | null
} {
  const referralCode = formData.referralCode.trim()
  return {
    brandName: formData.brandName.trim(),
    websiteUrl: optionalUrlForPayload(formData.websiteUrl),
    facebookPageUrl: optionalUrlForPayload(formData.facebookPageUrl),
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
    left.businessDescription === right.businessDescription &&
    left.referralCode === right.referralCode
  )
}

export const BUSINESS_ONBOARDING_FIELD_LABELS: Record<keyof BusinessOnboardingFormData, string> = {
  brandName: 'Brand name',
  websiteUrl: 'Website URL',
  facebookPageUrl: 'Facebook page link',
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
  | 'facebookPageUrl'
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
    id: 'facebookPageUrl',
    title: 'Facebook page link',
    subtitle: 'Optional. Add your public Facebook page if you use it for customer conversations.',
    required: false,
    field: 'facebookPageUrl',
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
  const step = BUSINESS_ONBOARDING_STEPS.find((item) => item.id === stepId)
  if (step === undefined || step.field === undefined) {
    return {}
  }

  const allErrors = validateBusinessOnboardingForm(formData)
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
  if (stepId === 'catalogue') {
    return true
  }

  return !hasBusinessOnboardingFieldErrors(validateBusinessOnboardingStep(stepId, formData))
}

export function findFirstOnboardingStepWithErrors(errors: BusinessOnboardingFieldErrors): number {
  for (let index = 0; index < BUSINESS_ONBOARDING_STEPS.length; index += 1) {
    const step = BUSINESS_ONBOARDING_STEPS[index]
    if (step.field !== undefined && errors[step.field] !== undefined) {
      return index
    }
  }

  return 0
}
