import { useState } from 'react'
import { useSound } from '../../audio/useSound'
import { MEMORY_CARDS } from '../../lib/content'

const FLIP_NOTES = [523.25, 587.33, 659.25, 783.99] // C5 D5 E5 G5

export function MemoryCards() {
  const sound = useSound()
  const [flipped, setFlipped] = useState<Record<string, boolean>>({})

  const toggle = (id: string, index: number) => {
    sound.pluck(FLIP_NOTES[index % FLIP_NOTES.length])
    setFlipped((f) => ({ ...f, [id]: !f[id] }))
  }

  return (
    <section aria-labelledby="cards-title" className="glass rounded-3xl p-5 sm:p-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-pink-300/90">Tap to flip</p>
      <h2 id="cards-title" className="mb-4 font-display text-2xl font-bold text-white sm:text-3xl">
        Four things about you
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {MEMORY_CARDS.map((card, i) => {
          const isFlipped = !!flipped[card.id]
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => toggle(card.id, i)}
              aria-pressed={isFlipped}
              aria-label={`${card.title}. ${isFlipped ? 'Showing note' : 'Tap to reveal note'}`}
              className="group relative aspect-[3/4] w-full text-left [perspective:1200px] focus-visible:outline-none"
            >
              <div
                className="relative h-full w-full transition-transform duration-[600ms] ease-[cubic-bezier(.4,0,.2,1)] [transform-style:preserve-3d]"
                style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
              >
                {/* front */}
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-gradient-to-br ${card.accent} p-4 text-center shadow-lg [backface-visibility:hidden] group-hover:brightness-110`}
                >
                  <span className="text-4xl sm:text-5xl" aria-hidden>
                    {card.emoji}
                  </span>
                  <span className="font-display text-base font-bold leading-tight text-slate-950 sm:text-lg">
                    {card.title}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-900/70">
                    flip
                  </span>
                </div>
                {/* back */}
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-2xl border border-pink-300/30 bg-slate-950 p-4 text-center shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]"
                >
                  <p className="font-hand text-xl leading-snug text-rose-50 sm:text-2xl">{card.note}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
