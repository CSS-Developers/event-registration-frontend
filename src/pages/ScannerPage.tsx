import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { checkIn, verifyScannerKey } from '../api/scanner'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { formatAccraClock } from '../lib/dates'

type ResultTone = 'success' | 'warning' | 'danger' | 'neutral'

type ResultState = {
  tone: ResultTone
  title: string
  detail?: string
}

export function ScannerPage() {
  const { eventId = '' } = useParams()
  // One key per browser session: a scanner key is not tied to an event.
  const storageKey = 'css-scanner-key'

  const [keyValue, setKeyValue] = useState(() => {
    if (typeof window === 'undefined') return ''
    try {
      return window.sessionStorage.getItem(storageKey) ?? ''
    } catch {
      return ''
    }
  })
  const [keyReady, setKeyReady] = useState(Boolean(keyValue))
  const [manualCode, setManualCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [cameraUnsupported, setCameraUnsupported] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [result, setResult] = useState<ResultState | null>(null)
  const [retryAfter, setRetryAfter] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const lastDecodedRef = useRef('')

  // Only a key the backend has accepted is kept; a half-typed or rejected key never reaches storage.
  useEffect(() => {
    try {
      if (keyReady && keyValue) window.sessionStorage.setItem(storageKey, keyValue)
      else window.sessionStorage.removeItem(storageKey)
    } catch {
      // Ignore storage issues; the key stays in memory only.
    }
  }, [keyReady, keyValue, storageKey])

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setCameraOpen(false)
  }, [])

  useEffect(() => () => stopCamera(), [stopCamera])

  const handleCheckIn = useCallback(
    async (ticketCode: string) => {
      const trimmed = ticketCode.trim()
      if (!trimmed || busy || paused || !keyReady) return
      if (lastDecodedRef.current === trimmed) return
      lastDecodedRef.current = trimmed

      setBusy(true)
      setManualCode(trimmed)
      const response = await checkIn(eventId, trimmed, keyValue)
      setBusy(false)

      if (response.ok) {
        setResult({
          tone: 'success',
          title: `Welcome, ${response.data.fullName}`,
          detail: formatAccraClock(response.data.checkedInAt),
        })
        setPaused(true)
        window.setTimeout(() => {
          setPaused(false)
          lastDecodedRef.current = ''
        }, 1400)
        return
      }

      const details = (response as { details?: Record<string, unknown> }).details

      if (response.code === 'RATE_LIMITED') {
        const wait = response.retryAfterSeconds ?? 60
        setRetryAfter(wait)
        setResult({
          tone: 'warning',
          title: `Too many scans. Wait ${wait} seconds.`,
        })
        setPaused(true)
        return
      }

      if (response.code === 'UNAUTHORIZED') {
        setResult({
          tone: 'danger',
          title: 'Wrong or missing access key.',
          detail: 'Ask the organiser for the correct scanner key.',
        })
        setKeyReady(false)
        setKeyValue('')
        setPaused(true)
        return
      }

      if (response.code === 'VALIDATION_ERROR' || response.code === 'NOT_FOUND') {
        setResult({
          tone: 'danger',
          title: 'This scanner is set up for an event that does not exist. Ask the organiser.',
        })
        setPaused(true)
        setKeyReady(false)
        return
      }

      if (response.code === 'TICKET_NOT_FOUND') {
        setResult({ tone: 'danger', title: 'Ticket not recognised.' })
      } else if (response.code === 'TICKET_CANCELLED') {
        setResult({ tone: 'danger', title: 'Ticket cancelled.' })
      } else if (response.code === 'WRONG_EVENT') {
        setResult({ tone: 'danger', title: 'This ticket is for a different event.' })
      } else if (response.code === 'ALREADY_CHECKED_IN') {
        setResult({
          tone: 'warning',
          title: 'Already used',
          detail: `${details?.fullName ?? 'This ticket'} was scanned at ${formatAccraClock(String(details?.checkedInAt ?? new Date().toISOString()))}`,
        })
      } else {
        setResult({ tone: 'warning', title: "Couldn't check this ticket. Try again." })
      }

      setPaused(true)
      window.setTimeout(() => {
        setPaused(false)
        lastDecodedRef.current = ''
      }, 1500)
    },
    [busy, eventId, keyReady, keyValue, paused],
  )

  useEffect(() => {
    if (!keyReady || !eventId) return
    if (retryAfter && retryAfter > 0) {
      const timeout = window.setTimeout(() => {
        setRetryAfter(null)
        setPaused(false)
      }, retryAfter * 1000)
      return () => window.clearTimeout(timeout)
    }
    return undefined
  }, [keyReady, eventId, retryAfter])

  const startCamera = useCallback(async () => {
    if (!('mediaDevices' in navigator) || !('BarcodeDetector' in window)) {
      setCameraUnsupported(true)
      setCameraError('Camera scanning is not available in this browser.')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      })
      streamRef.current = stream
      setCameraOpen(true)
      setCameraUnsupported(false)
      setCameraError(null)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => undefined)
      }
    } catch {
      setCameraOpen(false)
      setCameraError('Camera access was blocked or unavailable.')
    }
  }, [])

  useEffect(() => {
    if (!cameraOpen || !videoRef.current || !('BarcodeDetector' in window)) return

    const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] })
    const intervalId = window.setInterval(async () => {
      if (!videoRef.current || paused || busy) return
      try {
        const codes = await detector.detect(videoRef.current)
        const raw = codes[0]?.rawValue?.trim()
        if (raw) {
          await handleCheckIn(raw)
        }
      } catch {
        // Ignore transient decode errors while the camera is still active.
      }
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [busy, cameraOpen, handleCheckIn, paused])

  const unlock = async () => {
    const key = keyValue.trim()
    if (!key) {
      setResult({ tone: 'danger', title: 'Enter the scanner access key to continue.' })
      return
    }
    setVerifying(true)
    setResult(null)
    const response = await verifyScannerKey(key)
    setVerifying(false)

    if (response.ok) {
      setKeyValue(key)
      setKeyReady(true)
      return
    }
    if (response.code === 'UNAUTHORIZED') {
      setResult({
        tone: 'danger',
        title: 'That key does not work.',
        detail: 'It may be wrong, expired or revoked. Ask the organiser for a valid key.',
      })
    } else if (response.code === 'RATE_LIMITED') {
      setResult({
        tone: 'warning',
        title: `Too many attempts. Wait ${response.retryAfterSeconds ?? 60} seconds.`,
      })
    } else if (response.code === 'NETWORK_ERROR') {
      setResult({ tone: 'warning', title: 'Could not reach the server. Check your connection.' })
    } else {
      setResult({ tone: 'warning', title: "Couldn't check the key. Try again." })
    }
  }

  const onManualSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!manualCode.trim()) return
    await handleCheckIn(manualCode)
  }

  if (!keyReady) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <div className="rounded-3xl border bg-surface-raised p-6 shadow-card">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-heading">Door scanner</p>
          <h1 className="mt-3 text-3xl">Open the check-in page</h1>
          <p className="mt-2 text-sm text-body">Enter the staff access key. It stays in this browser only.</p>
          <form onSubmit={(event) => { event.preventDefault(); void unlock() }} className="mt-6 space-y-4">
            <Input
              label="Access key"
              type="password"
              autoComplete="off"
              value={keyValue}
              onValueChange={setKeyValue}
              placeholder="••••••••••••••••"
            />
            <Button type="submit" className="w-full" disabled={verifying}>
              {verifying ? 'Checking key…' : 'Open scanner'}
            </Button>
          </form>
          {result && (
            <div
              className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                result.tone === 'danger'
                  ? 'border-danger/30 bg-danger-soft text-danger'
                  : result.tone === 'warning'
                    ? 'border-warning/30 bg-warning-soft text-warning'
                    : 'border-green/30 bg-green-soft text-green'
              }`}
            >
              {result.title}
              {result.detail && <div className="mt-1 text-xs opacity-80">{result.detail}</div>}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-body">Event scanner</p>
          <h1 className="mt-2 text-3xl">Check in attendees</h1>
        </div>
        <Button variant="secondary" size="sm" onClick={() => { setKeyReady(false); setKeyValue(''); setResult(null) }}>
          Change key
        </Button>
      </div>

      {result && (
        <div
          className={`mt-6 rounded-3xl border px-5 py-5 text-center ${
            result.tone === 'success'
              ? 'border-green/30 bg-green-soft text-green'
              : result.tone === 'warning'
                ? 'border-warning/30 bg-warning-soft text-warning'
                : 'border-danger/30 bg-danger-soft text-danger'
          }`}
        >
          <p className="font-display text-3xl font-black">{result.title}</p>
          {result.detail && <p className="mt-2 text-sm font-semibold">{result.detail}</p>}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border bg-surface-raised p-5 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-black text-heading">Scan a ticket</h2>
            <Button variant={cameraOpen ? 'ghost' : 'secondary'} size="sm" onClick={() => void startCamera()} disabled={busy || paused}>
              {cameraOpen ? 'Camera live' : 'Use camera'}
            </Button>
          </div>

          {cameraOpen ? (
            <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-black">
              <video ref={videoRef} autoPlay playsInline muted className="aspect-video w-full object-cover" />
            </div>
          ) : (
            <div className="mt-4 flex aspect-video items-center justify-center rounded-2xl border border-dashed border-border bg-surface-inset text-sm text-body">
              {cameraUnsupported ? 'QR scanning is not supported here.' : cameraError ?? 'Camera is off. Use the manual code field.'}
            </div>
          )}

          {retryAfter && retryAfter > 0 && (
            <p className="mt-4 text-sm font-semibold text-warning">Too many scans. Wait {retryAfter} seconds.</p>
          )}
        </div>

        <div className="rounded-3xl border bg-surface-raised p-5 shadow-card">
          <h2 className="font-display text-xl font-black text-heading">Manual check-in</h2>
          <form onSubmit={onManualSubmit} className="mt-4 space-y-4">
            <Input
              label="Ticket code"
              value={manualCode}
              onValueChange={setManualCode}
              placeholder="ABC123XYZ"
              autoComplete="off"
            />
            <Button type="submit" className="w-full" disabled={busy || paused || !manualCode.trim()}>
              {busy ? 'Checking in…' : 'Check in'}
            </Button>
          </form>

          {paused && (
            <p className="mt-3 text-sm font-semibold text-body">Scanning is paused for a moment after the last result.</p>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-border bg-surface-inset p-4 text-sm text-body">
        <p className="font-bold text-heading">Remember</p>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          <li>Never reveal the access key in a public chat or URL.</li>
          <li>Only check in guests for the linked event.</li>
          <li>Use the QR code or the code text from the ticket page.</li>
        </ul>
      </div>

      <div className="mt-6 text-center text-sm text-body">
        <Link to="/events" className="font-bold text-heading hover:underline">Back to events</Link>
      </div>
    </div>
  )
}
