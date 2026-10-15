import { AGE, RECIPIENT } from '../lib/content'

interface Props {
  /** One boolean per candle; true = flame is lit. */
  candles?: boolean[]
  /** Indices whose smoke puff is currently playing. */
  smoking?: boolean[]
  onCandleTap?: (index: number) => void
  className?: string
}

const CANDLE_X = [112, 160, 208]

/** Illustrated two-tier birthday cake with tappable candles. */
export function Cake({ candles = [true, true, true], smoking = [], onCandleTap, className = '' }: Props) {
  return (
    <svg viewBox="0 0 320 300" className={className} role="img" aria-label={`${RECIPIENT}'s birthday cake`}>
      <defs>
        <linearGradient id="tierA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbcfe8" />
          <stop offset="1" stopColor="#f472b6" />
        </linearGradient>
        <linearGradient id="tierB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="plate" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#cbd5e1" />
          <stop offset="0.5" stopColor="#f8fafc" />
          <stop offset="1" stopColor="#94a3b8" />
        </linearGradient>
        <radialGradient id="flame" cx="50%" cy="70%" r="60%">
          <stop offset="0" stopColor="#fff7ed" />
          <stop offset="0.4" stopColor="#fbbf24" />
          <stop offset="1" stopColor="#f97316" stopOpacity="0.9" />
        </radialGradient>
        <radialGradient id="flameGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fbbf24" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="candle" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff1f2" />
          <stop offset="0.5" stopColor="#fda4af" />
          <stop offset="1" stopColor="#fff1f2" />
        </linearGradient>
      </defs>

      {/* plate */}
      <ellipse cx="160" cy="276" rx="140" ry="16" fill="url(#plate)" />
      <ellipse cx="160" cy="272" rx="124" ry="10" fill="#e2e8f0" />

      {/* bottom tier */}
      <rect x="44" y="196" width="232" height="72" rx="10" fill="url(#tierA)" />
      <ellipse cx="160" cy="196" rx="116" ry="14" fill="#fce7f3" />
      {/* drips on bottom tier */}
      <path
        d="M44 204 q8 14 16 0 q6 20 14 0 q8 10 16 0 q7 24 16 0 q8 12 16 0 q7 18 16 0 q8 10 16 0 q7 22 16 0 q8 12 16 0 q7 16 16 0 q8 10 16 0 q7 20 16 0 q8 12 14 0 v-8 h-232 z"
        fill="#fce7f3"
      />
      <text x="160" y="244" textAnchor="middle" fontFamily="Outfit, sans-serif" fontWeight="700" fontSize="13" fill="#831843" letterSpacing="1">
        {AGE} YEARS OF AWESOME
      </text>

      {/* top tier */}
      <rect x="84" y="132" width="152" height="66" rx="10" fill="url(#tierB)" />
      <ellipse cx="160" cy="132" rx="76" ry="11" fill="#fef3c7" />
      <path
        d="M84 138 q7 12 14 0 q6 18 13 0 q7 9 14 0 q6 20 13 0 q7 10 14 0 q6 16 13 0 q7 9 14 0 q6 20 13 0 q7 10 14 0 q6 16 13 0 q7 9 13 0 v-8 h-152 z"
        fill="#fef3c7"
      />
      {/* name banner */}
      <rect x="104" y="156" width="112" height="26" rx="13" fill="#be185d" />
      <text x="160" y="174" textAnchor="middle" fontFamily="Caveat, cursive" fontWeight="700" fontSize="22" fill="#fff1f2">
        {RECIPIENT}
      </text>
      {/* sprinkles */}
      {[
        [60, 220, '#f472b6'], [96, 258, '#fbbf24'], [140, 252, '#a78bfa'], [190, 258, '#34d399'],
        [236, 222, '#fbbf24'], [262, 250, '#f472b6'], [100, 190, '#c084fc'], [214, 192, '#38bdf8'],
      ].map(([x, y, c], i) => (
        <rect key={i} x={Number(x)} y={Number(y)} width="7" height="3" rx="1.5" fill={String(c)} transform={`rotate(${(i * 37) % 90} ${x} ${y})`} />
      ))}

      {/* candles */}
      {CANDLE_X.map((x, i) => {
        const lit = candles[i] ?? true
        const smoke = smoking[i] ?? false
        return (
          <g
            key={i}
            onClick={onCandleTap ? () => onCandleTap(i) : undefined}
            role={onCandleTap ? 'button' : undefined}
            tabIndex={onCandleTap ? 0 : undefined}
            aria-label={onCandleTap ? (lit ? `Blow out candle ${i + 1}` : `Candle ${i + 1} is out`) : undefined}
            onKeyDown={
              onCandleTap
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onCandleTap(i)
                    }
                  }
                : undefined
            }
            style={{ cursor: onCandleTap && lit ? 'pointer' : 'default', outline: 'none' }}
          >
            {/* generous invisible hit area (44px+) */}
            <rect x={x - 22} y="52" width="44" height="90" fill="transparent" />
            {/* candle body */}
            <rect x={x - 6} y="92" width="12" height="42" rx="3" fill="url(#candle)" />
            <path d={`M${x - 6} 100 l12 6 M${x - 6} 112 l12 6 M${x - 6} 124 l12 6`} stroke="#fb7185" strokeWidth="2" opacity="0.7" />
            {/* wick */}
            <rect x={x - 1} y="84" width="2" height="9" fill="#44403c" />
            {/* flame */}
            <g style={{ opacity: lit ? 1 : 0, transition: 'opacity .4s ease-in, transform .4s ease-in', transformBox: 'fill-box', transformOrigin: '50% 100%', transform: lit ? 'scale(1)' : 'scale(0)' }}>
              <circle cx={x} cy="74" r="22" fill="url(#flameGlow)" />
              <g className="animate-flicker svg-origin-bottom" style={{ animationDelay: `${i * 0.11}s` }}>
                <path d={`M${x} 60 C${x + 7} 70 ${x + 8} 78 ${x} 86 C${x - 8} 78 ${x - 7} 70 ${x} 60 Z`} fill="url(#flame)" />
                <path d={`M${x} 72 C${x + 3} 77 ${x + 3} 81 ${x} 85 C${x - 3} 81 ${x - 3} 77 ${x} 72 Z`} fill="#fff7ed" opacity="0.9" />
              </g>
            </g>
            {/* smoke */}
            {smoke && (
              <g fill="#cbd5e1">
                {[0, 1, 2].map((k) => (
                  <circle
                    key={k}
                    cx={x + (k - 1) * 4}
                    cy={78 - k * 4}
                    r={3 + k}
                    className="animate-smoke svg-origin-center"
                    style={{ animationDelay: `${k * 0.12}s`, opacity: 0 }}
                  />
                ))}
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}
