import { useEffect, useRef, useState } from 'react'
import './AmbientAudio.css'

const TRACK = '/audio/kulakovka-deep-house-267502.mp3'
const FADE = 0.8

export default function AmbientAudio() {
  const audio = useRef(null)
  const engine = useRef(null)
  const pauseTimer = useRef(null)
  const wanted = useRef(false)
  const request = useRef(0)
  const container = useRef(null)
  const volumeRef = useRef(12)
  const [volume, setVolume] = useState(12)
  const [panelOpen, setPanelOpen] = useState(false)
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

  useEffect(() => {
    if (!panelOpen) return
    const onOutside = (event) => {
      if (!container.current?.contains(event.target)) setPanelOpen(false)
    }
    const onEscape = (event) => {
      if (event.key === 'Escape') setPanelOpen(false)
    }
    document.addEventListener('pointerdown', onOutside)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('pointerdown', onOutside)
      document.removeEventListener('keydown', onEscape)
    }
  }, [panelOpen])

  const fadeTo = (value, duration = FADE) => {
    const { context, gain } = engine.current
    const now = context.currentTime
    // GainNode keeps the same low volume on iOS, where media.volume is read-only.
    if (gain.gain.cancelAndHoldAtTime) gain.gain.cancelAndHoldAtTime(now)
    else {
      const current = gain.gain.value
      gain.gain.cancelScheduledValues(now)
      gain.gain.setValueAtTime(current, now)
    }
    gain.gain.linearRampToValueAtTime(value, now + duration)
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
      fadeTo(volumeRef.current / 100)
    } catch {
      if (request.current === id) fail()
    }
  }

  const adjustVolume = (event) => {
    const next = Number(event.target.value)
    volumeRef.current = next
    setVolume(next)
    if (engine.current && wanted.current) fadeTo(next / 100, 0.12)
  }

  return (
    <div className="ambient-audio" ref={container}>
      <audio ref={audio} preload="none" loop playsInline onError={fail} />
      {panelOpen && (
        <div className="ambient-audio-panel" id="ambient-audio-panel" role="group" aria-label="Controles da música ambiente">
          <div className="ambient-audio-header">
            <span>Som ambiente</span>
            <span className="ambient-audio-value">{volume}%</span>
          </div>
          <label className="ambient-audio-label" htmlFor="ambient-audio-volume">Volume</label>
          <input
            id="ambient-audio-volume"
            className="ambient-audio-slider"
            type="range"
            min="0"
            max="100"
            step="1"
            value={volume}
            onChange={adjustVolume}
            style={{ '--volume-level': `${volume}%` }}
            aria-label="Ajustar volume da música"
          />
          <button
            type="button"
            className="ambient-audio-toggle"
            onClick={toggle}
            aria-pressed={enabled}
          >
            {enabled ? 'Pausar música' : 'Reproduzir música'}
          </button>
        </div>
      )}
      <button
        type="button"
        className="ambient-audio-button"
        aria-label="Abrir controles de áudio"
        aria-expanded={panelOpen}
        aria-controls="ambient-audio-panel"
        title="Ajustar áudio ambiente"
        onClick={() => setPanelOpen((open) => !open)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 5 6 9H3v6h3l5 4V5Z" />
          {enabled && volume > 0 ? (
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
