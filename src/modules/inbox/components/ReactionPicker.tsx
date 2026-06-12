import { useEffect, useRef, useState } from 'react'

import { MESSAGE_QUICK_EMOJIS } from '@/modules/inbox/inbox.constants'

type ReactionPickerProps = {
  readonly disabled: boolean
  readonly onSelect: (emoji: string) => void
}

export function ReactionPicker({ disabled, onSelect }: ReactionPickerProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (rootRef.current !== null && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open])

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        disabled={disabled}
        aria-label="React to message"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-base text-neutral-400 opacity-0 transition-opacity hover:bg-neutral-100 hover:text-neutral-600 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-0"
      >
        <span aria-hidden>+</span>
      </button>

      {open && (
        <div className="absolute bottom-full left-0 z-10 mb-1 grid w-[220px] grid-cols-6 gap-1 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg">
          {MESSAGE_QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-lg hover:bg-neutral-100"
              onClick={() => {
                onSelect(emoji)
                setOpen(false)
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
