import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import Words from './Words.jsx'
import { contact } from '../data/content.js'

// Quadros do avatar: a cabeça e o corpo são IDÊNTICOS em todos, só o olhar muda.
// Arquivos em public/foto-<nome>.webp. Os que não existirem são ignorados.
// [nome, direção x, direção y] (x: -1 esquerda da tela, y: -1 cima)
const gaze = [
  ['centro', 0, 0],
  ['cima', 0, -1], ['baixo', 0, 1], ['esquerda', -1, 0], ['direita', 1, 0],
  ['cima-esquerda', -1, -1], ['cima-direita', 1, -1], ['baixo-esquerda', -1, 1], ['baixo-direita', 1, 1],
]
const extras = ['fechado', 'piscada'] // olhos fechados (pisca sozinho) e careta de piscada (clique)
const all = [...gaze.map((g) => g[0]), ...extras]

// Quadro inicial: "centro" se existir; senão "baixo"; senão o primeiro que carregar.
const rank = (n) => { const i = ['centro', 'baixo'].indexOf(n); return i < 0 ? 9 : i }
const firstFrame = (e) => {
  const el = e.currentTarget
  const on = el.closest('.tilt').querySelector('.on')
  if (!on) el.classList.add('on')
  else if (rank(el.dataset.f) < rank(on.dataset.f)) { on.classList.remove('on'); el.classList.add('on') }
}

export default function Hero() {
  const root = useRef(null)

  useLayoutEffect(() => {
    let onMove, onDown, blink
    const ctx = gsap.context(() => {
      // Entrada da primeira tela: títulos, foto, CTA e menu em sequência.
      // fromTo explicita o estado inicial, inclusive após o refresh do Vite.
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.fromTo('.hero .word',
        { yPercent: 115 },
        { yPercent: 0, duration: 1.1, stagger: 0.12 }, 0)
        .fromTo('.tilt',
          { yPercent: 40, opacity: 0, scale: 0.92 },
          { yPercent: 0, opacity: 1, scale: 1, duration: 1.3 }, 0.5)
        .fromTo('.hero-tag, .hero .btn',
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.15 }, 1.1)
        .fromTo(document.querySelectorAll('.nav a'),
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 }, 0.9)
      gsap.to('.hero-photo', {
        scale: 1.05, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const img = (n) => root.current.querySelector(`img[data-f="${n}"]`)
      const has = (n) => { const e = img(n); return !!e && e.complete && e.naturalWidth > 0 }
      const current = () => root.current.querySelector('.tilt .on')?.dataset.f
      let held = null
      const show = (n) => {
        const c = current()
        if (!has(n) || n === c) return
        img(c)?.classList.remove('on'); img(n).classList.add('on')
      }
      const gazeFrame = (e) => {
        const r = root.current.querySelector('.tilt').getBoundingClientRect()
        const vx = e.clientX - (r.left + r.width / 2)
        const vy = e.clientY - (r.top + r.height * 0.42) // altura aproximada dos olhos
        const len = Math.hypot(vx, vy)
        if (len < Math.min(r.width, r.height) * 0.12) return 'centro'
        let best = 'centro', score = -2
        gaze.slice(1).forEach(([n, dx, dy]) => {
          if (!has(n)) return
          const s = (vx * dx + vy * dy) / (len * Math.hypot(dx, dy))
          if (s > score) { score = s; best = n }
        })
        return best
      }
      onMove = (e) => { if (!held) show(gazeFrame(e)) }
      onDown = () => {
        if (!has('piscada')) return
        held = 'piscada'; const back = current(); show('piscada')
        gsap.delayedCall(0.6, () => { held = null; show(back) })
      }
      const loop = () => {
        if (!held && has('fechado')) {
          held = 'fechado'; const back = current(); show('fechado')
          gsap.delayedCall(0.14, () => { held = null; show(back) })
        }
        blink = gsap.delayedCall(gsap.utils.random(3, 6), loop)
      }
      blink = gsap.delayedCall(3, loop)
      // Evita piscadas e mudanças de olhar disparadas pelo toque ao rolar no celular.
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        window.addEventListener('pointermove', onMove)
        window.addEventListener('pointerdown', onDown)
      }
    }, root)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      ctx.revert()
    }
  }, [])

  return (
    <section className="hero" id="inicio" ref={root}>
      <h1>
        <span className="line"><Words text="OLÁ, SOU" /></span>
        <span className="line"><Words text="GUILHERME ANSELMO" /></span>
      </h1>
      <div className="hero-photo">
        <div className="tilt">
          {all.map((f) => (
            <img key={f} data-f={f} onLoad={firstFrame} src={`/foto-${f}.webp`} alt={f === 'centro' ? 'Guilherme Anselmo' : ''} />
          ))}
        </div>
      </div>
      <p className="hero-tag">Criando sites e sistemas web de alto impacto, com design forte e código limpo.</p>
      <a className="btn" href={contact.href || '#contato'}>FALE COMIGO</a>
    </section>
  )
}
