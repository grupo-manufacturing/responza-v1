import api from '@/shared/api/client'

import type { AuthSession, MeResponse, RegisterResponse } from './auth.types'
import type { TranslationLanguage } from '@/shared/session/storage'

interface AuthApiResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  organization: AuthSession['organization']
  subscription: AuthSession['subscription']
  businessDetails: AuthSession['businessDetails']
}

interface RegisterVerificationResponse {
  requiresEmailVerification: true
  email: string
}

export interface TranslationLanguageOption {
  code: TranslationLanguage
  label: string
}

function isRegisterVerificationResponse(
  data: AuthApiResponse | RegisterVerificationResponse,
): data is RegisterVerificationResponse {
  return 'requiresEmailVerification' in data && data.requiresEmailVerification === true
}

export class AuthService {
  static async login(data: { email: string; password: string }): Promise<AuthSession> {
    const response = await api.post<AuthApiResponse>('/auth/login', data)
    return response.data
  }

  static async register(data: { email: string; password: string; name: string }): Promise<RegisterResponse> {
    const response = await api.post<AuthApiResponse | RegisterVerificationResponse>('/auth/register', data)
    if (isRegisterVerificationResponse(response.data)) {
      return response.data
    }

    return response.data
  }

  static async resendVerificationEmail(email: string): Promise<void> {
    await api.post('/auth/resend-verification', { email })
  }

  static async completeGoogleSignIn(data: {
    accessToken: string
    refreshToken: string
    expiresIn: number
  }): Promise<AuthSession> {
    const response = await api.post<AuthApiResponse>('/auth/google/callback', data)
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
