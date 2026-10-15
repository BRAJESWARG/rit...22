import { useEffect, useState } from 'react'

interface Props {
  text: string
  /** Milliseconds per character. */
  speed?: number
  runId: number
  startDelay?: number
  onDone?: () => void
  className?: string
}

/** Types text out one character at a time with a blinking caret. */
export function Typewriter({ text, speed = 25, runId, startDelay = 0, onDone, className = '' }: Props) {
  const [count, setCount] = useState(0)
  const done = count >= text.length

  useEffect(() => {
    setCount(0)
    let interval = 0
    const timeout = window.setTimeout(() => {
      interval = window.setInterval(() => {
        setCount((c) => {
          if (c + 1 >= text.length) {
            window.clearInterval(interval)
            return text.length
          }
          return c + 1
        })
      }, speed)
    }, startDelay)
    return () => {
      window.clearTimeout(timeout)
      window.clearInterval(interval)
    }
  }, [text, speed, runId, startDelay])

  useEffect(() => {
    if (done) onDone?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  return (
    <p className={`whitespace-pre-wrap ${className}`} aria-live="polite">
      {text.slice(0, count)}
      {!done && <span className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-pink-300 align-middle" aria-hidden />}
    </p>
  )
}
