import { useEffect, useId, useRef, useState } from 'react'

import { APP_INPUT_CLASS } from '@/shared/ui/app-ui'

type SelectOption<T extends string = string> = {
  readonly value: T
  readonly label: string
}

type SelectProps<T extends string> = {
  readonly id?: string
  readonly label?: string
  readonly value: T
  readonly onChange: (value: T) => void
  readonly options: readonly SelectOption<T>[]
  readonly placeholder?: string
  readonly className?: string
  readonly disabled?: boolean
}

function ChevronDownIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

export function Select<T extends string>({
  id: idProp,
  label,
  value,
  onChange,
  options,
  placeholder = 'Select…',
  className = '',
  disabled = false,
}: SelectProps<T>) {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const selectedOption = options.find((option) => option.value === value)
  const displayLabel = selectedOption?.label ?? placeholder
  const isPlaceholder = selectedOption === undefined

  useEffect(() => {
    if (!open) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Node) || rootRef.current?.contains(target)) {
        return
      }
      setOpen(false)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const handleSelect = (next: T) => {
    onChange(next)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className={['relative', className].filter(Boolean).join(' ')}>
      {label !== undefined && (
        <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-ink-muted">
          {label}
        </label>
      )}

      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={[
          APP_INPUT_CLASS,
          'flex h-10 items-center justify-between gap-2 text-left',
          disabled ? 'cursor-not-allowed opacity-50' : '',
          open ? 'border-accent ring-2 ring-accent/15' : '',
        ].join(' ')}
      >
        <span className={['truncate', isPlaceholder ? 'text-ink-faint' : 'text-ink'].join(' ')}>
          {displayLabel}
        </span>
        <ChevronDownIcon
          className={['h-4 w-4 shrink-0 text-ink-muted transition-transform', open ? 'rotate-180' : ''].join(
            ' ',
          )}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-labelledby={id}
          className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-border bg-white py-1 shadow-card [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {options.map((option) => {
            const isSelected = option.value === value
            return (
              <li key={option.value || '__empty'} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className={[
                    'flex w-full items-center px-3 py-2 text-left text-sm transition-colors',
                    isSelected
                      ? 'bg-accent/10 font-medium text-accent'
                      : 'text-ink hover:bg-surface-muted',
                  ].join(' ')}
                >
                  {option.label}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
