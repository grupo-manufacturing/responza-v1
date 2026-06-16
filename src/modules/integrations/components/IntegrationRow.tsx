import { ConnectedAccountProfile } from '@/modules/integrations/components/ConnectedAccountProfile'
import {
  INTEGRATION_PLATFORM_DESCRIPTIONS,
  INTEGRATION_PLATFORM_LOGOS,
  integrationPlatformLabel,
  integrationPlatformLogoClass,
  integrationStatusLabel,
  type IntegrationPlatform,
  type IntegrationStatus,
} from '@/modules/integrations/integrations.constants'
import type {
  InstagramConnectSummary,
  WhatsAppConnectSummary,
} from '@/modules/integrations/integrations.service'

type IntegrationRowProps = {
  platform: IntegrationPlatform
  status: IntegrationStatus
  busy: boolean
  whatsappDetails: WhatsAppConnectSummary | null
  instagramDetails: InstagramConnectSummary | null
  onConnect: (platform: IntegrationPlatform) => void
  onDisconnect: (platform: IntegrationPlatform) => void
}

function StatusIndicator({ connected }: { connected: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500">
      <span
        className={[
          'h-1.5 w-1.5 rounded-full',
          connected ? 'bg-emerald-500' : 'bg-neutral-300',
        ].join(' ')}
        aria-hidden
      />
      {connected ? 'Connected' : 'Not connected'}
    </span>
  )
}

export function IntegrationRow({
  platform,
  status,
  busy,
  whatsappDetails,
  instagramDetails,
  onConnect,
  onDisconnect,
}: IntegrationRowProps) {
  const isConnected = status === 'connected'
  const connectLabel =
    platform === 'whatsapp' && busy && !isConnected
      ? 'Opening signup…'
      : platform === 'instagram' && busy && !isConnected
        ? 'Opening OAuth…'
        : busy && !isConnected
          ? 'Connecting…'
          : isConnected
            ? 'Reconnect'
            : 'Connect'

  const connectButtonClass =
    platform === 'whatsapp'
      ? 'bg-[#128C7E] hover:bg-[#0f7a6d]'
      : platform === 'instagram'
        ? 'bg-neutral-900 hover:bg-neutral-800'
        : 'bg-neutral-900 hover:bg-neutral-800'

  return (
    <article className="px-6 py-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-neutral-100 bg-neutral-50 p-1.5">
            <img
              src={INTEGRATION_PLATFORM_LOGOS[platform]}
              alt=""
              className={integrationPlatformLogoClass(platform)}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h2 className="text-base font-semibold text-neutral-900">
                {integrationPlatformLabel(platform)}
              </h2>
              <StatusIndicator connected={isConnected} />
            </div>

            {platform === 'whatsapp' && isConnected && whatsappDetails !== null ? (
              <div className="mt-3">
                <ConnectedAccountProfile
                  displayName={whatsappDetails.display_name}
                  profilePictureUrl={whatsappDetails.profile_picture_url}
                  fallbackInitial={whatsappDetails.display_name ?? 'W'}
                  avatarClassName="bg-[#DCF8C6] text-[#128C7E]"
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
                  avatarClassName="bg-gradient-to-br from-[#405DE6] to-[#E1306C] text-white"
                />
              </div>
            ) : (
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">
                {INTEGRATION_PLATFORM_DESCRIPTIONS[platform]}
              </p>
            )}

            {!isConnected && (
              <p className="sr-only">{integrationStatusLabel(status)}</p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-2 sm:pl-4">
          <button
            type="button"
            disabled={busy}
            onClick={() => onConnect(platform)}
            className={[
              'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50',
              connectButtonClass,
            ].join(' ')}
          >
            {connectLabel}
          </button>
          <button
            type="button"
            disabled={busy || !isConnected}
            onClick={() => onDisconnect(platform)}
            className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy && isConnected ? 'Disconnecting…' : 'Disconnect'}
          </button>
        </div>
      </div>
    </article>
  )
}
