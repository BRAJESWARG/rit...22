import { useState } from 'react'
import { useSound } from '../../audio/useSound'
import { FORTUNES } from '../../lib/content'
import { Button } from '../Button'

function randomFortune(except?: string) {
  const pool = FORTUNES.filter((f) => f !== except)
  return pool[Math.floor(Math.random() * pool.length)]
}

export function FortuneCookie() {
  const sound = useSound()
  const [cracked, setCracked] = useState(false)
  const [fortune, setFortune] = useState<string>(() => randomFortune())

  const crack = () => {
    if (cracked) return
    setCracked(true)
    sound.pop()
    setTimeout(() => sound.chime(1318.5, 1.2), 150)
  }

  const another = () => {
    setCracked(false)
    sound.pluck(880)
    setTimeout(() => {
      setFortune((f) => randomFortune(f))
    }, 350)
  }

  return (
    <section aria-labelledby="fortune-title" className="glass rounded-3xl p-5 sm:p-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-pink-300/90">Birthday fortune</p>
      <h2 id="fortune-title" className="mb-4 font-display text-2xl font-bold text-white sm:text-3xl">
        Crack the golden cookie
      </h2>

      <div className="flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={crack}
          aria-label={cracked ? 'Cookie cracked open' : 'Crack open the fortune cookie'}
          disabled={cracked}
          className="relative grid h-40 w-full max-w-xs place-items-center disabled:cursor-default"
        >
          <svg viewBox="0 0 240 150" className="h-full w-full drop-shadow-[0_12px_24px_rgba(251,191,36,0.35)]" aria-hidden>
            <defs>
              <linearGradient id="cookieGold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fde68a" />
                <stop offset="0.5" stopColor="#f59e0b" />
                <stop offset="1" stopColor="#b45309" />
              </linearGradient>
            </defs>
            {/* left half */}
            <g
              style={{
                transformBox: 'fill-box',
                transformOrigin: '100% 60%',
                transform: cracked ? 'translate(-26px, 6px) rotate(-18deg)' : 'none',
                transition: 'transform .5s cubic-bezier(.22,1,.36,1)',
              }}
            >
              <path d="M120 40 C80 20 40 40 36 78 C34 100 60 120 118 112 Z" fill="url(#cookieGold)" stroke="#92400e" strokeWidth="2" />
              <path d="M60 78 q30 -8 56 10" stroke="#fff7ed" strokeWidth="3" fill="none" opacity="0.5" />
            </g>
            {/* right half */}
            <g
              style={{
                transformBox: 'fill-box',
                transformOrigin: '0% 60%',
                transform: cracked ? 'translate(26px, 6px) rotate(18deg)' : 'none',
                transition: 'transform .5s cubic-bezier(.22,1,.36,1)',
              }}
            >
              <path d="M120 40 C160 20 200 40 204 78 C206 100 180 120 122 112 Z" fill="url(#cookieGold)" stroke="#92400e" strokeWidth="2" />
              <path d="M124 90 q30 -12 56 -6" stroke="#fff7ed" strokeWidth="3" fill="none" opacity="0.5" />
            </g>
            {/* crack flash */}
            <path
              d="M120 36 l-5 18 l8 14 l-6 16 l6 20"
              stroke="#fff7ed"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              style={{ opacity: cracked ? 0 : 0.75, transition: 'opacity .3s' }}
            />
          </svg>
          {!cracked && (
            <span className="absolute bottom-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/90">
              tap to crack
            </span>
          )}
        </button>

        <div className="w-full max-w-md overflow-hidden" aria-live="polite">
          <div
            className="rounded-2xl border border-amber-200/60 bg-[linear-gradient(180deg,#fffbeb,#fef3c7)] px-5 py-4 text-center shadow-lg transition-all duration-500 ease-out"
            style={{
              transform: cracked ? 'translateY(0)' : 'translateY(-110%)',
              opacity: cracked ? 1 : 0,
            }}
          >
            <p className="font-hand text-2xl font-semibold leading-snug text-amber-900 sm:text-[26px]">
              {fortune}
            </p>
          </div>
        </div>

        {cracked && (
          <Button variant="ghost" onClick={another} className="animate-rise">
            Another cookie 🥠
          </Button>
        )}
      </div>
    </section>
  )
}
