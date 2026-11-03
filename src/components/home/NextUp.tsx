import { Link } from 'react-router-dom'
import type { PublicEvent } from '../../api/types'
import { formatAccraRange, untilInWords } from '../../lib/dates'
import { DateStamp } from '../ui/DateStamp'
import { Button } from '../ui/Button'
import { MapPinIcon } from '../ui/icons'

interface Props {
  /** The soonest upcoming event, or null once the list has loaded and is empty. */
  event?: PublicEvent | null
  /** True while the list is still on its way. */
  loading?: boolean
}

/**
 * The hero's right half: the one event a visitor should act on now, with the date set as a
 * stamp and a single way in. This is the thing the first screen was missing — a logo alone
 * says who the society is but never what is happening.
 */
export function NextUp({ event, loading = false }: Props) {
  if (loading) {
    return (
      <div className="max-w-md" aria-hidden="true">
        <p className="label-mono text-[11px] text-ink-muted">Next up</p>
        <div className="skeleton mt-4 h-24 w-40 rounded-xl bg-ink-raised" />
        <div className="skeleton mt-5 h-9 w-11/12 rounded-md bg-ink-raised" />
        <div className="skeleton mt-2 h-9 w-7/12 rounded-md bg-ink-raised" />
        <div className="skeleton mt-4 h-4 w-9/12 rounded-md bg-ink-raised" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="max-w-md">
        <p className="label-mono text-[11px] text-ink-muted">Next up</p>
        <p className="mt-4 font-display text-[clamp(1.7rem,3.4vw,2.6rem)] leading-[1.05] font-black text-ink-text">
          Nothing on the calendar yet.
        </p>
        <p className="mt-3 text-sm text-ink-muted">
          The next meetup is being planned. Free events, no account needed.
        </p>
        <Link
          to="/events"
          className="mt-6 inline-block font-bold text-ink-text underline decoration-ink-line underline-offset-4 transition-colors hover:decoration-ink-text"
        >
          Browse past and upcoming events
        </Link>
      </div>
    )
  }

  const soldOut = event.spotsLeft === 0
  const wait = untilInWords(event.startsAt)

  return (
    <div className="max-w-md">
      <div className="flex items-center gap-3">
        <p className="label-mono text-[11px] text-ink-muted">Next up</p>
        <span aria-hidden="true" className="h-px flex-1 bg-ink-line" />
        {wait !== 'started' && (
          <p className="label-mono text-[11px] text-ink-muted">{wait}</p>
        )}
      </div>

      <DateStamp iso={event.startsAt} size="lg" tone="ink" className="mt-5" />

      <h1 className="mt-5 font-display text-[clamp(1.7rem,3.6vw,2.8rem)] leading-[1.03] font-black tracking-tight text-ink-text">
        {event.title}
      </h1>

      <p className="mt-4 flex items-center gap-2 text-sm text-ink-muted">
        <MapPinIcon width={16} height={16} className="shrink-0" />
        <span className="truncate">{event.venue}</span>
      </p>
      <p className="mt-1 text-sm text-ink-muted">{formatAccraRange(event.startsAt, event.endsAt)}</p>

      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
        {soldOut ? (
          <p className="label-mono text-xs text-ink-muted">Sold out</p>
        ) : (
          <Link to={`/events/${event.id}/register`}>
            <Button variant="brand" size="lg">
              Register free
            </Button>
          </Link>
        )}
        <Link
          to={`/events/${event.id}`}
          className="font-bold text-ink-text underline decoration-ink-line underline-offset-4 transition-colors hover:decoration-ink-text"
        >
          Event details
        </Link>
      </div>

      <p className="label-mono mt-5 text-[11px] text-ink-muted">
        {event.spotsLeft} of {event.capacity} spots left
      </p>
    </div>
  )
}
