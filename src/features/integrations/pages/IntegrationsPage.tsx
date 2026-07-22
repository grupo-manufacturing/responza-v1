import { SubscriptionRequired } from '@/shared/ui/gates/SubscriptionRequired'
import { Alert } from '@/shared/ui/primitives/Alert'
import { SpinnerSection } from '@/shared/ui/primitives/Spinner'
import { ComingSoonIntegrationRow } from '@/features/integrations/components/ComingSoonIntegrationRow'
import { IntegrationRow } from '@/features/integrations/components/IntegrationRow'
import { COMING_SOON_INTEGRATIONS } from '@/features/integrations/constants'
import { useIntegrations } from '@/features/integrations/hooks/useIntegrations'
import { AppCard, AppPage, AppPageHeader } from '@/shared/ui/app-ui'

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

  return (
    <AppPage className="max-w-4xl">
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

      {!gmailConfigured && (
        <Alert variant="warning" className="mb-4">
          Gmail OAuth env vars are missing. Add `VITE_GOOGLE_CLIENT_ID` and
          `VITE_GMAIL_REDIRECT_URI` to enable Gmail connect.
        </Alert>
      )}

      {loading && <SpinnerSection minHeightClassName="min-h-[40vh]" />}

      {!loading && success !== null && (
        <Alert variant="success" className="mb-4">
          {success}
        </Alert>
      )}

      {!loading && error !== null && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}

      {!loading && (
        <AppCard padding="none" className="overflow-hidden">
          <div className="divide-y divide-border">
            {integrations.map((integration) => (
              <IntegrationRow
                key={integration.platform}
                platform={integration.platform}
                status={integration.status}
                busy={busyPlatform === integration.platform}
                whatsappDetails={integration.platform === 'whatsapp' ? whatsappDetails : null}
                instagramDetails={integration.platform === 'instagram' ? instagramDetails : null}
                gmailDetails={integration.platform === 'gmail' ? gmailDetails : null}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
              />
            ))}
            {COMING_SOON_INTEGRATIONS.map((integration) => (
              <ComingSoonIntegrationRow key={integration.platform} {...integration} />
            ))}
          </div>
        </AppCard>
      )}
    </AppPage>
  )
}
