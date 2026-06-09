import { Link } from 'react-router-dom'

import {
  INTEGRATION_PLATFORM_LOGOS,
  integrationPlatformLabel,
  type IntegrationPlatform,
} from '@/shared/constants/integrations'

type IntegrationsRequiredProps = {
  readonly connectedPlatforms?: IntegrationPlatform[]
}

const CHANNEL_PLATFORMS: IntegrationPlatform[] = ['whatsapp', 'instagram']

export function IntegrationsRequired({ connectedPlatforms = [] }: IntegrationsRequiredProps) {
  const disconnected = CHANNEL_PLATFORMS.filter((platform) => !connectedPlatforms.includes(platform))
  const channelHint =
    disconnected.length === CHANNEL_PLATFORMS.length
      ? 'Connect WhatsApp or Instagram on the Integrations page to receive messages and reply from one unified inbox.'
      : disconnected.length === 1
        ? `Connect ${integrationPlatformLabel(disconnected[0]!)} on the Integrations page to use it in your inbox.`
        : 'Connect your messaging channels on the Integrations page to use the inbox.'

  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        {CHANNEL_PLATFORMS.map((platform) => (
          <div
            key={platform}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 p-2"
          >
            <img
              src={INTEGRATION_PLATFORM_LOGOS[platform]}
              alt=""
              className="h-full w-full object-contain opacity-90"
              aria-hidden
            />
          </div>
        ))}
      </div>
      <h2 className="text-xl font-semibold text-neutral-900">Connect a channel to use Inbox</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-600">{channelHint}</p>
      <Link
        to="/integrations"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
      >
        Go to Integrations
      </Link>
    </div>
  )
}
