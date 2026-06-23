import { INTEGRATION_PLATFORM_LOGOS } from '@/modules/integrations/integrations.constants'
import type { DashboardStats } from '@/modules/dashboard/dashboard.service'

type PlatformConversationsChartProps = {
  readonly conversationsByPlatform: DashboardStats['conversationsByPlatform']
  readonly totalConversations: number
}

const PLATFORM_COLORS = {
  whatsapp: '#25D366',
  instagram: '#E1306C',
  empty: '#E5E5E5',
} as const

function polarToCartesian(cx: number, cy: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180

  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  }
}

function describeDonutSlice(
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
): string {
  const sweep = endAngle - startAngle

  if (sweep >= 359.999) {
    return [
      `M ${cx} ${cy - outerRadius}`,
      `A ${outerRadius} ${outerRadius} 0 1 1 ${cx - 0.001} ${cy - outerRadius}`,
      `L ${cx - 0.001} ${cy - innerRadius}`,
      `A ${innerRadius} ${innerRadius} 0 1 0 ${cx} ${cy - innerRadius}`,
      'Z',
    ].join(' ')
  }

  const outerStart = polarToCartesian(cx, cy, outerRadius, endAngle)
  const outerEnd = polarToCartesian(cx, cy, outerRadius, startAngle)
  const innerStart = polarToCartesian(cx, cy, innerRadius, endAngle)
  const innerEnd = polarToCartesian(cx, cy, innerRadius, startAngle)
  const largeArcFlag = sweep > 180 ? 1 : 0

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ')
}

export function PlatformConversationsChart({
  conversationsByPlatform,
  totalConversations,
}: PlatformConversationsChartProps) {
  const whatsappCount = conversationsByPlatform.whatsapp
  const instagramCount = conversationsByPlatform.instagram
  const chartTotal = whatsappCount + instagramCount

  const cx = 56
  const cy = 56
  const outerRadius = 48
  const innerRadius = 30

  let currentAngle = 0
  const slices: Array<{ key: 'whatsapp' | 'instagram'; count: number; color: string }> = []

  if (whatsappCount > 0) {
    slices.push({ key: 'whatsapp', count: whatsappCount, color: PLATFORM_COLORS.whatsapp })
  }

  if (instagramCount > 0) {
    slices.push({ key: 'instagram', count: instagramCount, color: PLATFORM_COLORS.instagram })
  }

  return (
    <div className="flex items-center gap-5">
      <div className="relative h-28 w-28 shrink-0">
        <svg viewBox="0 0 112 112" className="h-full w-full" aria-hidden>
          {chartTotal === 0 ? (
            <circle
              cx={cx}
              cy={cy}
              r={outerRadius}
              fill="none"
              stroke={PLATFORM_COLORS.empty}
              strokeWidth={outerRadius - innerRadius}
            />
          ) : (
            slices.map((slice) => {
              const sliceAngle = (slice.count / chartTotal) * 360
              const startAngle = currentAngle
              const endAngle = currentAngle + sliceAngle
              currentAngle = endAngle

              return (
                <path
                  key={slice.key}
                  d={describeDonutSlice(cx, cy, outerRadius, innerRadius, startAngle, endAngle)}
                  fill={slice.color}
                />
              )
            })
          )}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold text-neutral-900">{totalConversations}</span>
          <span className="text-[10px] font-medium uppercase tracking-wide text-neutral-500">Total</span>
        </div>
      </div>

      <ul className="space-y-3">
        <li className="flex items-center gap-2.5">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: PLATFORM_COLORS.whatsapp }}
            aria-hidden
          />
          <img
            src={INTEGRATION_PLATFORM_LOGOS.whatsapp}
            alt=""
            className="h-4 w-4 object-contain"
            aria-hidden
          />
          <span className="text-sm text-neutral-700">
            WhatsApp{' '}
            <span className="font-semibold text-neutral-900">{whatsappCount}</span>
          </span>
        </li>
        <li className="flex items-center gap-2.5">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: PLATFORM_COLORS.instagram }}
            aria-hidden
          />
          <img
            src={INTEGRATION_PLATFORM_LOGOS.instagram}
            alt=""
            className="h-4 w-4 object-contain"
            aria-hidden
          />
          <span className="text-sm text-neutral-700">
            Instagram{' '}
            <span className="font-semibold text-neutral-900">{instagramCount}</span>
          </span>
        </li>
      </ul>
    </div>
  )
}
