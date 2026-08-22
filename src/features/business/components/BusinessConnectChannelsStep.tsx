import { IntegrationRow } from '@/features/integrations/components/IntegrationRow'
import { useIntegrations } from '@/features/integrations/hooks/useIntegrations'
import { AppButton } from '@/shared/ui/app-ui'
import { SpinnerSection } from '@/shared/ui/primitives/Spinner'

const ONBOARDING_CHANNEL_PLATFORMS = ['whatsapp', 'instagram'] as const

type BusinessConnectChannelsStepProps = {
  readonly onContinue: () => void
}

export function BusinessConnectChannelsStep({ onContinue }: BusinessConnectChannelsStepProps) {
  const {
    integrations,
    whatsappDetails,
    instagramDetails,
    loading,
    busyPlatform,
    handleConnect,
    handleDisconnect,
  } = useIntegrations()

  const channelIntegrations = integrations.filter((integration) =>
    ONBOARDING_CHANNEL_PLATFORMS.includes(
      integration.platform as (typeof ONBOARDING_CHANNEL_PLATFORMS)[number],
    ),
  )

  const hasConnectedChannel = channelIntegrations.some((integration) => integration.status === 'connected')

  return (
    <div>
      <p className="mb-4 text-center text-sm text-ink-muted">
        Link WhatsApp or Instagram to receive messages in your inbox. Optional — skip anytime.
      </p>

      {loading ? (
        <SpinnerSection minHeightClassName="min-h-[12rem]" />
      ) : (
        <div className="divide-y divide-border rounded-xl border border-border">
          {channelIntegrations.map((integration) => (
            <IntegrationRow
              key={integration.platform}
              platform={integration.platform}
              status={integration.status}
              busy={busyPlatform === integration.platform}
              whatsappDetails={integration.platform === 'whatsapp' ? whatsappDetails : null}
              instagramDetails={integration.platform === 'instagram' ? instagramDetails : null}
              gmailDetails={null}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              showDisconnect={false}
            />
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-border pt-3">
        <AppButton type="button" variant="secondary" onClick={onContinue}>
          Skip for now
        </AppButton>
        {hasConnectedChannel && (
          <AppButton type="button" onClick={onContinue}>
            Continue to app
          </AppButton>
        )}
      </div>
    </div>
  )
}
