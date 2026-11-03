import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'

/* The steps are a real sequence — find it, register, show the code at the door — so they keep
   numbers. They are set as a list, not as cards: the band is the loud beat of the page, and a
   grid of raised panels would break it back up into tiles. */
const STEPS = [
  {
    num: '01',
    title: 'Find an event',
    body: 'Browse the Events page and pick one that interests you.',
  },
  {
    num: '02',
    title: 'Register for free',
    body: 'Just enter your name and email. No account, no payment needed.',
  },
  {
    num: '03',
    title: 'Show your QR at the door',
    body: "You'll get your ticket on screen and by email. Present the QR at check-in.",
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 bg-brand text-white"
      aria-labelledby="how-it-works-title"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="lg:grid lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <p className="label-mono text-[11px]">How it works</p>
            <h2
              id="how-it-works-title"
              className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] leading-[1.02] font-black tracking-tight text-white"
            >
              Three steps,
              <br />
              no account.
            </h2>
            <p className="mt-4 max-w-sm text-white">
              It&rsquo;s quick, free, and you don&rsquo;t need an account to register for an event.
            </p>
          </div>

          <ol className="mt-10 lg:col-span-7 lg:mt-0">
            {STEPS.map((step, i) => (
              <li
                key={step.num}
                className={`flex gap-5 py-6 sm:gap-7 ${i > 0 ? 'border-t border-white/25' : ''} ${
                  i === 0 ? 'pt-0' : ''
                }`}
              >
                <span className="label-mono shrink-0 pt-1 text-sm">{step.num}</span>
                <div className="min-w-0">
                  <h3 className="font-heading text-lg font-black text-white">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-white/25 pt-8">
          <Link to="/events">
            <Button variant="paper" size="lg">
              Browse all events
            </Button>
          </Link>
          <Link
            to="/resend"
            className="font-bold text-white underline decoration-white/50 underline-offset-4 transition-colors hover:decoration-white"
          >
            Lost your ticket?
          </Link>
        </div>
      </div>
    </section>
  )
}
