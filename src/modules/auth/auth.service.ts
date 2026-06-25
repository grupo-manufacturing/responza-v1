import api from '@/shared/api/client'

import type { AuthSession, MeResponse, RegisterPendingResponse } from './auth.types'
import type { TranslationLanguage } from '@/shared/session/storage'

interface AuthApiResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  organization: AuthSession['organization']
  subscription: AuthSession['subscription']
  businessDetails: AuthSession['businessDetails']
}

export interface TranslationLanguageOption {
  code: TranslationLanguage
  label: string
}

export class AuthService {
  static async login(data: { email: string; password: string }): Promise<AuthSession> {
    const response = await api.post<AuthApiResponse>('/auth/login', data)
    return response.data
  }

  static async register(data: {
    email: string
    password: string
    name: string
  }): Promise<AuthSession | RegisterPendingResponse> {
    const response = await api.post<AuthApiResponse | RegisterPendingResponse>('/auth/register', data)
    return response.data
  }

  static async verifyOtp(data: { email: string; token: string }): Promise<AuthSession> {
    const response = await api.post<AuthApiResponse>('/auth/verify-otp', data)
    return response.data
  }

  static async resendOtp(data: { email: string }): Promise<void> {
    await api.post('/auth/resend-otp', data)
  }

  static async completeOAuth(tokens: {
    accessToken: string
    refreshToken: string
    expiresIn: number
  }): Promise<AuthSession> {
    const response = await api.post<AuthApiResponse>(
      '/auth/oauth/complete',
      {
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    )
    return response.data
  }

  static async getMe(): Promise<MeResponse> {
    const response = await api.get<MeResponse>('/auth/me')
    return response.data
  }

  static async patchMe(data: {
    name?: string
    preferredTranslationLanguage?: TranslationLanguage | null
  }): Promise<MeResponse> {
    const response = await api.patch<MeResponse>('/auth/me', data)
    return response.data
  }

  static async getTranslationLanguages(): Promise<{ languages: TranslationLanguageOption[] }> {
    const response = await api.get<{ languages: TranslationLanguageOption[] }>(
      '/auth/translation-languages',
    )
    return response.data
  }

  static async changePassword(data: {
    currentPassword: string
    newPassword: string
  }): Promise<void> {
    await api.post('/auth/change-password', data)
  }
}
