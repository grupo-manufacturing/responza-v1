import { useEffect, useRef, useState, type ReactNode } from 'react'

import { Spinner } from '@/components/ui/Spinner'
import {
  APP_INPUT_CLASS,
  APP_TEXTAREA_CLASS,
  AppButton,
} from '@/shared/ui/app-ui'
import type { CatalogueFile } from '@/modules/business/business.service'
import {
  BUSINESS_DESCRIPTION_MIN_LENGTH,
  BUSINESS_ONBOARDING_STEPS,
  CATALOGUE_ACCEPT,
  CATALOGUE_MAX_FILES,
  canProceedFromOnboardingStep,
  validateBusinessOnboardingStep,
  validateCatalogueFileBeforeUpload,
  type BusinessOnboardingFieldErrors,
  type BusinessOnboardingFormData,
  type BusinessOnboardingStepId,
} from '@/modules/business/business-onboarding'

type BusinessOnboardingWizardProps = {
  readonly formData: BusinessOnboardingFormData
  readonly catalogueFiles: CatalogueFile[]
  readonly uploadingCatalogue: boolean
  readonly removingCatalogueId: string | null
  readonly fieldErrors?: BusinessOnboardingFieldErrors
  readonly initialStepIndex?: number
  readonly isSaving?: boolean
  readonly onChange: (data: BusinessOnboardingFormData) => void
  readonly onFieldEdit?: (field: keyof BusinessOnboardingFormData) => void
  readonly onUploadCatalogue: (file: File) => Promise<void>
  readonly onRemoveCatalogue: (fileId: string) => Promise<void>
  readonly onComplete: () => void
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FieldError({ message }: { readonly message?: string }) {
  if (message === undefined || message.length === 0) {
    return null
  }

  return <p className="mt-2 text-sm text-red-600">{message}</p>
}

function fieldInputClass(hasError: boolean, large = false): string {
  return [
    APP_INPUT_CLASS,
    large ? 'px-4 py-3.5 text-base' : '',
    hasError ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : '',
  ].join(' ')
}

function fieldTextareaClass(hasError: boolean): string {
  return [
    APP_TEXTAREA_CLASS,
    'min-h-[10rem] px-4 py-3.5 text-base leading-relaxed',
    hasError ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : '',
  ].join(' ')
}

function OnboardingProgress({
  currentStep,
  totalSteps,
}: {
  readonly currentStep: number
  readonly totalSteps: number
}) {
  const percent = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between text-xs font-medium tracking-wide text-ink-faint uppercase">
        <span>
          Step {currentStep} of {totalSteps}
        </span>
        <span>{percent}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent-soft via-accent to-accent-violet transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}

function StepHeader({
  title,
  subtitle,
  required,
}: {
  readonly title: string
  readonly subtitle: string
  readonly required: boolean
}) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
        {title}
        {required && <span className="text-red-500"> *</span>}
        {!required && <span className="ml-2 text-sm font-normal text-ink-faint">(optional)</span>}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{subtitle}</p>
    </div>
  )
}

function StepShell({ children }: { readonly children: ReactNode }) {
  return <div className="animate-step-in">{children}</div>
}

