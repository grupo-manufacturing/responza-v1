declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim()

export function initGoogleAnalytics(): void {
  if (!MEASUREMENT_ID) return

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer ?? []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments) // eslint-disable-line prefer-rest-params
  }
  window.gtag('js', new Date())
  window.gtag('config', MEASUREMENT_ID)
}
