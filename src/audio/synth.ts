/**
 * Zero-dependency procedural synthesizer built on the Web Audio API.
 * The AudioContext is created lazily on the first user gesture so mobile
 * autoplay policies never block playback.
 */

type WindowWithWebkit = Window & { webkitAudioContext?: typeof AudioContext }

let ctx: AudioContext | null = null

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as WindowWithWebkit).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  // Safari/iOS can leave a context 'suspended' or 'interrupted'; always try to resume.
  if (ctx.state !== 'running') void ctx.resume()
  return ctx
}

/** Returns the context if one exists, without creating it. */
export function peekAudioContext(): AudioContext | null {
  return ctx
}

let warmedUp = false
/** Plays a one-sample silent buffer inside a user gesture, which unlocks audio on older iOS. */
export function warmUp(ac: AudioContext) {
  if (warmedUp) return
  warmedUp = true
  const buffer = ac.createBuffer(1, 1, ac.sampleRate)
  const src = ac.createBufferSource()
  src.buffer = buffer
  src.connect(ac.destination)
  src.start(0)
}

function tone(
  freq: number,
  duration: number,
  peak: number,
  type: OscillatorType,
  delay = 0,
  endFreq?: number,
) {
  const ac = getAudioContext()
  if (!ac) return
  const t0 = ac.currentTime + delay
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (endFreq !== undefined) osc.frequency.exponentialRampToValueAtTime(endFreq, t0 + duration)
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.linearRampToValueAtTime(peak, t0 + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
  osc.connect(gain).connect(ac.destination)
  osc.start(t0)
  osc.stop(t0 + duration + 0.05)
}

/** Crystalline bell: sine oscillator, 10ms attack, exponential decay. */
export function playChime(freq = 523.25, duration = 1.2, peak = 0.12, delay = 0) {
  tone(freq, duration, peak, 'sine', delay)
  tone(freq * 2, duration * 0.6, peak * 0.25, 'sine', delay)
}

/** Balloon pop: pitch sweep 240Hz -> 80Hz over 60ms. */
export function playPop() {
  tone(240, 0.06, 0.25, 'triangle', 0, 80)
  tone(120, 0.12, 0.1, 'sine', 0, 40)
}

const MELODY = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25] // C4 D4 E4 G4 A4 C5
let melodyIndex = 0

/** Sequences an acoustic-style arpeggio across user actions. */
export function playNextMelodyNote() {
  const note = MELODY[melodyIndex % MELODY.length]
  melodyIndex += 1
  tone(note, 0.9, 0.1, 'triangle')
  tone(note * 1.5, 0.7, 0.04, 'sine')
}

/** Short ascending celebration run. */
export function playFanfare() {
  const notes = [523.25, 659.25, 783.99, 1046.5]
  notes.forEach((n, i) => playChime(n, 1.0, 0.1, i * 0.12))
}

/** Soft wind puff from filtered noise, used when a candle is blown out. */
export function playWhoosh() {
  const ac = getAudioContext()
  if (!ac) return
  const duration = 0.45
  const buffer = ac.createBuffer(1, Math.floor(ac.sampleRate * duration), ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * 0.6
  const src = ac.createBufferSource()
  src.buffer = buffer
  const filter = ac.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 900
  filter.Q.value = 0.7
  const gain = ac.createGain()
  const t0 = ac.currentTime
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.linearRampToValueAtTime(0.18, t0 + 0.05)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
  src.connect(filter).connect(gain).connect(ac.destination)
  src.start(t0)
  src.stop(t0 + duration)
}

/** Low electric hum followed by a bright chime for the light switch. */
export function playLightsOn() {
  tone(55, 0.5, 0.08, 'sawtooth', 0, 110)
  playChime(659.25, 1.4, 0.1, 0.25)
  playChime(987.77, 1.4, 0.07, 0.4)
}

/** Harp-like pluck for card flips. */
export function playPluck(freq = 659.25) {
  tone(freq, 0.5, 0.1, 'triangle')
  tone(freq * 2, 0.3, 0.03, 'sine')
}
