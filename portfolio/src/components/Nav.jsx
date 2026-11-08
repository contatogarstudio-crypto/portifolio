const go = (id) => (e) => {
  e.preventDefault()
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
}

export default function Nav() {
  return (
    <nav className="nav" aria-label="Principal">
      <a href="#inicio" onClick={go('inicio')}>INÍCIO</a>
      <a href="#projetos" onClick={go('projetos')}>PROJETOS</a>
      <a href="#sobre" onClick={go('sobre')}>SOBRE</a>
      <a href="#contato" onClick={go('contato')}>CONTATO</a>
    </nav>
  )
}
