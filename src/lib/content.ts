export const RECIPIENT = 'Ritika'
export const AGE = 22
export const BIRTHDAY_LABEL = 'Oct 17'

export const LETTER = `Dear Ritika,

Twenty-two. Some people say it's just another number, but I think it's a whole new chapter.

You spent the last year growing in ways you probably didn't even notice. The rest of us noticed every bit of it.

This tree grew into a heart because that's what you do to the rooms you walk into. Thank you for the laughter, the late-night talks, and for being exactly who you are.

Here's to a year that gives back everything you keep giving.

Happy birthday. ♡`

export interface MemoryCard {
  id: string
  emoji: string
  title: string
  note: string
  accent: string
}

export const MEMORY_CARDS: MemoryCard[] = [
  {
    id: 'smile',
    emoji: '😊',
    title: 'The Contagious Smile',
    note: 'Nobody stays in a bad mood around you for long. It is physically impossible.',
    accent: 'from-pink-500 to-rose-400',
  },
  {
    id: 'heart',
    emoji: '🦁',
    title: 'The Fearless Heart',
    note: 'You walk into every new thing like you already belong there. Because you do.',
    accent: 'from-amber-400 to-orange-400',
  },
  {
    id: 'grace',
    emoji: '🌙',
    title: 'Unstoppable Grace',
    note: 'Even on the messy days, you carry yourself like it is all part of the plan.',
    accent: 'from-violet-500 to-fuchsia-400',
  },
  {
    id: 'presence',
    emoji: '🔥',
    title: 'The Warmest Presence',
    note: 'Being near you feels like candlelight. Calm, warm, and impossible to ignore.',
    accent: 'from-sky-400 to-teal-300',
  },
]

export const FORTUNES: string[] = [
  'Twenty-two will hand you a door you did not know existed. Walk through it.',
  'Someone is going to say "I knew you could" this year. Let them be right.',
  'Your laugh is about to be someone\'s favourite sound. Keep laughing loudly.',
  'A small yes in the next few months will change the shape of the whole year.',
  'The thing you are nervous about is the thing you will be proudest of.',
  'This year, you collect people who feel like home. Keep them close.',
  'Rest is not falling behind. Twenty-two learns this early.',
  'You will surprise yourself before the next candle gets lit.',
]

export interface Balloon {
  id: string
  color: string
  highlight: string
  delay: string
}

export const BALLOONS: Balloon[] = [
  { id: 'b1', color: '#f472b6', highlight: '#fbcfe8', delay: '0s' },
  { id: 'b2', color: '#fbbf24', highlight: '#fde68a', delay: '0.5s' },
  { id: 'b3', color: '#a78bfa', highlight: '#ddd6fe', delay: '1s' },
  { id: 'b4', color: '#38bdf8', highlight: '#bae6fd', delay: '1.5s' },
]
