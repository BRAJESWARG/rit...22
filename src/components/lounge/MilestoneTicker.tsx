import { useEffect, useState } from 'react'
import { computeMilestones, formatNumber } from '../../lib/milestones'
import { RECIPIENT } from '../../lib/content'

export function MilestoneTicker() {
  const [m, setM] = useState(() => computeMilestones())

  useEffect(() => {
    const id = window.setInterval(() => setM(computeMilestones()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const stats = [
    { label: 'Days alive', value: formatNumber(m.days), emoji: '🌅' },
    { label: 'Hours of being awesome', value: formatNumber(m.hours), emoji: '⏳' },
    { label: 'Minutes (and counting)', value: formatNumber(m.minutes), emoji: '⏱️' },
    { label: 'Breaths taken, roughly', value: formatNumber(m.breaths), emoji: '🌬️' },
    { label: 'Heartbeats, roughly', value: formatNumber(m.heartbeats), emoji: '💗' },
    {
      label: m.isBirthdayToday ? 'Today is the day' : `Days until ${m.nextAge}`,
      value: m.isBirthdayToday ? '🎉' : formatNumber(m.daysUntilBirthday),
      emoji: '🎂',
    },
  ]

  return (
    <section aria-labelledby="ticker-title" className="glass rounded-3xl p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-pink-300/90">Live milestone ticker</p>
          <h2 id="ticker-title" className="font-display text-2xl font-bold text-white sm:text-3xl">
            {RECIPIENT} in numbers
          </h2>
        </div>
        <p className="font-hand text-xl text-amber-200">
          {m.years} years young · born Oct 17, 2004
        </p>
      </div>
      <dl className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3 sm:p-4">
            <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
              <span aria-hidden>{s.emoji}</span>
              {s.label}
            </dt>
            <dd className="mt-1 font-sans text-xl font-bold tabular-nums tracking-tight text-white sm:text-2xl">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
