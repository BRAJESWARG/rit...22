import { useSound } from '../audio/useSound'
import { fireConfettiCannon } from '../lib/confetti'
import { AGE, BIRTHDAY_LABEL, RECIPIENT } from '../lib/content'
import { STAGES, type Stage } from '../types'

interface Props {
  stage: Stage
  maxStage: Stage
  onJump: (stage: Stage) => void
}

export function Header({ stage, maxStage, onJump }: Props) {
  const sound = useSound()

  const confetti = () => {
    sound.fanfare()
    fireConfettiCannon()
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)]">
      <div className="mx-auto w-full max-w-2xl px-4 pt-3 lg:max-w-6xl">
        <div className="glass flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl px-3 py-2 shadow-xl shadow-black/40 sm:px-4">
          {/* Brand chip */}
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-pink-500 to-amber-400 font-display text-lg font-bold text-slate-950 shadow-md shadow-pink-500/40 ring-2 ring-pink-300/70 sm:size-11">
              <span aria-hidden>{RECIPIENT[0]}</span>
              <img
                src="/ritika-thumb.jpg"
                alt={`Photo of ${RECIPIENT}`}
                width={44}
                height={44}
                className="absolute inset-0 size-full object-cover"
              />
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate font-display text-sm font-semibold text-white sm:text-base">
                {RECIPIENT}&rsquo;s {AGE}nd
              </p>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-pink-300/90">
                {BIRTHDAY_LABEL}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="ml-auto flex items-center gap-1.5 md:order-last md:ml-0">
            <button
              type="button"
              onClick={sound.toggle}
              aria-pressed={sound.enabled}
              aria-label={sound.enabled ? 'Mute music and sounds' : 'Unmute music and sounds'}
              title={sound.enabled ? 'Music on' : 'Music off'}
              className={`grid size-11 place-items-center rounded-full border transition active:scale-90 ${
                sound.enabled
                  ? 'border-pink-400/50 bg-pink-500/15 text-pink-200'
                  : 'border-slate-700 bg-slate-800/60 text-slate-400'
              }`}
            >
              {sound.enabled ? <SpeakerOn /> : <SpeakerOff />}
            </button>
            <button
              type="button"
              onClick={confetti}
              aria-label="Fire confetti"
              title="Confetti!"
              className="grid size-11 place-items-center rounded-full border border-amber-300/50 bg-amber-400/15 text-amber-200 transition hover:bg-amber-400/25 active:scale-90"
            >
              <span aria-hidden className="text-lg leading-none">🎉</span>
            </button>
          </div>

          {/* Progress dots */}
          <nav
            aria-label="Stages"
            className="order-last flex w-full items-center justify-center gap-2 border-t border-slate-800/80 pt-2 md:order-none md:mx-auto md:w-auto md:border-0 md:px-2 md:pt-0 lg:gap-3"
          >
            {STAGES.map((s) => {
              const isCurrent = s.id === stage
              const isVisited = s.id <= maxStage
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onJump(s.id)}
                  aria-label={`Stage ${s.id}: ${s.title}`}
                  aria-current={isCurrent ? 'step' : undefined}
                  title={s.title}
                  className="group grid h-11 min-w-11 place-items-center rounded-full"
                >
                  <span
                    className={`block rounded-full transition-all duration-500 ${
                      isCurrent
                        ? 'h-2.5 w-7 bg-gradient-to-r from-pink-400 to-amber-300 shadow-[0_0_12px_rgba(244,114,182,0.8)]'
                        : isVisited
                          ? 'size-2.5 bg-amber-300/80 group-hover:scale-125'
                          : 'size-2.5 bg-slate-700 group-hover:bg-slate-500'
                    }`}
                  />
                  <span className="sr-only">{s.short}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}

function SpeakerOn() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M19 5a9 9 0 0 1 0 14" />
    </svg>
  )
}

function SpeakerOff() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="m23 9-6 6" />
      <path d="m17 9 6 6" />
    </svg>
  )
}
