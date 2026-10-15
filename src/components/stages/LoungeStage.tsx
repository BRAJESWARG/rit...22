import { useEffect } from 'react'
import { useSound } from '../../audio/useSound'
import { fireConfettiCannon } from '../../lib/confetti'
import { AGE, RECIPIENT } from '../../lib/content'
import { BalloonGame } from '../lounge/BalloonGame'
import { FortuneCookie } from '../lounge/FortuneCookie'
import { MemoryCards } from '../lounge/MemoryCards'
import { MilestoneTicker } from '../lounge/MilestoneTicker'
import { Button } from '../Button'
import { StageShell } from '../StageShell'

export function LoungeStage({ onRestart }: { onRestart: () => void }) {
  const sound = useSound()

  useEffect(() => {
    const id = window.setTimeout(fireConfettiCannon, 300)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <StageShell eyebrow="Stage six" title={<span className="text-shimmer">{RECIPIENT}&rsquo;s Birthday Lounge</span>}>
      <p className="mx-auto -mt-3 mb-6 max-w-xl text-center text-sm font-light text-slate-300 sm:mb-8 sm:text-base">
        Stay as long as you like. Everything here is yours to tap, flip, pop and crack.
      </p>

      <div className="grid gap-5 sm:gap-6">
        <MilestoneTicker />
        <MemoryCards />
        <div className="grid gap-5 sm:gap-6 lg:grid-cols-2">
          <BalloonGame />
          <FortuneCookie />
        </div>
      </div>

      <footer className="mt-10 flex flex-col items-center gap-4 text-center">
        <p className="font-hand text-2xl text-pink-200 sm:text-3xl">
          Happy {AGE}nd, {RECIPIENT}. Made with far too much love.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant="gold"
            onClick={() => {
              sound.fanfare()
              fireConfettiCannon()
            }}
          >
            One more confetti 🎉
          </Button>
          <Button variant="ghost" onClick={onRestart}>
            Start over ↺
          </Button>
        </div>
      </footer>
    </StageShell>
  )
}
