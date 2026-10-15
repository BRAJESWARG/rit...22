interface Props {
  awake: boolean
  className?: string
}

/** Party mascot. Sleeps in the dark, wakes up when the lights come on. */
export function TeddyBear({ awake, className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 200 220"
      className={className}
      role="img"
      aria-label={awake ? 'A cheerful teddy bear in a party hat' : 'A sleeping teddy bear'}
    >
      <defs>
        <radialGradient id="fur" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#d9a066" />
          <stop offset="1" stopColor="#a1662f" />
        </radialGradient>
        <linearGradient id="hat" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f472b6" />
          <stop offset="1" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      {/* body */}
      <ellipse cx="100" cy="165" rx="58" ry="50" fill="url(#fur)" />
      <ellipse cx="100" cy="172" rx="34" ry="30" fill="#f3d6b1" />
      {/* arms */}
      <ellipse cx="44" cy="150" rx="18" ry="26" fill="url(#fur)" transform="rotate(-20 44 150)" />
      <ellipse cx="156" cy="150" rx="18" ry="26" fill="url(#fur)" transform="rotate(20 156 150)" />
      {/* legs */}
      <ellipse cx="66" cy="205" rx="22" ry="14" fill="url(#fur)" />
      <ellipse cx="134" cy="205" rx="22" ry="14" fill="url(#fur)" />
      {/* ears */}
      <circle cx="52" cy="62" r="20" fill="url(#fur)" />
      <circle cx="148" cy="62" r="20" fill="url(#fur)" />
      <circle cx="52" cy="62" r="10" fill="#f3d6b1" />
      <circle cx="148" cy="62" r="10" fill="#f3d6b1" />
      {/* head */}
      <circle cx="100" cy="90" r="52" fill="url(#fur)" />
      <ellipse cx="100" cy="110" rx="24" ry="18" fill="#f3d6b1" />
      <ellipse cx="100" cy="103" rx="8" ry="6" fill="#3b2314" />
      <path d="M100 109 v6 M100 115 q-6 6 -11 1 M100 115 q6 6 11 1" stroke="#3b2314" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* eyes */}
      {awake ? (
        <g>
          <circle cx="80" cy="84" r="6" fill="#1b1008" />
          <circle cx="120" cy="84" r="6" fill="#1b1008" />
          <circle cx="82" cy="82" r="2" fill="#fff" />
          <circle cx="122" cy="82" r="2" fill="#fff" />
          <circle cx="72" cy="98" r="7" fill="#f9a8d4" opacity="0.6" />
          <circle cx="128" cy="98" r="7" fill="#f9a8d4" opacity="0.6" />
        </g>
      ) : (
        <g stroke="#1b1008" strokeWidth="3" strokeLinecap="round" fill="none">
          <path d="M72 86 q8 6 16 0" />
          <path d="M112 86 q8 6 16 0" />
        </g>
      )}
      {/* party hat */}
      <g className={awake ? 'animate-wiggle svg-origin-bottom' : ''} style={{ opacity: awake ? 1 : 0.35, transition: 'opacity .8s' }}>
        <path d="M100 8 L72 56 L128 56 Z" fill="url(#hat)" />
        <circle cx="100" cy="8" r="7" fill="#fde68a" />
        <path d="M80 42 q20 -10 40 0" stroke="#fff" strokeWidth="3" fill="none" opacity="0.7" />
      </g>
      {/* zzz when asleep */}
      {!awake && (
        <g fill="#cbd5e1" fontFamily="Outfit, sans-serif" fontWeight="700" opacity="0.8">
          <text x="140" y="40" fontSize="14">z</text>
          <text x="152" y="26" fontSize="18">z</text>
          <text x="166" y="10" fontSize="22">z</text>
        </g>
      )}
    </svg>
  )
}
