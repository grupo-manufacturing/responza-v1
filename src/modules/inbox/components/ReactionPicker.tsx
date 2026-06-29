import { useEffect, useRef, useState } from 'react'

import { MESSAGE_QUICK_EMOJIS } from '@/modules/inbox/inbox.constants'
import { INBOX_ICON_BUTTON_CLASS, INBOX_POPOVER_CLASS } from '@/modules/inbox/inbox-ui'

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
        className={[INBOX_ICON_BUTTON_CLASS, 'h-7 w-7 rounded-full text-base'].join(' ')}
      >
        <span aria-hidden>+</span>
      </button>

      {open && (
        <div className={`${INBOX_POPOVER_CLASS} top-full right-0 mt-1 grid w-[220px] grid-cols-6 gap-1`}>
          {MESSAGE_QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-lg hover:bg-surface-muted"
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
