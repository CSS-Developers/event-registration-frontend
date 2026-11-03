import type { PublicEvent } from '../../api/types'
import { accraTodayLabel, isHappeningNow, untilInWords } from '../../lib/dates'
import { useMinuteTick } from '../../lib/useMinuteTick'
import { RAIL_GRID } from './rail'

/**
 * Where "now" sits on the rail — an ink band cut across the alabaster, because the one thing on
 * this page that is always true is today. The rule stops at the band and picks up again below it.
 * It is the only thing here that moves on its own.
 */
export function NowMarker({ next }: { next?: PublicEvent }) {
  useMinuteTick()

  const live = next ? isHappeningNow(next.startsAt, next.endsAt) : false

  return (
    <div className="-mx-4 sm:-mx-6">
      <div className="bg-ink px-4 py-4 sm:px-6 sm:py-5">
        <div className={`${RAIL_GRID} items-center`}>
          <div className="flex justify-center">
            <span className="relative flex h-2.5 w-2.5">
              <span
                aria-hidden="true"
                className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60 motion-reduce:animate-none"
              />
              <span
                aria-hidden="true"
                className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand ring-4 ring-brand/25"
              />
            </span>
          </div>
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="label-mono text-[10px] text-brand">Today</p>
            <p className="label-mono text-[10px] text-ink-muted">{accraTodayLabel()}</p>
            <span aria-hidden="true" className="hidden h-3 w-px bg-ink-line sm:block" />
            {next ? (
              <p className="min-w-0 text-sm text-ink-muted">
                {live ? 'Happening now · ' : `Next ${untilInWords(next.startsAt)} · `}
                <span className="font-semibold text-ink-text">{next.title}</span>
              </p>
            ) : (
              <p className="text-sm text-ink-muted">Nothing on the calendar yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
