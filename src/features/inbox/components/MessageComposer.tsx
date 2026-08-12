import { useEffect, useRef, useState } from 'react'

import { Spinner } from '@/shared/ui/primitives/Spinner'
import {
  attachmentPreviewLabel,
  canPreviewAttachmentLocally,
  OUTBOUND_MEDIA_ACCEPT,
  validateOutboundMediaFile,
} from '@/features/inbox/lib/inbox.media'
import type { MediaContentType } from '@/features/inbox/lib/inbox.preview'
import {
  INBOX_COMPOSER_ACTION_CLASS,
  composerFocusRingClass,
  composerSendButtonClass,
} from '@/features/inbox/lib/inbox-ui'
import type { IntegrationPlatform } from '@/features/integrations/constants'

type OutboundComposerAttachment = {
  file: File
  contentType: MediaContentType
  previewUrl: string
}

export type SendComposerInput = {
  content: string
  attachment?: OutboundComposerAttachment
}

type MessageComposerProps = {
  readonly conversationId: string | null
  readonly disabled: boolean
  readonly sending: boolean
  readonly platform?: IntegrationPlatform | null
  readonly agentDraft?: { messageId: string; reply: string } | null
  readonly onSend: (input: SendComposerInput) => Promise<void>
}

type SelectedAttachment = OutboundComposerAttachment

function SendIcon() {
  return (
    <svg
      className="h-5 w-5 rotate-90"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
      />
    </svg>
  )
}

function AttachIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="m18.375 12.739-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81"
      />
    </svg>
  )
}

function composerPlaceholder(disabled: boolean, hasAttachment: boolean): string {
  if (disabled) {
    return 'Select a conversation to reply'
  }

  if (hasAttachment) {
    return 'Add a caption (optional)…'
  }

  return 'Type a message…'
}

const composerActionButtonClass = INBOX_COMPOSER_ACTION_CLASS

function composerActionIconClass(enabled: boolean, enabledClassName: string): string {
  return [
    composerActionButtonClass,
    enabled ? enabledClassName : 'cursor-not-allowed opacity-40',
  ].join(' ')
}

