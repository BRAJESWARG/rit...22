import confetti from 'canvas-confetti'

const PALETTE = ['#f472b6', '#fb7185', '#fbbf24', '#fde68a', '#c084fc', '#fff1f2']

/** Multi-angle shower fired from both lower corners and the centre. */
export function fireConfettiCannon() {
  const base = { zIndex: 60, colors: PALETTE, ticks: 220 }
  confetti({ ...base, particleCount: 70, angle: 60, spread: 60, origin: { x: 0, y: 0.8 } })
  confetti({ ...base, particleCount: 70, angle: 120, spread: 60, origin: { x: 1, y: 0.8 } })
  confetti({ ...base, particleCount: 90, angle: 90, spread: 100, startVelocity: 45, origin: { x: 0.5, y: 0.7 } })
}

/** Burst at a viewport pixel position (for balloons, candles, etc). */
export function burstAt(clientX: number, clientY: number, count = 40) {
  if (typeof window === 'undefined') return
  confetti({
    zIndex: 60,
    particleCount: count,
    spread: 75,
    startVelocity: 28,
    scalar: 0.9,
    ticks: 160,
    colors: PALETTE,
    origin: { x: clientX / window.innerWidth, y: clientY / window.innerHeight },
  })
}

/** Gentle continuous drizzle for the lounge entrance. */
export function sprinkle(durationMs = 1800) {
  const end = Date.now() + durationMs
  const frame = () => {
    confetti({ zIndex: 60, particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors: PALETTE })
    confetti({ zIndex: 60, particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors: PALETTE })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}
