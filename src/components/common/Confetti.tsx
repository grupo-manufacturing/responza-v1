import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const CONFETTI_COLORS = [
  '#171717',
  '#128C7E',
  '#E1306C',
  '#405DE6',
  '#F59E0B',
  '#10B981',
  '#6366F1',
]

const DURATION_MS = 2200
const PARTICLE_COUNT = 72

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  width: number
  height: number
  color: string
  rotation: number
  rotationSpeed: number
  opacity: number
}

type ConfettiProps = {
  /** Increment to fire a new burst (e.g. `generation` from `useConfetti`). */
  readonly generation: number
  readonly onComplete?: () => void
}

function createParticles(width: number, height: number): Particle[] {
  const originX = width * 0.5
  const originY = height * 0.72

  return Array.from({ length: PARTICLE_COUNT }, () => {
    const angle = (Math.random() - 0.5) * Math.PI * 0.9 - Math.PI / 2
    const speed = Math.random() * 7 + 4

    return {
      x: originX + (Math.random() - 0.5) * 120,
      y: originY + (Math.random() - 0.5) * 40,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - Math.random() * 2,
      width: Math.random() * 6 + 4,
      height: Math.random() * 3 + 2,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)] ?? '#171717',
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
    }
  })
}

function runConfettiBurst(
  canvas: HTMLCanvasElement,
  onComplete: () => void,
): () => void {
  const context = canvas.getContext('2d')
  if (context === null) {
    onComplete()
    return () => undefined
  }

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  resize()
  window.addEventListener('resize', resize)

  let particles = createParticles(canvas.width, canvas.height)
  const startedAt = performance.now()
  let frameId = 0

  const draw = (timestamp: number) => {
    const elapsed = timestamp - startedAt
    context.clearRect(0, 0, canvas.width, canvas.height)

    particles = particles.filter((particle) => {
      particle.x += particle.vx
      particle.y += particle.vy
      particle.vy += 0.18
      particle.vx *= 0.99
      particle.rotation += particle.rotationSpeed
      particle.opacity = Math.max(0, 1 - elapsed / DURATION_MS)

      context.save()
      context.globalAlpha = particle.opacity
      context.translate(particle.x, particle.y)
      context.rotate((particle.rotation * Math.PI) / 180)
      context.fillStyle = particle.color
      context.fillRect(-particle.width / 2, -particle.height / 2, particle.width, particle.height)
      context.restore()

      return particle.opacity > 0.02 && particle.y < canvas.height + 40
    })

    if (elapsed < DURATION_MS && particles.length > 0) {
      frameId = requestAnimationFrame(draw)
      return
    }

    context.clearRect(0, 0, canvas.width, canvas.height)
    window.removeEventListener('resize', resize)
    onComplete()
  }

  frameId = requestAnimationFrame(draw)

  return () => {
    cancelAnimationFrame(frameId)
    window.removeEventListener('resize', resize)
  }
}

export function Confetti({ generation, onComplete }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastGenerationRef = useRef(0)

  useEffect(() => {
    if (generation <= 0 || generation === lastGenerationRef.current) {
      return
    }

    lastGenerationRef.current = generation
    const canvas = canvasRef.current
    if (canvas === null) {
      return
    }

    return runConfettiBurst(canvas, () => {
      onComplete?.()
    })
  }, [generation, onComplete])

  if (generation <= 0) {
    return null
  }

  return createPortal(
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[200]"
    />,
    document.body,
  )
}
