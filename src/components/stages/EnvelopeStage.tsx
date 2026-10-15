import { useEffect, useRef, useState } from 'react'
import { useSound } from '../../audio/useSound'
import { fireConfettiCannon } from '../../lib/confetti'
import { AGE, RECIPIENT } from '../../lib/content'
import type { StageProps } from '../../types'
import { Button } from '../Button'
import { StageShell } from '../StageShell'

export function EnvelopeStage({ onNext }: StageProps) {
  const sound = useSound()
  const [opened, setOpened] = useState(false)
  const advanceTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(advanceTimer.current), [])

  const open = () => {
    if (opened) return
    sound.unlock()
    setOpened(true)
    sound.chime(523.25, 1.2)
    sound.chime(659.25, 1.2)
    setTimeout(() => sound.chime(783.99, 1.4), 140)
    fireConfettiCannon()
    advanceTimer.current = window.setTimeout(onNext, 1100)
  }

  return (
    <StageShell eyebrow="A little something for you" title={<>Happy {AGE}nd, {RECIPIENT}</>}>
      <div className="flex flex-col items-center gap-8 text-center">
        <p className="max-w-md text-sm font-light leading-relaxed text-slate-300 sm:text-base">
          There&rsquo;s a letter waiting with your name on it. Tap the seal when you&rsquo;re ready.
        </p>

        <div
          className="relative w-[min(88vw,420px)] md:w-[460px] lg:w-[520px]"
          style={{ perspective: '1400px' }}
        >
          <button
            type="button"
            onClick={open}
            aria-label="Open the envelope"
            className="group relative block aspect-[3/2] w-full rounded-2xl bg-gradient-to-br from-rose-200 via-pink-100 to-amber-100 text-left animate-glow transition-transform duration-500 hover:-translate-y-1"
          >
            {/* letter */}
            <div
              className="absolute inset-x-5 top-4 bottom-3 z-10 flex flex-col items-center justify-start rounded-xl bg-white px-4 pt-5 shadow-lg transition-transform duration-700 ease-out sm:px-6"
              style={{ transform: opened ? 'translateY(-62%)' : 'translateY(0)' }}
            >
              <p className="font-hand text-2xl font-bold text-rose-600 sm:text-3xl">For {RECIPIENT} ♡</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                open me
              </p>
            </div>

            {/* pocket (sides + bottom) */}
            <div
              className="absolute inset-0 z-20 rounded-2xl bg-gradient-to-b from-rose-300 to-rose-200"
              style={{ clipPath: 'polygon(0 0, 50% 58%, 100% 0, 100% 100%, 0 100%)' }}
            />
            <div
              className="absolute inset-0 z-20 rounded-2xl bg-gradient-to-t from-amber-100/90 to-rose-200/40"
              style={{ clipPath: 'polygon(0 100%, 50% 42%, 100% 100%)' }}
            />

            {/* flap */}
            <div
              className={`absolute inset-x-0 top-0 h-[58%] origin-top rounded-t-2xl bg-gradient-to-b from-rose-400 to-rose-300 transition-transform duration-700 ease-in-out ${
                opened ? 'z-0' : 'z-30'
              }`}
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                transform: opened ? 'rotateX(180deg)' : 'rotateX(0deg)',
                transformStyle: 'preserve-3d',
              }}
            />

            {/* wax seal */}
            <span
              className={`absolute left-1/2 top-[58%] z-40 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-rose-500 via-rose-600 to-rose-800 font-hand text-3xl font-bold text-rose-50 shadow-[0_6px_18px_rgba(159,18,57,0.5),inset_0_2px_4px_rgba(255,255,255,0.4)] ring-4 ring-rose-700/40 transition duration-300 group-hover:scale-105 group-active:scale-95 ${
                opened ? 'scale-0 opacity-0' : ''
              }`}
            >
              {RECIPIENT[0]}
            </span>
          </button>
        </div>

        <Button onClick={open} disabled={opened} className="min-w-56">
          {opened ? 'Opening…' : 'Open your surprise ✨'}
        </Button>
      </div>
    </StageShell>
  )
}
