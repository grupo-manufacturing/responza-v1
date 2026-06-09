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
