import { SubscriptionRequired } from '@/components/common/SubscriptionRequired'
import { Alert } from '@/components/ui/Alert'
import { SpinnerSection } from '@/components/ui/Spinner'
import { IntegrationRow } from '@/modules/integrations/components/IntegrationRow'
import { useIntegrations } from '@/modules/integrations/hooks/useIntegrations'
import { AppCard, AppPage, AppPageHeader } from '@/shared/ui/app-ui'

export function IntegrationsPage() {
  const {
    integrations,
    whatsappDetails,
    instagramDetails,
    loading,
    busyPlatform,
    error,
    success,
    subscriptionRequired,
    whatsappConfigured,
    instagramConfigured,
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

      {loading && <SpinnerSection label="Loading integrations..." minHeightClassName="min-h-[40vh]" />}

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
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
              />
            ))}
          </div>
        </AppCard>
      )}
    </AppPage>
  )
}
