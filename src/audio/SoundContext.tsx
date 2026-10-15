import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { SoundCtx, type SoundApi } from './soundCtx'
import { startMusic, stopMusic } from './music'
import {
  getAudioContext,
  peekAudioContext,
  playChime,
  playFanfare,
  playLightsOn,
  playNextMelodyNote,
  playPluck,
  playPop,
  playWhoosh,
  warmUp,
} from './synth'

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true)
  const enabledRef = useRef(enabled)
  useEffect(() => {
    enabledRef.current = enabled
  }, [enabled])

  /** Creates/resumes the AudioContext inside a user gesture and starts the music if sound is on. */
  const unlock = useCallback(() => {
    const ac = getAudioContext()
    if (!ac) return
    warmUp(ac)
    if (enabledRef.current) startMusic()
  }, [])

  // Any first gesture anywhere on the page unlocks audio (browser autoplay policy),
  // and later gestures recover from iOS "interrupted" states.
  useEffect(() => {
    const onGesture = () => unlock()
    const onVisibility = () => {
      const ac = peekAudioContext()
      if (!ac) return
      if (document.hidden) void ac.suspend()
      else if (enabledRef.current) void ac.resume()
    }
    window.addEventListener('pointerdown', onGesture, { passive: true })
    window.addEventListener('touchend', onGesture, { passive: true })
    window.addEventListener('keydown', onGesture)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('pointerdown', onGesture)
      window.removeEventListener('touchend', onGesture)
      window.removeEventListener('keydown', onGesture)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [unlock])

  // Start or stop the background music when the toggle changes.
  useEffect(() => {
    if (enabled) {
      if (peekAudioContext()) startMusic()
    } else {
      stopMusic()
    }
  }, [enabled])

  useEffect(() => () => stopMusic(), [])

  const api = useMemo<SoundApi>(() => {
    const guard =
      <A extends unknown[]>(fn: (...args: A) => void) =>
      (...args: A) => {
        if (!enabled) return
        fn(...args)
      }
    return {
      enabled,
      unlock,
      toggle: () => {
        const ac = getAudioContext()
        if (ac) warmUp(ac)
        const next = !enabledRef.current
        if (next) playChime(783.99, 0.6, 0.08)
        setEnabled(next)
      },
      chime: guard(playChime),
      pop: guard(playPop),
      melody: guard(playNextMelodyNote),
      fanfare: guard(playFanfare),
      whoosh: guard(playWhoosh),
      lightsOn: guard(playLightsOn),
      pluck: guard(playPluck),
    }
  }, [enabled, unlock])

  return <SoundCtx.Provider value={api}>{children}</SoundCtx.Provider>
}
