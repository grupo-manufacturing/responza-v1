import { useCallback, useEffect, useMemo, useState } from 'react'

import { PlatformCard } from '@/modules/integrations/components/PlatformCard'
import { runWhatsAppEmbeddedSignup } from '@/modules/integrations/whatsapp/embedded-signup'
import { SpinnerSection } from '@/components/ui/Spinner'
import {
  PLATFORM_DEFINITIONS,
  type IntegrationPlatform,
} from '@/shared/constants/integrations'
import { isWhatsAppConnectConfigured } from '@/shared/config/meta'
import IntegrationsService, { type Integration } from '@/shared/services/integrations.service'
import { getApiErrorMessage } from '@/shared/utils/api-error'

function upsertIntegration(integrations: Integration[], updated: Integration): Integration[] {
  const index = integrations.findIndex((entry) => entry.platform === updated.platform)
  if (index === -1) {
    return [...integrations, updated]
  }

  return integrations.map((entry) => (entry.platform === updated.platform ? updated : entry))
}

export function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectingPlatform, setConnectingPlatform] = useState<IntegrationPlatform | null>(null)
  const [disconnectingPlatform, setDisconnectingPlatform] = useState<IntegrationPlatform | null>(null)

  const loadIntegrations = useCallback(async () => {
    setError(null)

    try {
      const result = await IntegrationsService.listIntegrations()
      setIntegrations(result.integrations)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not load integrations. Please try again.'))
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    void loadIntegrations().finally(() => {
      if (!cancelled) {
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [loadIntegrations])

  const integrationByPlatform = useMemo(() => {
    return new Map(integrations.map((integration) => [integration.platform, integration]))
  }, [integrations])

  const connectedCount = useMemo(
    () => integrations.filter((integration) => integration.status === 'connected').length,
    [integrations],
  )

  const handleConnect = async (platform: IntegrationPlatform) => {
    setError(null)
    setConnectingPlatform(platform)

    try {
      if (platform === 'whatsapp') {
        if (!isWhatsAppConnectConfigured()) {
          throw new Error(
            'WhatsApp is not configured for this environment. Add VITE_META_APP_ID and VITE_WHATSAPP_EMBEDDED_CONFIG_ID.',
          )
        }

        const signup = await runWhatsAppEmbeddedSignup()
        const { integration } = await IntegrationsService.connectWhatsApp(signup)
        setIntegrations((current) => upsertIntegration(current, integration))
        return
      }

      const { integration } = await IntegrationsService.connectIntegration(platform)
      setIntegrations((current) => upsertIntegration(current, integration))
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : getApiErrorMessage(err, 'Could not connect this platform. Please try again.')
      setError(message)
    } finally {
      setConnectingPlatform(null)
    }
  }

  const handleDisconnect = async (platform: IntegrationPlatform) => {
    setError(null)
    setDisconnectingPlatform(platform)

    try {
      const { integration } = await IntegrationsService.disconnectIntegration(platform)
      setIntegrations((current) => upsertIntegration(current, integration))
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not disconnect this platform. Please try again.'))
    } finally {
      setDisconnectingPlatform(null)
    }
  }

  if (loading) {
    return <SpinnerSection label="Loading integrations..." minHeightClassName="min-h-[50vh]" />
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Integrations</h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-600">
            Connect the platforms your customers use. WhatsApp uses Meta Embedded Signup; Instagram
            and IndiaMART use placeholder connect until those channels ship.
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Connected</p>
          <p className="mt-0.5 text-lg font-semibold text-neutral-900">
            {connectedCount}
            <span className="text-sm font-normal text-neutral-500">
              {' '}
              / {PLATFORM_DEFINITIONS.length}
            </span>
          </p>
        </div>
      </div>

      {error !== null && (
        <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {PLATFORM_DEFINITIONS.map((definition) => {
          const integration = integrationByPlatform.get(definition.platform) ?? {
            platform: definition.platform,
            status: 'disconnected' as const,
            connectedAt: null,
            disconnectedAt: null,
            updatedAt: null,
          }

          return (
            <PlatformCard
              key={definition.platform}
              definition={definition}
              integration={integration}
              connecting={connectingPlatform === definition.platform}
              disconnecting={disconnectingPlatform === definition.platform}
              onConnect={() => void handleConnect(definition.platform)}
              onDisconnect={() => void handleDisconnect(definition.platform)}
            />
          )
        })}
      </div>
    </div>
  )
}
