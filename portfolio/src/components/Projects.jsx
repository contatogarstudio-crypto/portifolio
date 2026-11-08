import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import Words from './Words.jsx'
import { projects, contact } from '../data/content.js'

// Se a captura real ainda não existir, mostra só o nome do projeto (sem interface inventada).
const hideBroken = (e) => { e.currentTarget.style.display = 'none' }

function Screen({ src, name }) {
  return (
    <div className="screen">
      <span className="screen-fallback">{name}</span>
      <img src={src} alt={`Captura de tela de ${name}`} loading="lazy" decoding="async" onError={hideBroken} />
    </div>
  )
}

export default function Projects() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.from('.projects-title .word', {
        yPercent: 115, duration: 1, stagger: 0.1, ease: 'power4.out',
        scrollTrigger: { trigger: '.projects-title', start: 'top 80%' },
      })

      // Em telas grandes, mantém o pin cinematográfico original.
      mm.add('(min-width: 901px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray('.proj').forEach((el) => {
          const q = gsap.utils.selector(el)
          gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: el, start: 'top top', end: '+=160%', pin: true, scrub: 1 },
          })
            .fromTo(q('.laptop'),
              { rotateX: 58, rotateY: -28, yPercent: 30, scale: 0.55, opacity: 0 },
              { rotateX: 6, rotateY: -10, yPercent: 0, scale: 1, opacity: 1, duration: 1 }, 0)
            .fromTo(q('.meta > *'), { y: 50, opacity: 0 },
              { y: 0, opacity: 1, stagger: 0.12, duration: 0.6 }, 0.35)
            .fromTo(q('.phone'),
              { xPercent: 120, z: -400, rotateY: 55, rotateZ: 8, yPercent: 30, opacity: 0 },
              { xPercent: 0, z: 140, rotateY: -14, rotateZ: 0, yPercent: 0, opacity: 1, duration: 1 }, 0.9)
            .to(q('.laptop'), { rotateY: 6, scale: 1.04, duration: 0.8 }, 1.9)
            .to(q('.phone'), { rotateY: -4, z: 200, duration: 0.8 }, 1.9)
            .to(q('.scene'), { opacity: 0, yPercent: -12, duration: 0.5 }, 2.7)
            .to(q('.meta'), { opacity: 0, duration: 0.4 }, 2.8)
        })
      })

      // Restaura a entrada 3D original no celular e no tablet.
      // Sem pin: o scroll continua natural, mas o notebook e o celular
      // entram em perspectiva e em momentos diferentes.
      mm.add('(max-width: 900px) and (prefers-reduced-motion: no-preference), (max-height: 719px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray('.proj').forEach((el) => {
          const q = gsap.utils.selector(el)
          gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              end: 'top 12%',
              scrub: 0.7,
              invalidateOnRefresh: true,
            },
          })
            .fromTo(q('.laptop'),
              { rotateX: 58, rotateY: -28, yPercent: 30, scale: 0.55, opacity: 0 },
              { rotateX: 6, rotateY: -10, yPercent: 0, scale: 1, opacity: 1, duration: 1 }, 0)
            .fromTo(q('.meta > *'),
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, stagger: 0.12, duration: 0.6 }, 0.2)
            .fromTo(q('.phone'),
              { xPercent: 120, z: -240, rotateY: 55, rotateZ: 8, yPercent: 30, opacity: 0 },
              { xPercent: 0, z: 100, rotateY: -14, rotateZ: 0, yPercent: 0, opacity: 1, duration: 1 }, 0.8)
            .to(q('.laptop'), { rotateY: 6, scale: 1.03, duration: 0.4 }, 1.65)
            .to(q('.phone'), { rotateY: -4, z: 130, duration: 0.4 }, 1.65)
        })
      })
    }, root)
    return () => { mm.revert(); ctx.revert() }
  }, [])

  return (
    <section className="projects" id="projetos" ref={root}>
      <h2 className="big projects-title"><Words text="PROJETOS" /></h2>

      {projects.map((p, i) => (
        <article className="proj" key={p.slug}>
          <div className="meta">
            <span className="num">{String(i + 1).padStart(2, '0')}</span>
            <small>{p.tag}</small>
            <h3>{p.name}</h3>
            <p>{p.text}</p>
            <a
              className={`btn ${p.url ? '' : 'disabled'}`}
              href={p.url || undefined}
              aria-label={p.url ? `Abrir site de ${p.name} em outra aba` : `Link de ${p.name} indisponível`}
              target="_blank"
              rel="noreferrer noopener"
              aria-disabled={!p.url}
            >
              {p.url ? 'ABRIR SITE' : 'LINK EM BREVE'}
            </a>
          </div>
          <div className="scene">
            <div className="laptop">
              <div className="lid"><Screen src={`/projects/${p.slug}-desktop.png`} name={p.name} /></div>
              <div className="base" />
            </div>
            <div className="phone">
              <Screen src={`/projects/${p.slug}-mobile.png`} name={p.name} />
            </div>
          </div>
        </article>
      ))}

      <footer className="contact" id="contato">
        <h2 className="big">VAMOS CONVERSAR?</h2>
        <a className="btn" href={contact.href || undefined}>CHAMAR NO CONTATO</a>
        <p>© Guilherme Anselmo</p>
      </footer>
    </section>
  )
}
