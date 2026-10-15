import { useState } from 'react'
import { useSound } from '../../audio/useSound'
import { sprinkle } from '../../lib/confetti'
import { LETTER, RECIPIENT } from '../../lib/content'
import type { StageProps } from '../../types'
import { Button } from '../Button'
import { HeartTree } from '../HeartTree'
import { StageShell } from '../StageShell'
import { Typewriter } from '../Typewriter'

export function BlossomTreeStage({ onNext }: StageProps) {
  const sound = useSound()
  const [runId, setRunId] = useState(0)
  const [bloomed, setBloomed] = useState(false)
  const [typed, setTyped] = useState(false)

  const replay = () => {
    setBloomed(false)
    setTyped(false)
    setRunId((r) => r + 1)
    sound.melody()
  }

  const onBloomed = () => {
    setBloomed(true)
    sound.chime(783.99, 1.6)
    sound.chime(1046.5, 1.6)
  }

  const enterLounge = () => {
    sprinkle(1500)
    sound.fanfare()
    onNext()
  }

  return (
    <StageShell eyebrow="Stage five" title="The heart blossom tree">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[radial-gradient(ellipse_at_top,#1e1b4b_0%,#020617_70%)] shadow-2xl shadow-black/60">
          <HeartTree runId={runId} onBloomed={onBloomed} className="block h-[56dvh] min-h-[360px] w-full sm:h-[480px] lg:h-full lg:min-h-[560px]" />
          <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center font-hand text-lg text-pink-200/80 sm:text-xl">
            {bloomed ? 'Grown from everything you are.' : 'Something is growing…'}
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <article className="glass relative flex-1 rounded-3xl p-6 sm:p-8">
            <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-pink-500 to-amber-400 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-950">
              A letter for {RECIPIENT}
            </span>
            <Typewriter
              key={runId}
              runId={runId}
              text={LETTER}
              speed={25}
              startDelay={600}
              onDone={() => setTyped(true)}
              className="font-hand text-[22px] leading-snug text-rose-50 sm:text-2xl lg:text-[26px]"
            />
          </article>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={replay}>
              Replay 🌸
            </Button>
            <Button onClick={enterLounge} disabled={!bloomed} className="min-w-56">
              {bloomed ? `Enter ${RECIPIENT}'s Lounge →` : typed ? 'Almost in bloom…' : 'Growing…'}
            </Button>
          </div>
        </div>
      </div>
    </StageShell>
  )
}
