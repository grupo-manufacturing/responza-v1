import { SubscriptionRequired } from '@/components/common/SubscriptionRequired'
import { IntegrationsRequired } from '@/components/common/IntegrationsRequired'
import { Alert } from '@/components/ui/Alert'
import { SpinnerSection } from '@/components/ui/Spinner'
import { ConversationQueueList } from '@/modules/dashboard/components/ConversationQueueList'
import { DashboardActionPanel } from '@/modules/dashboard/components/DashboardActionPanel'
import { DashboardStatsRow } from '@/modules/dashboard/components/DashboardStatsRow'
import { LeadQueueList } from '@/modules/dashboard/components/LeadQueueList'
import { useDashboard } from '@/modules/dashboard/hooks/useDashboard'
import { useSession } from '@/shared/hooks/useSession'
import { SessionStorage } from '@/shared/session/storage'
import { AppButtonLink, AppPage, AppPageHeader } from '@/shared/ui/app-ui'
import { isTrialSubscription } from '@/shared/utils/subscription-access'

function DashboardPageContent() {
  const {
    data,
    loading,
    error,
    subscriptionRequired,
    integrationsLoading,
    integrationsRequired,
  } = useDashboard()

  if (subscriptionRequired) {
    return <SubscriptionRequired />
  }

  if (integrationsLoading) {
    return <SpinnerSection minHeightClassName="min-h-[40vh]" />
  }

  if (integrationsRequired) {
    return <IntegrationsRequired />
  }

  return (
    <AppPage>
      <AppPageHeader
        title="Dashboard"
        description="See what needs your attention and jump straight into action."
      />

      {loading && <SpinnerSection minHeightClassName="min-h-[40vh]" />}

      {!loading && error !== null && <Alert variant="error">{error}</Alert>}

      {!loading && error === null && data !== undefined && (
        <div className="space-y-6">
          <DashboardStatsRow
            stats={data.stats}
            needsReplyCount={data.needsReply.length}
            toNudgeCount={data.toNudge.length}
            leadsCount={data.leadsToFollowUp.length}
          />

          {data.stats.totalConversations === 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-card)] border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-ink-muted">
              <span>Connect WhatsApp or Instagram to start receiving conversations.</span>
              <AppButtonLink to="/integrations" variant="secondary" className="!px-4 !py-2 text-xs">
                Go to Integrations
              </AppButtonLink>
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
    </AppPage>
  )
}

export function DashboardPage() {
  const { me } = useSession()
  const subscription = me?.subscription ?? SessionStorage.getStoredSubscription()

  if (isTrialSubscription(subscription)) {
    return <SubscriptionRequired variant="pro" />
  }

  return <DashboardPageContent />
}
