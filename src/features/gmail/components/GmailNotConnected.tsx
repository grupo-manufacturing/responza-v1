import { AppButtonLink } from '@/shared/ui/app-ui'

export function GmailNotConnected() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-[var(--radius-card-lg)] border border-dashed border-border bg-white/60 px-6 py-12 text-center">
      <img src="/gmail.png" alt="" className="mb-4 h-14 w-14 object-contain" />
      <h2 className="text-lg font-semibold text-ink sm:text-xl">Connect Gmail to get started</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
        Link your Gmail account in Integrations to read your inbox emails here.
      </p>
      <AppButtonLink to="/integrations" className="mt-6 !bg-[#C5221F] hover:!bg-[#A91B1B]">
        Go to Integrations
      </AppButtonLink>
    </div>
  )
}
