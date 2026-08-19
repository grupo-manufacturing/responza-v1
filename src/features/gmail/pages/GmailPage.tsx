import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { APP_PANEL_HEIGHT_CLASS } from '@/layouts/app-layout.constants'
import { GmailComposePopout } from '@/features/gmail/components/GmailComposePopout'
import { GmailMessageList } from '@/features/gmail/components/GmailMessageList'
import { GmailMessageView } from '@/features/gmail/components/GmailMessageView'
import { GmailNotConnected } from '@/features/gmail/components/GmailNotConnected'
import {
  buildReplyDefaults,
  gmailKeys,
  type GmailComposeMode,
  type GmailComposeState,
} from '@/features/gmail/constants'
import { useGmailConnection } from '@/features/gmail/hooks/useGmailConnection'
import { useGmailMessage } from '@/features/gmail/hooks/useGmailMessage'
import { flattenGmailMessages, useGmailMessages } from '@/features/gmail/hooks/useGmailMessages'
import { useGmailSend } from '@/features/gmail/hooks/useGmailSend'
import { isGmailRevokedError } from '@/features/gmail/lib/gmail-errors'
import { GMAIL_LIST_COLUMN_CLASS, GMAIL_PRIMARY_BUTTON_CLASS } from '@/features/gmail/lib/gmail-ui'
import { INBOX_SHELL_CLASS } from '@/features/inbox/lib/inbox-ui'
import { SubscriptionRequired } from '@/shared/ui/gates/SubscriptionRequired'
import { AppButton } from '@/shared/ui/app-ui'
import { Alert } from '@/shared/ui/primitives/Alert'
import { SpinnerSection } from '@/shared/ui/primitives/Spinner'
import { useSubscriptionGate } from '@/shared/hooks/useSubscriptionGate'
import { integrationsGateKeys } from '@/shared/hooks/useIntegrationsGate'
import { getApiErrorMessage } from '@/shared/utils/api-error'

const EMPTY_COMPOSE_STATE: GmailComposeState = {
  mode: 'compose',
  to: '',
  subject: '',
}

function GmailPageHeader({ subtitle, action }: { subtitle: string; action?: ReactNode }) {
  return (
    <header className="mb-4 flex shrink-0 flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Gmail</h1>
        <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>
      </div>
      {action}
    </header>
  )
}

