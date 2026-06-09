import { Link } from 'react-router-dom'

export function IntegrationsRequired() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
        <svg className="h-7 w-7 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-neutral-900">Connect an integration first</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-600">
        Inbox is available after you connect at least one messaging platform on the Integrations page.
      </p>
      <Link
        to="/integrations"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
      >
        Go to Integrations
      </Link>
    </div>
  )
}
