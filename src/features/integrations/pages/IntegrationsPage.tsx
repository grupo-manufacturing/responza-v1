import { SubscriptionRequired } from '@/shared/ui/gates/SubscriptionRequired'
import { SpinnerSection } from '@/shared/ui/primitives/Spinner'
import { ComingSoonIntegrationRow } from '@/features/integrations/components/ComingSoonIntegrationRow'
import { IntegrationRow } from '@/features/integrations/components/IntegrationRow'
import { COMING_SOON_INTEGRATIONS } from '@/features/integrations/constants'
import { useIntegrations } from '@/features/integrations/hooks/useIntegrations'
import { isGmailFeatureEnabled } from '@/shared/config/features'
import { AppCard, AppPage, AppPageHeader } from '@/shared/ui/app-ui'

export function IntegrationsPage() {
  const {
    integrations,
    whatsappDetails,
    instagramDetails,
    gmailDetails,
    loading,
    busyPlatform,
    subscriptionRequired,
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

      {loading && <SpinnerSection minHeightClassName="min-h-[40vh]" />}

      {!loading && (
        <div className="animate-step-in">
          <AppCard padding="none" className="overflow-hidden">
            <div className="divide-y divide-border">
              {integrations
                .filter((integration) => integration.platform !== 'gmail' || isGmailFeatureEnabled())
                .map((integration) => (
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
        </div>
      )}
    </AppPage>
  )
}
