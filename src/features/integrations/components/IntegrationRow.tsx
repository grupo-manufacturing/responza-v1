import { AppButton } from '@/shared/ui/app-ui'
import { ConnectedAccountProfile } from '@/features/integrations/components/ConnectedAccountProfile'
import { IntegrationRowLayout, IntegrationStatusDot } from '@/features/integrations/components/IntegrationRowLayout'
import {
  INTEGRATION_PLATFORM_LOGOS,
  integrationPlatformLabel,
  integrationPlatformLogoClass,
  type IntegrationPlatform,
  type IntegrationStatus,
} from '@/features/integrations/constants'
import type {
  GmailConnectSummary,
  InstagramConnectSummary,
  WhatsAppConnectSummary,
} from '@/features/integrations/api/integrations.service'

type IntegrationRowProps = {
  platform: IntegrationPlatform
  status: IntegrationStatus
  busy: boolean
  whatsappDetails: WhatsAppConnectSummary | null
  instagramDetails: InstagramConnectSummary | null
  gmailDetails: GmailConnectSummary | null
  onConnect: (platform: IntegrationPlatform) => void
  onDisconnect: (platform: IntegrationPlatform) => void
}

export function IntegrationRow({
  platform,
  status,
  busy,
  whatsappDetails,
  instagramDetails,
  gmailDetails,
  onConnect,
  onDisconnect,
}: IntegrationRowProps) {
  const isConnected = status === 'connected'
  const connectLabel =
    platform === 'whatsapp' && busy && !isConnected
      ? 'Opening signup…'
      : platform === 'instagram' && busy && !isConnected
        ? 'Opening OAuth…'
        : platform === 'gmail' && busy && !isConnected
          ? 'Opening OAuth…'
          : busy && !isConnected
            ? 'Connecting…'
            : isConnected
              ? 'Reconnect'
              : 'Connect'

  const profile =
    platform === 'whatsapp' && isConnected && whatsappDetails !== null ? (
      <ConnectedAccountProfile
        displayName={whatsappDetails.display_name}
        profilePictureUrl={whatsappDetails.profile_picture_url}
        fallbackInitial={whatsappDetails.display_name ?? 'W'}
      />
    ) : platform === 'instagram' && isConnected && instagramDetails !== null ? (
      <ConnectedAccountProfile
        displayName={instagramDetails.username !== null ? `@${instagramDetails.username}` : null}
        profilePictureUrl={instagramDetails.profile_picture_url}
        fallbackInitial={instagramDetails.username ?? 'I'}
      />
    ) : platform === 'gmail' && isConnected && gmailDetails !== null ? (
      <ConnectedAccountProfile
        displayName={gmailDetails.display_name ?? gmailDetails.email}
        profilePictureUrl={gmailDetails.profile_picture_url}
        fallbackInitial={gmailDetails.email}
      />
    ) : (
      <p className="truncate text-sm text-ink-faint">No account connected</p>
    )

  return (
    <IntegrationRowLayout
      logo={INTEGRATION_PLATFORM_LOGOS[platform]}
      logoClassName={integrationPlatformLogoClass(platform)}
      title={integrationPlatformLabel(platform)}
      status={<IntegrationStatusDot connected={isConnected} />}
      meta={profile}
      actions={
        <>
          <AppButton disabled={busy} onClick={() => onConnect(platform)} className="!px-4 !py-2">
            {connectLabel}
          </AppButton>
          <AppButton
            variant="secondary"
            disabled={busy || !isConnected}
            onClick={() => onDisconnect(platform)}
            className="!px-4 !py-2"
          >
            {busy && isConnected ? 'Disconnecting…' : 'Disconnect'}
          </AppButton>
        </>
      }
    />
  )
}