export function BusinessOnboardingWizard({
  formData,
  catalogueFiles,
  uploadingCatalogue,
  removingCatalogueId,
  fieldErrors = {},
  initialStepIndex = 0,
  isSaving = false,
  onChange,
  onFieldEdit,
  onUploadCatalogue,
  onRemoveCatalogue,
  onComplete,
}: BusinessOnboardingWizardProps) {
  const [stepIndex, setStepIndex] = useState(initialStepIndex)
  const [localErrors, setLocalErrors] = useState<BusinessOnboardingFieldErrors>({})
  const [catalogueError, setCatalogueError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  const totalSteps = BUSINESS_ONBOARDING_STEPS.length
  const currentStep = BUSINESS_ONBOARDING_STEPS[stepIndex]
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === totalSteps - 1
  const mergedErrors = { ...localErrors, ...fieldErrors }

  useEffect(() => {
    setStepIndex(initialStepIndex)
  }, [initialStepIndex])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      inputRef.current?.focus()
    }, 120)

    return () => window.clearTimeout(timer)
  }, [stepIndex])

  const updateField = <K extends keyof BusinessOnboardingFormData>(
    field: K,
    value: BusinessOnboardingFormData[K],
  ) => {
    onChange({ ...formData, [field]: value })
    onFieldEdit?.(field)
    setLocalErrors((current) => {
      if (current[field] === undefined) {
        return current
      }

      const next = { ...current }
      delete next[field]
      return next
    })
  }

  const goToStep = (index: number) => {
    setStepIndex(Math.max(0, Math.min(index, totalSteps - 1)))
    setLocalErrors({})
    setCatalogueError(null)
  }

  const handleBack = () => {
    goToStep(stepIndex - 1)
  }

  const handleNext = () => {
    if (currentStep === undefined) {
      return
    }

    const stepErrors = validateBusinessOnboardingStep(currentStep.id, formData)
    if (Object.keys(stepErrors).length > 0) {
      setLocalErrors(stepErrors)
      return
    }

    if (isLastStep) {
      onComplete()
      return
    }

    goToStep(stepIndex + 1)
  }

  const handleSkip = () => {
    if (currentStep === undefined || currentStep.required || isLastStep) {
      return
    }

    goToStep(stepIndex + 1)
  }

  const handleCatalogueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (file === undefined) {
      return
    }

    const validationError = validateCatalogueFileBeforeUpload(file)
    if (validationError !== null) {
      setCatalogueError(validationError)
      return
    }

    setCatalogueError(null)
    void onUploadCatalogue(file).catch((error: unknown) => {
      const message =
        error instanceof Error && error.message.length > 0
          ? error.message
          : 'We could not upload this file. Please try a PDF, Word, Excel, PowerPoint, or text file under 10 MB.'
      setCatalogueError(message)
    })
  }

  const descriptionLength = formData.businessDescription.trim().length
  const descriptionReady = descriptionLength >= BUSINESS_DESCRIPTION_MIN_LENGTH
  const canProceed = currentStep !== undefined && canProceedFromOnboardingStep(currentStep.id, formData)

  const renderStepContent = (stepId: BusinessOnboardingStepId) => {
    switch (stepId) {
      case 'brandName':
        return (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={formData.brandName}
            onChange={(event) => updateField('brandName', event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                handleNext()
              }
            }}
            placeholder="e.g., StyleHub"
            className={fieldInputClass(mergedErrors.brandName !== undefined, true)}
            autoComplete="organization"
          />
        )

      case 'websiteUrl':
        return (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            inputMode="url"
            autoComplete="url"
            value={formData.websiteUrl}
            onChange={(event) => updateField('websiteUrl', event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                handleNext()
              }
            }}
            placeholder="https://yourshop.com"
            className={fieldInputClass(mergedErrors.websiteUrl !== undefined, true)}
          />
        )

      case 'catalogue':
        return (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept={CATALOGUE_ACCEPT}
              className="hidden"
              onChange={handleCatalogueChange}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingCatalogue || catalogueFiles.length >= CATALOGUE_MAX_FILES}
              className={[
                'flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 transition-colors',
                uploadingCatalogue || catalogueFiles.length >= CATALOGUE_MAX_FILES
                  ? 'cursor-not-allowed border-border bg-surface-muted/50 opacity-70'
                  : 'border-accent/25 bg-accent/5 hover:border-accent/40 hover:bg-accent/8',
              ].join(' ')}
            >
              {uploadingCatalogue ? (
                <>
                  <Spinner size="sm" variant="muted" />
                  <span className="mt-3 text-sm font-medium text-ink-muted">Uploading...</span>
                </>
              ) : (
                <>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ink-muted shadow-soft">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.75}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </span>
                  <span className="mt-4 text-sm font-medium text-ink">Click to upload a document</span>
                  <span className="mt-1 text-xs text-ink-faint">PDF, Word, Excel, PowerPoint, or text</span>
                </>
              )}
            </button>

            <FieldError message={catalogueError ?? undefined} />

            {catalogueFiles.length > 0 && (
              <ul className="mt-4 space-y-2">
                {catalogueFiles.map((file) => (
                  <li
                    key={file.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-white px-3 py-2.5 shadow-soft"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{file.filename}</p>
                      <p className="text-xs text-ink-faint">{formatFileSize(file.fileSizeBytes)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        void onRemoveCatalogue(file.id)
                      }}
                      disabled={removingCatalogueId === file.id || uploadingCatalogue}
                      className="shrink-0 text-xs font-medium text-ink-muted transition-colors hover:text-ink disabled:opacity-50"
                    >
                      {removingCatalogueId === file.id ? 'Removing...' : 'Remove'}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {catalogueFiles.length > 0 && (
              <p className="mt-3 text-xs text-ink-faint">
                {catalogueFiles.length} of {CATALOGUE_MAX_FILES} files uploaded
              </p>
            )}
          </div>
        )

      case 'facebookPageUrl':
        return (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            inputMode="url"
            autoComplete="url"
            value={formData.facebookPageUrl}
            onChange={(event) => updateField('facebookPageUrl', event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                handleNext()
              }
            }}
            placeholder="https://facebook.com/yourpage"
            className={fieldInputClass(mergedErrors.facebookPageUrl !== undefined, true)}
          />
        )

      case 'instagramPageUrl':
        return (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            inputMode="url"
            autoComplete="url"
            value={formData.instagramPageUrl}
            onChange={(event) => updateField('instagramPageUrl', event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                handleNext()
              }
            }}
            placeholder="https://instagram.com/yourpage"
            className={fieldInputClass(mergedErrors.instagramPageUrl !== undefined, true)}
          />
        )

      case 'businessDescription':
        return (
          <div>
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={formData.businessDescription}
              onChange={(event) => updateField('businessDescription', event.target.value)}
              placeholder="Describe your products, services, target customers, tone, policies, and common questions you receive..."
              className={fieldTextareaClass(mergedErrors.businessDescription !== undefined)}
            />
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-xs text-ink-faint">
                Minimum {BUSINESS_DESCRIPTION_MIN_LENGTH} characters
              </p>
              <p
                className={[
                  'text-xs font-medium tabular-nums',
                  descriptionReady ? 'text-emerald-600' : 'text-ink-faint',
                ].join(' ')}
              >
                {descriptionLength} / {BUSINESS_DESCRIPTION_MIN_LENGTH}
              </p>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted">
              <div
                className={[
                  'h-full rounded-full transition-all duration-300',
                  descriptionReady
                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                    : 'bg-gradient-to-r from-accent-soft to-accent',
                ].join(' ')}
                style={{
                  width: `${Math.min(100, (descriptionLength / BUSINESS_DESCRIPTION_MIN_LENGTH) * 100)}%`,
                }}
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (currentStep === undefined) {
    return null
  }

  const stepField = currentStep.field
  const stepFieldError = stepField !== undefined ? mergedErrors[stepField] : undefined

  return (
    <div>
      <OnboardingProgress currentStep={stepIndex + 1} totalSteps={totalSteps} />

      <StepShell key={currentStep.id}>
        <StepHeader
          title={currentStep.title}
          subtitle={currentStep.subtitle}
          required={currentStep.required}
        />

        {renderStepContent(currentStep.id)}
        <FieldError message={stepFieldError} />
      </StepShell>

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5">
        <div>
          {!isFirstStep && (
            <AppButton type="button" variant="ghost" onClick={handleBack} disabled={isSaving}>
              Back
            </AppButton>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {!currentStep.required && !isLastStep && (
            <AppButton type="button" variant="secondary" onClick={handleSkip} disabled={isSaving || uploadingCatalogue}>
              Skip
            </AppButton>
          )}

          <AppButton
            type="button"
            onClick={handleNext}
            disabled={isSaving || uploadingCatalogue || (!isLastStep && !canProceed && currentStep.required)}
          >
            {isSaving ? (
              <>
                <Spinner size="sm" variant="white" />
                Saving...
              </>
            ) : isLastStep ? (
              'Save & finish setup'
            ) : (
              'Continue'
            )}
          </AppButton>
        </div>
      </div>

      {isLastStep && !descriptionReady && (
        <p className="mt-3 text-right text-xs text-ink-faint">
          Add at least {BUSINESS_DESCRIPTION_MIN_LENGTH} characters to finish setup.
        </p>
      )}
    </div>
  )
}
