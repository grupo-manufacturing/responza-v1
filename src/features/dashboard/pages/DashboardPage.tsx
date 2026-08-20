import { AssistantChat } from '@/features/assistant/components/AssistantChat'
import { AssistantTrialPreview } from '@/features/assistant/components/AssistantTrialPreview'
import { SubscriptionRequired } from '@/shared/ui/gates/SubscriptionRequired'
import { IntegrationsRequired } from '@/shared/ui/gates/IntegrationsRequired'
import { SpinnerSection } from '@/shared/ui/primitives/Spinner'
import { useSession } from '@/shared/hooks/useSession'
import { useIntegrationsGate } from '@/shared/hooks/useIntegrationsGate'
import { useSubscriptionGate } from '@/shared/hooks/useSubscriptionGate'
import { SessionStorage } from '@/shared/session/storage'
import { AppPage, AppPageHeader } from '@/shared/ui/app-ui'
import { isTrialSubscription } from '@/shared/utils/subscription-access'

function DashboardAssistantContent() {
  const { subscriptionRequired } = useSubscriptionGate()
  const { integrationsLoading, integrationsRequired } = useIntegrationsGate(subscriptionRequired)

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
    <AppPage className="max-w-5xl">
      <AppPageHeader
        title="Dashboard"
        description="Ask questions about your conversations and connected integrations."
      />
      <AssistantChat />
    </AppPage>
  )
}

export function DashboardPage() {
  const { me } = useSession()
  const subscription = me?.subscription ?? SessionStorage.getStoredSubscription()

  if (isTrialSubscription(subscription)) {
    return <AssistantTrialPreview />
  }

  return <DashboardAssistantContent />
}
