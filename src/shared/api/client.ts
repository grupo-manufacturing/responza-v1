import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { AuthService } from '@/features/auth/api/auth.service'
import { clearGoogleOAuthStorage } from '@/shared/auth/googleOAuthStorage'
import { getApiBaseUrl } from '@/shared/config/env'
import { clearSessionCache } from '@/shared/hooks/useSession'
import { resetRealtimeSupabaseClient } from '@/shared/realtime/supabase'
import { SessionStorage } from '@/shared/session/storage'

const AUTH_PATHS_SKIP_REFRESH = [
  '/auth/login',
  '/auth/register',
  '/auth/verify-otp',
  '/auth/resend-otp',
  '/auth/oauth/complete',
  '/auth/refresh',
] as const

type RetriableAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

let refreshPromise: Promise<boolean> | null = null

function shouldSkipTokenRefresh(requestUrl: string | undefined): boolean {
  if (requestUrl === undefined) {
    return false
  }

  return AUTH_PATHS_SKIP_REFRESH.some((path) => requestUrl.includes(path))
}

function clearAuthSession(): void {
  clearSessionCache()
  SessionStorage.clearTokens()
  clearGoogleOAuthStorage()
  resetRealtimeSupabaseClient()
}

function redirectToLogin(): void {
  window.location.href = '/auth?mode=login'
}

async function refreshSessionTokens(): Promise<boolean> {
  const refreshToken = localStorage.getItem('refreshToken')
  if (refreshToken === null || refreshToken.length === 0) {
    return false
  }

  if (refreshPromise !== null) {
    return refreshPromise
  }

  refreshPromise = AuthService.refresh(refreshToken)
    .then((tokens) => {
      SessionStorage.saveTokens(tokens.accessToken, tokens.refreshToken)
      resetRealtimeSupabaseClient()
      return true
    })
    .catch(() => false)
    .finally(() => {
      refreshPromise = null
    })

  return refreshPromise
}

api.interceptors.request.use((config) => {
  if (config.headers.Authorization) {
    return config
  }

  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableAxiosRequestConfig | undefined

    if (originalRequest === undefined || error.response?.status !== 401) {
      return Promise.reject(error)
    }

    if (shouldSkipTokenRefresh(originalRequest.url)) {
      return Promise.reject(error)
    }

    if (originalRequest._retry === true) {
      clearAuthSession()
      redirectToLogin()
      return Promise.reject(error)
    }

    originalRequest._retry = true

    const refreshed = await refreshSessionTokens()
    if (!refreshed) {
      clearAuthSession()
      redirectToLogin()
      return Promise.reject(error)
    }

    const accessToken = localStorage.getItem('accessToken')
    if (accessToken !== null) {
      originalRequest.headers.Authorization = `Bearer ${accessToken}`
    }

    return api(originalRequest)
  },
)

export default api
