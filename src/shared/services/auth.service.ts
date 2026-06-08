import api from '@/shared/api/client'

export interface AuthFormData {
  email: string
  password: string
  name: string
}

interface AuthApiResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  organization: {
    id: string
    email: string
    name: string
    plan: string
  }
  subscription: {
    status: string
    trialEndsAt: string | null
  }
  businessDetails: {
    completed: boolean
  }
}

export interface AuthSession {
  accessToken: string
  refreshToken: string
  expiresIn: number
  organization: AuthApiResponse['organization']
  subscription: AuthApiResponse['subscription']
  businessDetails: AuthApiResponse['businessDetails']
}

function toAuthSession(data: AuthApiResponse): AuthSession {
  return data
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

const ORGANIZATION_STORAGE_KEY = 'organization'
const SUBSCRIPTION_STORAGE_KEY = 'subscription'
const BUSINESS_DETAILS_COMPLETED_KEY = 'businessDetailsCompleted'

export interface MeResponse {
  organization: AuthSession['organization']
  subscription: AuthSession['subscription']
  businessDetails: AuthSession['businessDetails']
}

export class AuthService {
  static async login(data: LoginRequest): Promise<AuthSession> {
    const response = await api.post<AuthApiResponse>('/auth/login', data)
    return toAuthSession(response.data)
  }

  static async register(data: RegisterRequest): Promise<AuthSession> {
    const response = await api.post<AuthApiResponse>('/auth/register', data)
    return toAuthSession(response.data)
  }

  static async getMe(): Promise<MeResponse> {
    const response = await api.get<MeResponse>('/auth/me')
    return response.data
  }

  static saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  }

  static saveSessionProfile(
    session: Pick<AuthSession, 'organization' | 'subscription' | 'businessDetails'>,
  ): void {
    localStorage.setItem(ORGANIZATION_STORAGE_KEY, JSON.stringify(session.organization))
    localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(session.subscription))
    localStorage.setItem(BUSINESS_DETAILS_COMPLETED_KEY, String(session.businessDetails.completed))
  }

  static isBusinessDetailsCompleted(): boolean {
    return localStorage.getItem(BUSINESS_DETAILS_COMPLETED_KEY) === 'true'
  }

  static setBusinessDetailsCompleted(completed: boolean): void {
    localStorage.setItem(BUSINESS_DETAILS_COMPLETED_KEY, String(completed))
  }

  static getStoredOrganization(): AuthSession['organization'] | null {
    const raw = localStorage.getItem(ORGANIZATION_STORAGE_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as AuthSession['organization']
    } catch {
      return null
    }
  }

  static getStoredSubscription(): AuthSession['subscription'] | null {
    const raw = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as AuthSession['subscription']
    } catch {
      return null
    }
  }

  static clearTokens(): void {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem(ORGANIZATION_STORAGE_KEY)
    localStorage.removeItem(SUBSCRIPTION_STORAGE_KEY)
    localStorage.removeItem(BUSINESS_DETAILS_COMPLETED_KEY)
  }

  static getAccessToken(): string | null {
    return localStorage.getItem('accessToken')
  }

  static isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }
}

export default AuthService
