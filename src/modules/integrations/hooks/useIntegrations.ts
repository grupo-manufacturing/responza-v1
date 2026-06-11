import { useCallback, useEffect, useState } from 'react'

import { startInstagramOAuth } from '@/modules/integrations/lib/instagramOAuth'
import { startWhatsAppEmbeddedSignup } from '@/modules/integrations/lib/whatsappEmbeddedSignup'
import type { IntegrationPlatform } from '@/modules/integrations/integrations.constants'
import {
  IntegrationsService,
  type InstagramConnectSummary,
  type Integration,
  type WhatsAppConnectSummary,
} from '@/modules/integrations/integrations.service'
import {
  getInstagramRedirectUri,
  isInstagramOAuthConfigured,
  isWhatsAppEmbeddedSignupConfigured,
} from '@/shared/config/env'
import { useSubscriptionGate } from '@/shared/hooks/useSubscriptionGate'
import { mergeByKey } from '@/shared/utils/upsert'
import { getApiErrorCode, getApiErrorMessage } from '@/shared/utils/api-error'
import { integrationPlatformLabel } from '@/modules/integrations/integrations.constants'

export function useIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [whatsappDetails, setWhatsappDetails] = useState<WhatsAppConnectSummary | null>(null)
  const [instagramDetails, setInstagramDetails] = useState<InstagramConnectSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [busyPlatform, setBusyPlatform] = useState<IntegrationPlatform | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { subscriptionRequired, handleError, reset } = useSubscriptionGate()

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
    reset()

    try {
      const result = await IntegrationsService.listIntegrations()
      setIntegrations(result.integrations)
      await loadWhatsAppStatus()
      await loadInstagramStatus()
    } catch (err) {
      if (handleError(err)) {
        setIntegrations([])
        setWhatsappDetails(null)
        setInstagramDetails(null)
        return
      }

      setError(getApiErrorMessage(err, 'Could not load integrations. Please try again.'))
      setIntegrations([])
      setWhatsappDetails(null)
      setInstagramDetails(null)
    } finally {
      setLoading(false)
    }
  }, [handleError, loadInstagramStatus, loadWhatsAppStatus, reset])

  useEffect(() => {
    void loadIntegrations()
  }, [loadIntegrations])

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
        setIntegrations((current) => mergeByKey(current, result.integration, 'platform'))
        setWhatsappDetails(result.whatsapp ?? null)
        setSuccess('WhatsApp connected successfully. Open Inbox to view conversations.')
        return
      }

      if (platform === 'instagram') {
        if (!isInstagramOAuthConfigured()) {
          throw new Error(
            'Instagram OAuth is not configured. Set VITE_INSTAGRAM_APP_ID and VITE_INSTAGRAM_REDIRECT_URI.',
          )
        }

        const oauth = await startInstagramOAuth()
        const redirectUri = getInstagramRedirectUri()
        const result = await IntegrationsService.connectIntegration(platform, {
          code: oauth.code,
          redirect_uri: redirectUri,
        })
        setIntegrations((current) => mergeByKey(current, result.integration, 'platform'))
        setInstagramDetails(result.instagram ?? null)
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
      setIntegrations((current) => mergeByKey(current, result.integration, 'platform'))
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

  return {
    integrations,
    whatsappDetails,
    instagramDetails,
    loading,
    busyPlatform,
    error,
    success,
    subscriptionRequired,
    whatsappConfigured: isWhatsAppEmbeddedSignupConfigured(),
    instagramConfigured: isInstagramOAuthConfigured(),
    handleConnect,
    handleDisconnect,
  }
}
