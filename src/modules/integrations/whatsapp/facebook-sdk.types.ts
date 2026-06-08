export type FacebookLoginResponse = {
  authResponse?: {
    code?: string
  }
  status?: string
}

export type FacebookSdk = {
  init: (options: {
    appId: string
    autoLogAppEvents?: boolean
    xfbml?: boolean
    version: string
  }) => void
  login: (
    callback: (response: FacebookLoginResponse) => void,
    options: Record<string, unknown>,
  ) => void
}

declare global {
  interface Window {
    FB?: FacebookSdk
    fbAsyncInit?: () => void
  }
}

export {}
