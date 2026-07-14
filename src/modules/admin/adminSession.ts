const ADMIN_TOKEN_KEY = 'adminAccessToken'
const ADMIN_USERNAME_KEY = 'adminUsername'

export const AdminSessionStorage = {
  getToken(): string | null {
    return localStorage.getItem(ADMIN_TOKEN_KEY)
  },

  getUsername(): string | null {
    return localStorage.getItem(ADMIN_USERNAME_KEY)
  },

  isAuthenticated(): boolean {
    const token = this.getToken()
    return token !== null && token.length > 0
  },

  saveSession(accessToken: string, username: string): void {
    localStorage.setItem(ADMIN_TOKEN_KEY, accessToken)
    localStorage.setItem(ADMIN_USERNAME_KEY, username)
  },

  clear(): void {
    localStorage.removeItem(ADMIN_TOKEN_KEY)
    localStorage.removeItem(ADMIN_USERNAME_KEY)
  },
}
