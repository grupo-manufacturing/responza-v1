import axios from 'axios'

type ApiErrorBody = {
  error?: {
    code?: string
    message?: string
  }
}

export function getApiErrorCode(error: unknown): string | null {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorBody | undefined
    if (typeof data?.error?.code === 'string') {
      return data.error.code
    }
  }

  return null
}

export function isIntegrationsRequiredError(error: unknown): boolean {
  if (axios.isAxiosError(error) && error.response?.status === 402) {
    return true
  }

  return getApiErrorCode(error) === 'INTEGRATIONS_REQUIRED'
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
