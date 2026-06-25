import axios from 'axios'

import { getApiBaseUrl } from '@/shared/config/env'
import { clearSessionCache } from '@/shared/hooks/useSession'
import { resetRealtimeSupabaseClient } from '@/shared/realtime/supabase'
import { SessionStorage } from '@/shared/session/storage'

const AUTH_CALLBACK_PATHS = [
  '/oauth/google/callback',
  '/auth/verify-email',
]

function isAuthCallbackRequest(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  return AUTH_CALLBACK_PATHS.some((path) => window.location.pathname.startsWith(path))
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isAuthCallbackRequest()) {
      clearSessionCache()
      SessionStorage.clearTokens()
      resetRealtimeSupabaseClient()
      window.location.href = '/auth?mode=login'
    }
    return Promise.reject(error)
  },
)

export default api
