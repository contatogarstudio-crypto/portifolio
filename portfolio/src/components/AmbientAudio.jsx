import { useEffect, useRef, useState } from 'react'
import './AmbientAudio.css'

const TRACK = '/audio/kulakovka-deep-house-267502.mp3'
const VOLUME = 0.12
const FADE = 0.8

export default function AmbientAudio() {
  const audio = useRef(null)
  const engine = useRef(null)
  const pauseTimer = useRef(null)
  const wanted = useRef(false)
  const request = useRef(0)
  const [enabled, setEnabled] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const media = audio.current
    return () => {
      request.current += 1
      clearTimeout(pauseTimer.current)
      media.pause()
      media.removeAttribute('src')
      media.load()
      engine.current?.source.disconnect()
      engine.current?.context.close().catch(() => {})
      engine.current = null
    }
  }, [])

  const fadeTo = (value) => {
    const { context, gain } = engine.current
    const now = context.currentTime
    // GainNode keeps the same low volume on iOS, where media.volume is read-only.
    if (gain.gain.cancelAndHoldAtTime) gain.gain.cancelAndHoldAtTime(now)
    else {
      const current = gain.gain.value
      gain.gain.cancelScheduledValues(now)
      gain.gain.setValueAtTime(current, now)
    }
    gain.gain.linearRampToValueAtTime(value, now + FADE)
  }

  const fail = () => {
    request.current += 1
    wanted.current = false
    clearTimeout(pauseTimer.current)
    audio.current?.pause()
    if (engine.current) {
      const { context, gain } = engine.current
      gain.gain.cancelScheduledValues(context.currentTime)
      gain.gain.setValueAtTime(0, context.currentTime)
    }
    setEnabled(false)
    setError('Não foi possível tocar a música. Toque para tentar novamente.')
  }

  const toggle = async () => {
    const media = audio.current
    const id = ++request.current
    wanted.current = !wanted.current
    clearTimeout(pauseTimer.current)
    setError('')

    if (!wanted.current) {
      setEnabled(false)
      if (engine.current) fadeTo(0)
      pauseTimer.current = setTimeout(() => media.pause(), FADE * 1000)
      return
    }

    try {
      if (!engine.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext
        const context = new AudioContext()
        const gain = context.createGain()
        const source = context.createMediaElementSource(media)
        gain.gain.value = 0
        source.connect(gain)
        gain.connect(context.destination)
        engine.current = { context, source, gain }
      }
      if (!media.getAttribute('src')) media.src = TRACK
      // Both calls start in the visitor's gesture, before the first await.
      await Promise.all([engine.current.context.resume(), media.play()])
      if (request.current !== id) return
      setEnabled(true)
      fadeTo(VOLUME)
    } catch {
      if (request.current === id) fail()
    }
  }

  return (
    <div className="ambient-audio">
      <audio ref={audio} preload="none" loop playsInline onError={fail} />
      <button
        type="button"
        className="ambient-audio-button"
        aria-label={enabled ? 'Desligar música ambiente' : 'Ligar música ambiente'}
        aria-pressed={enabled}
        aria-describedby={error ? 'ambient-audio-status' : undefined}
        title={enabled ? 'Desligar música ambiente' : 'Ligar música ambiente'}
        onClick={toggle}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 5 6 9H3v6h3l5 4V5Z" />
          {enabled ? (
            <>
              <path d="M15 8a6 6 0 0 1 0 8" />
              <path d="M18 5a10 10 0 0 1 0 14" />
            </>
          ) : <path d="m16 9 5 6m0-6-5 6" />}
        </svg>
      </button>
      <span id="ambient-audio-status" className="ambient-audio-status" role="status">{error}</span>
    </div>
  )
}
