import { IntegrationRow } from '@/features/integrations/components/IntegrationRow'
import { useIntegrations } from '@/features/integrations/hooks/useIntegrations'
import { useAgentStatus } from '@/features/knowledge/hooks/useAgentStatus'
import { AppButton } from '@/shared/ui/app-ui'
import { Spinner, SpinnerSection } from '@/shared/ui/primitives/Spinner'

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
  const { status: agentStatus } = useAgentStatus()

  const channelIntegrations = integrations.filter((integration) =>
    ONBOARDING_CHANNEL_PLATFORMS.includes(
      integration.platform as (typeof ONBOARDING_CHANNEL_PLATFORMS)[number],
    ),
  )

  const hasConnectedChannel = channelIntegrations.some((integration) => integration.status === 'connected')
  const isAgentBuilding = agentStatus?.status === 'building'

  return (
    <div>
      <div className="mb-4 text-center">
        <p className="text-sm text-ink-muted">
          Link WhatsApp or Instagram to receive messages in your inbox. Optional — skip anytime.
        </p>
        {isAgentBuilding && (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface-muted/60 px-3 py-1.5 text-xs font-medium text-ink-muted">
            <Spinner size="sm" variant="muted" />
            AI agent building your knowledge base in the background
          </p>
        )}
      </div>

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
