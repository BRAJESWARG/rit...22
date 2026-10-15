import { useEffect, useRef } from 'react'

interface Blossom {
  x: number
  y: number
  r: number
  color: string
  petals: boolean
  t: number
  rot: number
}

interface Petal {
  x: number
  y: number
  vy: number
  drift: number
  phase: number
  rot: number
  vr: number
  size: number
  color: string
}

interface Tree {
  /** Node i grows from nodes[parent[i]]; node 0 is the root at the top of the trunk. */
  x: Float64Array
  y: Float64Array
  parent: Int32Array
  depth: Int32Array
  width: Float32Array
  count: number
  maxDepth: number
  blossoms: Blossom[]
  cx: number
  cy: number
  s: number
  baseY: number
  forkY: number
  trunkWidth: number
}

const GROW_SECONDS = 5
/** Fraction of the timeline spent growing wood; blossoms finish in the remainder. */
const GROWTH_END = 0.82
const PINKS = ['#f472b6', '#fb7185', '#fff1f2', '#f9a8d4', '#fda4af']
const TRUNK: [number, number, number] = [0x4a, 0x28, 0x10]
const TWIG: [number, number, number] = [0x8a, 0x4a, 0x36]

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

const lerpColor = (a: [number, number, number], b: [number, number, number], t: number) =>
  `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)}, ${Math.round(a[1] + (b[1] - a[1]) * t)}, ${Math.round(a[2] + (b[2] - a[2]) * t)})`

/** Small deterministic PRNG (mulberry32) so a resize rescales the same tree. */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Parametric heart: x = 16 sin^3 t, y = -(13 cos t - 5 cos 2t - 2 cos 3t - cos 4t).
 * In these units the lobes peak at y = -12, the notch is at y = -5, the widest
 * points are x = +/-16 and the bottom tip is at y = +17.
 */
function heartPoint(t: number) {
  const x = 16 * Math.sin(t) ** 3
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
  return { x, y }
}

