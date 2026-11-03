import { useState } from 'react'
import { Link } from 'react-router-dom'
import { absoluteUrl } from '../../api/client'
import type { PublicEvent } from '../../api/types'
import { accraDateParts } from '../../lib/dates'
import { DateStamp } from '../ui/DateStamp'

/**
 * The oversized card that opens a month: the chapter's thumbnail. With a banner it is the
 * event's own poster, full bleed. Without one the card is still a poster — brand blue, the
 * month set large, the headliner's date as a stamp — because a missing image should never
 * look like a missing design. It is an overture above the rail, not a replacement for the stops.
 */
export function MonthDoor({
  kicker = 'Featured this month',
  event,
}: {
  kicker?: string
  event: PublicEvent
}) {
  const [failed, setFailed] = useState(false)
  const showImage = event.bannerUrl && !failed
  const parts = accraDateParts(event.startsAt)

  return (
    <div className="group relative mb-3 aspect-[4/3] max-h-[30rem] w-full overflow-hidden rounded-2xl sm:aspect-[16/9]">
      {showImage ? (
        <img
          src={absoluteUrl(event.bannerUrl!)}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      ) : (
        <div
          aria-hidden="true"
          className="relative h-full w-full overflow-hidden bg-brand"
        >
          <div className="iso-grid absolute inset-0 opacity-[0.18]" />
          <div
            className="absolute -top-24 -right-20 h-96 w-96 rounded-full border-[10px] border-white/15"
          />
          <span className="absolute right-4 -bottom-10 font-display text-[11rem] leading-none font-black text-white/10 tabular-nums sm:text-[15rem]">
            {parts.day}
          </span>
        </div>
      )}

      {showImage && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10"
        />
      )}

      <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <p className="label-mono text-[10px] text-white/85 sm:text-[11px]">
            {kicker}
          </p>
          {!showImage && (
            <DateStamp
              iso={event.startsAt}
              size="md"
              tone="ink"
              className="hidden sm:inline-flex"
            />
          )}
        </div>

        <div className="max-w-xl">
          <Link
            to={`/events/${event.id}`}
            className="text-balance font-display text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[0.98] font-black tracking-tight text-white transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {event.title}
          </Link>
          <p className="mt-2 text-sm font-semibold text-white/90 sm:text-[15px]">
            {parts.weekday} {Number(parts.day)} {parts.month} · {event.venue}
          </p>
        </div>
      </div>
    </div>
  )
}
