import { Link } from 'react-router-dom'

export function SubscriptionRequired() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-white">
      <div className="px-6 py-10 text-center">
        <p className="text-lg font-semibold text-neutral-900">Your free trial has ended</p>
        <p className="mt-2 text-sm text-neutral-500">Subscribe to continue using Responza.</p>
        <Link
          to="/settings?tab=subscription"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
        >
          View subscription
        </Link>
      </div>
    </div>
  )
}
