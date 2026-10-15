import { useState, type MouseEvent } from 'react'
import { useSound } from '../../audio/useSound'
import { burstAt } from '../../lib/confetti'
import { BALLOONS } from '../../lib/content'
import { Button } from '../Button'

type State = 'floating' | 'popping' | 'gone'

export function BalloonGame() {
  const sound = useSound()
  const [states, setStates] = useState<Record<string, State>>({})
  const [round, setRound] = useState(0)

  const popped = BALLOONS.filter((b) => states[b.id] === 'gone' || states[b.id] === 'popping').length
  const allPopped = popped === BALLOONS.length

  const pop = (id: string, e: MouseEvent<HTMLButtonElement>) => {
    if (states[id]) return
    const rect = e.currentTarget.getBoundingClientRect()
    burstAt(rect.left + rect.width / 2, rect.top + rect.height * 0.4, 35)
    sound.pop()
    setStates((s) => ({ ...s, [id]: 'popping' }))
    window.setTimeout(() => setStates((s) => ({ ...s, [id]: 'gone' })), 260)
  }

  const reset = () => {
    setStates({})
    setRound((r) => r + 1)
    sound.melody()
  }

  return (
    <section aria-labelledby="balloons-title" className="glass rounded-3xl p-5 sm:p-6">
      <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-pink-300/90">Mini game</p>
          <h2 id="balloons-title" className="font-display text-2xl font-bold text-white sm:text-3xl">
            Pop the balloons
          </h2>
        </div>
        <p className="font-sans text-sm text-slate-300" aria-live="polite">
          {popped} / {BALLOONS.length} popped
        </p>
      </div>

      <div key={round} className="relative flex h-56 items-end justify-around sm:h-64">
        {BALLOONS.map((b, i) => {
          const state = states[b.id] ?? 'floating'
          if (state === 'gone') return <div key={b.id} className="w-16" aria-hidden />
          return (
            <button
              key={b.id}
              type="button"
              onClick={(e) => pop(b.id, e)}
              aria-label="Pop balloon"
              className={`relative flex w-16 flex-col items-center sm:w-20 ${
                state === 'popping' ? 'animate-pop' : 'animate-bob'
              }`}
              style={{ animationDelay: state === 'popping' ? '0s' : b.delay, animationDuration: state === 'popping' ? undefined : `${3 + i * 0.4}s` }}
            >
              <span
                className="block h-20 w-16 sm:h-24 sm:w-20"
                style={{
                  background: `radial-gradient(circle at 35% 30%, ${b.highlight} 0%, ${b.color} 45%, ${b.color} 100%)`,
                  borderRadius: '50% 50% 50% 50% / 58% 58% 42% 42%',
                  boxShadow: `inset -6px -8px 12px rgba(0,0,0,0.18), 0 10px 20px rgba(0,0,0,0.35)`,
                }}
              />
              <span
                className="-mt-1 block h-0 w-0 border-x-[5px] border-b-[8px] border-x-transparent"
                style={{ borderBottomColor: b.color }}
                aria-hidden
              />
              <span className="block h-14 w-px bg-slate-400/60" aria-hidden />
            </button>
          )
        })}
      </div>

      <div className="mt-2 flex min-h-11 items-center justify-center">
        {allPopped ? (
          <Button variant="ghost" onClick={reset} className="animate-rise">
            Bring them back 🎈
          </Button>
        ) : (
          <p className="text-center text-sm font-light text-slate-400">Tap a balloon to pop it.</p>
        )}
      </div>
    </section>
  )
}
