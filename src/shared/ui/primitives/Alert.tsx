type AlertVariant = 'error' | 'success' | 'warning'

const VARIANT_CLASS: Record<AlertVariant, string> = {
  error: 'border-red-200/80 bg-red-50 text-red-700',
  success: 'border-emerald-200/80 bg-emerald-50 text-emerald-800',
  warning: 'border-amber-200/80 bg-amber-50 text-amber-800',
}

type AlertProps = {
  variant: AlertVariant
  children: React.ReactNode
  className?: string
}

export function Alert({ variant, children, className = '' }: AlertProps) {
  return (
    <p
      className={['rounded-xl border px-4 py-3 text-sm', VARIANT_CLASS[variant], className].join(' ')}
    >
      {children}
    </p>
  )
}
