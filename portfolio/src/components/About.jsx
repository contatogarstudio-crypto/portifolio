import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import Words from './Words.jsx'
import { contact } from '../data/content.js'

export default function About() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about h2 .word', {
        yPercent: 115, duration: 1, stagger: 0.12, ease: 'power4.out',
        scrollTrigger: { trigger: root.current, start: 'top 60%' },
      })
      gsap.from('.about p, .about .btn', {
        y: 30, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 45%' },
      })
      gsap.utils.toArray('.float').forEach((el, i) =>
        gsap.to(el, {
          yPercent: (i % 2 ? -1 : 1) * 60, rotate: (i - 1) * 25, ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        }))
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="about" id="sobre" ref={root}>
      <svg className="float f1" viewBox="0 0 100 100" aria-hidden="true"><path d="M70 12a40 40 0 1 0 20 62A34 34 0 0 1 70 12z" /></svg>
      <svg className="float f2" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="38" /><circle cx="37" cy="42" r="4" /><circle cx="63" cy="42" r="4" /><path d="M30 60q20 22 40 0" /></svg>
      <svg className="float f3" viewBox="0 0 100 100" aria-hidden="true"><path d="M20 10l60 38-26 6 16 30-14 8-16-30-20 18z" /></svg>
      <h2 className="big"><Words text="SOBRE MIM" /></h2>
      <div className="about-copy">
        <p>
          Sou Guilherme Anselmo, desenvolvedor web e criador da GAR Studio. Gosto de transformar ideias
          em experiências digitais que unem identidade visual, tecnologia e facilidade de uso.
        </p>
        <p>
          Trabalho com sites, landing pages e sistemas personalizados. Cuido de cada etapa, do design
          e da responsividade ao desenvolvimento e à publicação, buscando criar projetos modernos,
          rápidos e com personalidade. Para mim, cada detalhe importa.
        </p>
      </div>
      <a className="btn" href={contact.href || '#contato'}>FALAR COM O GUILHERME</a>
    </section>
  )
}
