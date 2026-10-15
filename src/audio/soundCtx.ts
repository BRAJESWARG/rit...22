import { createContext } from 'react'

export interface SoundApi {
  enabled: boolean
  toggle: () => void
  unlock: () => void
  chime: (freq?: number, duration?: number) => void
  pop: () => void
  melody: () => void
  fanfare: () => void
  whoosh: () => void
  lightsOn: () => void
  pluck: (freq?: number) => void
}

export const SoundCtx = createContext<SoundApi | null>(null)