export function GmailPage() {
  const queryClient = useQueryClient()
  const { subscriptionRequired } = useSubscriptionGate()
  const connectionQuery = useGmailConnection(!subscriptionRequired)
  const connected = connectionQuery.data?.connected === true

  const messagesQuery = useGmailMessages(!subscriptionRequired && connected)
  const messages = flattenGmailMessages(messagesQuery.data)
  const { sendMutation, replyMutation, sending } = useGmailSend()

  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  const [mobileShowMessage, setMobileShowMessage] = useState(false)
  const [composeOpen, setComposeOpen] = useState(false)
  const [composeState, setComposeState] = useState<GmailComposeState>(EMPTY_COMPOSE_STATE)
  const [composeError, setComposeError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const messageQuery = useGmailMessage(
    selectedMessageId,
    !subscriptionRequired && connected && selectedMessageId !== null,
  )

  const gmailRevoked =
    isGmailRevokedError(messagesQuery.error) ||
    isGmailRevokedError(messageQuery.error)

  const handleGmailRevoked = useCallback(() => {
    void connectionQuery.refetch()
    void queryClient.invalidateQueries({ queryKey: gmailKeys.messages })
    void queryClient.invalidateQueries({ queryKey: integrationsGateKeys.all })
  }, [connectionQuery, queryClient])

  useEffect(() => {
    if (gmailRevoked) {
      handleGmailRevoked()
    }
  }, [gmailRevoked, handleGmailRevoked])

  const handleSelectMessage = useCallback((messageId: string) => {
    setSelectedMessageId(messageId)
    setMobileShowMessage(true)
  }, [])

  const handleBackToList = useCallback(() => {
    setMobileShowMessage(false)
  }, [])

  const openCompose = useCallback((mode: GmailComposeMode, overrides?: Partial<GmailComposeState>) => {
    setComposeError(null)
    setComposeState({
      ...EMPTY_COMPOSE_STATE,
      mode,
      ...overrides,
    })
    setComposeOpen(true)
  }, [])

  const handleReply = useCallback(() => {
    const message = messageQuery.data?.message
    if (message === undefined) {
      return
    }

    const defaults = buildReplyDefaults(message)
    openCompose('reply', {
      replyMessageId: message.id,
      to: defaults.to,
      subject: defaults.subject,
    })
  }, [messageQuery.data?.message, openCompose])

  const handleSend = useCallback(
    async (input: { to: string; subject: string; body: string }) => {
      setComposeError(null)

      try {
        if (composeState.mode === 'reply') {
          if (composeState.replyMessageId === undefined) {
            throw new Error('Reply message is missing')
          }

          await replyMutation.mutateAsync({
            messageId: composeState.replyMessageId,
            body: input.body,
          })
          setSuccess('Reply sent successfully.')
        } else {
          await sendMutation.mutateAsync(input)
          setSuccess('Email sent successfully.')
        }

        setComposeOpen(false)
        setComposeState(EMPTY_COMPOSE_STATE)
      } catch (error) {
        if (isGmailRevokedError(error)) {
          setComposeOpen(false)
          handleGmailRevoked()
          return
        }

        setComposeError(getApiErrorMessage(error, 'Could not send email. Please try again.'))
      }
    },
    [composeState.mode, composeState.replyMessageId, handleGmailRevoked, replyMutation, sendMutation],
  )

  if (subscriptionRequired) {
    return <SubscriptionRequired />
  }

  if (connectionQuery.isLoading) {
    return <SpinnerSection minHeightClassName="min-h-[50vh]" />
  }

  if (!connected || gmailRevoked) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <GmailPageHeader subtitle="Read and send Gmail from Responza." />
        <GmailNotConnected />
      </div>
    )
  }

  const listError =
    messagesQuery.isError && !messagesQuery.isFetching
      ? getApiErrorMessage(messagesQuery.error, 'Could not load Gmail messages.')
      : null

  const messageError =
    messageQuery.isError && !messageQuery.isFetching
      ? getApiErrorMessage(messageQuery.error, 'Could not load this email.')
      : null

  return (
    <div className={`flex min-h-0 flex-col ${APP_PANEL_HEIGHT_CLASS}`}>
      <GmailPageHeader
        subtitle={connectionQuery.data?.gmail?.email ?? 'Connected Gmail inbox'}
        action={
          <AppButton onClick={() => openCompose('compose')} className={GMAIL_PRIMARY_BUTTON_CLASS}>
            Compose
          </AppButton>
        }
      />

      {success !== null && (
        <Alert variant="success" className="mb-4 shrink-0">
          {success}
        </Alert>
      )}

      {listError !== null && (
        <Alert variant="error" className="mb-4 shrink-0">
          {listError}
        </Alert>
      )}

      <div className={`${INBOX_SHELL_CLASS} relative min-h-0 flex-1 animate-step-in`}>
        <div className="flex min-h-0 flex-1">
          <div
            className={[
              GMAIL_LIST_COLUMN_CLASS,
              'flex min-h-0 flex-col border-border lg:border-r',
              mobileShowMessage ? 'hidden lg:flex' : 'flex',
            ].join(' ')}
          >
            <GmailMessageList
              messages={messages}
              selectedMessageId={selectedMessageId}
              loading={messagesQuery.isLoading}
              loadingMore={messagesQuery.isFetchingNextPage}
              hasMore={messagesQuery.hasNextPage}
              onSelect={handleSelectMessage}
              onLoadMore={() => {
                void messagesQuery.fetchNextPage()
              }}
            />
          </div>

          <div
            className={[
              'relative flex min-h-0 min-w-0 flex-1 flex-col',
              mobileShowMessage ? 'flex' : 'hidden lg:flex',
            ].join(' ')}
          >
            <GmailMessageView
              message={messageQuery.data?.message ?? null}
              loading={messageQuery.isLoading && selectedMessageId !== null}
              error={messageError}
              onBack={handleBackToList}
              onReply={messageQuery.data?.message !== undefined ? handleReply : undefined}
              onRetry={() => {
                void messageQuery.refetch()
              }}
            />
          </div>
        </div>

        <GmailComposePopout
          open={composeOpen}
          mode={composeState.mode}
          initialTo={composeState.to}
          initialSubject={composeState.subject}
          sending={sending}
          error={composeError}
          onClose={() => {
            if (!sending) {
              setComposeOpen(false)
              setComposeError(null)
            }
          }}
          onSend={(input) => {
            void handleSend(input)
          }}
        />
      </div>
    </div>
  )
}
