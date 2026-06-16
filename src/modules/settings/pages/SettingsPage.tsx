import { useSearchParams } from 'react-router-dom'

import { GeneralSettingsPanel } from '@/modules/settings/components/GeneralSettingsPanel'
import { SubscriptionPanel } from '@/modules/settings/components/SubscriptionPanel'

const TABS = [
  { id: 'general', label: 'General' },
  { id: 'subscription', label: 'Subscription' },
] as const

type SettingsTab = (typeof TABS)[number]['id']

function isSettingsTab(value: string | null): value is SettingsTab {
  return value === 'general' || value === 'subscription'
}

function tabClassName(isActive: boolean) {
  return [
    'rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
    isActive
      ? 'bg-neutral-900 text-white shadow-md'
      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
  ].join(' ')
}

export function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const activeTab: SettingsTab = isSettingsTab(tabParam) ? tabParam : 'general'

  const setTab = (tab: SettingsTab) => {
    setSearchParams(tab === 'general' ? {} : { tab })
  }

  return (
    <div className="mx-auto max-w-4xl">
      <nav className="mb-6 flex flex-wrap gap-2 border-b border-neutral-200 pb-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTab(tab.id)}
            className={tabClassName(activeTab === tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'general' && <GeneralSettingsPanel />}

      {activeTab === 'subscription' && <SubscriptionPanel />}
    </div>
  )
}
