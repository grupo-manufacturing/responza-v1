import { useCallback, useEffect, useState } from 'react'

import { Spinner } from '@/components/ui/Spinner'
import {
  INTEGRATION_PLATFORM_DESCRIPTIONS,
  INTEGRATION_PLATFORM_LOGOS,
  integrationPlatformLabel,
  integrationStatusLabel,
  type IntegrationPlatform,
  type IntegrationStatus,
} from '@/shared/constants/integrations'
import IntegrationsService, { type Integration } from '@/shared/services/integrations.service'
import { getApiErrorMessage } from '@/shared/utils/api-error'

function upsertIntegration(integrations: Integration[], updated: Integration): Integration[] {
  return integrations.map((item) => (item.platform === updated.platform ? { ...item, ...updated } : item))
}

type PlatformCardProps = {
  platform: IntegrationPlatform
  status: IntegrationStatus
  busy: boolean
  onConnect: (platform: IntegrationPlatform) => void
  onDisconnect: (platform: IntegrationPlatform) => void
}

function PlatformCard({ platform, status, busy, onConnect, onDisconnect }: PlatformCardProps) {
  const isConnected = status === 'connected'

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

      <div className="mt-auto flex flex-wrap gap-2 border-t border-neutral-100 pt-4">
        <button
          type="button"
          disabled={busy || isConnected}
          onClick={() => onConnect(platform)}
          className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy && !isConnected ? 'Connecting…' : 'Connect'}
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
  const [loading, setLoading] = useState(true)
  const [busyPlatform, setBusyPlatform] = useState<IntegrationPlatform | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadIntegrations = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await IntegrationsService.listIntegrations()
      setIntegrations(result.integrations)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not load integrations. Please try again.'))
      setIntegrations([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadIntegrations()
  }, [loadIntegrations])

  const handleConnect = async (platform: IntegrationPlatform) => {
    setBusyPlatform(platform)
    setError(null)

    try {
      const result = await IntegrationsService.connectIntegration(platform)
      setIntegrations((current) => upsertIntegration(current, result.integration))
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not connect integration. Please try again.'))
    } finally {
      setBusyPlatform(null)
    }
  }

  const handleDisconnect = async (platform: IntegrationPlatform) => {
    setBusyPlatform(platform)
    setError(null)

    try {
      const result = await IntegrationsService.disconnectIntegration(platform)
      setIntegrations((current) => upsertIntegration(current, result.integration))
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not disconnect integration. Please try again.'))
    } finally {
      setBusyPlatform(null)
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Integrations</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Connect messaging platforms to use inbox features when they become available.
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
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
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />
          ))}
        </div>
      )}
    </div>
  )
}
