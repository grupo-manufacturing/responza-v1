type RazorpaySuccessResponse = {
  razorpay_payment_id: string
  razorpay_subscription_id: string
  razorpay_signature: string
}

type RazorpayCheckoutOptions = {
  key: string
  subscription_id: string
  name: string
  description: string
  prefill?: {
    email?: string
    name?: string
  }
  theme?: {
    color?: string
  }
  handler: (response: RazorpaySuccessResponse) => void
  modal?: {
    ondismiss?: () => void
  }
}

type RazorpayCheckoutInstance = {
  open: () => void
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayCheckoutInstance
  }
}

let scriptPromise: Promise<void> | null = null

function loadRazorpayCheckoutScript(): Promise<void> {
  if (window.Razorpay !== undefined) {
    return Promise.resolve()
  }

  if (scriptPromise !== null) {
    return scriptPromise
  }

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load checkout.'))
    document.body.appendChild(script)
  })

  return scriptPromise
}

export type OpenRazorpaySubscriptionCheckoutInput = {
  keyId: string
  subscriptionId: string
  planLabel: string
  customerName?: string
  customerEmail?: string
  onSuccess: (response: RazorpaySuccessResponse) => void
  onDismiss?: () => void
}

export async function openRazorpaySubscriptionCheckout(
  input: OpenRazorpaySubscriptionCheckoutInput,
): Promise<void> {
  await loadRazorpayCheckoutScript()

  if (window.Razorpay === undefined) {
    throw new Error('Checkout is unavailable.')
  }

  const checkout = new window.Razorpay({
    key: input.keyId,
    subscription_id: input.subscriptionId,
    name: 'Responza AI',
    description: `${input.planLabel} plan`,
    prefill: {
      name: input.customerName,
      email: input.customerEmail,
    },
    theme: {
      color: '#171717',
    },
    handler: input.onSuccess,
    modal: {
      ondismiss: input.onDismiss,
    },
  })

  checkout.open()
}
