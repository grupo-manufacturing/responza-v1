import { useSearchParams } from 'react-router-dom'

import { AgentSettingsPanel } from '@/modules/settings/components/AgentSettingsPanel'
import { BusinessProfilePanel } from '@/modules/settings/components/BusinessProfilePanel'
import { GeneralSettingsPanel } from '@/modules/settings/components/GeneralSettingsPanel'
import { SubscriptionPanel } from '@/modules/settings/components/SubscriptionPanel'
import { AppPage, AppPageHeader } from '@/shared/ui/app-ui'

const TABS = [
  { id: 'general', label: 'General' },
  { id: 'agent', label: 'Agent' },
  { id: 'profile', label: 'Profile' },
  { id: 'subscription', label: 'Subscription' },
] as const

type SettingsTab = (typeof TABS)[number]['id']

function isSettingsTab(value: string | null): value is SettingsTab {
  return value === 'general' || value === 'agent' || value === 'profile' || value === 'subscription'
}

export function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const activeTab: SettingsTab = isSettingsTab(tabParam) ? tabParam : 'general'

  const setTab = (tab: SettingsTab) => {
    setSearchParams(tab === 'general' ? {} : { tab })
  }

  return (
    <AppPage className="max-w-4xl">
      <AppPageHeader
        title="Settings"
        description="Manage your account, AI agent, business profile, translation preferences, and subscription."
      />

      <nav
        className="mb-6 flex max-w-lg rounded-[var(--radius-pill)] border border-border bg-surface-muted/80 p-1"
        aria-label="Settings sections"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTab(tab.id)}
            className={[
              'flex-1 rounded-[var(--radius-pill)] px-4 py-2 text-sm font-medium transition-all duration-200',
              activeTab === tab.id
                ? 'bg-ink text-on-dark shadow-soft'
                : 'text-ink-muted hover:text-ink',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'general' && <GeneralSettingsPanel />}

      {activeTab === 'agent' && <AgentSettingsPanel />}

      {activeTab === 'profile' && <BusinessProfilePanel />}

      {activeTab === 'subscription' && <SubscriptionPanel />}
    </AppPage>
  )
}
