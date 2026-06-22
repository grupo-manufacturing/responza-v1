import axios from 'axios'

type ApiErrorBody = {
  error?: {
    code?: string
    message?: string
    details?: unknown
  }
}

export function isSubscriptionRequiredError(error: unknown): boolean {
  return getApiErrorCode(error) === 'SUBSCRIPTION_REQUIRED'
}

export function isConversationLimitReachedError(error: unknown): boolean {
  return getApiErrorCode(error) === 'CONVERSATION_LIMIT_REACHED'
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
    const data = error.response?.data as ApiErrorBody | undefined
    if (typeof data?.error?.message === 'string' && data.error.message.length > 0) {
      return data.error.message
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
