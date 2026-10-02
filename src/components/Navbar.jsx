import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import ThemeToggle from './ThemeToggle.jsx'
import { useScrollTo } from '../context/ScrollToContext.jsx'

const LINKS = [
  { href: '#destacado', label: 'Destacado' },
  { href: '#mas-productos', label: 'Más productos' },
  { href: '#comprar', label: 'Cómo comprar' },
  { href: '#coleccion', label: 'Filosofía' },
]

export default function Navbar() {
  const [ready, setReady] = useState(false) // animación de entrada del header
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const scrollTo = useScrollTo()

  // Entrada del header al cargar la página
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Sección activa (se resalta en el menú de desktop)
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`))
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    LINKS.forEach((l) => {
      const el = document.querySelector(l.href)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  // Bloquea el scroll del fondo mientras el menú está abierto
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  // Cierra con Escape o si la pantalla pasa a desktop
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onResize = () => window.innerWidth >= 768 && setOpen(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  function go(href) {
    if (open) {
      setOpen(false)
      setTimeout(() => scrollTo(href), 80) // espera a liberar el scroll
    } else {
      scrollTo(href)
    }
  }

  const solid = scrolled && !open

  // Portal en <body>: `fixed` siempre relativo a la pantalla, pegado arriba.
  return createPortal(
    <>
      {/* ===================== BARRA SUPERIOR ===================== */}
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${solid
            ? 'border-ink/10 bg-porcelain/85 backdrop-blur-md dark:border-night-text/10 dark:bg-night/85'
            : 'border-transparent bg-transparent'
          }`}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        {/* Entrada: baja y aparece una sola vez al cargar */}
        <div
          className={`transition-[transform,opacity] duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${ready ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
        >
          <div
            className={`flex items-center justify-between px-6 transition-[padding] duration-300 md:grid md:grid-cols-[1fr_auto_1fr] md:px-12 ${scrolled ? 'py-3.5' : 'py-5'
              }`}
          >
            <button
              onClick={() => go('#destacado')}
              className="font-display text-lg tracking-wide text-ink dark:text-night-text md:justify-self-start md:text-xl"
            >
              Terra&nbsp;Crema
            </button>

            {/* Links centrados, con subrayado fino animado y sección activa */}
            <nav className="hidden items-center gap-10 md:flex">
              {LINKS.map((l) => {
                const isActive = active === l.href
                return (
                  <button
                    key={l.href}
                    onClick={() => go(l.href)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative py-1 text-sm tracking-wide transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:bg-clay after:transition-transform after:duration-300 hover:text-ink dark:after:bg-sage-light dark:hover:text-night-text ${isActive
                        ? 'text-ink after:scale-x-100 dark:text-night-text'
                        : 'text-ink/60 after:scale-x-0 hover:after:scale-x-100 dark:text-night-text/60'
                      }`}
                  >
                    {l.label}
                  </button>
                )
              })}
            </nav>

            <div className="flex items-center gap-3 md:justify-self-end">
              <ThemeToggle />

              {/* Hamburguesa: dos líneas que se vuelven X */}
              <button
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={open}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink dark:border-night-text/20 dark:text-night-text md:hidden"
              >
                <span className="relative block h-3 w-5">
                  <span
                    className={`absolute left-0 h-0.5 w-5 bg-current transition-all duration-300 ${open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'
                      }`}
                  />
                  <span
                    className={`absolute left-0 h-0.5 w-5 bg-current transition-all duration-300 ${open ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0'
                      }`}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===================== MENÚ MÓVIL (pantalla completa) =====================
          Entrada: una cortina baja desde arriba y los links suben en cascada.
          Salida: todo se recoge rápido (300 ms) para que no se sienta lento. */}
      <nav
        aria-hidden={!open}
        className={`fixed inset-0 z-40 flex h-[100dvh] w-full flex-col bg-porcelain px-6 pb-8 pt-24 transition-[clip-path] ease-[cubic-bezier(.77,0,.18,1)] dark:bg-night md:hidden ${open
            ? 'pointer-events-auto duration-[450ms] [clip-path:inset(0_0_0_0)]'
            : 'pointer-events-none duration-300 [clip-path:inset(0_0_100%_0)]'
          }`}
      >
        <div className="flex flex-1 flex-col">
          {LINKS.map((l, i) => {
            const delay = 180 + i * 60
            return (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                tabIndex={open ? 0 : -1}
                style={{ transitionDelay: open ? `${delay}ms, ${delay}ms, 0ms` : '0ms' }}
                className={`flex flex-1 items-center border-t border-ink/10 text-left font-display text-[10vw] leading-none transition-[opacity,transform,color] duration-500 last:border-b dark:border-night-text/10 ${open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                  } ${active === l.href
                    ? 'text-clay dark:text-sage-light'
                    : 'text-ink active:text-clay dark:text-night-text dark:active:text-sage-light'
                  }`}
              >
                {l.label}
              </button>
            )
          })}
        </div>

        <div
          style={{ transitionDelay: open ? '460ms' : '0ms' }}
          className={`mt-5 flex items-center justify-between text-xs text-ink/55 transition-opacity duration-500 dark:text-night-text/55 ${open ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <span>Terra Crema</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </nav>
    </>,
    document.body,
  )
}