import { AppButton } from '@/shared/ui/app-ui'
import { ConnectedAccountProfile } from '@/features/integrations/components/ConnectedAccountProfile'
import {
  INTEGRATION_PLATFORM_DESCRIPTIONS,
  INTEGRATION_PLATFORM_LOGOS,
  integrationPlatformLabel,
  integrationPlatformLogoClass,
  integrationStatusLabel,
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

const CONNECT_BUTTON_CLASS: Partial<Record<IntegrationPlatform, string>> = {
  whatsapp: '!bg-brand-whatsapp hover:!bg-brand-whatsapp/90',
  instagram: '!bg-gradient-to-r !from-[#405DE6] !to-brand-instagram hover:opacity-90',
  gmail: '!bg-[#C5221F] hover:!bg-[#A91B1B]',
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

  return (
    <article className="px-5 py-5 sm:px-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-muted/80 p-2">
            <img
              src={INTEGRATION_PLATFORM_LOGOS[platform]}
              alt=""
              className={integrationPlatformLogoClass(platform)}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h2 className="text-base font-semibold text-ink">{integrationPlatformLabel(platform)}</h2>
              <StatusIndicator connected={isConnected} />
            </div>

            {platform === 'whatsapp' && isConnected && whatsappDetails !== null ? (
              <div className="mt-3">
                <ConnectedAccountProfile
                  displayName={whatsappDetails.display_name}
                  profilePictureUrl={whatsappDetails.profile_picture_url}
                  fallbackInitial={whatsappDetails.display_name ?? 'W'}
                  avatarClassName="bg-brand-whatsapp/15 text-brand-whatsapp"
                />
              </div>
            ) : platform === 'instagram' && isConnected && instagramDetails !== null ? (
              <div className="mt-3">
                <ConnectedAccountProfile
                  displayName={
                    instagramDetails.username !== null ? `@${instagramDetails.username}` : null
                  }
                  profilePictureUrl={instagramDetails.profile_picture_url}
                  fallbackInitial={instagramDetails.username ?? 'I'}
                  avatarClassName="bg-gradient-to-br from-[#405DE6] to-brand-instagram text-white"
                />
              </div>
            ) : platform === 'gmail' && isConnected && gmailDetails !== null ? (
              <div className="mt-3">
                <ConnectedAccountProfile
                  displayName={gmailDetails.display_name ?? gmailDetails.email}
                  profilePictureUrl={gmailDetails.profile_picture_url}
                  fallbackInitial={gmailDetails.email}
                  avatarClassName="bg-[#C5221F]/15 text-[#C5221F]"
                />
              </div>
            ) : (
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                {INTEGRATION_PLATFORM_DESCRIPTIONS[platform]}
              </p>
            )}

            {!isConnected && <p className="sr-only">{integrationStatusLabel(status)}</p>}
          </div>
        </div>

        <div className="flex shrink-0 sm:pl-4">
          <div className="flex flex-wrap gap-2">
            <AppButton
              disabled={busy}
              onClick={() => onConnect(platform)}
              className={['!px-4 !py-2', CONNECT_BUTTON_CLASS[platform] ?? ''].join(' ')}
            >
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
        </div>
      </div>
    </article>
  )
}
