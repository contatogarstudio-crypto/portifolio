const go = (id) => (e) => {
  e.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
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
