// Divide o texto em palavras com máscara, para animar por palavra com GSAP.
export default function Words({ text }) {
  return text.split(' ').map((w, i) => (
    <span className="mask" key={i}>
      <span className="word">{w}</span>{' '}
    </span>
  ))
}
