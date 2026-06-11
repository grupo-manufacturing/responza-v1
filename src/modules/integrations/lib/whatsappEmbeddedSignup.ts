import {
  getGraphApiVersion,
  getMetaAppId,
  getWhatsAppEmbeddedConfigId,
  isWhatsAppEmbeddedSignupConfigured,
} from '@/shared/config/env'

export type WhatsAppSessionInfo = {
  phone_number_id: string
  waba_id: string
  business_id?: string
}

type FacebookLoginResponse = {
  authResponse?: {
    code?: string
  }
}

type FacebookSdk = {
  init: (options: {
    appId: string
    autoLogAppEvents: boolean
    xfbml: boolean
    version: string
  }) => void
  login: (
    callback: (response: FacebookLoginResponse) => void,
    options: {
      config_id: string
      response_type: string
      override_default_response_type: boolean
      extras: { setup: Record<string, never> }
    },
  ) => void
}

declare global {
  interface Window {
    FB?: FacebookSdk
    fbAsyncInit?: () => void
  }
}

let facebookSdkReady: Promise<FacebookSdk> | null = null
let latestSessionInfo: WhatsAppSessionInfo | null = null
let sessionListenerBound = false

const SDK_INIT_TIMEOUT_MS = 15000

function bindSessionInfoListener(): void {
  if (sessionListenerBound) {
    return
  }

  sessionListenerBound = true

  window.addEventListener('message', (event) => {
    const fromFacebook = !event.origin || event.origin.endsWith('facebook.com')
    if (!fromFacebook) {
      return
    }

    try {
      const payload = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
      if (payload?.type === 'WA_EMBEDDED_SIGNUP' && payload.data && typeof payload.data === 'object') {
        const data = payload.data as Record<string, unknown>
        const phoneNumberId = typeof data.phone_number_id === 'string' ? data.phone_number_id.trim() : ''
        const wabaId = typeof data.waba_id === 'string' ? data.waba_id.trim() : ''
        const businessId = typeof data.business_id === 'string' ? data.business_id.trim() : ''

        if (phoneNumberId.length > 0 && wabaId.length > 0) {
          latestSessionInfo = {
            phone_number_id: phoneNumberId,
            waba_id: wabaId,
            ...(businessId.length > 0 ? { business_id: businessId } : {}),
          }
        }
      }
    } catch {
      void 0
    }
  })
}

function initializeFacebookSdk(): FacebookSdk {
  if (!window.FB) {
    throw new Error('Facebook SDK failed to initialize')
  }

  window.FB.init({
    appId: getMetaAppId(),
    autoLogAppEvents: true,
    xfbml: true,
    version: getGraphApiVersion(),
  })

  return window.FB
}

function waitForFacebookSdk(): Promise<FacebookSdk> {
  return new Promise((resolve, reject) => {
    if (window.FB) {
      resolve(initializeFacebookSdk())
      return
    }

    const startedAt = Date.now()
    const intervalId = window.setInterval(() => {
      if (window.FB) {
        window.clearInterval(intervalId)
        try {
          resolve(initializeFacebookSdk())
        } catch (error) {
          reject(error)
        }
        return
      }

      if (Date.now() - startedAt >= SDK_INIT_TIMEOUT_MS) {
        window.clearInterval(intervalId)
        reject(new Error('Facebook SDK failed to initialize'))
      }
    }, 100)
  })
}

function loadFacebookSdk(): Promise<FacebookSdk> {
  if (window.FB) {
    return Promise.resolve(initializeFacebookSdk())
  }

  if (facebookSdkReady) {
    return facebookSdkReady
  }

  const appId = getMetaAppId()
  if (appId.length === 0) {
    return Promise.reject(new Error('VITE_META_APP_ID is not configured'))
  }

  facebookSdkReady = new Promise((resolve, reject) => {
    window.fbAsyncInit = () => {
      try {
        resolve(initializeFacebookSdk())
      } catch (error) {
        reject(error)
      }
    }

    if (document.querySelector('script[data-responza-fb-sdk="1"]')) {
      void waitForFacebookSdk().then(resolve).catch(reject)
      return
    }

    const script = document.createElement('script')
    script.async = true
    script.defer = true
    script.crossOrigin = 'anonymous'
    script.dataset.responzaFbSdk = '1'
    script.src = 'https://connect.facebook.net/en_US/sdk.js'
    script.onerror = () => {
      facebookSdkReady = null
      reject(new Error('Failed to load Facebook SDK. Check your network or ad blockers.'))
    }
    document.head.appendChild(script)
  })

  return facebookSdkReady
}

export async function startWhatsAppEmbeddedSignup(): Promise<{
  code: string
  sessionInfo: WhatsAppSessionInfo
}> {
  if (!isWhatsAppEmbeddedSignupConfigured()) {
    throw new Error('WhatsApp Embedded Signup is not configured for this app')
  }

  bindSessionInfoListener()
  latestSessionInfo = null

  const configId = getWhatsAppEmbeddedConfigId()
  const FB = await loadFacebookSdk()

  const code = await new Promise<string>((resolve, reject) => {
    try {
      FB.login(
        (response) => {
          const authCode = response.authResponse?.code?.trim()
          if (!authCode) {
            reject(new Error('WhatsApp Embedded Signup was canceled or failed'))
            return
          }
          resolve(authCode)
        },
        {
          config_id: configId,
          response_type: 'code',
          override_default_response_type: true,
          extras: { setup: {} },
        },
      )
    } catch (error) {
      reject(error instanceof Error ? error : new Error('WhatsApp Embedded Signup failed to open'))
    }
  })

  const sessionInfo = latestSessionInfo
  if (sessionInfo === null) {
    throw new Error('WhatsApp session info was not received. Complete Embedded Signup and try again.')
  }

  return { code, sessionInfo }
}
