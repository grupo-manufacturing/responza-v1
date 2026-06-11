import { SubscriptionRequired } from '@/components/common/SubscriptionRequired'
import { Alert } from '@/components/ui/Alert'
import { Spinner } from '@/components/ui/Spinner'
import { PlatformCard } from '@/modules/integrations/components/PlatformCard'
import { useIntegrations } from '@/modules/integrations/hooks/useIntegrations'

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
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Integrations</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Connect messaging platforms to receive and reply to conversations in your inbox.
        </p>
      </div>

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

      {loading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

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
