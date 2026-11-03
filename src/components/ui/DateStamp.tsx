import { accraStamp } from '../../lib/dates'

type Size = 'sm' | 'md' | 'lg'
type Tone = 'paper' | 'ink'

const SIZES: Record<Size, { pad: string; day: string; unit: string; gap: string }> = {
  sm: { pad: 'px-2 py-1.5', day: 'text-lg', unit: 'text-[9px]', gap: 'gap-1.5' },
  md: { pad: 'px-3 py-2', day: 'text-2xl', unit: 'text-[10px]', gap: 'gap-2' },
  lg: { pad: 'px-4 py-3', day: 'text-5xl', unit: 'text-[11px]', gap: 'gap-3' },
}

const TONES: Record<Tone, string> = {
  paper: 'border-border bg-surface-raised text-heading',
  ink: 'border-ink-line bg-ink-raised text-ink-text',
}

interface Props {
  iso: string
  size?: Size
  tone?: Tone
  className?: string
}

/**
 * A date set like a stamp: the day at display weight, month and weekday in the mono label
 * layer beside it. Used wherever an event's date has to be read at a glance — the hero's
 * next-up block, the posters, the event page. Always Accra time, like every other date here.
 */
export function DateStamp({ iso, size = 'md', tone = 'paper', className = '' }: Props) {
  const { day, month, weekday } = accraStamp(iso)
  const s = SIZES[size]

  return (
    <div
      className={`inline-flex items-center rounded-xl border leading-none ${s.gap} ${s.pad} ${TONES[tone]} ${className}`}
    >
      <span className={`font-display font-black tabular-nums ${s.day}`}>{day}</span>
      <span className={`flex flex-col gap-1 ${s.unit}`}>
        <span className="label-mono">{month}</span>
        <span className="label-mono opacity-70">{weekday}</span>
      </span>
    </div>
  )
}
