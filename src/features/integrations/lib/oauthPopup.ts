type OAuthPopupResult = {
  code: string
  payload: Record<string, unknown>
}

export async function waitForOAuthPopupCode(input: {
  authUrl: string
  windowName: string
  allowedOrigins: string[]
  successType: string
  errorType: string
  canceledMessage: string
  validate?: (payload: Record<string, unknown>) => string | null
}): Promise<OAuthPopupResult> {
  return new Promise((resolve, reject) => {
    let settled = false
    let popup: Window | null = null
    let timer: number | null = null

    const cleanup = () => {
      window.removeEventListener('message', onMessage)
      if (timer !== null) {
        window.clearInterval(timer)
      }
    }

    const fail = (error: Error) => {
      if (settled) {
        return
      }
      settled = true
      cleanup()
      reject(error)
    }

    const succeed = (result: OAuthPopupResult) => {
      if (settled) {
        return
      }
      settled = true
      cleanup()
      resolve(result)
    }

    const onMessage = (event: MessageEvent) => {
      if (!event.origin || !input.allowedOrigins.includes(event.origin)) {
        return
      }

      const payload =
        typeof event.data === 'object' && event.data !== null
          ? (event.data as Record<string, unknown>)
          : null

      if (payload === null) {
        return
      }

      if (payload.type === input.successType && typeof payload.code === 'string') {
        const validationError = input.validate?.(payload) ?? null
        if (validationError !== null) {
          fail(new Error(validationError))
          return
        }

        succeed({ code: payload.code, payload })
        return
      }

      if (payload.type === input.errorType) {
        fail(new Error(typeof payload.error === 'string' ? payload.error : `${input.windowName} OAuth failed`))
      }
    }

    window.addEventListener('message', onMessage)

    popup = window.open(
      input.authUrl,
      input.windowName,
      'width=560,height=720,menubar=no,toolbar=no,status=no,scrollbars=yes',
    )

    if (!popup) {
      fail(new Error('Pop-up blocked. Allow pop-ups and try again.'))
      return
    }

    timer = window.setInterval(() => {
      if (popup?.closed && !settled) {
        fail(new Error(input.canceledMessage))
      }
    }, 1000)
  })
}

export function postOAuthResultToOpener(payload: Record<string, unknown>): void {
  window.opener?.postMessage(payload, window.location.origin)
  window.setTimeout(() => {
    window.close()
  }, 150)
}
