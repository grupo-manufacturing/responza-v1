type AlertVariant = 'error' | 'success' | 'warning'

const VARIANT_CLASS: Record<AlertVariant, string> = {
  error: 'border-red-200 bg-red-50 text-red-700',
  success: 'border-green-200 bg-green-50 text-green-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
}

type AlertProps = {
  variant: AlertVariant
  children: React.ReactNode
  className?: string
}

export function Alert({ variant, children, className = '' }: AlertProps) {
  return (
    <p
      className={[
        'rounded-lg border px-4 py-3 text-sm',
        VARIANT_CLASS[variant],
        className,
      ].join(' ')}
    >
      {children}
    </p>
  )
}
