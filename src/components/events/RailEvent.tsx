import type { PublicEvent } from '../../api/types'
import { accraStamp } from '../../lib/dates'
import { EventBody } from './EventBody'
import { EventPoster } from './EventPoster'
import { RAIL_GRID } from './rail'

/**
 * One stop on the rail. The date sits on the rule as a small stamp; the poster and the facts hang
 * off it. Deliberately thin — the story is the order, the month's thumbnail carries the feature,
 * and the full description belongs to the detail page.
 */
export function RailEvent({ event, index = 0 }: { event: PublicEvent; index?: number }) {
  const { day, month } = accraStamp(event.startsAt)

  return (
    <li
      className={`${RAIL_GRID} items-start py-5 animate-rise-in md:py-6`}
      style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
    >
      <div className="relative flex justify-center pt-1">
        <div className="relative z-10 flex w-10 flex-col items-center rounded-lg border border-border bg-surface-raised px-1 py-1.5 shadow-card md:w-14">
          <span className="font-display text-lg leading-none font-black text-heading tabular-nums md:text-2xl">
            {Number(day)}
          </span>
          <span className="label-mono mt-1 text-[8px] text-body md:text-[9px]">{month}</span>
        </div>
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-full h-px w-3 bg-body/25 md:w-6"
        />
      </div>

      <div className="flex min-w-0 items-start gap-4 md:gap-6">
        <div className="w-20 shrink-0 md:w-36">
          <EventPoster event={event} />
        </div>
        <EventBody event={event} />
      </div>
    </li>
  )
}
