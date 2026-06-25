import axios from 'axios'

import { getApiBaseUrl } from '@/shared/config/env'
import { clearSessionCache } from '@/shared/hooks/useSession'
import { resetRealtimeSupabaseClient } from '@/shared/realtime/supabase'
import { SessionStorage } from '@/shared/session/storage'

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
    const requestUrl = error.config?.url
    const isOAuthComplete =
      typeof requestUrl === 'string' && requestUrl.includes('/auth/oauth/complete')

    if (error.response?.status === 401 && !isOAuthComplete) {
      clearSessionCache()
      SessionStorage.clearTokens()
      resetRealtimeSupabaseClient()
      window.location.href = '/auth?mode=login'
    }
    return Promise.reject(error)
  },
)

export default api
