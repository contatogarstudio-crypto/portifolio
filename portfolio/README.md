# Portfólio — Guilherme Anselmo

React + Vite + GSAP (ScrollTrigger).

## Rodar
```bash
npm install
npm run dev      # abre em http://localhost:5173
npm run build    # gera a pasta dist/
```

## O que você precisa adicionar
1. **Avatar**: quadros do olhar em `public/foto-*.webp` (veja a lista em `src/components/Hero.jsx`).
2. **Prints reais** dos sites em `public/projects/` (nomes em `public/projects/README.md`).
3. **Links dos sites e contato** em `src/data/content.js` (`url` de cada projeto e `contact.href`).

Enquanto faltar foto ou print, nada é inventado: a foto some e a tela mostra só o nome do projeto.

## Estrutura
- `src/components/` — Hero, About, Services, Projects (notebook + celular com scroll) e Nav
- `src/data/content.js` — textos, serviços e projetos
- `src/styles.css` — todo o CSS
