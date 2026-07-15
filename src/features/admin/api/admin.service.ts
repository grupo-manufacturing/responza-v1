import axios from 'axios'

import { getApiBaseUrl } from '@/shared/config/env'
import { AdminSessionStorage } from '@/features/admin/lib/adminSession'

import type { AdminDashboardResponse } from './admin.types'

export type { AdminDashboardResponse } from './admin.types'

const adminApi = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

adminApi.interceptors.request.use((config) => {
  const token = AdminSessionStorage.getToken()
  if (token !== null) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      AdminSessionStorage.clear()
      if (!window.location.pathname.startsWith('/admin/login')) {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  },
)

export class AdminService {
  static async login(username: string, password: string): Promise<{ accessToken: string; username: string }> {
    const response = await adminApi.post<{ accessToken: string; username: string }>('/admin/login', {
      username,
      password,
    })
    return response.data
  }

  static async getMe(): Promise<{ username: string }> {
    const response = await adminApi.get<{ username: string }>('/admin/me')
    return response.data
  }

  static async getDashboard(): Promise<AdminDashboardResponse> {
    const response = await adminApi.get<AdminDashboardResponse>('/admin/dashboard')
    return response.data
  }
}
