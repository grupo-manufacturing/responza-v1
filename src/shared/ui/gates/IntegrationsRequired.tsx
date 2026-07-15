import { INTEGRATION_PLATFORM_LOGOS } from '@/features/integrations/constants'
import { AppGateCard } from '@/shared/ui/app-ui'

export function IntegrationsRequired() {
  return (
    <AppGateCard
      icon={
        <div className="flex items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-whatsapp/10">
            <img src={INTEGRATION_PLATFORM_LOGOS.whatsapp} alt="" className="h-6 w-6 object-contain" aria-hidden />
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#405DE6]/10 to-brand-instagram/10">
            <img src={INTEGRATION_PLATFORM_LOGOS.instagram} alt="" className="h-6 w-6 object-contain" aria-hidden />
          </div>
        </div>
      }
      title="Connect your messaging platforms"
      description="Connect WhatsApp or Instagram to receive messages, view your dashboard, and reply from one unified inbox."
      actionLabel="Connect platforms"
      actionTo="/integrations"
    />
  )
}
