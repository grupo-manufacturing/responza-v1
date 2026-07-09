import { ProLockedSection } from '@/components/common/ProLockedSection'
import { ConversationQueueList } from '@/modules/dashboard/components/ConversationQueueList'
import { DashboardActionPanel } from '@/modules/dashboard/components/DashboardActionPanel'
import { DashboardStatsRow } from '@/modules/dashboard/components/DashboardStatsRow'
import { LeadQueueList } from '@/modules/dashboard/components/LeadQueueList'
import { DASHBOARD_PREVIEW_DATA } from '@/modules/dashboard/dashboard.preview'
import { AppPage, AppPageHeader } from '@/shared/ui/app-ui'

export function DashboardTrialPreview() {
  const data = DASHBOARD_PREVIEW_DATA

  return (
    <AppPage>
      <AppPageHeader
        title="Dashboard"
        description="See what needs your attention and jump straight into action."
      />

      <div className="space-y-6">
        <ProLockedSection
          title="Upgrade to unlock insights"
          description="Subscribe to see live counts for replies, nudges, leads, and workspace performance."
        >
          <DashboardStatsRow
            stats={data.stats}
            needsReplyCount={data.needsReply.length}
            toNudgeCount={data.toNudge.length}
            leadsCount={data.leadsToFollowUp.length}
          />
        </ProLockedSection>

        <div className="grid gap-6 lg:grid-cols-2">
          <DashboardActionPanel
            title="Conversations that need your reply"
            description="Customers are waiting for a response."
            viewAllHref="/inbox"
            viewAllLabel="Open inbox"
          >
            <ProLockedSection
              className="min-h-[220px]"
              title="Upgrade to unlock reply queue"
              description="Subscribe to prioritize customers waiting for your response."
            >
              <ConversationQueueList
                conversations={data.needsReply}
                emptyMessage="All caught up — no conversations need a reply."
                actionLabel="Reply"
              />
            </ProLockedSection>
          </DashboardActionPanel>

          <DashboardActionPanel
            title="Leads to follow up on"
            description="Active leads that may need your attention."
            viewAllHref="/leads"
            viewAllLabel="Open leads"
          >
            <ProLockedSection
              className="min-h-[220px]"
              title="Upgrade to unlock lead follow-ups"
              description="Subscribe to see which leads need your attention next."
            >
              <LeadQueueList
                leads={data.leadsToFollowUp}
                emptyMessage="No leads need follow-up right now."
              />
            </ProLockedSection>
          </DashboardActionPanel>

          <div className="lg:col-span-2">
            <DashboardActionPanel
              title="Conversations to nudge"
              description="You replied, but the customer has gone quiet."
              viewAllHref="/inbox"
              viewAllLabel="Open inbox"
            >
              <ProLockedSection
                className="min-h-[220px]"
                title="Upgrade to unlock nudge queue"
                description="Subscribe to find quiet conversations worth re-engaging."
              >
                <ConversationQueueList
                  conversations={data.toNudge}
                  emptyMessage="No conversations need a follow-up nudge."
                  actionLabel="Nudge"
                />
              </ProLockedSection>
            </DashboardActionPanel>
          </div>
        </div>
      </div>
    </AppPage>
  )
}
