import { useCallback, useState } from 'react'
import { SoundProvider } from './audio/SoundContext'
import { Header } from './components/Header'
import { Starfield } from './components/Starfield'
import { BlossomTreeStage } from './components/stages/BlossomTreeStage'
import { CakeCutStage } from './components/stages/CakeCutStage'
import { CandlesStage } from './components/stages/CandlesStage'
import { DarkRoomStage } from './components/stages/DarkRoomStage'
import { EnvelopeStage } from './components/stages/EnvelopeStage'
import { LoungeStage } from './components/stages/LoungeStage'
import type { Stage } from './types'

function initialStage(): Stage {
  if (typeof window === 'undefined') return 1
  const n = Number(new URLSearchParams(window.location.search).get('stage'))
  return n >= 1 && n <= 6 ? (Math.floor(n) as Stage) : 1
}

export default function App() {
  const [stage, setStage] = useState<Stage>(initialStage)
  const [maxStage, setMaxStage] = useState<Stage>(stage)

  const go = useCallback((next: Stage) => {
    setStage(next)
    setMaxStage((m) => (next > m ? next : m))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <SoundProvider>
      <Starfield />
      <Header stage={stage} maxStage={maxStage} onJump={go} />
      <main className="relative z-10 mx-auto w-full max-w-2xl px-4 pb-[max(3rem,env(safe-area-inset-bottom))] pt-32 sm:pt-32 md:pt-24 lg:max-w-6xl lg:px-8">
        <div key={stage}>
          {stage === 1 && <EnvelopeStage onNext={() => go(2)} />}
          {stage === 2 && <DarkRoomStage onNext={() => go(3)} />}
          {stage === 3 && <CandlesStage onNext={() => go(4)} />}
          {stage === 4 && <CakeCutStage onNext={() => go(5)} />}
          {stage === 5 && <BlossomTreeStage onNext={() => go(6)} />}
          {stage === 6 && <LoungeStage onRestart={() => go(1)} />}
        </div>
      </main>
    </SoundProvider>
  )
}
