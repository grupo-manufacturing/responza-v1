import api from '@/shared/api/client'

import type { AuthSession, MeResponse } from './auth.types'

interface AuthApiResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  organization: AuthSession['organization']
  subscription: AuthSession['subscription']
  businessDetails: AuthSession['businessDetails']
}

export class AuthService {
  static async login(data: { email: string; password: string }): Promise<AuthSession> {
    const response = await api.post<AuthApiResponse>('/auth/login', data)
    return response.data
  }

  static async register(data: { email: string; password: string; name: string }): Promise<AuthSession> {
    const response = await api.post<AuthApiResponse>('/auth/register', data)
    return response.data
  }

  static async getMe(): Promise<MeResponse> {
    const response = await api.get<MeResponse>('/auth/me')
    return response.data
  }

  static async patchMe(data: { name: string }): Promise<MeResponse> {
    const response = await api.patch<MeResponse>('/auth/me', data)
    return response.data
  }

  static async changePassword(data: {
    currentPassword: string
    newPassword: string
  }): Promise<void> {
    await api.post('/auth/change-password', data)
  }
}
