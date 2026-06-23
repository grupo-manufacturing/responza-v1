import { Link } from 'react-router-dom'

import { SubscriptionRequired } from '@/components/common/SubscriptionRequired'
import { Alert } from '@/components/ui/Alert'
import { Spinner } from '@/components/ui/Spinner'
import { ConversationQueueList } from '@/modules/dashboard/components/ConversationQueueList'
import { DashboardActionPanel } from '@/modules/dashboard/components/DashboardActionPanel'
import { DashboardStatsRow } from '@/modules/dashboard/components/DashboardStatsRow'
import { LeadQueueList } from '@/modules/dashboard/components/LeadQueueList'
import { useDashboard } from '@/modules/dashboard/hooks/useDashboard'

export function DashboardPage() {
  const { data, loading, error, subscriptionRequired } = useDashboard()

  if (subscriptionRequired) {
    return <SubscriptionRequired />
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-600">
          See what needs your attention and jump straight into action.
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

      {!loading && error !== null && <Alert variant="error">{error}</Alert>}

      {!loading && error === null && data !== undefined && (
        <div className="space-y-6">
          <DashboardStatsRow stats={data.stats} />

          {data.stats.totalConversations === 0 && (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
              Connect WhatsApp or Instagram to start receiving conversations.{' '}
              <Link to="/integrations" className="font-medium text-neutral-900 underline underline-offset-2">
                Go to Integrations
              </Link>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <DashboardActionPanel
              title="Conversations that need your reply"
              description="Customers are waiting for a response."
              viewAllHref="/inbox"
              viewAllLabel="Open inbox"
            >
              <ConversationQueueList
                conversations={data.needsReply}
                emptyMessage="All caught up — no conversations need a reply."
                actionLabel="Reply"
              />
            </DashboardActionPanel>

            <DashboardActionPanel
              title="Leads to follow up on"
              description="Active leads that may need your attention."
              viewAllHref="/leads"
              viewAllLabel="Open leads"
            >
              <LeadQueueList
                leads={data.leadsToFollowUp}
                emptyMessage="No leads need follow-up right now."
              />
            </DashboardActionPanel>

            <div className="lg:col-span-2">
              <DashboardActionPanel
                title="Conversations to nudge"
                description="You replied, but the customer has gone quiet."
                viewAllHref="/inbox"
                viewAllLabel="Open inbox"
              >
                <ConversationQueueList
                  conversations={data.toNudge}
                  emptyMessage="No conversations need a follow-up nudge."
                  actionLabel="Nudge"
                />
              </DashboardActionPanel>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
