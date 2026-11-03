import { motion, useReducedMotion } from 'motion/react'
import type { PublicEvent } from '../../api/types'
import logoImg from '../../visuals/css_logo.svg'
import { NextUp } from '../home/NextUp'
import { Bot } from './Bot'
import { PosterWall } from './PosterWall'

interface Props {
  /** True when the bot has turned up further down the page: he leaves the hero. */
  botAway?: boolean
  /** The soonest upcoming event, shown beside the mark. */
  nextEvent?: PublicEvent | null
  /** True while the event list is still loading. */
  loading?: boolean
  /** Event banners for the wall behind, already absolute URLs. */
  posters?: string[]
}

/**
 * The settled hero: the society's mark mounted on the wall of the term's posters, with the
 * next event beside it. On ink, because the page opens loud and then settles into alabaster
 * for reading — the same near-black the footer closes with.
 */
export function LogoHero({ botAway = false, nextEvent, loading = false, posters }: Props) {
  const reduced = useReducedMotion()

  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <PosterWall posters={posters} />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-18rem)] max-w-7xl flex-col justify-center gap-12 px-4 py-16 sm:px-6 lg:grid lg:grid-cols-12 lg:items-center lg:gap-14 lg:py-20">
        <motion.div
          className="lg:col-span-6"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div
            className="relative mx-auto w-fit"
            style={{ rotate: '-1.2deg' }}
          >
            <div className="relative rounded-[28px] border border-white/12 bg-surface px-6 py-7 shadow-[0_44px_90px_-44px_rgba(0,0,0,0.95)] sm:px-9 sm:py-9">
              <div className="relative">
                <div
                  className={`absolute bottom-0 left-0 z-0 w-[84px] transition-all duration-400 ease-out sm:w-[132px] lg:w-[164px] ${
                    botAway
                      ? 'pointer-events-none translate-x-[28%] opacity-0'
                      : 'translate-x-0 opacity-100'
                  }`}
                >
                  <Bot color="var(--brand)" wave />
                </div>
                <img
                  src={logoImg}
                  alt="KNUST Computer Science Society"
                  className="relative z-10 h-28 w-auto sm:h-40 lg:h-44"
                />
              </div>
              <p className="mt-3 ps-[0.38em] text-center font-display text-2xl font-light tracking-[0.38em] text-black sm:text-3xl">
                EVENTS
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="lg:col-span-6"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        >
          <NextUp event={nextEvent} loading={loading} />
        </motion.div>
      </div>
    </section>
  )
}
