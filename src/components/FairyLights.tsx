const COLORS = ['#f472b6', '#fbbf24', '#34d399', '#60a5fa', '#c084fc', '#fb7185', '#fde047', '#22d3ee']

function pointOnCurve(t: number) {
  // Quadratic bezier from (0,8) through (200,70) to (400,8)
  const x = 2 * (1 - t) * t * 200 + t * t * 400
  const y = (1 - t) * (1 - t) * 8 + 2 * (1 - t) * t * 70 + t * t * 8
  return { x, y }
}

/** Animated fairy light string that glows when the room is lit. */
export function FairyLights({ lit }: { lit: boolean }) {
  const bulbs = Array.from({ length: 13 }, (_, i) => {
    const t = (i + 0.5) / 13
    const { x, y } = pointOnCurve(t)
    return { x, y, color: COLORS[i % COLORS.length], delay: `${(i * 0.17) % 1.4}s` }
  })

  return (
    <svg viewBox="0 0 400 80" className="h-auto w-full" aria-hidden preserveAspectRatio="none">
      <path d="M0 8 Q200 70 400 8" fill="none" stroke={lit ? '#475569' : '#1e293b'} strokeWidth="1.5" />
      {bulbs.map((b, i) => (
        <g key={i}>
          <rect x={b.x - 2.5} y={b.y} width="5" height="5" rx="1" fill={lit ? '#64748b' : '#1e293b'} />
          <circle
            cx={b.x}
            cy={b.y + 11}
            r="6"
            fill={lit ? b.color : '#1f2937'}
            color={b.color}
            className={lit ? 'animate-fairy' : ''}
            style={{ animationDelay: b.delay, transition: 'fill .6s' }}
          />
        </g>
      ))}
    </svg>
  )
}
