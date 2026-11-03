import learningImg from '../../visuals/learning.webp'
import hackathonImg from '../../visuals/learning1_hackathon.webp'
import learning6Img from '../../visuals/learning6.webp'
import captainJusticeImg from '../../visuals/sports10_captainJustice.webp'
import trophyLiftImg from '../../visuals/sports2_trophylift.webp'
import trophyImg from '../../visuals/sports8_trophy.webp'

/** The society's own photographs: what the wall shows when events have no banner. */
const PHOTOS = [
  learning6Img,
  learningImg,
  hackathonImg,
  captainJusticeImg,
  trophyImg,
  trophyLiftImg,
]

const TILT = [-2.4, 1.6, -1.2, 2.2, -1.8, 1.1]

interface Props {
  /** Event banners, already resolved to absolute URLs. Shown before the photographs. */
  posters?: string[]
}

/**
 * The wall of posters behind the hero: the term's events, pinned slightly askew and drifting
 * slowly past. It is atmosphere, not content — decorative, hidden from assistive tech, and
 * still under reduced motion (the drift is CSS, which the global rule switches off).
 */
export function PosterWall({ posters = [] }: Props) {
  const tiles = [...posters, ...PHOTOS]
  const strip = [...tiles, ...tiles]

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-0 top-0 flex h-[68%] items-start">
        {/* pr matches the gap so the -50% loop point lands exactly on the second copy. */}
        <div className="animate-marquee flex w-max gap-5 pt-6 pr-5 opacity-90 sm:gap-6 sm:pr-6">
          {strip.map((src, i) => (
            <div
              key={`${src}-${i}`}
              style={{ transform: `rotate(${TILT[i % TILT.length]}deg)` }}
              className={`w-[132px] shrink-0 sm:w-[180px] lg:w-[208px] ${
                i % 2 === 0 ? 'mt-8' : 'mt-0'
              }`}
            >
              <div className="aspect-[3/4] overflow-hidden rounded-lg border border-white/10 bg-ink-raised shadow-[0_18px_40px_-20px_rgba(0,0,0,0.9)]">
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover brightness-110"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two scrims: one settles the wall into the band top and bottom, the other darkens the
          side the words sit on so the wall stays visible around the mark on the left. */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/50 to-ink" />
      <div className="absolute inset-0 bg-gradient-to-l from-ink via-ink/55 to-transparent" />
    </div>
  )
}
