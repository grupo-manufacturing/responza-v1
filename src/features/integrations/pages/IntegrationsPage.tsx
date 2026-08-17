import { SubscriptionRequired } from '@/shared/ui/gates/SubscriptionRequired'
import { Alert } from '@/shared/ui/primitives/Alert'
import { SpinnerSection } from '@/shared/ui/primitives/Spinner'
import { ComingSoonIntegrationCard } from '@/features/integrations/components/ComingSoonIntegrationCard'
import { IntegrationCard } from '@/features/integrations/components/IntegrationCard'
import { COMING_SOON_INTEGRATIONS } from '@/features/integrations/constants'
import { useIntegrations } from '@/features/integrations/hooks/useIntegrations'
import { isGmailFeatureEnabled } from '@/shared/config/features'
import { AppPage, AppPageHeader } from '@/shared/ui/app-ui'

export function IntegrationsPage() {
  const {
    integrations,
    whatsappDetails,
    instagramDetails,
    gmailDetails,
    loading,
    busyPlatform,
    error,
    success,
    subscriptionRequired,
    whatsappConfigured,
    instagramConfigured,
    gmailConfigured,
    handleConnect,
    handleDisconnect,
  } = useIntegrations()

  if (subscriptionRequired) {
    return <SubscriptionRequired />
  }

  const activeIntegrations = integrations.filter(
    (integration) => integration.platform !== 'gmail' || isGmailFeatureEnabled(),
  )

  return (
    <AppPage className="max-w-5xl">
      <AppPageHeader
        title="Integrations"
        description="Connect messaging platforms to receive and reply to conversations in your inbox."
      />

      {!whatsappConfigured && (
        <Alert variant="warning" className="mb-4">
          WhatsApp Embedded Signup env vars are missing. Add `VITE_META_APP_ID` and
          `VITE_WHATSAPP_EMBEDDED_CONFIG_ID` to enable WhatsApp connect.
        </Alert>
      )}

      {!instagramConfigured && (
        <Alert variant="warning" className="mb-4">
          Instagram OAuth env vars are missing. Add `VITE_INSTAGRAM_APP_ID` and
          `VITE_INSTAGRAM_REDIRECT_URI` to enable Instagram connect.
        </Alert>
      )}

      {!gmailConfigured && isGmailFeatureEnabled() && (
        <Alert variant="warning" className="mb-4">
          Gmail OAuth env vars are missing. Add `VITE_GOOGLE_CLIENT_ID` and
          `VITE_GMAIL_REDIRECT_URI` to enable Gmail connect.
        </Alert>
      )}

      {loading && <SpinnerSection minHeightClassName="min-h-[40vh]" />}

      {!loading && (
        <div className="animate-step-in space-y-4">
          {success !== null && (
            <Alert variant="success">{success}</Alert>
          )}

          {error !== null && (
            <Alert variant="error">{error}</Alert>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {activeIntegrations.map((integration, index) => (
              <IntegrationCard
                key={integration.platform}
                platform={integration.platform}
                status={integration.status}
                busy={busyPlatform === integration.platform}
                whatsappDetails={integration.platform === 'whatsapp' ? whatsappDetails : null}
                instagramDetails={integration.platform === 'instagram' ? instagramDetails : null}
                gmailDetails={integration.platform === 'gmail' ? gmailDetails : null}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                animationDelayMs={index * 60}
              />
            ))}
            {COMING_SOON_INTEGRATIONS.map((integration, index) => (
              <ComingSoonIntegrationCard
                key={integration.platform}
                {...integration}
                animationDelayMs={(activeIntegrations.length + index) * 60}
              />
            ))}
          </div>
        </div>
      )}
    </AppPage>
  )
}
