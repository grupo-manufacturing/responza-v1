import { getBackendOrigin } from '@/shared/config/api'
import IntegrationsService from '@/shared/services/integrations.service'

const POPUP_FEATURES = 'width=560,height=720,menubar=no,toolbar=no,status=no'
const POPUP_NAME = 'instagram_business_login'

export type InstagramOAuthResult = {
  igUserId: string
  igUsername: string
}

type InstagramBusinessLoginMessage = {
  type: 'INSTAGRAM_BUSINESS_LOGIN'
  status: 'success' | 'error'
  data?: {
    igUserId: string
    igUsername: string
  }
  error?: string
}

function isInstagramBusinessLoginMessage(data: unknown): data is InstagramBusinessLoginMessage {
  if (typeof data !== 'object' || data === null) {
    return false
  }

  return (data as InstagramBusinessLoginMessage).type === 'INSTAGRAM_BUSINESS_LOGIN'
}

function isAllowedOAuthMessageOrigin(origin: string): boolean {
  if (origin === getBackendOrigin()) {
    return true
  }

  return origin === window.location.origin
}

export async function openInstagramConnect(): Promise<InstagramOAuthResult> {
  const { url } = await IntegrationsService.getInstagramConnectUrl()

  return new Promise((resolve, reject) => {
    const popup = window.open(url, POPUP_NAME, POPUP_FEATURES)
    if (!popup) {
      reject(new Error('Pop-up blocked. Allow pop-ups and try again.'))
      return
    }

    let settled = false

    const cleanup = (popupWatcher: number, onMessage: (event: MessageEvent) => void) => {
      window.removeEventListener('message', onMessage)
      window.clearInterval(popupWatcher)
    }

    const onMessage = (event: MessageEvent) => {
      if (!isAllowedOAuthMessageOrigin(event.origin)) {
        return
      }

      if (!isInstagramBusinessLoginMessage(event.data)) {
        return
      }

      if (event.data.status === 'success') {
        const data = event.data.data
        if (data?.igUserId === undefined || data.igUserId.length === 0) {
          settled = true
          cleanup(popupWatcher, onMessage)
          reject(new Error('Instagram connect succeeded but account details were missing.'))
          return
        }

        settled = true
        cleanup(popupWatcher, onMessage)
        resolve({
          igUserId: data.igUserId,
          igUsername: data.igUsername ?? data.igUserId,
        })
        return
      }

      settled = true
      cleanup(popupWatcher, onMessage)
      reject(new Error(event.data.error ?? 'Instagram authorization failed.'))
    }

    const popupWatcher = window.setInterval(() => {
      if (popup.closed && !settled) {
        settled = true
        cleanup(popupWatcher, onMessage)
        reject(new Error('Instagram authorization was canceled.'))
      }
    }, 500)

    window.addEventListener('message', onMessage)
  })
}