function AttachmentPreview({
  attachment,
  disabled,
  onRemove,
}: {
  readonly attachment: SelectedAttachment
  readonly disabled: boolean
  readonly onRemove: () => void
}) {
  const label = attachmentPreviewLabel(attachment.contentType, attachment.file.name)

  return (
    <div className="mb-2 flex items-center gap-3 rounded-xl border border-border bg-surface-muted/80 px-3 py-2">
      {attachment.contentType === 'image' && (
        <img
          src={attachment.previewUrl}
          alt={label}
          className="h-14 w-14 rounded-lg border border-border object-cover"
        />
      )}

      {attachment.contentType === 'video' && canPreviewAttachmentLocally('video') && (
        <video
          src={attachment.previewUrl}
          className="h-14 w-14 rounded-lg border border-border object-cover"
          muted
        />
      )}

      {attachment.contentType === 'audio' && (
        <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-border bg-white text-lg">
          🎵
        </div>
      )}

      {attachment.contentType === 'document' && (
        <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-border bg-white text-lg">
          📄
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{label}</p>
        <p className="text-xs capitalize text-ink-faint">{attachment.contentType}</p>
      </div>

      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-label="Remove attachment"
        className="rounded-lg px-2 py-1 text-xs font-medium text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        Remove
      </button>
    </div>
  )
}

export function MessageComposer({
  conversationId,
  disabled,
  sending,
  platform = null,
  agentDraft = null,
  onSend,
}: MessageComposerProps) {
  const [content, setContent] = useState('')
  const [attachment, setAttachment] = useState<SelectedAttachment | null>(null)
  const [attachmentError, setAttachmentError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const appliedAgentDraftMessageIdRef = useRef<string | null>(null)
  const appliedAgentDraftReplyRef = useRef<string | null>(null)
  const dismissedAgentDraftMessageIdsRef = useRef<Set<string>>(new Set())
  const attachmentsSupported = true
  const canSend =
    !disabled && !sending && (attachment !== null || content.trim().length > 0)
  const canAttach = !disabled && !sending && attachmentsSupported

  const dismissAgentDraft = (messageId: string) => {
    dismissedAgentDraftMessageIdsRef.current.add(messageId)
    if (appliedAgentDraftMessageIdRef.current === messageId) {
      appliedAgentDraftMessageIdRef.current = null
      appliedAgentDraftReplyRef.current = null
    }
  }

  useEffect(() => {
    setContent('')
    setAttachmentError(null)
    setAttachment((current) => {
      if (current !== null) {
        URL.revokeObjectURL(current.previewUrl)
      }
      return null
    })
    if (fileInputRef.current !== null) {
      fileInputRef.current.value = ''
    }
    appliedAgentDraftMessageIdRef.current = null
    appliedAgentDraftReplyRef.current = null
  }, [conversationId])

  useEffect(() => {
    if (disabled || agentDraft === null) {
      return
    }

    if (dismissedAgentDraftMessageIdsRef.current.has(agentDraft.messageId)) {
      return
    }

    if (appliedAgentDraftMessageIdRef.current === agentDraft.messageId) {
      return
    }

    if (content.trim().length > 0) {
      return
    }

    setContent(agentDraft.reply)
    appliedAgentDraftMessageIdRef.current = agentDraft.messageId
    appliedAgentDraftReplyRef.current = agentDraft.reply
    requestAnimationFrame(() => {
      textareaRef.current?.focus()
    })
  }, [agentDraft, content, disabled])

  useEffect(() => {
    return () => {
      if (attachment !== null) {
        URL.revokeObjectURL(attachment.previewUrl)
      }
    }
  }, [attachment])

  const clearAttachment = () => {
    if (attachment !== null) {
      URL.revokeObjectURL(attachment.previewUrl)
    }
    setAttachment(null)
    setAttachmentError(null)
    if (fileInputRef.current !== null) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (disabled || sending) {
      return
    }

    const trimmed = content.trim()
    if (attachment === null && trimmed.length === 0) {
      return
    }

    await onSend({
      content: trimmed,
      attachment: attachment ?? undefined,
    })

    if (agentDraft !== null) {
      dismissAgentDraft(agentDraft.messageId)
    }

    setContent('')
    clearAttachment()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file === undefined) {
      return
    }

    const validation = validateOutboundMediaFile(file)
    if (!validation.valid) {
      setAttachmentError(validation.message)
      event.target.value = ''
      return
    }

    if (attachment !== null) {
      URL.revokeObjectURL(attachment.previewUrl)
    }

    const previewUrl = URL.createObjectURL(file)
    setAttachment({
      file,
      contentType: validation.contentType,
      previewUrl,
    })
    setAttachmentError(null)
    event.target.value = ''
  }

  const composerDisabled = disabled || sending

  return (
    <div className="relative shrink-0">
      <form
        onSubmit={(event) => {
          void handleSubmit(event)
        }}
        className="border-t border-border bg-white/95 px-3 py-3 backdrop-blur-sm sm:px-4"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={OUTBOUND_MEDIA_ACCEPT}
          className="hidden"
          onChange={handleFileChange}
        />

        {attachment !== null && (
          <AttachmentPreview
            attachment={attachment}
            disabled={composerDisabled}
            onRemove={clearAttachment}
          />
        )}

        <div
          className={[
            'flex items-center gap-1 rounded-[var(--radius-pill)] border border-border bg-white px-2 py-1.5 transition-all',
            composerFocusRingClass(platform),
            composerDisabled ? 'bg-surface-muted/80' : '',
          ].join(' ')}
        >
          {attachmentsSupported && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={!canAttach}
              aria-label="Attach file"
              title="Attach file"
              className={composerActionIconClass(
                canAttach,
                'text-ink-muted hover:bg-surface-muted hover:text-ink',
              )}
            >
              <AttachIcon />
            </button>
          )}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(event) => {
              const next = event.target.value
              const appliedMessageId = appliedAgentDraftMessageIdRef.current
              const appliedReply = appliedAgentDraftReplyRef.current

              if (
                appliedMessageId !== null &&
                appliedReply !== null &&
                (next.trim().length === 0 || next !== appliedReply)
              ) {
                dismissAgentDraft(appliedMessageId)
              }

              setContent(next)
            }}
            placeholder={composerPlaceholder(disabled, attachment !== null)}
            disabled={composerDisabled}
            rows={1}
            className="min-h-[36px] max-h-28 flex-1 resize-none border-0 bg-transparent py-1.5 text-sm text-ink outline-none placeholder:text-ink-faint disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!canSend}
            aria-label={sending ? 'Sending message' : 'Send message'}
            className={[composerActionButtonClass, 'rounded-[var(--radius-pill)]', composerSendButtonClass(canSend, platform)].join(' ')}
          >
            {sending ? <Spinner size="sm" variant="muted" /> : <SendIcon />}
          </button>
        </div>
        {attachmentError !== null && (
          <p className="mt-2 text-xs text-red-600" role="alert">
            {attachmentError}
          </p>
        )}
      </form>
    </div>
  )
}
