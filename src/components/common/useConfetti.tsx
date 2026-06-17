import { useCallback, useState } from 'react'

import { Confetti } from '@/components/common/Confetti'

export function useConfetti() {
  const [generation, setGeneration] = useState(0)

  const fire = useCallback(() => {
    setGeneration((current) => current + 1)
  }, [])

  const confetti = <Confetti generation={generation} />

  return { fire, confetti }
}
