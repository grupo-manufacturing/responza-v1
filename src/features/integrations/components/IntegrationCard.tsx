import { AppButton } from '@/shared/ui/app-ui'
import { ConnectedAccountProfile } from '@/features/integrations/components/ConnectedAccountProfile'
import {
  INTEGRATION_PLATFORM_DESCRIPTIONS,
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

type IntegrationCardProps = {
  platform: IntegrationPlatform
  status: IntegrationStatus
  busy: boolean
  whatsappDetails: WhatsAppConnectSummary | null
  instagramDetails: InstagramConnectSummary | null
  gmailDetails: GmailConnectSummary | null
  onConnect: (platform: IntegrationPlatform) => void
  onDisconnect: (platform: IntegrationPlatform) => void
  animationDelayMs?: number
}

function StatusIndicator({ connected }: { connected: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted">
      <span
        className={['h-1.5 w-1.5 rounded-full', connected ? 'bg-emerald-500' : 'bg-border'].join(' ')}
        aria-hidden
      />
      {connected ? 'Connected' : 'Not connected'}
    </span>
  )
}

export function IntegrationCard({
  platform,
  status,
  busy,
  whatsappDetails,
  instagramDetails,
  gmailDetails,
  onConnect,
  onDisconnect,
  animationDelayMs = 0,
}: IntegrationCardProps) {
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

  return (
    <article
      className="animate-step-in flex h-full flex-col rounded-[var(--radius-card)] border border-border bg-white p-5 shadow-soft"
      style={{ animationDelay: `${animationDelayMs}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-muted/80 p-2">
          <img
            src={INTEGRATION_PLATFORM_LOGOS[platform]}
            alt=""
            className={integrationPlatformLogoClass(platform)}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-ink">{integrationPlatformLabel(platform)}</h2>
          <div className="mt-1">
            <StatusIndicator connected={isConnected} />
          </div>
        </div>
      </div>

      <div className="mt-4 min-h-[3.25rem] flex-1">
        {platform === 'whatsapp' && isConnected && whatsappDetails !== null ? (
          <ConnectedAccountProfile
            displayName={whatsappDetails.display_name}
            profilePictureUrl={whatsappDetails.profile_picture_url}
            fallbackInitial={whatsappDetails.display_name ?? 'W'}
          />
        ) : platform === 'instagram' && isConnected && instagramDetails !== null ? (
          <ConnectedAccountProfile
            displayName={
              instagramDetails.username !== null ? `@${instagramDetails.username}` : null
            }
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
          <p className="text-sm leading-relaxed text-ink-muted">
            {INTEGRATION_PLATFORM_DESCRIPTIONS[platform]}
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
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
      </div>
    </article>
  )
}
