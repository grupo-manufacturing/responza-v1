import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
}

export function Modal({ open, onClose, title, description, children }: ModalProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-neutral-900/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative z-10 flex max-h-[min(90vh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-neutral-100 px-6 py-4">
          <div className="min-w-0">
            <h2 id="modal-title" className="text-lg font-semibold text-neutral-900">
              {title}
            </h2>
            {description !== undefined && (
              <p className="mt-0.5 text-sm text-neutral-600">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="min-h-0 overflow-y-auto px-6 py-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}
