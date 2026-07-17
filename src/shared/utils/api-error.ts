import axios from 'axios'

import { BUSINESS_ONBOARDING_FIELD_LABELS } from '@/features/business/lib/business-onboarding'

type ApiErrorBody = {
  error?: {
    code?: string
    message?: string
    details?: unknown
  }
}

type ZodFlattenedError = {
  formErrors?: string[]
  fieldErrors?: Record<string, string[]>
}

function formatValidationErrorMessage(details: ZodFlattenedError): string | null {
  const lines: string[] = []

  for (const message of details.formErrors ?? []) {
    if (message.length > 0) {
      lines.push(message)
    }
  }

  for (const [field, messages] of Object.entries(details.fieldErrors ?? {})) {
    const label =
      BUSINESS_ONBOARDING_FIELD_LABELS[field as keyof typeof BUSINESS_ONBOARDING_FIELD_LABELS] ??
      field.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase())

    for (const message of messages ?? []) {
      if (message.length > 0) {
        lines.push(`${label}: ${message}`)
      }
    }
  }

  return lines.length > 0 ? lines.join(' ') : null
}

export function getApiValidationFieldErrors(error: unknown): Record<string, string> | null {
  const details = getApiErrorDetails<ZodFlattenedError & { fieldErrors?: Record<string, string | string[]> }>(
    error,
  )
  if (details?.fieldErrors === undefined) {
    return null
  }

  const mapped: Record<string, string> = {}

  for (const [field, messages] of Object.entries(details.fieldErrors)) {
    if (typeof messages === 'string' && messages.length > 0) {
      mapped[field] = messages
      continue
    }

    const message = Array.isArray(messages) ? messages[0] : undefined
    if (typeof message === 'string' && message.length > 0) {
      mapped[field] = message
    }
  }

  return Object.keys(mapped).length > 0 ? mapped : null
}

export function isEmailNotVerifiedError(error: unknown): boolean {
  return getApiErrorCode(error) === 'EMAIL_NOT_VERIFIED'
}

export function isSubscriptionRequiredError(error: unknown): boolean {
  return getApiErrorCode(error) === 'SUBSCRIPTION_REQUIRED'
}

export function getApiErrorCode(error: unknown): string | null {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorBody | undefined
    if (typeof data?.error?.code === 'string' && data.error.code.length > 0) {
      return data.error.code
    }
  }

  return null
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return 'The request took too long to complete. Please check your internet connection and try again.'
    }

    if (error.response === undefined) {
      return 'We could not reach the server. Please check your internet connection and try again.'
    }

    const data = error.response.data as ApiErrorBody | undefined
    const code = data?.error?.code
    const details = data?.error?.details

    if (code === 'VALIDATION_ERROR' && details !== undefined && details !== null) {
      const formatted = formatValidationErrorMessage(details as ZodFlattenedError)
      if (formatted !== null) {
        return formatted
      }
    }

    const message = data?.error?.message
    if (typeof message === 'string' && message.length > 0) {
      if (!(code === 'INTERNAL_ERROR' && message === 'An unexpected error occurred')) {
        return message
      }
    }

    if (error.response.status === 413) {
      return 'This file is too large to upload. Please choose a smaller file.'
    }
  }

  return fallback
}

export function getApiErrorDetails<T>(error: unknown): T | null {
  if (!axios.isAxiosError(error)) {
    return null
  }

  const data = error.response?.data as ApiErrorBody | undefined
  const details = data?.error?.details
  if (details === undefined || details === null) {
    return null
  }

  return details as T
}
