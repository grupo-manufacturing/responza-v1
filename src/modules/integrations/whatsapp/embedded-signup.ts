import {
  getWhatsAppEmbeddedConfigId,
  isWhatsAppConnectConfigured,
} from '@/shared/config/meta'

import { loadFacebookSdk } from './facebook-sdk'

export type WhatsAppSessionInfo = {
  phone_number_id: string
  waba_id: string
  business_id?: string
}

export type WhatsAppEmbeddedSignupResult = {
  code: string
  session_info: WhatsAppSessionInfo
}

let latestSignupSession: Record<string, unknown> | null = null
let messageListenerAttached = false

function isFacebookOrigin(origin: string): boolean {
  return origin.length === 0 || origin.endsWith('facebook.com')
}

function ensureEmbeddedSignupListener(): void {
  if (messageListenerAttached) {
    return
  }

  messageListenerAttached = true

  window.addEventListener('message', (event) => {
    if (!isFacebookOrigin(event.origin)) {
      return
    }

    try {
      const payload =
        typeof event.data === 'string' ? (JSON.parse(event.data) as unknown) : event.data

      if (
        payload !== null &&
        typeof payload === 'object' &&
        !Array.isArray(payload) &&
        (payload as Record<string, unknown>).type === 'WA_EMBEDDED_SIGNUP'
      ) {
        const data = (payload as Record<string, unknown>).data
        latestSignupSession =
          data !== null && typeof data === 'object' && !Array.isArray(data)
            ? (data as Record<string, unknown>)
            : null
      }
    } catch {
      /* ignore non-JSON postMessage payloads */
    }
  })
}

function normalizeSessionInfo(session: Record<string, unknown> | null): WhatsAppSessionInfo {
  const phoneNumberId =
    typeof session?.phone_number_id === 'string' ? session.phone_number_id.trim() : ''
  const wabaId = typeof session?.waba_id === 'string' ? session.waba_id.trim() : ''
  const businessId =
    typeof session?.business_id === 'string' ? session.business_id.trim() : undefined

  if (phoneNumberId.length === 0 || wabaId.length === 0) {
    throw new Error(
      'WhatsApp signup did not return phone_number_id and waba_id. Complete Embedded Signup and try again.',
    )
  }

  return {
    phone_number_id: phoneNumberId,
    waba_id: wabaId,
    ...(businessId !== undefined && businessId.length > 0 ? { business_id: businessId } : {}),
  }
}

export async function runWhatsAppEmbeddedSignup(): Promise<WhatsAppEmbeddedSignupResult> {
  if (!isWhatsAppConnectConfigured()) {
    throw new Error(
      'WhatsApp connect is not configured. Set VITE_META_APP_ID and VITE_WHATSAPP_EMBEDDED_CONFIG_ID.',
    )
  }

  ensureEmbeddedSignupListener()
  latestSignupSession = null

  const configId = getWhatsAppEmbeddedConfigId()
  const FB = await loadFacebookSdk()

  const code = await new Promise<string>((resolve, reject) => {
    FB.login(
      (response) => {
        const authCode = response.authResponse?.code?.trim() ?? ''
        if (authCode.length === 0) {
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
  })

  return {
    code,
    session_info: normalizeSessionInfo(latestSignupSession),
  }
}
