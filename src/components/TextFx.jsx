import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* Título en líneas; cada línea dentro de una máscara para que "suba". */
export function SplitTitle({ lines, fit, as: Tag = 'h2', align = 'items-center text-center', className = '' }) {
  return (
    <Tag
      data-fit={fit}
      style={{ fontSize: '12vw' }}
      className={`flex flex-col font-display leading-[0.86] tracking-tight ${align} ${className}`}
    >
      {lines.map((line, i) => (
        <span className="block overflow-hidden whitespace-nowrap py-[0.04em]" key={i}>
          <span className="w block will-change-transform">{line}</span>
        </span>
      ))}
    </Tag>
  )
}

/*
 * Llamar dentro de gsap.matchMedia().add(...).
 *  - root: elemento contenedor de la sección
 *  - F:    { nombreFit: { w: fracciónAncho, h: fracciónAlto } }
 * Hace dos cosas:
 *  1) Auto-ajusta cada [data-fit] para llenar el espacio asignado.
 *  2) Cada [data-reveal] hace entrar sus líneas (.w) desde abajo con
 *     rotación de 70°, y luego sus [data-extra], UNA sola vez.
 * Devuelve una función de limpieza.
 */
export function initTextFx(root, F) {
  const fitTitles = () => {
    root.querySelectorAll('[data-fit]').forEach((el) => {
      const cfg = F[el.dataset.fit]
      if (!cfg) return
      const W = window.innerWidth * cfg.w
      const H = window.innerHeight * cfg.h
      el.style.fontSize = '100px'
      const lines = [...el.children]
      const widest = Math.max(...lines.map((l) => l.offsetWidth))
      el.style.fontSize = `${Math.min((100 * W) / widest, H / (lines.length * 0.88))}px`
    })
  }
  fitTitles()
  ScrollTrigger.addEventListener('refreshInit', fitTitles)

  root.querySelectorAll('[data-reveal]').forEach((el) => {
    const words = el.querySelectorAll('.w')
    const extras = el.querySelectorAll('[data-extra]')

    gsap.set(words, { yPercent: 110, rotate: 70, transformOrigin: '0% 100%' })
    gsap.set(extras, { y: 30, opacity: 0 })

    const t = gsap
      .timeline({ paused: true })
      .to(words, { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.14, ease: 'power4.out' })
      .to(extras, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' }, '-=0.5')

    ScrollTrigger.create({
      trigger: el,
      start: el.dataset.start || 'top 70%',
      once: true,
      onEnter: () => t.play(),
    })
  })

  return () => {
    ScrollTrigger.removeEventListener('refreshInit', fitTitles)
  }
}
