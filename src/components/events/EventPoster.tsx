import { useState } from 'react'
import { Link } from 'react-router-dom'
import { absoluteUrl } from '../../api/client'
import type { PublicEvent } from '../../api/types'
import { accraStamp } from '../../lib/dates'

export function EventPoster({ event }: { event: PublicEvent }) {
  const [failed, setFailed] = useState(false)
  const showImage = event.bannerUrl && !failed
  const { year } = accraStamp(event.startsAt)

  return (
    <Link
      to={`/events/${event.id}`}
      aria-label={`View ${event.title}`}
      className="group relative block aspect-[3/4] w-full overflow-hidden rounded-xl border border-border bg-surface-inset shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-heading md:rounded-2xl"
    >
      {showImage ? (
        <img
          src={absoluteUrl(event.bannerUrl!)}
          alt=""
          onError={() => setFailed(true)}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        // No banner: the event still gets a poster, set from its own title on brand blue.
        // Decorative — the title and date are read from the row beside it.
        <div
          aria-hidden="true"
          className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-brand p-2 text-white transition-transform duration-500 group-hover:scale-105 sm:p-2.5 md:p-3"
        >
          <span className="relative z-10 label-mono text-[7px] leading-none text-white/70 md:text-[8px]">
            CSS / {year}
          </span>
          <span className="relative z-10 line-clamp-4 font-display text-[10px] leading-[1.05] font-black tracking-tight text-balance uppercase sm:text-[11px] md:text-sm">
            {event.title}
          </span>
          <span className="relative z-10 label-mono text-[7px] leading-none text-white/70 md:text-[8px]">
            Free entry
          </span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-7 -right-7 h-16 w-16 rounded-full border-4 border-white/15 md:-top-9 md:-right-9 md:h-24 md:w-24 md:border-[6px]"
          />
        </div>
      )}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-1.5 bottom-1.5 flex h-6 w-6 translate-y-1 items-center justify-center rounded-full bg-ink/85 text-[11px] text-ink-text opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
      >
        ↗
      </span>
    </Link>
  )
}
