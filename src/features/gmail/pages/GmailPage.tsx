import { useCallback, useState } from 'react'

import { GmailMessageList } from '@/features/gmail/components/GmailMessageList'
import { GmailMessageView } from '@/features/gmail/components/GmailMessageView'
import { GmailNotConnected } from '@/features/gmail/components/GmailNotConnected'
import { useGmailConnection } from '@/features/gmail/hooks/useGmailConnection'
import { useGmailMessage } from '@/features/gmail/hooks/useGmailMessage'
import { flattenGmailMessages, useGmailMessages } from '@/features/gmail/hooks/useGmailMessages'
import {
  GMAIL_LIST_COLUMN_CLASS,
  GMAIL_PANEL_HEADER_CLASS,
  GMAIL_SHELL_CLASS,
} from '@/features/gmail/lib/gmail-ui'
import { SubscriptionRequired } from '@/shared/ui/gates/SubscriptionRequired'
import { Alert } from '@/shared/ui/primitives/Alert'
import { SpinnerSection } from '@/shared/ui/primitives/Spinner'
import { useSubscriptionGate } from '@/shared/hooks/useSubscriptionGate'
import { getApiErrorMessage } from '@/shared/utils/api-error'

export function GmailPage() {
  const { subscriptionRequired } = useSubscriptionGate()
  const connectionQuery = useGmailConnection(!subscriptionRequired)
  const connected = connectionQuery.data?.connected === true

  const messagesQuery = useGmailMessages(!subscriptionRequired && connected)
  const messages = flattenGmailMessages(messagesQuery.data)

  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  const [mobileShowMessage, setMobileShowMessage] = useState(false)

  const messageQuery = useGmailMessage(
    selectedMessageId,
    !subscriptionRequired && connected && selectedMessageId !== null,
  )

  const handleSelectMessage = useCallback((messageId: string) => {
    setSelectedMessageId(messageId)
    setMobileShowMessage(true)
  }, [])

  const handleBackToList = useCallback(() => {
    setMobileShowMessage(false)
  }, [])

  if (subscriptionRequired) {
    return <SubscriptionRequired />
  }

  if (connectionQuery.isLoading) {
    return <SpinnerSection minHeightClassName="min-h-[50vh]" />
  }

  if (!connected) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Gmail</h1>
          <p className="mt-1 text-sm text-ink-muted">Read your Gmail inbox inside Responza.</p>
        </header>
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
    <div className="flex h-[calc(100dvh-7.5rem)] min-h-[32rem] flex-col">
      <header className="mb-4 shrink-0">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Gmail</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {connectionQuery.data?.gmail?.email ?? 'Connected Gmail inbox'}
        </p>
      </header>

      {listError !== null && (
        <Alert variant="error" className="mb-4 shrink-0">
          {listError}
        </Alert>
      )}

      <div className={GMAIL_SHELL_CLASS}>
        <div className="flex min-h-0 flex-1">
          <div
            className={[
              GMAIL_LIST_COLUMN_CLASS,
              'flex min-h-0 flex-col border-border lg:border-r',
              mobileShowMessage ? 'hidden lg:flex' : 'flex',
            ].join(' ')}
          >
            <div className={GMAIL_PANEL_HEADER_CLASS}>
              <h2 className="text-sm font-semibold text-ink">Inbox</h2>
            </div>
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
              onRetry={() => {
                void messageQuery.refetch()
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
