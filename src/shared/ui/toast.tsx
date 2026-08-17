import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type ToastVariant = 'success' | 'error' | 'info'

export type ToastInput = {
  readonly title?: string
  readonly message: string
  readonly variant?: ToastVariant
  readonly durationMs?: number
}

type ToastItem = {
  readonly id: string
  readonly title?: string
  readonly message: string
  readonly variant: ToastVariant
  readonly durationMs: number
}

type ToastApi = {
  readonly push: (input: ToastInput) => void
  readonly success: (message: string, title?: string) => void
  readonly error: (message: string, title?: string) => void
  readonly info: (message: string, title?: string) => void
  readonly dismiss: (id: string) => void
}

const ToastContext = createContext<ToastApi | null>(null)

const DEFAULT_DURATION_MS = 4200

const VARIANT_CLASS: Record<ToastVariant, string> = {
  success: 'border-emerald-200/80 bg-white text-ink',
  error: 'border-red-200/80 bg-white text-ink',
  info: 'border-border bg-white text-ink',
}

const ACCENT_CLASS: Record<ToastVariant, string> = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-accent',
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  readonly toasts: ToastItem[]
  readonly onDismiss: (id: string) => void
}) {
  if (toasts.length === 0) {
    return null
  }

  return (
    <div
      className="pointer-events-none fixed right-4 bottom-4 z-[100] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2"
      aria-live="polite"
      aria-relevant="additions"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={[
            'pointer-events-auto animate-toast-in overflow-hidden rounded-2xl border shadow-card',
            VARIANT_CLASS[toast.variant],
          ].join(' ')}
        >
          <div className="flex gap-3 px-4 py-3.5">
            <span
              className={['mt-1.5 h-2 w-2 shrink-0 rounded-full', ACCENT_CLASS[toast.variant]].join(' ')}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              {toast.title !== undefined && toast.title.length > 0 ? (
                <p className="text-sm font-semibold text-ink">{toast.title}</p>
              ) : null}
              <p
                className={[
                  'text-sm leading-relaxed text-ink-muted',
                  toast.title !== undefined && toast.title.length > 0 ? 'mt-0.5' : '',
                ].join(' ')}
              >
                {toast.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 rounded-md px-1 text-ink-faint transition-colors hover:text-ink"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ToastProvider({ children }: { readonly children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const push = useCallback(
    (input: ToastInput) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const durationMs = input.durationMs ?? DEFAULT_DURATION_MS
      const toast: ToastItem = {
        id,
        title: input.title,
        message: input.message,
        variant: input.variant ?? 'info',
        durationMs,
      }

      setToasts((current) => [...current, toast].slice(-4))

      window.setTimeout(() => {
        dismiss(id)
      }, durationMs)
    },
    [dismiss],
  )

  const api = useMemo<ToastApi>(
    () => ({
      push,
      dismiss,
      success: (message, title) => push({ message, title, variant: 'success' }),
      error: (message, title) => push({ message, title, variant: 'error' }),
      info: (message, title) => push({ message, title, variant: 'info' }),
    }),
    [dismiss, push],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast(): ToastApi {
  const context = useContext(ToastContext)
  if (context === null) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
