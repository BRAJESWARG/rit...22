import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  phase: number
  speed: number
  hue: number
}

/** Lightweight ambient particle field rendered on a fixed full-screen canvas. */
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0
    let raf = 0
    let last = performance.now()
    let stars: Star[] = []

    const seed = () => {
      const count = Math.round(Math.min(140, Math.max(60, (width * height) / 9000)))
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.6 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 6,
        vy: -(4 + Math.random() * 10),
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 1.2,
        hue: Math.random() < 0.3 ? 330 : Math.random() < 0.5 ? 45 : 220,
      }))
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      ctx.clearRect(0, 0, width, height)
      for (const s of stars) {
        s.x += s.vx * dt
        s.y += s.vy * dt
        s.phase += s.speed * dt
        if (s.y < -4) { s.y = height + 4; s.x = Math.random() * width }
        if (s.x < -4) s.x = width + 4
        if (s.x > width + 4) s.x = -4
        const alpha = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(s.phase))
        ctx.beginPath()
        ctx.fillStyle = `hsla(${s.hue}, 90%, 85%, ${alpha})`
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    resize()
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  )
}
