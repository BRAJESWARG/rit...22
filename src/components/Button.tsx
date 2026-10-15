import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'gold' | 'ghost'

const styles: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-pink-500 to-amber-400 text-slate-950 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:brightness-110',
  gold:
    'bg-gradient-to-r from-amber-300 to-yellow-500 text-slate-950 shadow-lg shadow-amber-400/30 hover:brightness-110',
  ghost:
    'glass text-slate-100 hover:border-pink-400/60 hover:text-white',
}

export function Button({
  variant = 'primary',
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      {...rest}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition duration-300 ease-out active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base ${styles[variant]} ${className}`}
    />
  )
}
