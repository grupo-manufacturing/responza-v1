import { Link } from 'react-router-dom'

export function IntegrationsRequired() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
        <img src="/whatsapp.png" alt="" className="h-8 w-8 object-contain opacity-80" aria-hidden />
      </div>
      <h2 className="text-xl font-semibold text-neutral-900">Connect WhatsApp to use Inbox</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-600">
        Complete Meta Embedded Signup on the Integrations page to receive WhatsApp messages and reply from
        one unified inbox.
      </p>
      <Link
        to="/integrations"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#128C7E] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0f7a6d]"
      >
        Connect WhatsApp
      </Link>
    </div>
  )
}
