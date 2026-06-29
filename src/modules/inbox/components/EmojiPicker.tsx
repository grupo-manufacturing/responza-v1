import { useEffect, useRef, useState } from 'react'

import { MESSAGE_QUICK_EMOJIS } from '@/modules/inbox/inbox.constants'
import { INBOX_COMPOSER_ACTION_CLASS, INBOX_POPOVER_CLASS } from '@/modules/inbox/inbox-ui'

type EmojiPickerProps = {
  readonly disabled: boolean
  readonly onSelect: (emoji: string) => void
}

function EmojiIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

export function EmojiPicker({ disabled, onSelect }: EmojiPickerProps) {
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
        aria-label="Insert emoji"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={[
          INBOX_COMPOSER_ACTION_CLASS,
          'text-ink-muted hover:bg-surface-muted hover:text-ink disabled:opacity-50',
        ].join(' ')}
      >
        <EmojiIcon />
      </button>

      {open && (
        <div className={`${INBOX_POPOVER_CLASS} bottom-full left-0 mb-2 grid w-[220px] grid-cols-6 gap-1`}>
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
