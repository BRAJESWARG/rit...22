/**
 * Looping music-box rendition of "Happy Birthday to You", synthesized with the
 * Web Audio API. Nothing is downloaded; every note is an oscillator.
 */
import { getAudioContext } from './synth'

const BPM = 96
const BEAT = 60 / BPM
const LOOP_REST_BEATS = 3

const N = {
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
}

/** [frequency, length in beats] */
const TUNE: Array<[number, number]> = [
  [N.G4, 0.75], [N.G4, 0.25], [N.A4, 1], [N.G4, 1], [N.C5, 1], [N.B4, 2],
  [N.G4, 0.75], [N.G4, 0.25], [N.A4, 1], [N.G4, 1], [N.D5, 1], [N.C5, 2],
  [N.G4, 0.75], [N.G4, 0.25], [N.G5, 1], [N.E5, 1], [N.C5, 1], [N.B4, 1], [N.A4, 2],
  [N.F5, 0.75], [N.F5, 0.25], [N.E5, 1], [N.C5, 1], [N.D5, 1], [N.C5, 3],
]

/** Soft chord pad under each phrase: [frequencies, start beat, length in beats] */
const PADS: Array<[number[], number, number]> = [
  [[261.63, 329.63, 392.0], 1, 5], // C
  [[196.0, 246.94, 392.0], 7, 5], // G
  [[261.63, 329.63, 392.0], 13, 3], // C
  [[174.61, 220.0, 261.63], 16, 4], // F
  [[196.0, 246.94, 293.66], 21, 2], // G
  [[261.63, 329.63, 392.0], 23, 4], // C
]

let master: GainNode | null = null
let timer = 0
let playing = false
let scheduled: OscillatorNode[] = []

function track(osc: OscillatorNode) {
  scheduled.push(osc)
  osc.onended = () => {
    scheduled = scheduled.filter((o) => o !== osc)
  }
}

function musicBoxNote(ac: AudioContext, dest: AudioNode, freq: number, t: number, dur: number) {
  const voices: Array<[number, number, OscillatorType]> = [
    [freq, 1, 'sine'],
    [freq * 2, 0.16, 'sine'],
    [freq * 3, 0.05, 'triangle'],
  ]
  const release = Math.max(0.4, dur * 1.5)
  for (const [f, amp, type] of voices) {
    const osc = ac.createOscillator()
    const g = ac.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(f, t)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.linearRampToValueAtTime(0.075 * amp, t + 0.012)
    g.gain.exponentialRampToValueAtTime(0.0001, t + release)
    osc.connect(g).connect(dest)
    osc.start(t)
    osc.stop(t + release + 0.05)
    track(osc)
  }
}

function padChord(ac: AudioContext, dest: AudioNode, freqs: number[], t: number, dur: number) {
  for (const f of freqs) {
    const osc = ac.createOscillator()
    const g = ac.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(f, t)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.linearRampToValueAtTime(0.012, t + 0.6)
    g.gain.setValueAtTime(0.012, t + Math.max(0.6, dur - 0.5))
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.4)
    osc.connect(g).connect(dest)
    osc.start(t)
    osc.stop(t + dur + 0.5)
    track(osc)
  }
}

/** Schedules one pass of the tune starting at `startAt`; returns when the next pass should begin. */
function scheduleLoop(ac: AudioContext, dest: AudioNode, startAt: number) {
  let t = startAt
  for (const [f, beats] of TUNE) {
    musicBoxNote(ac, dest, f, t, beats * BEAT)
    t += beats * BEAT
  }
  for (const [freqs, atBeat, beats] of PADS) {
    padChord(ac, dest, freqs, startAt + atBeat * BEAT, beats * BEAT)
  }
  return t + LOOP_REST_BEATS * BEAT
}

export function startMusic() {
  const ac = getAudioContext()
  if (!ac || playing) return
  playing = true
  master = ac.createGain()
  master.gain.setValueAtTime(0.0001, ac.currentTime)
  master.gain.linearRampToValueAtTime(1, ac.currentTime + 1.2)
  master.connect(ac.destination)

  let next = ac.currentTime + 0.25
  const tick = () => {
    if (!playing || !master) return
    if (next - ac.currentTime < 1) next = scheduleLoop(ac, master, next)
    timer = window.setTimeout(tick, 500)
  }
  tick()
}

export function stopMusic() {
  if (!playing) return
  playing = false
  window.clearTimeout(timer)
  const ac = getAudioContext()
  const m = master
  master = null
  if (ac && m) {
    const now = ac.currentTime
    m.gain.cancelScheduledValues(now)
    m.gain.setValueAtTime(m.gain.value, now)
    m.gain.linearRampToValueAtTime(0.0001, now + 0.35)
    for (const osc of scheduled) {
      try {
        osc.stop(now + 0.4)
      } catch {
        /* already stopped */
      }
    }
    window.setTimeout(() => m.disconnect(), 600)
  }
  scheduled = []
}

export const isMusicPlaying = () => playing
