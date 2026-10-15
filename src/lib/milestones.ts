/** Ritika's date of birth: 17 October 2004 (local time). */
export const BIRTH_DATE = new Date(2004, 9, 17, 0, 0, 0, 0)

export interface Milestones {
  years: number
  days: number
  hours: number
  minutes: number
  seconds: number
  breaths: number
  heartbeats: number
  daysUntilBirthday: number
  isBirthdayToday: boolean
  nextAge: number
}

export function computeMilestones(now: Date = new Date()): Milestones {
  const elapsedMs = Math.max(0, now.getTime() - BIRTH_DATE.getTime())
  const seconds = Math.floor(elapsedMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  let years = now.getFullYear() - BIRTH_DATE.getFullYear()
  const hadBirthdayThisYear =
    now.getMonth() > BIRTH_DATE.getMonth() ||
    (now.getMonth() === BIRTH_DATE.getMonth() && now.getDate() >= BIRTH_DATE.getDate())
  if (!hadBirthdayThisYear) years -= 1

  const isBirthdayToday =
    now.getMonth() === BIRTH_DATE.getMonth() && now.getDate() === BIRTH_DATE.getDate()

  let next = new Date(now.getFullYear(), BIRTH_DATE.getMonth(), BIRTH_DATE.getDate())
  if (!isBirthdayToday && next.getTime() < now.getTime()) {
    next = new Date(now.getFullYear() + 1, BIRTH_DATE.getMonth(), BIRTH_DATE.getDate())
  }
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const daysUntilBirthday = isBirthdayToday
    ? 0
    : Math.round((next.getTime() - startOfToday.getTime()) / 86_400_000)

  return {
    years,
    days,
    hours,
    minutes,
    seconds,
    breaths: minutes * 16,
    heartbeats: minutes * 72,
    daysUntilBirthday,
    isBirthdayToday,
    nextAge: isBirthdayToday ? years : years + 1,
  }
}

export const formatNumber = (n: number) => new Intl.NumberFormat('en-US').format(n)
