import type { ReactNode } from 'react'
import type { PublicEvent } from '../../api/types'
import type { Chapter } from './chapters'
import { MonthDoor } from './MonthDoor'
import { NowMarker } from './NowMarker'
import { RailEvent } from './RailEvent'
import { RAIL_GRID, RAIL_LINE } from './rail'

/**
 * The page's body once you are not searching: one rule down the left, a marker for today, and the
 * events hung off it in month chapters. Each chapter opens with a number plate on the rule, the
 * month set large, and an oversized thumbnail card for that month's headliner.
 */
export function SeasonRail({
  chapters,
  next,
  footer,
}: {
  chapters: Chapter[]
  next?: PublicEvent
  footer?: ReactNode
}) {
  return (
    <div className="relative isolate pt-5">
      <span className={RAIL_LINE} aria-hidden="true" />
      <NowMarker next={next} />

      {chapters.map((chapter, chapterIndex) => {
        const globalOffset = chapters
          .slice(0, chapterIndex)
          .reduce((sum, c) => sum + c.events.length, 0)
        const count = chapter.events.length

        return (
          <section key={chapter.id} id={chapter.id} className="scroll-mt-40">
            <h2 className={`${RAIL_GRID} items-start pt-9 pb-4`}>
              <div className="flex justify-center pt-0.5">
                {/* The number is decoration on top of the month it labels, so it stays out of the
                    heading's readable name. */}
                <span
                  aria-hidden="true"
                  className="label-mono grid h-9 w-9 place-items-center rounded-lg bg-ink text-[11px] text-ink-text"
                >
                  {String(chapterIndex + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-display text-[clamp(2rem,4.6vw,3.4rem)] leading-[0.9] font-black tracking-[-0.03em] text-heading">
                    {chapter.month}
                  </span>
                  <span className="label-mono text-[11px] text-brand">{chapter.year}</span>
                  <span className="label-mono ml-auto text-[10px] text-body">
                    {count} event{count === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand" />
                  <span aria-hidden="true" className="h-px flex-1 bg-body/15" />
                </div>
              </div>
            </h2>

            {chapter.events[0] && <MonthDoor event={chapter.events[0]} />}

            <ul>
              {chapter.events.map((event, eventIndex) => (
                <RailEvent
                  key={event.id}
                  event={event}
                  index={globalOffset + eventIndex}
                />
              ))}
            </ul>
          </section>
        )
      })}

      {footer && (
        <div className={`${RAIL_GRID} items-start pt-2`}>
          <div className="flex justify-center pt-2">
            <span
              aria-hidden="true"
              className="h-3 w-3 rounded-full border-2 border-soft/50 bg-surface"
            />
          </div>
          <div className="min-w-0 border-t border-dashed border-body/25 pt-6">{footer}</div>
        </div>
      )}
    </div>
  )
}
