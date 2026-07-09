import type { ReactNode } from 'react'

import { SubscriptionRequired } from '@/components/common/SubscriptionRequired'

type ProLockedSectionProps = {
  readonly children: ReactNode
  readonly title?: string
  readonly description?: string
  readonly className?: string
}

export function ProLockedSection({
  children,
  title,
  description,
  className = '',
}: ProLockedSectionProps) {
  return (
    <div className={['relative overflow-hidden', className].join(' ')}>
      <div className="pointer-events-none select-none blur-[3px] saturate-50" aria-hidden>
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/55 px-4 backdrop-blur-[2px]">
        <div className="pointer-events-auto max-w-sm">
          <SubscriptionRequired variant="pro" embedded title={title} description={description} />
        </div>
      </div>
    </div>
  )
}
