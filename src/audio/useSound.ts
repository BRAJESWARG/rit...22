import { useContext } from 'react'
import { SoundCtx, type SoundApi } from './soundCtx'

export function useSound(): SoundApi {
  const api = useContext(SoundCtx)
  if (!api) throw new Error('useSound must be used inside <SoundProvider>')
  return api
}