function traceHeart(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number) {
  ctx.beginPath()
  for (let i = 0; i <= 160; i += 1) {
    const p = heartPoint((i / 160) * Math.PI * 2)
    const x = cx + p.x * scale
    const y = cy + p.y * scale
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
}

/** Rasterises the heart once so inside/outside tests are O(1) lookups. */
function buildMask(width: number, height: number, cx: number, cy: number, scale: number): Uint8Array | null {
  const c = document.createElement('canvas')
  c.width = width
  c.height = height
  const g = c.getContext('2d', { willReadFrequently: true })
  if (!g) return null
  g.fillStyle = '#fff'
  traceHeart(g, cx, cy, scale)
  g.fill()
  const data = g.getImageData(0, 0, width, height).data
  const mask = new Uint8Array(width * height)
  for (let i = 0; i < mask.length; i += 1) mask[i] = data[i * 4 + 3] > 127 ? 1 : 0
  return mask
}

const EMPTY_TREE: Tree = {
  x: new Float64Array(0),
  y: new Float64Array(0),
  parent: new Int32Array(0),
  depth: new Int32Array(0),
  width: new Float32Array(0),
  count: 0,
  maxDepth: 0,
  blossoms: [],
  cx: 0,
  cy: 0,
  s: 1,
  baseY: 0,
  forkY: 0,
  trunkWidth: 1,
}

/** Simple uniform grid of point indices for neighbourhood queries. */
class PointGrid {
  private cells = new Map<number, number[]>()
  private cell: number
  constructor(cell: number) {
    this.cell = cell
  }
  private key(cx: number, cy: number) {
    return cy * 65536 + cx
  }
  add(i: number, x: number, y: number) {
    const k = this.key(Math.floor(x / this.cell), Math.floor(y / this.cell))
    const list = this.cells.get(k)
    if (list) list.push(i)
    else this.cells.set(k, [i])
  }
  /** Calls fn for every index in cells within `radius` of (x, y). */
  near(x: number, y: number, radius: number, fn: (i: number) => void) {
    const r = Math.ceil(radius / this.cell)
    const cx = Math.floor(x / this.cell)
    const cy = Math.floor(y / this.cell)
    for (let j = cy - r; j <= cy + r; j += 1) {
      for (let i = cx - r; i <= cx + r; i += 1) {
        const list = this.cells.get(this.key(i, j))
        if (list) for (const idx of list) fn(idx)
      }
    }
  }
}

/**
 * Space colonisation (Runions et al.): attraction points are scattered through the
 * heart and the tree grows towards them, so the branches fill the shape evenly and
 * the outline of the canopy is the heart itself.
 */
function buildTree(width: number, height: number, seed: number): Tree {
  if (width < 40 || height < 40) return EMPTY_TREE
  const random = mulberry32(seed)
  const rand = (a: number, b: number) => a + random() * (b - a)

  // --- Geometry: the heart sits on the trunk, its bottom tip at the trunk top.
  const padX = width * 0.05
  const padTop = height * 0.05
  const baseY = height * 0.96
  const minTrunk = Math.max(28, height * 0.12)
  const s = Math.min((width - 2 * padX) / 32, (baseY - padTop - minTrunk) / 29)
  const heartH = 29 * s
  const trunkLen = Math.min(baseY - padTop - heartH, height * 0.35)
  const tipY = baseY - trunkLen
  const cx = width / 2
  const cy = tipY - 17 * s
  // The heart's bottom is a cusp, so the trunk climbs into it before the first fork.
  const forkY = tipY - 5 * s
  const trunkWidth = clamp(s * 0.55, 5, 14)

  const canopyMask = buildMask(width, height, cx, cy, s * 0.97)
  const fullMask = buildMask(width, height, cx, cy, s)
  const insideMask = (mask: Uint8Array | null, x: number, y: number) => {
    if (!mask) return true
    if (x < 0 || y < 0 || x >= width || y >= height) return false
    return mask[(y | 0) * width + (x | 0)] === 1
  }

  // --- Attraction points: a uniform fill of the canopy plus a ring just inside
  // the outline, so twigs reach out and trace the heart's silhouette.
  const STEP = s * 0.55
  const KILL = s * 0.78
  const INFLUENCE = s * 4.5
  const area = 32 * s * 29 * s
  const attractorTarget = Math.round(clamp(area / (s * s) * 3.1, 1200, 2200))
  const ax: number[] = []
  const ay: number[] = []
  for (let tries = 0; ax.length < attractorTarget && tries < attractorTarget * 30; tries += 1) {
    const x = cx + rand(-16, 16) * s
    const y = cy + rand(-12, 17) * s
    if (y > forkY - s * 0.5) continue
    if (!insideMask(canopyMask, x, y)) continue
    ax.push(x)
    ay.push(y)
  }
  const ringCount = 260
  for (let i = 0; i < ringCount; i += 1) {
    const t = ((i + rand(0, 1)) / ringCount) * Math.PI * 2
    const p = heartPoint(t)
    const x = cx + p.x * s * 0.955
    const y = cy + p.y * s * 0.955
    if (y > forkY - s * 0.5) continue
    ax.push(x)
    ay.push(y)
  }
  const alive = new Uint8Array(ax.length).fill(1)
  const attractorGrid = new PointGrid(KILL)
  for (let i = 0; i < ax.length; i += 1) attractorGrid.add(i, ax[i], ay[i])

  // --- Nodes.
  const cap = 9000
  const nx = new Float64Array(cap)
  const ny = new Float64Array(cap)
  const parent = new Int32Array(cap)
  const depth = new Int32Array(cap)
  const children = new Int32Array(cap)
  let count = 1
  nx[0] = cx
  ny[0] = forkY
  parent[0] = -1
  depth[0] = 0
  const nodeGrid = new PointGrid(INFLUENCE / 2)
  nodeGrid.add(0, cx, forkY)

  const accX = new Float64Array(cap)
  const accY = new Float64Array(cap)
  const accN = new Int32Array(cap)

  for (let iter = 0; iter < 600 && count < cap - 64; iter += 1) {
    accX.fill(0, 0, count)
    accY.fill(0, 0, count)
    accN.fill(0, 0, count)
    let any = false
    for (let a = 0; a < ax.length; a += 1) {
      if (!alive[a]) continue
      let best = -1
      let bestD = INFLUENCE * INFLUENCE
      nodeGrid.near(ax[a], ay[a], INFLUENCE, (i) => {
        const dx = ax[a] - nx[i]
        const dy = ay[a] - ny[i]
        const d2 = dx * dx + dy * dy
        if (d2 < bestD) {
          bestD = d2
          best = i
        }
      })
      if (best < 0) continue
      const d = Math.sqrt(bestD) || 1
      accX[best] += (ax[a] - nx[best]) / d
      accY[best] += (ay[a] - ny[best]) / d
      accN[best] += 1
      any = true
    }
    if (!any) break

    const firstNew = count
    for (let i = 0; i < firstNew && count < cap - 1; i += 1) {
      if (accN[i] === 0) continue
      let vx = accX[i] / accN[i]
      let vy = accY[i] / accN[i]
      let len = Math.hypot(vx, vy)
      if (len < 0.08) {
        vx += rand(-0.6, 0.6)
        vy += rand(-0.6, 0.6)
        len = Math.hypot(vx, vy) || 1
      }
      const ang = Math.atan2(vy, vx) + rand(-0.1, 0.1)
      const px = nx[i] + Math.cos(ang) * STEP
      const py = ny[i] + Math.sin(ang) * STEP
      nx[count] = px
      ny[count] = py
      parent[count] = i
      depth[count] = depth[i] + 1
      children[i] += 1
      nodeGrid.add(count, px, py)
      count += 1
    }
    if (count === firstNew) break

    for (let i = firstNew; i < count; i += 1) {
      attractorGrid.near(nx[i], ny[i], KILL, (a) => {
        if (!alive[a]) return
        const dx = ax[a] - nx[i]
        const dy = ay[a] - ny[i]
        if (dx * dx + dy * dy < KILL * KILL) alive[a] = 0
      })
    }
  }

  // --- Limb thickness from how many twigs each limb carries (pipe model).
  const leaves = new Float64Array(count)
  for (let i = count - 1; i >= 1; i -= 1) {
    if (children[i] === 0) leaves[i] += 1
    leaves[parent[i]] += leaves[i]
  }
  const twigW = clamp(s / 14, 0.6, 1.3)
  const topW = trunkWidth * 0.75
  const width_ = new Float32Array(count)
  let maxDepth = 0
  for (let i = 0; i < count; i += 1) {
    width_[i] = clamp(topW * Math.pow(leaves[i] / Math.max(1, leaves[0]), 0.55), twigW, topW)
    if (depth[i] > maxDepth) maxDepth = depth[i]
  }

  // --- Blossoms: on the twigs, a few along thin branches, and a soft uniform fill.
  const sizeFactor = clamp(s / 11, 0.85, 1.5)
  const pickColor = () => PINKS[Math.floor(random() * PINKS.length)]
  const blossoms: Blossom[] = []
  const tAt = (d: number) => (d / Math.max(1, maxDepth)) * GROWTH_END
  for (let i = 1; i < count; i += 1) {
    const isTip = children[i] === 0
    const thin = width_[i] <= twigW * 1.6
    if (isTip ? random() > 0.75 : !thin || random() > 0.06) continue
    blossoms.push({
      x: nx[i] + rand(-2, 2),
      y: ny[i] + rand(-2, 2),
      r: (isTip ? rand(2.6, 4.8) : rand(2.2, 3.8)) * sizeFactor,
      color: pickColor(),
      petals: random() < 0.4,
      t: tAt(depth[i]) + rand(0.01, 0.06),
      rot: random() * Math.PI,
    })
  }
  const scatterCount = Math.round(clamp((32 * s * 29 * s) / 2200, 60, 180))
  let scattered = 0
  for (let tries = 0; scattered < scatterCount && tries < scatterCount * 25; tries += 1) {
    const x = cx + rand(-16, 16) * s
    const y = cy + rand(-12, 17) * s
    if (!insideMask(fullMask, x, y)) continue
    scattered += 1
    blossoms.push({
      x,
      y,
      r: rand(2, 3.6) * sizeFactor,
      color: pickColor(),
      petals: random() < 0.3,
      t: rand(0.5, 0.93),
      rot: random() * Math.PI,
    })
  }
  blossoms.sort((a, b) => a.t - b.t)

  return {
    x: nx.subarray(0, count),
    y: ny.subarray(0, count),
    parent: parent.subarray(0, count),
    depth: depth.subarray(0, count),
    width: width_,
    count,
    maxDepth,
    blossoms,
    cx,
    cy,
    s,
    baseY,
    forkY,
    trunkWidth,
  }
}

function drawBlossom(ctx: CanvasRenderingContext2D, b: Blossom, alpha: number) {
  ctx.globalAlpha = alpha
  ctx.fillStyle = b.color
  if (b.petals) {
    for (let k = 0; k < 5; k += 1) {
      const a = b.rot + (k / 5) * Math.PI * 2
      ctx.beginPath()
      ctx.ellipse(b.x + Math.cos(a) * b.r * 0.8, b.y + Math.sin(a) * b.r * 0.8, b.r * 0.7, b.r * 0.45, a, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.fillStyle = '#fde68a'
    ctx.beginPath()
    ctx.arc(b.x, b.y, b.r * 0.35, 0, Math.PI * 2)
    ctx.fill()
  } else {
    ctx.beginPath()
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

interface Props {
  /** Change this value to replay the growth animation. */
  runId: number
  onBloomed?: () => void
  className?: string
}

/** Procedural cherry blossom tree whose branches and canopy fill a heart. */
export function HeartTree({ runId, onBloomed, className = '' }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const bloomedRef = useRef(onBloomed)
  useEffect(() => {
    bloomedRef.current = onBloomed
  }, [onBloomed])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const layer = document.createElement('canvas')
    const lctx = layer.getContext('2d')
    if (!lctx) return

    let width = 0
    let height = 0
    let tree: Tree = EMPTY_TREE
    let petals: Petal[] = []
    let startTime = performance.now()
    let last = startTime
    let layerDone = false
    let bloomedFired = false
    let raf = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = Math.max(1, Math.floor(rect.width))
      height = Math.max(1, Math.floor(rect.height))
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      layer.width = canvas.width
      layer.height = canvas.height
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      lctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const t0 = performance.now()
      tree = buildTree(width, height, runId + 1)
      canvas.dataset.buildMs = (performance.now() - t0).toFixed(1)
      petals = []
      layerDone = false
    }

    const drawTrunk = (f: number) => {
      const { cx, baseY, forkY, trunkWidth } = tree
      const len = (baseY - forkY) * f
      const topY = baseY - len
      const wb = trunkWidth * 1.4
      const wt = trunkWidth * (1 - 0.3 * f)
      lctx.fillStyle = lerpColor(TRUNK, TWIG, 0)
      lctx.beginPath()
      lctx.moveTo(cx - wb, baseY)
      lctx.quadraticCurveTo(cx - wt, baseY - len * 0.45, cx - wt, topY)
      lctx.lineTo(cx + wt, topY)
      lctx.quadraticCurveTo(cx + wt, baseY - len * 0.45, cx + wb, baseY)
      lctx.closePath()
      lctx.fill()
    }

    const drawLayer = (progress: number) => {
      lctx.clearRect(0, 0, width, height)

      // soft heart-shaped glow behind the canopy (layered fills, no canvas filter needed)
      const glow = clamp((progress - 0.3) / 0.45, 0, 1)
      if (glow > 0) {
        for (let k = 0; k < 7; k += 1) {
          traceHeart(lctx, tree.cx, tree.cy, tree.s * (1.16 - k * 0.035))
          lctx.fillStyle = `rgba(244,114,182,${(0.024 * glow).toFixed(3)})`
          lctx.fill()
        }
      }

      // trunk grows first, then the canopy level by level
      const trunkShare = 0.1
      const trunkF = clamp(progress / trunkShare, 0, 1)
      if (trunkF > 0) drawTrunk(trunkF)

      if (tree.count > 1 && tree.maxDepth > 0) {
        const lvl = ((progress - trunkShare) / (GROWTH_END - trunkShare)) * tree.maxDepth
        lctx.lineCap = 'round'
        lctx.lineJoin = 'round'
        const buckets = new Map<number, Path2D>()
        for (let i = 1; i < tree.count; i += 1) {
          const f = clamp(lvl - (tree.depth[i] - 1), 0, 1)
          if (f <= 0) continue
          const p = tree.parent[i]
          const x1 = tree.x[p]
          const y1 = tree.y[p]
          const x2 = x1 + (tree.x[i] - x1) * f
          const y2 = y1 + (tree.y[i] - y1) * f
          const key = Math.round(tree.width[i] * 2)
          let path = buckets.get(key)
          if (!path) {
            path = new Path2D()
            buckets.set(key, path)
          }
          path.moveTo(x1, y1)
          path.lineTo(x2, y2)
        }
        const topW = tree.trunkWidth * 0.75
        for (const [key, path] of buckets) {
          const w = key / 2
          lctx.lineWidth = w
          lctx.strokeStyle = lerpColor(TRUNK, TWIG, clamp(1 - w / topW, 0, 1))
          lctx.stroke(path)
        }
      }

      for (const b of tree.blossoms) {
        if (progress <= b.t) break
        drawBlossom(lctx, b, Math.min(1, (progress - b.t) / 0.06))
      }
    }

    const spawnPetal = () => {
      if (tree.blossoms.length === 0) return
      const src = tree.blossoms[Math.floor(Math.random() * tree.blossoms.length)]
      petals.push({
        x: src.x,
        y: src.y,
        vy: 22 + Math.random() * 30,
        drift: 10 + Math.random() * 18,
        phase: Math.random() * Math.PI * 2,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 2,
        size: 3 + Math.random() * 3,
        color: PINKS[Math.floor(Math.random() * PINKS.length)],
      })
    }

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const progress = Math.min(1, (now - startTime) / (GROW_SECONDS * 1000))

      if (!layerDone) {
        drawLayer(progress)
        if (progress >= 1) layerDone = true
      }
      if (progress >= 0.97 && !bloomedFired) {
        bloomedFired = true
        bloomedRef.current?.()
      }

      if (progress > 0.55 && petals.length < 42 && Math.random() < 0.35) spawnPetal()
      for (const p of petals) {
        p.phase += dt * 2.2
        p.y += p.vy * dt
        p.x += Math.sin(p.phase) * p.drift * dt
        p.rot += p.vr * dt
      }
      petals = petals.filter((p) => p.y < height + 10)

      ctx.clearRect(0, 0, width, height)
      const g = ctx.createRadialGradient(width / 2, height, 0, width / 2, height, width * 0.5)
      g.addColorStop(0, 'rgba(244,114,182,0.18)')
      g.addColorStop(1, 'rgba(244,114,182,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, width, height)

      ctx.drawImage(layer, 0, 0, width, height)

      for (const p of petals) {
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.globalAlpha = 0.9
        ctx.beginPath()
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
      raf = requestAnimationFrame(frame)
    }

    const ro = new ResizeObserver(() => {
      const elapsed = performance.now() - startTime
      resize()
      startTime = performance.now() - elapsed
    })
    ro.observe(canvas)
    resize()
    startTime = performance.now()
    last = startTime
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [runId])

  return <canvas ref={ref} className={className} role="img" aria-label="A blossoming tree whose branches fill a heart" />
}
