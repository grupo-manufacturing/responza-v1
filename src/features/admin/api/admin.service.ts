import axios from 'axios'

import { getApiBaseUrl } from '@/shared/config/env'
import { AdminSessionStorage } from '@/features/admin/lib/adminSession'

import type {
  AdminAffiliate,
  AdminAffiliateReferralsResponse,
  AdminAffiliatesListResponse,
  AdminDashboardResponse,
} from './admin.types'

export type {
  AdminAffiliate,
  AdminAffiliateReferral,
  AdminAffiliateReferralsResponse,
  AdminAffiliatesListResponse,
  AdminDashboardResponse,
} from './admin.types'

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

  static async listAffiliates(): Promise<AdminAffiliatesListResponse> {
    const response = await adminApi.get<AdminAffiliatesListResponse>('/admin/affiliates')
    return response.data
  }

  static async createAffiliate(input: {
    name: string
    code: string
    notes?: string
  }): Promise<{ affiliate: AdminAffiliate }> {
    const response = await adminApi.post<{ affiliate: AdminAffiliate }>('/admin/affiliates', input)
    return response.data
  }

  static async updateAffiliate(
    id: string,
    input: { name?: string; notes?: string | null; isActive?: boolean },
  ): Promise<{ affiliate: AdminAffiliate }> {
    const response = await adminApi.patch<{ affiliate: AdminAffiliate }>(`/admin/affiliates/${id}`, input)
    return response.data
  }

  static async getAffiliateReferrals(id: string): Promise<AdminAffiliateReferralsResponse> {
    const response = await adminApi.get<AdminAffiliateReferralsResponse>(`/admin/affiliates/${id}/referrals`)
    return response.data
  }
}
