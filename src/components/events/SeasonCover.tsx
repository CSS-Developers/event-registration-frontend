import { accraStamp } from '../../lib/dates'
import type { MonthEntry } from './MonthStrip'

interface Props {
  months: MonthEntry[]
  total: number
  liveCount: number
  firstIso?: string
  lastIso?: string
  loading: boolean
  error?: boolean
  searching: boolean
  term: string
  onPick: (id: string) => void
}

/**
 * The programme's cover. Ink, because every reading surface in this design is alabaster and the
 * season deserves one loud page: the title, the season's dates, and a contents list that jumps
 * into the chapters. On narrow screens the contents fold away — the sticky month strip below is
 * the same index, and a phone should reach the first event quickly.
 */
export function SeasonCover({
  months,
  total,
  liveCount,
  firstIso,
  lastIso,
  loading,
  error = false,
  searching,
  term,
  onPick,
}: Props) {
  const first = firstIso ? accraStamp(firstIso) : null
  const last = lastIso ? accraStamp(lastIso) : null

  const season = first && last ? (first.year === last.year ? first.year : `${first.year}/${last.year.slice(2)}`) : null
  const span =
    first && last ? `${first.month.toUpperCase()} ${first.year.slice(2)} → ${last.month.toUpperCase()} ${last.year.slice(2)}` : '—'

  return (
    <section
      aria-labelledby="events-title"
      className="relative isolate overflow-hidden bg-ink"
    >
      <div aria-hidden="true" className="iso-grid pointer-events-none absolute inset-0 opacity-[0.06]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 -left-40 h-[32rem] w-[32rem] rounded-full opacity-[0.22]"
        style={{ background: 'radial-gradient(circle, var(--brand), transparent 65%)' }}
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-10 pb-11 sm:px-6 sm:pt-14 sm:pb-14">
        <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4">
              <p className="label-mono shrink-0 text-[10px] text-ink-muted sm:text-[11px]">
                KNUST CSS — Events
              </p>
              <span aria-hidden="true" className="h-px flex-1 bg-ink-line" />
              <p className="label-mono shrink-0 text-[10px] text-ink-muted sm:text-[11px]">
                {season ? `Season ${season}` : 'Season'}
              </p>
            </div>

            <h1
              id="events-title"
              className="mt-5 font-display text-[clamp(2.9rem,8.6vw,6.25rem)] leading-[0.88] font-black tracking-[-0.035em] text-ink-text"
            >
              What&rsquo;s on
            </h1>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-muted sm:text-[15px]">
              {searching ? (
                <>
                  The index: everything matching{' '}
                  <span className="font-semibold text-ink-text">&ldquo;{term}&rdquo;</span>, flat and
                  in date order.
                </>
              ) : (
                'The society’s whole season, told in order — month by month, soonest first.'
              )}
            </p>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-5">
              <Stat
                value={loading || error ? '—' : String(total)}
                label={searching ? 'Matches' : 'On the calendar'}
              />
              {searching ? (
                <Stat value="Free" label="Entry, no account" className="sm:border-l sm:border-ink-line sm:pl-8" />
              ) : (
                <>
                  <Stat value={span} label="First to last" mono className="sm:border-l sm:border-ink-line sm:pl-8" />
                  {liveCount > 0 ? (
                    <Stat value={String(liveCount)} label="Happening now" className="sm:border-l sm:border-ink-line sm:pl-8" />
                  ) : (
                    <Stat value="Free" label="Entry, no account" className="sm:border-l sm:border-ink-line sm:pl-8" />
                  )}
                </>
              )}
            </div>
          </div>

          {!searching && (
            <div className="mt-10 hidden lg:col-span-5 lg:mt-0 lg:block">
              <div className="flex items-baseline justify-between">
                <p className="label-mono text-[10px] text-ink-muted">Contents</p>
                <p className="label-mono text-[10px] text-ink-muted">
                  {loading || error ? '—' : `${months.length} month${months.length === 1 ? '' : 's'}`}
                </p>
              </div>

              <ol className="mt-3 border-t border-ink-line">
                {loading && months.length === 0
                  ? [0, 1, 2, 3].map((row) => (
                      <li key={row} className="border-b border-ink-line py-3">
                        <span className="skeleton block h-5 w-2/3 rounded bg-ink-raised" />
                      </li>
                    ))
                  : months.map((month, index) => (
                      <li key={month.id} className="border-b border-ink-line">
                        <button
                          type="button"
                          onClick={() => onPick(month.id)}
                          className="group flex w-full items-baseline gap-3 py-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-text"
                        >
                          <span
                            aria-hidden="true"
                            className="label-mono w-5 shrink-0 text-[10px] text-ink-muted"
                          >
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="font-display text-lg leading-none font-semibold tracking-tight text-ink-text">
                            {month.month}{' '}
                            <span className="label-mono align-[0.1em] text-[10px] text-brand">
                              {month.year.slice(2)}
                            </span>
                          </span>
                          <span className="label-mono ml-auto text-[10px] text-ink-muted transition-colors group-hover:text-ink-text">
                            {month.count} event{month.count === 1 ? '' : 's'}
                          </span>
                          <span
                            aria-hidden="true"
                            className="text-ink-muted transition-transform duration-200 group-hover:translate-x-0.5"
                          >
                            →
                          </span>
                        </button>
                      </li>
                    ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function Stat({
  value,
  label,
  mono = false,
  className = '',
}: {
  value: string
  label: string
  mono?: boolean
  className?: string
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <p
        className={`leading-none text-ink-text ${
          mono
            ? 'label-mono text-[12px] tracking-[0.08em] sm:text-[13px]'
            : 'font-display text-2xl font-black tabular-nums'
        }`}
      >
        {value}
      </p>
      <p className="label-mono mt-2 text-[9px] text-ink-muted">{label}</p>
    </div>
  )
}
