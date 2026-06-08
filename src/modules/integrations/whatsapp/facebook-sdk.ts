import { getGraphApiVersion, getMetaAppId } from '@/shared/config/meta'

import type { FacebookSdk } from './facebook-sdk.types'

let facebookSdkReady: Promise<FacebookSdk> | null = null

function waitForFacebookSdk(timeoutMs = 15000): Promise<FacebookSdk> {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now()

    const check = () => {
      if (window.FB !== undefined) {
        resolve(window.FB)
        return
      }

      if (Date.now() - startedAt >= timeoutMs) {
        reject(new Error('Timed out waiting for Facebook SDK'))
        return
      }

      window.setTimeout(check, 50)
    }

    check()
  })
}

export function loadFacebookSdk(): Promise<FacebookSdk> {
  if (window.FB !== undefined) {
    return Promise.resolve(window.FB)
  }

  if (facebookSdkReady !== null) {
    return facebookSdkReady
  }

  const appId = getMetaAppId()
  if (appId.length === 0) {
    return Promise.reject(new Error('VITE_META_APP_ID is not configured'))
  }

  const existingScript = document.querySelector<HTMLScriptElement>(
    'script[data-responza-facebook-sdk="true"]',
  )

  if (existingScript !== null) {
    facebookSdkReady = waitForFacebookSdk()
    return facebookSdkReady
  }

  facebookSdkReady = new Promise((resolve, reject) => {
    window.fbAsyncInit = () => {
      window.FB?.init({
        appId,
        autoLogAppEvents: true,
        xfbml: true,
        version: getGraphApiVersion(),
      })

      if (window.FB === undefined) {
        reject(new Error('Facebook SDK failed to initialize'))
        return
      }

      resolve(window.FB)
    }

    const script = document.createElement('script')
    script.async = true
    script.defer = true
    script.crossOrigin = 'anonymous'
    script.dataset.responzaFacebookSdk = 'true'
    script.src = 'https://connect.facebook.net/en_US/sdk.js'
    script.onerror = () => {
      facebookSdkReady = null
      reject(new Error('Failed to load Facebook SDK'))
    }
    document.head.appendChild(script)
  })

  return facebookSdkReady
}
