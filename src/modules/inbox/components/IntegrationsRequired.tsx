import { Link } from 'react-router-dom'

export function IntegrationsRequired() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#128C7E]/10">
          <img src="/whatsapp.png" alt="" className="h-6 w-6 object-contain" aria-hidden />
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#405DE6]/10 to-[#E1306C]/10">
          <img src="/instagram.png" alt="" className="h-6 w-6 object-contain" aria-hidden />
        </div>
      </div>
      <h2 className="text-xl font-semibold text-neutral-900">Connect messaging platforms to use Inbox</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-600">
        Connect WhatsApp or Instagram (or both) on the Integrations page to receive messages and reply from
        one unified inbox.
      </p>
      <Link
        to="/integrations"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
      >
        Connect Platforms
      </Link>
    </div>
  )
}
