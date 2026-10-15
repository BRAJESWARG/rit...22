import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['Outfit', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        hand: ['Caveat', '"Segoe Script"', 'cursive'],
      },
      colors: {
        midnight: '#020617',
        blush: '#f472b6',
        'rose-glow': '#ec4899',
        champagne: '#fbbf24',
        fairy: '#fcd34d',
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 36px 4px rgba(251, 191, 36, 0.28), 0 20px 50px rgba(0, 0, 0, 0.45)' },
          '50%': { boxShadow: '0 0 70px 14px rgba(251, 191, 36, 0.5), 0 20px 50px rgba(0, 0, 0, 0.45)' },
        },
        flicker: {
          '0%': { transform: 'scale(1) rotate(-2deg)' },
          '50%': { transform: 'scale(1.08, 0.94) rotate(2deg)' },
          '100%': { transform: 'scale(0.94, 1.06) rotate(-1deg)' },
        },
        bob: {
          '0%, 100%': { transform: 'translateY(0) rotate(-1.5deg)' },
          '50%': { transform: 'translateY(-14px) rotate(1.5deg)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.35', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        },
        swipe: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '20%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { transform: 'translateY(70px)', opacity: '0' },
        },
        'stage-in': {
          from: { opacity: '0', transform: 'translateY(18px) scale(0.985)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        rise: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        smoke: {
          '0%': { opacity: '0.8', transform: 'translateY(0) scale(0.6)' },
          '100%': { opacity: '0', transform: 'translateY(-40px) scale(1.8)' },
        },
        pop: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '60%': { transform: 'scale(1.3)', opacity: '1' },
          '100%': { transform: 'scale(0.2)', opacity: '0' },
        },
        fairy: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 6px currentColor)' },
          '50%': { opacity: '0.45', filter: 'drop-shadow(0 0 1px currentColor)' },
        },
        shimmer: {
          from: { backgroundPosition: '200% center' },
          to: { backgroundPosition: '-200% center' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
      },
      animation: {
        glow: 'glow 2.6s ease-in-out infinite',
        flicker: 'flicker 0.32s ease-in-out infinite alternate',
        bob: 'bob 3.2s ease-in-out infinite',
        twinkle: 'twinkle 1.8s ease-in-out infinite',
        swipe: 'swipe 1.6s ease-in-out infinite',
        'stage-in': 'stage-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        rise: 'rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        smoke: 'smoke 1.3s ease-out forwards',
        pop: 'pop 0.25s cubic-bezier(0.2, 0.9, 0.3, 1.4) forwards',
        fairy: 'fairy 1.4s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        wiggle: 'wiggle 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
