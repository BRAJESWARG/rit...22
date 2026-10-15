import { useEffect, useRef, useState } from 'react'
import { useSound } from '../../audio/useSound'
import { burstAt } from '../../lib/confetti'
import type { StageProps } from '../../types'
import { Button } from '../Button'
import { Cake } from '../Cake'
import { StageShell } from '../StageShell'

const CANDLE_COUNT = 3

export function CandlesStage({ onNext }: StageProps) {
  const sound = useSound()
  const [lit, setLit] = useState<boolean[]>(() => Array(CANDLE_COUNT).fill(true))
  const [smoking, setSmoking] = useState<boolean[]>(() => Array(CANDLE_COUNT).fill(false))
  const timers = useRef<number[]>([])
  const cakeRef = useRef<HTMLDivElement>(null)

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const litCount = lit.filter(Boolean).length
  const allOut = litCount === 0

  const extinguish = (index: number) => {
    if (!lit[index]) return
    setLit((prev) => prev.map((v, i) => (i === index ? false : v)))
    setSmoking((prev) => prev.map((v, i) => (i === index ? true : v)))
    sound.whoosh()
    sound.chime(440 + index * 110, 0.9)
    timers.current.push(
      window.setTimeout(() => setSmoking((prev) => prev.map((v, i) => (i === index ? false : v))), 1400),
    )
  }

  const blowAll = () => {
    lit.forEach((isLit, i) => {
      if (isLit) timers.current.push(window.setTimeout(() => extinguish(i), i * 140))
    })
    const rect = cakeRef.current?.getBoundingClientRect()
    if (rect) burstAt(rect.left + rect.width / 2, rect.top + rect.height * 0.3, 50)
  }

  const confirmWish = () => {
    sound.fanfare()
    onNext()
  }

  return (
    <StageShell
      eyebrow="Stage three"
      title={allOut ? 'Hold that thought…' : 'Make a wish'}
    >
      <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-sm font-light text-slate-300 sm:text-base lg:hidden">
            Tap each flame to blow it out. Close your eyes first if you&rsquo;re the superstitious type.
          </p>
          <div ref={cakeRef} className="w-[min(90vw,420px)] md:w-[460px] lg:w-[520px]">
            <Cake candles={lit} smoking={smoking} onCandleTap={extinguish} className="h-auto w-full drop-shadow-[0_20px_40px_rgba(244,114,182,0.25)]" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
          <p className="hidden text-base font-light text-slate-300 lg:block">
            Tap each flame to blow it out. Close your eyes first if you&rsquo;re the superstitious type.
          </p>

          <div className="glass flex items-center gap-3 rounded-full px-4 py-2 text-sm">
            <span className="flex gap-1" aria-hidden>
              {lit.map((v, i) => (
                <span key={i} className={`text-lg transition-opacity duration-300 ${v ? 'opacity-100' : 'opacity-25'}`}>
                  🕯️
                </span>
              ))}
            </span>
            <span className="text-slate-300">
              {allOut ? 'All candles out!' : `${litCount} of ${CANDLE_COUNT} still burning`}
            </span>
          </div>

          {!allOut ? (
            <Button variant="ghost" onClick={blowAll} className="min-w-56">
              Blow all candles 🌬️
            </Button>
          ) : (
            <div className="glass animate-rise w-full max-w-sm rounded-3xl p-6">
              <p className="font-hand text-3xl font-bold text-pink-200">Did you make your wish?</p>
              <p className="mt-2 text-sm font-light text-slate-300">
                Keep it secret. Wishes work better that way.
              </p>
              <Button onClick={confirmWish} className="mt-5 w-full">
                I made my wish ✨
              </Button>
            </div>
          )}
        </div>
      </div>
    </StageShell>
  )
}
