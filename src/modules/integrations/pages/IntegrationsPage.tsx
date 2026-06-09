import { useCallback, useEffect, useState } from 'react'

import { Spinner } from '@/components/ui/Spinner'
import { openInstagramConnect } from '@/modules/integrations/lib/instagramOAuth'
import { startWhatsAppEmbeddedSignup } from '@/modules/integrations/lib/whatsappEmbeddedSignup'
import { isInstagramOAuthConfigured, isWhatsAppEmbeddedSignupConfigured } from '@/shared/config/meta'
import {
  INTEGRATION_PLATFORM_DESCRIPTIONS,
  INTEGRATION_PLATFORM_LOGOS,
  integrationPlatformLabel,
  integrationStatusLabel,
  type IntegrationPlatform,
  type IntegrationStatus,
} from '@/shared/constants/integrations'
import IntegrationsService, {
  type InstagramConnectSummary,
  type Integration,
  type WhatsAppConnectSummary,
} from '@/shared/services/integrations.service'
import { getApiErrorCode, getApiErrorMessage } from '@/shared/utils/api-error'

function upsertIntegration(integrations: Integration[], updated: Integration): Integration[] {
  return integrations.map((item) => (item.platform === updated.platform ? { ...item, ...updated } : item))
}

function formatInstagramUsername(username: string): string {
  const trimmed = username.trim()
  if (trimmed.length === 0) {
    return '—'
  }

  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`
}

type PlatformCardProps = {
  platform: IntegrationPlatform
  status: IntegrationStatus
  busy: boolean
  whatsappDetails: WhatsAppConnectSummary | null
  instagramDetails: InstagramConnectSummary | null
  onConnect: (platform: IntegrationPlatform) => void
  onDisconnect: (platform: IntegrationPlatform) => void
}

function WhatsAppDetailsPanel({ details }: { details: WhatsAppConnectSummary }) {
  return (
    <div className="mt-4 rounded-xl border border-[#DCF8C6] bg-[#f6fff3] px-4 py-3 text-sm text-neutral-700">
      <p className="font-medium text-[#128C7E]">Connected WhatsApp Business</p>
      <dl className="mt-2 space-y-1 text-xs">
        <div className="flex justify-between gap-3">
          <dt className="text-neutral-500">Phone number ID</dt>
          <dd className="truncate font-mono text-neutral-800">{details.phone_number_id}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-neutral-500">WABA ID</dt>
          <dd className="truncate font-mono text-neutral-800">{details.waba_id}</dd>
        </div>
        {details.business_id !== null && (
          <div className="flex justify-between gap-3">
            <dt className="text-neutral-500">Business ID</dt>
            <dd className="truncate font-mono text-neutral-800">{details.business_id}</dd>
          </div>
        )}
      </dl>
    </div>
  )
}

function InstagramDetailsPanel({ details }: { details: InstagramConnectSummary }) {
  return (
    <div className="mt-4 rounded-xl border border-[#F8D7E8] bg-[#fff5fa] px-4 py-3 text-sm text-neutral-700">
      <p className="font-medium text-[#E1306C]">Connected Instagram Business</p>
      <dl className="mt-2 space-y-1 text-xs">
        <div className="flex justify-between gap-3">
          <dt className="text-neutral-500">Username</dt>
          <dd className="truncate font-medium text-neutral-800">{formatInstagramUsername(details.ig_username)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-neutral-500">IG user ID</dt>
          <dd className="truncate font-mono text-neutral-800">{details.ig_user_id}</dd>
        </div>
        {details.messaging_account_id !== null && (
          <div className="flex justify-between gap-3">
            <dt className="text-neutral-500">Messaging account ID</dt>
            <dd className="truncate font-mono text-neutral-800">{details.messaging_account_id}</dd>
          </div>
        )}
      </dl>
    </div>
  )
}

function connectButtonClassName(platform: IntegrationPlatform): string {
  if (platform === 'whatsapp') {
    return 'bg-[#128C7E] hover:bg-[#0f7a6d]'
  }

  if (platform === 'instagram') {
    return 'bg-[#E1306C] hover:bg-[#c72c63]'
  }

  return 'bg-neutral-900 hover:bg-neutral-800'
}

function PlatformCard({
  platform,
  status,
  busy,
  whatsappDetails,
  instagramDetails,
  onConnect,
  onDisconnect,
}: PlatformCardProps) {
  const isConnected = status === 'connected'
  const connectLabel =
    platform === 'whatsapp' && busy && !isConnected
      ? 'Opening signup…'
      : platform === 'instagram' && busy && !isConnected
        ? 'Opening…'
        : busy && !isConnected
          ? 'Connecting…'
          : isConnected
            ? 'Reconnect'
            : 'Connect'

  return (
    <article className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 p-2">
          <img
            src={INTEGRATION_PLATFORM_LOGOS[platform]}
            alt={integrationPlatformLabel(platform)}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-semibold text-neutral-900">{integrationPlatformLabel(platform)}</h2>
            <span
              className={[
                'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
                isConnected ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-600',
              ].join(' ')}
            >
              {integrationStatusLabel(status)}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            {INTEGRATION_PLATFORM_DESCRIPTIONS[platform]}
          </p>
        </div>
      </div>

      {platform === 'whatsapp' && isConnected && whatsappDetails !== null && (
        <WhatsAppDetailsPanel details={whatsappDetails} />
      )}

      {platform === 'instagram' && isConnected && instagramDetails !== null && (
        <InstagramDetailsPanel details={instagramDetails} />
      )}

      <div className="mt-auto flex flex-wrap gap-2 border-t border-neutral-100 pt-4">
        <button
          type="button"
          disabled={busy}
          onClick={() => onConnect(platform)}
          className={[
            'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50',
            connectButtonClassName(platform),
          ].join(' ')}
        >
          {connectLabel}
        </button>
        <button
          type="button"
          disabled={busy || !isConnected}
          onClick={() => onDisconnect(platform)}
          className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy && isConnected ? 'Disconnecting…' : 'Disconnect'}
        </button>
      </div>
    </article>
  )
}

export function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [whatsappDetails, setWhatsappDetails] = useState<WhatsAppConnectSummary | null>(null)
  const [instagramDetails, setInstagramDetails] = useState<InstagramConnectSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [busyPlatform, setBusyPlatform] = useState<IntegrationPlatform | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const loadWhatsAppStatus = useCallback(async () => {
    try {
      const status = await IntegrationsService.getWhatsAppStatus()
      setWhatsappDetails(status.connected ? status.whatsapp : null)
    } catch {
      setWhatsappDetails(null)
    }
  }, [])

  const loadInstagramStatus = useCallback(async () => {
    try {
      const status = await IntegrationsService.getInstagramStatus()
      setInstagramDetails(status.connected ? status.instagram : null)
    } catch {
      setInstagramDetails(null)
    }
  }, [])

  const loadIntegrations = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await IntegrationsService.listIntegrations()
      setIntegrations(result.integrations)
      await Promise.all([loadWhatsAppStatus(), loadInstagramStatus()])
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not load integrations. Please try again.'))
      setIntegrations([])
      setWhatsappDetails(null)
      setInstagramDetails(null)
    } finally {
      setLoading(false)
    }
  }, [loadInstagramStatus, loadWhatsAppStatus])

  useEffect(() => {
    void loadIntegrations()
  }, [loadIntegrations])

  const refreshPlatformStatus = async (platform: IntegrationPlatform) => {
    const result = await IntegrationsService.listIntegrations()
    setIntegrations(result.integrations)

    if (platform === 'whatsapp') {
      await loadWhatsAppStatus()
      return
    }

    if (platform === 'instagram') {
      await loadInstagramStatus()
    }
  }

  const handleConnect = async (platform: IntegrationPlatform) => {
    setBusyPlatform(platform)
    setError(null)
    setSuccess(null)

    try {
      if (platform === 'whatsapp') {
        if (!isWhatsAppEmbeddedSignupConfigured()) {
          throw new Error(
            'WhatsApp Embedded Signup is not configured. Set VITE_META_APP_ID and VITE_WHATSAPP_EMBEDDED_CONFIG_ID.',
          )
        }

        const signup = await startWhatsAppEmbeddedSignup()
        const result = await IntegrationsService.connectIntegration(platform, {
          code: signup.code,
          session_info: signup.sessionInfo,
        })
        setIntegrations((current) => upsertIntegration(current, result.integration))
        setWhatsappDetails(result.whatsapp ?? null)
        setSuccess('WhatsApp connected successfully. Open Inbox to view conversations.')
        return
      }

      if (platform === 'instagram') {
        await openInstagramConnect()
        await refreshPlatformStatus(platform)
        setSuccess('Instagram connected successfully. Open Inbox to view conversations.')
        return
      }

      await IntegrationsService.connectIntegration(platform)
    } catch (err) {
      if (getApiErrorCode(err) === 'NOT_IMPLEMENTED') {
        setError(getApiErrorMessage(err, `${integrationPlatformLabel(platform)} connect is coming soon.`))
      } else {
        setError(getApiErrorMessage(err, 'Could not connect integration. Please try again.'))
      }
    } finally {
      setBusyPlatform(null)
    }
  }

  const handleDisconnect = async (platform: IntegrationPlatform) => {
    setBusyPlatform(platform)
    setError(null)
    setSuccess(null)

    try {
      const result = await IntegrationsService.disconnectIntegration(platform)
      setIntegrations((current) => upsertIntegration(current, result.integration))
      if (platform === 'whatsapp') {
        setWhatsappDetails(null)
      }
      if (platform === 'instagram') {
        setInstagramDetails(null)
      }
      setSuccess(`${integrationPlatformLabel(platform)} disconnected.`)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not disconnect integration. Please try again.'))
    } finally {
      setBusyPlatform(null)
    }
  }

  const whatsappConfigured = isWhatsAppEmbeddedSignupConfigured()
  const instagramConfigured = isInstagramOAuthConfigured()

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Integrations</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Connect messaging platforms to receive and reply to conversations in your inbox.
        </p>
      </div>

      {!whatsappConfigured && (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          WhatsApp Embedded Signup env vars are missing. Add `VITE_META_APP_ID` and
          `VITE_WHATSAPP_EMBEDDED_CONFIG_ID` to enable WhatsApp connect.
        </p>
      )}

      {!instagramConfigured && (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          `VITE_INSTAGRAM_APP_ID` is not set in the frontend env. Instagram connect still uses the
          backend OAuth URL, but you should configure `INSTAGRAM_APP_ID`, `INSTAGRAM_APP_SECRET`, and
          `INSTAGRAM_REDIRECT_URI` on the server.
        </p>
      )}

      {loading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

      {!loading && success !== null && (
        <p className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {success}
        </p>
      )}

      {!loading && error !== null && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {!loading && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {integrations.map((integration) => (
            <PlatformCard
              key={integration.platform}
              platform={integration.platform}
              status={integration.status}
              busy={busyPlatform === integration.platform}
              whatsappDetails={integration.platform === 'whatsapp' ? whatsappDetails : null}
              instagramDetails={integration.platform === 'instagram' ? instagramDetails : null}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />
          ))}
        </div>
      )}
    </div>
  )
}
