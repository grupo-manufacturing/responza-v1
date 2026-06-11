import {
  INTEGRATION_PLATFORM_DESCRIPTIONS,
  INTEGRATION_PLATFORM_LOGOS,
  integrationPlatformLabel,
  integrationStatusLabel,
  type IntegrationPlatform,
  type IntegrationStatus,
} from '@/modules/integrations/integrations.constants'
import type {
  InstagramConnectSummary,
  WhatsAppConnectSummary,
} from '@/modules/integrations/integrations.service'

function WhatsAppDetailsPanel({ details }: { details: WhatsAppConnectSummary }) {
  return (
    <div className="mt-4 rounded-xl border border-[#DCF8C6] bg-[#f6fff3] px-4 py-3 text-sm text-neutral-700">
      <p className="font-medium text-[#128C7E]">Connected WhatsApp Business</p>
      <dl className="mt-2 space-y-1 text-xs">
        <div className="flex justify-between gap-3">
          <dt className="text-neutral-500">Phone number ID</dt>
          <dd className="truncate font-mono text-neutral-800">{details.phone_number_id}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-neutral-500">WABA ID</dt>
          <dd className="truncate font-mono text-neutral-800">{details.waba_id}</dd>
        </div>
        {details.business_id !== null && (
          <div className="flex justify-between gap-3">
            <dt className="text-neutral-500">Business ID</dt>
            <dd className="truncate font-mono text-neutral-800">{details.business_id}</dd>
          </div>
        )}
      </dl>
    </div>
  )
}

function InstagramDetailsPanel({ details }: { details: InstagramConnectSummary }) {
  return (
    <div className="mt-4 rounded-xl border border-[#E1306C]/20 bg-gradient-to-br from-[#405DE6]/5 to-[#E1306C]/5 px-4 py-3 text-sm text-neutral-700">
      <p className="font-medium text-[#E1306C]">Connected Instagram Business</p>
      <dl className="mt-2 space-y-1 text-xs">
        <div className="flex justify-between gap-3">
          <dt className="text-neutral-500">Business account ID</dt>
          <dd className="truncate font-mono text-neutral-800">{details.business_account_id}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-neutral-500">User ID</dt>
          <dd className="truncate font-mono text-neutral-800">{details.user_id}</dd>
        </div>
        {details.username !== null && (
          <div className="flex justify-between gap-3">
            <dt className="text-neutral-500">Username</dt>
            <dd className="truncate font-mono text-neutral-800">@{details.username}</dd>
          </div>
        )}
      </dl>
    </div>
  )
}

type PlatformCardProps = {
  platform: IntegrationPlatform
  status: IntegrationStatus
  busy: boolean
  whatsappDetails: WhatsAppConnectSummary | null
  instagramDetails: InstagramConnectSummary | null
  onConnect: (platform: IntegrationPlatform) => void
  onDisconnect: (platform: IntegrationPlatform) => void
}

export function PlatformCard({
  platform,
  status,
  busy,
  whatsappDetails,
  instagramDetails,
  onConnect,
  onDisconnect,
}: PlatformCardProps) {
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

  return (
    <article className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 p-2">
          <img
            src={INTEGRATION_PLATFORM_LOGOS[platform]}
            alt={integrationPlatformLabel(platform)}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-semibold text-neutral-900">{integrationPlatformLabel(platform)}</h2>
            <span
              className={[
                'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
                isConnected ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-600',
              ].join(' ')}
            >
              {integrationStatusLabel(status)}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            {INTEGRATION_PLATFORM_DESCRIPTIONS[platform]}
          </p>
        </div>
      </div>

      {platform === 'whatsapp' && isConnected && whatsappDetails !== null && (
        <WhatsAppDetailsPanel details={whatsappDetails} />
      )}

      {platform === 'instagram' && isConnected && instagramDetails !== null && (
        <InstagramDetailsPanel details={instagramDetails} />
      )}

      <div className="mt-auto flex flex-wrap gap-2 border-t border-neutral-100 pt-4">
        <button
          type="button"
          disabled={busy}
          onClick={() => onConnect(platform)}
          className={[
            'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50',
            platform === 'whatsapp'
              ? 'bg-[#128C7E] hover:bg-[#0f7a6d]'
              : platform === 'instagram'
                ? 'bg-gradient-to-r from-[#405DE6] to-[#E1306C] hover:from-[#405DE6]/90 hover:to-[#E1306C]/90'
                : 'bg-neutral-900 hover:bg-neutral-800',
          ].join(' ')}
        >
          {connectLabel}
        </button>
        <button
          type="button"
          disabled={busy || !isConnected}
          onClick={() => onDisconnect(platform)}
          className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy && isConnected ? 'Disconnecting…' : 'Disconnect'}
        </button>
      </div>
    </article>
  )
}
