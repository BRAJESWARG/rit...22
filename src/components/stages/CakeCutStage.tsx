import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { useSound } from '../../audio/useSound'
import { fireConfettiCannon } from '../../lib/confetti'
import type { StageProps } from '../../types'
import { Button } from '../Button'
import { Cake } from '../Cake'
import { StageShell } from '../StageShell'

const SLICE_THRESHOLD = 70

export function CakeCutStage({ onNext }: StageProps) {
  const sound = useSound()
  const [sliced, setSliced] = useState(false)
  const [drag, setDrag] = useState<{ startY: number; x: number; y: number } | null>(null)
  const areaRef = useRef<HTMLDivElement>(null)

  const slice = () => {
    if (sliced) return
    setSliced(true)
    setDrag(null)
    sound.pop()
    setTimeout(() => sound.fanfare(), 120)
    setTimeout(fireConfettiCannon, 300)
  }

  const localPoint = (e: ReactPointerEvent) => {
    const rect = areaRef.current?.getBoundingClientRect()
    return { x: e.clientX - (rect?.left ?? 0), y: e.clientY - (rect?.top ?? 0) }
  }

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (sliced) return
    sound.unlock()
    e.currentTarget.setPointerCapture(e.pointerId)
    const p = localPoint(e)
    setDrag({ startY: p.y, x: p.x, y: p.y })
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag || sliced) return
    const p = localPoint(e)
    setDrag({ ...drag, x: p.x, y: p.y })
    if (p.y - drag.startY >= SLICE_THRESHOLD) slice()
  }

  const onPointerUp = () => setDrag(null)

  const progress = drag ? Math.min(1, Math.max(0, (drag.y - drag.startY) / SLICE_THRESHOLD)) : 0

  return (
    <StageShell eyebrow="Stage four" title={sliced ? 'Delicious first cut!' : 'Cut the cake'}>
      <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <div className="flex flex-col items-center gap-3">
          {!sliced && (
            <p className="text-center text-sm font-light text-slate-300 sm:text-base lg:hidden">
              Swipe down along the dotted line to make the first cut.
            </p>
          )}

          <div className="w-full overflow-hidden py-3">
          <div
            ref={areaRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className={`relative mx-auto w-[min(86vw,420px)] touch-none select-none md:w-[460px] lg:w-[520px] ${sliced ? '' : 'cursor-grab active:cursor-grabbing'}`}
            style={{ perspective: '1000px' }}
            aria-label="Swipe down to slice the cake"
          >
            {/* left half */}
            <div
              className="transition-transform duration-[600ms] ease-[cubic-bezier(.34,1.56,.64,1)]"
              style={{
                clipPath: 'inset(0 50% 0 0)',
                transform: sliced ? 'translateX(-7%) rotate(-6deg)' : 'none',
                transformOrigin: '50% 100%',
              }}
            >
              <Cake candles={[false, false, false]} className="h-auto w-full" />
            </div>
            {/* right half */}
            <div
              className="absolute inset-0 transition-transform duration-[600ms] ease-[cubic-bezier(.34,1.56,.64,1)]"
              style={{
                clipPath: 'inset(0 0 0 50%)',
                transform: sliced ? 'translateX(7%) rotate(6deg)' : 'none',
                transformOrigin: '50% 100%',
              }}
            >
              <Cake candles={[false, false, false]} className="h-auto w-full" />
            </div>

            {/* slice guide */}
            {!sliced && (
              <div className="pointer-events-none absolute inset-y-[18%] left-1/2 w-0 -translate-x-1/2">
                <div className="h-full border-l-2 border-dashed border-white/70" />
                {!drag && (
                  <span className="absolute -left-4 top-0 animate-swipe text-3xl" aria-hidden>
                    👇
                  </span>
                )}
                {drag && (
                  <div
                    className="absolute left-0 top-0 w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-pink-400 to-amber-300 shadow-[0_0_12px_rgba(244,114,182,0.9)]"
                    style={{ height: `${progress * 100}%` }}
                  />
                )}
              </div>
            )}

            {/* trailing knife */}
            {drag && !sliced && (
              <span
                className="pointer-events-none absolute text-4xl drop-shadow-lg"
                style={{ left: drag.x, top: drag.y, transform: 'translate(-30%, -70%) rotate(-45deg)' }}
                aria-hidden
              >
                🔪
              </span>
            )}
          </div>
          </div>

          {!sliced && (
            <Button variant="ghost" onClick={slice} className="mt-2">
              Slice with knife 🔪
            </Button>
          )}
        </div>

        <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
          {!sliced ? (
            <p className="hidden text-base font-light text-slate-300 lg:block">
              Click and drag downward along the dotted line to make the first cut. Mouse or finger, both work.
            </p>
          ) : (
            <div className="glass animate-rise w-full max-w-sm rounded-3xl p-6">
              <p className="text-4xl" aria-hidden>🍰</p>
              <p className="mt-2 font-display text-2xl font-bold text-white">Delicious First Cut!</p>
              <p className="mt-2 text-sm font-light text-slate-300">
                The first slice is always yours. The second one too, if we&rsquo;re honest.
              </p>
              <Button onClick={onNext} className="mt-5 w-full">
                Something&rsquo;s growing… 🌸 →
              </Button>
            </div>
          )}
        </div>
      </div>
    </StageShell>
  )
}
