import { useRef, useState, type ReactNode } from 'react'

import { Spinner } from '@/shared/ui/primitives/Spinner'
import {
  APP_INPUT_CLASS,
  APP_TEXTAREA_CLASS,
  AppButton,
} from '@/shared/ui/app-ui'
import type { CatalogueFile } from '@/features/business/api/business.service'
import {
  BUSINESS_DESCRIPTION_MIN_LENGTH,
  CATALOGUE_ACCEPT,
  CATALOGUE_MAX_FILES,
  validateCatalogueFileBeforeUpload,
  type BusinessOnboardingFieldErrors,
  type BusinessOnboardingFormData,
} from '@/features/business/lib/business-onboarding'

type BusinessOnboardingFormProps = {
  readonly formData: BusinessOnboardingFormData
  readonly catalogueFiles: CatalogueFile[]
  readonly uploadingCatalogue: boolean
  readonly removingCatalogueId: string | null
  readonly fieldErrors?: BusinessOnboardingFieldErrors
  readonly onChange: (data: BusinessOnboardingFormData) => void
  readonly onFieldEdit?: (field: keyof BusinessOnboardingFormData) => void
  readonly onUploadCatalogue: (file: File) => Promise<void>
  readonly onRemoveCatalogue: (fileId: string) => Promise<void>
  readonly intro?: ReactNode
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

function FieldLabel({
  children,
  required = false,
  optional = false,
}: {
  readonly children: string
  readonly required?: boolean
  readonly optional?: boolean
}) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-ink">
      {children}
      {required && <span className="text-red-500"> *</span>}
      {optional && <span className="ml-1 font-normal text-ink-faint">(optional)</span>}
    </label>
  )
}

function FieldError({ message }: { readonly message?: string }) {
  if (message === undefined || message.length === 0) {
    return null
  }

  return <p className="mt-1.5 text-xs text-red-600">{message}</p>
}

function fieldInputClass(hasError: boolean): string {
  return [
    APP_INPUT_CLASS,
    hasError ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : '',
  ].join(' ')
}

function fieldTextareaClass(hasError: boolean): string {
  return [
    APP_TEXTAREA_CLASS,
    'px-4 py-3 text-base',
    hasError ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : '',
  ].join(' ')
}

export function BusinessOnboardingForm({
  formData,
  catalogueFiles,
  uploadingCatalogue,
  removingCatalogueId,
  fieldErrors = {},
  onChange,
  onFieldEdit,
  onUploadCatalogue,
  onRemoveCatalogue,
  intro,
}: BusinessOnboardingFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [catalogueError, setCatalogueError] = useState<string | null>(null)

  const updateField = <K extends keyof BusinessOnboardingFormData>(
    field: K,
    value: BusinessOnboardingFormData[K],
  ) => {
    onChange({ ...formData, [field]: value })
    onFieldEdit?.(field)
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

  return (
    <div className="space-y-6">
      {intro !== undefined ? (
        intro
      ) : (
        <p className="rounded-xl border border-accent/15 bg-accent/5 px-4 py-3 text-sm leading-relaxed text-ink-muted">
          Please share a few details about your business. This helps our AI understand your brand,
          products, and how you communicate — so replies and insights feel accurate and on-brand.
          Website, catalogue, and social links are optional, but they give the AI more context.
        </p>
      )}

      <div>
        <FieldLabel required>What is your brand name?</FieldLabel>
        <input
          type="text"
          value={formData.brandName}
          onChange={(event) => updateField('brandName', event.target.value)}
          placeholder="e.g., StyleHub"
          className={fieldInputClass(fieldErrors.brandName !== undefined)}
        />
        <FieldError message={fieldErrors.brandName} />
      </div>

      <div>
        <FieldLabel optional>Your shop&apos;s website</FieldLabel>
        <input
          type="text"
          inputMode="url"
          autoComplete="url"
          value={formData.websiteUrl}
          onChange={(event) => updateField('websiteUrl', event.target.value)}
          placeholder="https://yourshop.com"
          className={fieldInputClass(fieldErrors.websiteUrl !== undefined)}
        />
        <FieldError message={fieldErrors.websiteUrl} />
      </div>

      <div>
        <FieldLabel optional>Catalogue</FieldLabel>
        <p className="mb-3 text-sm text-ink-muted">
          Upload product catalogues or brochures (PDF, Word, Excel, PowerPoint, or text). Up to 5 files,
          10 MB each.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept={CATALOGUE_ACCEPT}
          className="hidden"
          onChange={handleCatalogueChange}
        />

        <AppButton
          type="button"
          variant="secondary"
          disabled={uploadingCatalogue || catalogueFiles.length >= CATALOGUE_MAX_FILES}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploadingCatalogue ? (
            <>
              <Spinner size="sm" variant="muted" />
              Uploading...
            </>
          ) : (
            'Upload document'
          )}
        </AppButton>

        <FieldError message={catalogueError ?? undefined} />

        {catalogueFiles.length > 0 && (
          <ul className="mt-3 space-y-2">
            {catalogueFiles.map((file) => (
              <li
                key={file.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-muted/60 px-3 py-2.5"
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
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel optional>Facebook page link</FieldLabel>
          <input
            type="text"
            inputMode="url"
            autoComplete="url"
            value={formData.facebookPageUrl}
            onChange={(event) => updateField('facebookPageUrl', event.target.value)}
            placeholder="https://facebook.com/yourpage"
            className={fieldInputClass(fieldErrors.facebookPageUrl !== undefined)}
          />
          <FieldError message={fieldErrors.facebookPageUrl} />
        </div>

        <div>
          <FieldLabel optional>Instagram page link</FieldLabel>
          <input
            type="text"
            inputMode="url"
            autoComplete="url"
            value={formData.instagramPageUrl}
            onChange={(event) => updateField('instagramPageUrl', event.target.value)}
            placeholder="https://instagram.com/yourpage"
            className={fieldInputClass(fieldErrors.instagramPageUrl !== undefined)}
          />
          <FieldError message={fieldErrors.instagramPageUrl} />
        </div>
      </div>

      <div>
        <FieldLabel required>Tell us about your business in detail</FieldLabel>
        <p className="mb-2 text-sm text-ink-muted">
          Include what you sell, who your customers are, pricing approach, policies, and anything else
          the AI should know when replying on your behalf.
        </p>
        <textarea
          value={formData.businessDescription}
          onChange={(event) => updateField('businessDescription', event.target.value)}
          placeholder="Describe your products, services, target customers, tone, policies, and common questions you receive..."
          rows={6}
          className={fieldTextareaClass(fieldErrors.businessDescription !== undefined)}
        />
        <p className="mt-1.5 text-xs text-ink-faint">
          At least {BUSINESS_DESCRIPTION_MIN_LENGTH} characters.
        </p>
        <FieldError message={fieldErrors.businessDescription} />
      </div>
    </div>
  )
}
