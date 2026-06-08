import {
  integrationStatusBadgeClass,
  integrationStatusLabel,
  type PlatformDefinition,
} from '@/shared/constants/integrations'
import type { Integration } from '@/shared/services/integrations.service'

type PlatformCardProps = {
  definition: PlatformDefinition
  integration: Integration
  connecting: boolean
  disconnecting: boolean
  onConnect: () => void
  onDisconnect: () => void
}

export function PlatformCard({
  definition,
  integration,
  connecting,
  disconnecting,
  onConnect,
  onDisconnect,
}: PlatformCardProps) {
  const isConnected = integration.status === 'connected'
  const isBusy = connecting || disconnecting
  const whatsappMetadata =
    definition.platform === 'whatsapp' && isConnected ? integration.metadata : undefined

  return (
    <article className="flex h-full min-h-[220px] flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-neutral-100 bg-neutral-50 p-2">
          <img
            src={definition.logoSrc}
            alt=""
            className="h-full w-full object-contain"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-base font-semibold text-neutral-900">{definition.label}</h2>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${integrationStatusBadgeClass(integration.status)}`}
            >
              {integrationStatusLabel(integration.status)}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-neutral-500">{definition.description}</p>

          {whatsappMetadata !== undefined &&
            (whatsappMetadata.phoneNumberId !== undefined ||
              whatsappMetadata.wabaId !== undefined) && (
              <dl className="mt-3 space-y-1 rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
                {whatsappMetadata.phoneNumberId !== undefined && (
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                    <dt className="font-medium text-neutral-500">Phone number ID</dt>
                    <dd className="break-all font-mono text-neutral-800">
                      {whatsappMetadata.phoneNumberId}
                    </dd>
                  </div>
                )}
                {whatsappMetadata.wabaId !== undefined && (
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                    <dt className="font-medium text-neutral-500">WABA ID</dt>
                    <dd className="break-all font-mono text-neutral-800">{whatsappMetadata.wabaId}</dd>
                  </div>
                )}
              </dl>
            )}
        </div>
      </div>

      <div className="mt-auto pt-5">
        {isConnected ? (
          <button
            type="button"
            disabled={isBusy}
            onClick={onDisconnect}
            className="inline-flex w-full items-center justify-center rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {disconnecting ? 'Disconnecting…' : 'Disconnect'}
          </button>
        ) : (
          <button
            type="button"
            disabled={isBusy}
            onClick={onConnect}
            className="inline-flex w-full items-center justify-center rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {connecting ? 'Connecting…' : 'Connect'}
          </button>
        )}
      </div>
    </article>
  )
}
