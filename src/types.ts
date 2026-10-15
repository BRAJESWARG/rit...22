export type Stage = 1 | 2 | 3 | 4 | 5 | 6

export const STAGES: ReadonlyArray<{ id: Stage; title: string; short: string }> = [
  { id: 1, title: 'The Mystery Envelope', short: 'Envelope' },
  { id: 2, title: 'Shhh... The Dark Room', short: 'Dark room' },
  { id: 3, title: 'Make a Wish', short: 'Wish' },
  { id: 4, title: 'Cut the Cake', short: 'Cake' },
  { id: 5, title: 'The Heart Blossom Tree', short: 'Tree' },
  { id: 6, title: "Ritika's Birthday Lounge", short: 'Lounge' },
]

export interface StageProps {
  onNext: () => void
}
