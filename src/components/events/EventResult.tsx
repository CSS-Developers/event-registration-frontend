import type { PublicEvent } from '../../api/types'
import { EventBody } from './EventBody'
import { EventPoster } from './EventPoster'

/**
 * One result while searching. Same facts as a rail stop, minus the rail and the chapter headings:
 * once you type, the page stops telling a story and starts answering a question — so the list
 * becomes a numbered index.
 */
export function EventResult({ event, index = 0 }: { event: PublicEvent; index?: number }) {
  return (
    <li className="transition-colors hover:bg-surface-raised/60">
      <div className="flex items-start gap-4 py-5 md:gap-6">
        <span
          aria-hidden="true"
          className="label-mono w-6 shrink-0 pt-1 text-[11px] text-soft"
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="w-16 shrink-0 md:w-20">
          <EventPoster event={event} />
        </div>
        <EventBody event={event} />
      </div>
    </li>
  )
}
