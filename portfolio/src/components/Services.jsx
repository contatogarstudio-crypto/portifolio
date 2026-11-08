import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import Words from './Words.jsx'
import { services } from '../data/content.js'

export default function Services() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.services h2 .word', {
        yPercent: 115, duration: 1, stagger: 0.1, ease: 'power4.out',
        scrollTrigger: { trigger: root.current, start: 'top 55%' },
      })
      gsap.utils.toArray('.service').forEach((el) =>
        gsap.from(el, {
          y: 60, opacity: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        }))
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="services" ref={root}>
      <h2 className="big"><Words text="SERVIÇOS" /></h2>
      <ol>
        {services.map((s, i) => (
          <li className="service" key={s.title}>
            <span className="num">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
