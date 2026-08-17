import { useCallback, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { startGmailOAuth } from '@/features/integrations/lib/gmailOAuth'
import { startInstagramOAuth } from '@/features/integrations/lib/instagramOAuth'
import { startWhatsAppEmbeddedSignup } from '@/features/integrations/lib/whatsappEmbeddedSignup'
import {
  integrationPlatformLabel,
  type IntegrationPlatform,
} from '@/features/integrations/constants'
import {
  IntegrationsService,
  type InstagramConnectSummary,
  type GmailConnectSummary,
  type Integration,
  type WhatsAppConnectSummary,
} from '@/features/integrations/api/integrations.service'
import {
  getGmailRedirectUri,
  getInstagramRedirectUri,
  isGmailOAuthConfigured,
  isInstagramOAuthConfigured,
  isWhatsAppEmbeddedSignupConfigured,
} from '@/shared/config/env'
import { useSubscriptionGate } from '@/shared/hooks/useSubscriptionGate'
import { integrationsGateKeys } from '@/shared/hooks/useIntegrationsGate'
import { isGmailFeatureEnabled } from '@/shared/config/features'
import { mergeByKey } from '@/shared/utils/upsert'
import { getApiErrorCode, getApiErrorMessage } from '@/shared/utils/api-error'
import { useToast } from '@/shared/ui/toast'

export function useIntegrations() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [whatsappDetails, setWhatsappDetails] = useState<WhatsAppConnectSummary | null>(null)
  const [instagramDetails, setInstagramDetails] = useState<InstagramConnectSummary | null>(null)
  const [gmailDetails, setGmailDetails] = useState<GmailConnectSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [busyPlatform, setBusyPlatform] = useState<IntegrationPlatform | null>(null)
  const { subscriptionRequired, handleError, reset } = useSubscriptionGate()

  const refreshIntegrationsGate = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: integrationsGateKeys.all })
  }, [queryClient])

  const loadIntegrations = useCallback(async () => {
    setLoading(true)
    reset()

    try {
      const result = await IntegrationsService.listIntegrations()
      setIntegrations(result.integrations)
      setWhatsappDetails(result.whatsapp)
      setInstagramDetails(result.instagram)
      setGmailDetails(isGmailFeatureEnabled() ? result.gmail : null)
      refreshIntegrationsGate()
    } catch (err) {
      if (handleError(err)) {
        setIntegrations([])
        setWhatsappDetails(null)
        setInstagramDetails(null)
        setGmailDetails(null)
        return
      }

      toast.error(getApiErrorMessage(err, 'Could not load integrations. Please try again.'))
      setIntegrations([])
      setWhatsappDetails(null)
      setInstagramDetails(null)
      setGmailDetails(null)
    } finally {
      setLoading(false)
    }
  }, [handleError, refreshIntegrationsGate, reset, toast])

  useEffect(() => {
    void loadIntegrations()
  }, [loadIntegrations])

  const handleConnect = async (platform: IntegrationPlatform) => {
    setBusyPlatform(platform)

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
        toast.success('WhatsApp connected successfully. Open WhatsApp to view conversations.')
        refreshIntegrationsGate()
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
        toast.success('Instagram connected successfully. Open Instagram to view conversations.')
        refreshIntegrationsGate()
        return
      }

      if (platform === 'gmail') {
        if (!isGmailOAuthConfigured()) {
          throw new Error(
            'Gmail OAuth is not configured. Set VITE_GOOGLE_CLIENT_ID and VITE_GMAIL_REDIRECT_URI.',
          )
        }

        const oauth = await startGmailOAuth()
        const redirectUri = getGmailRedirectUri()
        const result = await IntegrationsService.connectIntegration(platform, {
          code: oauth.code,
          redirect_uri: redirectUri,
        })
        setIntegrations((current) => mergeByKey(current, result.integration, 'platform'))
        setGmailDetails(result.gmail ?? null)
        toast.success('Gmail connected successfully. Open Gmail to manage your email.')
        refreshIntegrationsGate()
        return
      }

      return
    } catch (err) {
      if (getApiErrorCode(err) === 'NOT_IMPLEMENTED') {
        toast.info(getApiErrorMessage(err, `${integrationPlatformLabel(platform)} connect is coming soon.`))
      } else {
        toast.error(getApiErrorMessage(err, 'Could not connect integration. Please try again.'))
      }
    } finally {
      setBusyPlatform(null)
    }
  }

  const handleDisconnect = async (platform: IntegrationPlatform) => {
    setBusyPlatform(platform)

    try {
      const result = await IntegrationsService.disconnectIntegration(platform)
      setIntegrations((current) => mergeByKey(current, result.integration, 'platform'))
      if (platform === 'whatsapp') {
        setWhatsappDetails(null)
      }
      if (platform === 'instagram') {
        setInstagramDetails(null)
      }
      if (platform === 'gmail') {
        setGmailDetails(null)
      }
      toast.success(`${integrationPlatformLabel(platform)} disconnected.`)
      refreshIntegrationsGate()
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not disconnect integration. Please try again.'))
    } finally {
      setBusyPlatform(null)
    }
  }

  return {
    integrations,
    whatsappDetails,
    instagramDetails,
    gmailDetails,
    loading,
    busyPlatform,
    subscriptionRequired,
    whatsappConfigured: isWhatsAppEmbeddedSignupConfigured(),
    instagramConfigured: isInstagramOAuthConfigured(),
    gmailConfigured: isGmailOAuthConfigured(),
    handleConnect,
    handleDisconnect,
  }
}
