import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listEvents } from '../../api/events'
import type { PublicEvent } from '../../api/types'
import { Button } from '../ui/Button'
import { formatAccraShort, isHappeningNow } from '../../lib/dates'

type State =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; events: PublicEvent[] }

/** Shown after the scanner key is accepted when the address has no event id: pick the event to scan for. */
export function ScannerEventPicker({ onChangeKey }: { onChangeKey: () => void }) {
  const [state, setState] = useState<State>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    void listEvents(1, 50).then((response) => {
      if (cancelled) return
      setState(response.ok ? { status: 'ready', events: response.data } : { status: 'error' })
    })
    return () => {
      cancelled = true
    }
  }, [attempt])

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-body">Door scanner</p>
          <h1 className="mt-2 text-3xl">Choose an event</h1>
        </div>
        <Button variant="secondary" size="sm" onClick={onChangeKey}>
          Change key
        </Button>
      </div>

      {state.status === 'loading' && (
        <p className="mt-8 text-sm text-body">Loading events… the first load can take a minute.</p>
      )}

      {state.status === 'error' && (
        <div className="mt-8 rounded-3xl border bg-surface-raised p-5 text-center">
          <p className="text-sm font-semibold text-body">Couldn't load the events.</p>
          <Button className="mt-4" onClick={() => { setState({ status: 'loading' }); setAttempt((a) => a + 1) }}>
            Try again
          </Button>
        </div>
      )}

      {state.status === 'ready' && state.events.length === 0 && (
        <p className="mt-8 text-sm text-body">There are no open events to scan for right now.</p>
      )}

      {state.status === 'ready' && state.events.length > 0 && (
        <ul className="mt-6 space-y-3">
          {state.events.map((event) => (
            <li key={event.id}>
              <Link
                to={`/scanner/${event.id}`}
                className="block rounded-3xl border bg-surface-raised p-5 shadow-card transition-colors hover:border-heading"
              >
                <p className="font-display text-xl font-black text-heading">{event.title}</p>
                <p className="mt-1 text-sm text-body">
                  {formatAccraShort(event.startsAt)}
                  {isHappeningNow(event.startsAt, event.endsAt) && (
                    <span className="ml-2 font-bold text-green">Happening now</span>
                  )}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
