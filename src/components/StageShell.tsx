import type { ReactNode } from 'react'

interface Props {
  eyebrow?: string
  title?: ReactNode
  children: ReactNode
}

/** Shared wrapper for each stage, including the 600ms entrance transition. */
export function StageShell({ eyebrow, title, children }: Props) {
  return (
    <section className="animate-stage-in">
      {(eyebrow || title) && (
        <div className="mb-6 text-center sm:mb-8">
          {eyebrow && (
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-pink-300/90 sm:text-sm">
              {eyebrow}
            </p>
          )}
          {title && (
            <h1 className="font-display text-[28px] font-bold leading-[1.15] text-white sm:text-4xl lg:text-5xl">
              {title}
            </h1>
          )}
        </div>
      )}
      {children}
    </section>
  )
}
