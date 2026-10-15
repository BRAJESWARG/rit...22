import { useState } from 'react'
import { useSound } from '../../audio/useSound'
import { fireConfettiCannon } from '../../lib/confetti'
import { RECIPIENT } from '../../lib/content'
import type { StageProps } from '../../types'
import { Button } from '../Button'
import { FairyLights } from '../FairyLights'
import { StageShell } from '../StageShell'
import { TeddyBear } from '../TeddyBear'

export function DarkRoomStage({ onNext }: StageProps) {
  const sound = useSound()
  const [lit, setLit] = useState(false)

  const turnOn = () => {
    if (lit) return
    setLit(true)
    sound.lightsOn()
    setTimeout(fireConfettiCannon, 350)
  }

  return (
    <StageShell
      eyebrow={lit ? 'Welcome to the party' : 'Stage two'}
      title={lit ? <span className="text-shimmer">Surprise, {RECIPIENT}!</span> : 'Shhh… it’s dark in here'}
    >
      <div className="relative min-h-[62dvh] overflow-hidden rounded-3xl border border-slate-800 shadow-2xl shadow-black/60 md:min-h-[540px]">
        {/* dark layer */}
        <div className="absolute inset-0 bg-black" />
        {/* lit layer (fades in) */}
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,#2e1065_0%,#831843_55%,#b45309_100%)] transition-opacity duration-[800ms] ease-[cubic-bezier(.22,1,.36,1)]"
          style={{ opacity: lit ? 1 : 0 }}
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(251,191,36,0.35),transparent_60%)] transition-opacity duration-[1200ms]"
          style={{ opacity: lit ? 1 : 0 }}
        />

        {/* fairy lights */}
        <div className="absolute inset-x-0 top-0">
          <FairyLights lit={lit} />
        </div>

        {/* content */}
        <div className="relative z-10 flex h-full min-h-[62dvh] flex-col items-center justify-end gap-5 px-5 pb-8 pt-20 text-center md:min-h-[540px] md:flex-row md:items-end md:justify-center md:gap-12 md:pb-12">
          <TeddyBear
            awake={lit}
            className={`w-40 shrink-0 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-700 sm:w-48 md:w-60 lg:w-72 ${
              lit ? 'opacity-100' : 'opacity-20 grayscale'
            }`}
          />

          <div className="flex max-w-md flex-col items-center gap-4 md:items-start md:pb-6 md:text-left">
            {!lit ? (
              <>
                <p className="text-sm font-light text-slate-300 sm:text-base">
                  Someone is definitely snoring in the corner. Find the switch.
                </p>
                <Button variant="gold" onClick={turnOn} className="min-w-56">
                  Turn on the lights ✨
                </Button>
              </>
            ) : (
              <>
                <p className="animate-rise font-hand text-2xl font-semibold text-amber-100 sm:text-3xl">
                  We&rsquo;ve been waiting all year for this!
                </p>
                <p className="animate-rise text-sm font-light text-rose-100/90 sm:text-base" style={{ animationDelay: '120ms' }}>
                  The bear woke up, the lights are on, and there is cake. Obviously there is cake.
                </p>
                <Button onClick={onNext} className="animate-rise min-w-56" style={{ animationDelay: '240ms' }}>
                  Bring out the cake! 🎂 →
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </StageShell>
  )
}
