import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import creams from '../data/creams.js'
import ProductImage from './ProductImage.jsx'
import { useScrollTo } from '../context/ScrollToContext.jsx'
import { SplitTitle } from './TextFx.jsx'

gsap.registerPlugin(ScrollTrigger)

// El primer producto ya es el protagonista de FeaturedShowcase.
const otherCreams = creams.slice(1)

/* Cuánto de la pantalla (ancho / alto) puede ocupar cada título.
   El texto se auto-ajusta para llenar ese espacio. */
const FIT = {
  desktop: { head: { w: 0.94, h: 0.42 }, name: { w: 0.9, h: 0.6 } },
  mobile: { head: { w: 0.94, h: 0.3 }, name: { w: 0.94, h: 0.4 } },
}

export default function MoreProducts() {
  const sectionRef = useRef(null)
  const scrollTo = useScrollTo()

  useLayoutEffect(() => {
    if (otherCreams.length === 0) return

    const root = sectionRef.current
    const mm = gsap.matchMedia()

    mm.add(
      { isDesktop: '(min-width: 768px)', isMobile: '(max-width: 767px)' },
      (context) => {
        const { isDesktop } = context.conditions
        const F = isDesktop ? FIT.desktop : FIT.mobile
        const k = isDesktop ? 1 : 0.7 // menos rotación en celular
        const cleanups = []

        /* ---------- 1. Texto que llena la pantalla ---------- */
        const fitTitles = () => {
          root.querySelectorAll('[data-fit]').forEach((el) => {
            const cfg = F[el.dataset.fit]
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
        cleanups.push(() => ScrollTrigger.removeEventListener('refreshInit', fitTitles))

        /* ---------- 2. Entrada del texto: UNA sola vez (sin scrub) ---------- */
        root.querySelectorAll('[data-reveal]').forEach((el) => {
          const words = el.querySelectorAll('.w')
          const extras = el.querySelectorAll('[data-extra]')

          // Cada línea arranca abajo, rotada 70° y anclada en su esquina inferior izquierda
          gsap.set(words, { yPercent: 110, rotate: 70, transformOrigin: '0% 100%' })
          gsap.set(extras, { y: 30, opacity: 0 })

          const t = gsap
            .timeline({ paused: true })
            .to(words, { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.14, ease: 'power4.out' })
            .to(extras, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' }, '-=0.5')

          ScrollTrigger.create({
            trigger: el,
            start: el.dataset.start || 'top 65%',
            once: true,
            onEnter: () => t.play(),
          })
        })

        /* ---------- 3. Imagen 3D con scrub (sin pin) ---------- */
        root.querySelectorAll('[data-block]').forEach((block) => {
          const i = Number(block.dataset.i)
          const dir = i % 2 === 0 ? 1 : -1 // alterna lados
          const box = block.querySelector('[data-box]')
          const tilt = block.querySelector('[data-tilt]')
          const inner = block.querySelector('[data-inner]')
          const shine = block.querySelector('[data-shine]')

          const baseX = () => (isDesktop ? -dir * window.innerWidth * 0.17 : 0)
          const baseY = () => (isDesktop ? 0 : -window.innerHeight * 0.08)
          const travel = () => window.innerHeight * (isDesktop ? 0.14 : 0.09)

          gsap.set(box, { left: '50%', top: '50%', xPercent: -50, yPercent: -50, transformPerspective: 1100 })

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: block,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })

          // La imagen cruza la pantalla girando en 3D mientras scrolleas
          tl.fromTo(
            box,
            {
              x: baseX,
              y: () => baseY() + travel(),
              rotateX: 14 * k,
              rotateY: dir * 28 * k,
              rotateZ: -dir * 6 * k,
              scale: 0.85,
            },
            {
              x: baseX,
              y: () => baseY() - travel(),
              rotateX: -8 * k,
              rotateY: -dir * 12 * k,
              rotateZ: dir * 3 * k,
              scale: 1.05,
            },
            0
          )
          tl.fromTo(inner, { scale: 1.15 }, { scale: 1 }, 0)
          tl.fromTo(shine, { xPercent: -120 }, { xPercent: 120 }, 0)

          // Inclinación extra con el mouse (solo desktop con mouse)
          if (isDesktop && window.matchMedia('(hover: hover)').matches) {
            gsap.set(tilt, { transformPerspective: 900 })
            const rx = gsap.quickTo(tilt, 'rotationX', { duration: 0.8, ease: 'power3' })
            const ry = gsap.quickTo(tilt, 'rotationY', { duration: 0.8, ease: 'power3' })
            const onMove = (e) => {
              const r = block.getBoundingClientRect()
              ry(((e.clientX - r.left) / r.width - 0.5) * 12)
              rx(-((e.clientY - r.top) / r.height - 0.5) * 8)
            }
            block.addEventListener('mousemove', onMove)
            cleanups.push(() => block.removeEventListener('mousemove', onMove))
          }
        })

        return () => cleanups.forEach((fn) => fn())
      }
    )

    return () => mm.revert()
  }, [])

  if (otherCreams.length === 0) return null

  return (
    <section
      id="mas-productos"
      ref={sectionRef}
      className="relative z-10 overflow-hidden bg-porcelain text-ink transition-colors duration-500 dark:bg-night dark:text-night-text"
    >
      {/* ===================== ENCABEZADO ===================== */}
      <div
        data-reveal
        data-start="top 85%"
        className="flex flex-col items-center px-3 pb-6 pt-24 md:pb-10 md:pt-32"
      >
        <span data-extra className="mb-3 text-sm text-clay dark:text-sage-light md:text-lg">
          También te puede gustar
        </span>
        <SplitTitle lines={['Más cremas', 'de la colección']} fit="head" as="h3" />
      </div>

      {/* ===================== UN BLOQUE (1 PANTALLA) POR PRODUCTO ===================== */}
      {otherCreams.map((c, i) => (
        <article
          key={c.id}
          data-block
          data-i={i}
          data-reveal
          className="relative h-screen w-full overflow-hidden"
        >
          {/* Luz de color detrás de la imagen */}
          <div
            aria-hidden
            className={`pointer-events-none absolute top-1/2 aspect-square w-[70vw] -translate-y-1/2 rounded-full opacity-30 blur-3xl md:w-[34vw] ${i % 2 === 0 ? 'left-1/2 -translate-x-1/2 md:left-[16%]' : 'left-1/2 -translate-x-1/2 md:left-auto md:right-[16%] md:translate-x-0'
              }`}
            style={{ background: c.color }}
          />

          {/* Nombre gigante, detrás de la imagen */}
          <div className="absolute inset-0 z-10 flex items-center justify-center px-3">
            <SplitTitle lines={c.name.split(' ')} fit="name" as="h4" />
          </div>

          {/* Imagen 3D (scrub) */}
          <div
            data-box
            className="absolute z-20 h-[44vh] w-[74vw] md:h-[62vh] md:w-[30vw]"
            style={{ borderRadius: '1.75rem', boxShadow: '0 50px 90px -30px rgba(0,0,0,.5)' }}
          >
            <div
              data-tilt
              className="absolute inset-0 overflow-hidden bg-white/40 dark:bg-white/5"
              style={{ borderRadius: 'inherit' }}
            >
              <div data-inner className="absolute inset-0">
                <ProductImage cream={c} className="absolute inset-0 h-full w-full object-contain" />
              </div>
              <div
                data-shine
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(115deg, transparent 38%, rgba(255,255,255,.38) 50%, transparent 62%)',
                }}
              />
            </div>
          </div>

          {/* Panel de vidrio con la info corta (lado contrario a la imagen en desktop) */}
          <div
            className={`absolute inset-x-4 bottom-5 z-30 md:inset-x-auto md:bottom-12 md:w-[26rem] ${i % 2 === 0 ? 'md:right-12' : 'md:left-12'
              }`}
          >
            <div
              data-extra
              className="rounded-3xl border border-white/30 bg-white/25 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-black/30"
            >
              <span className="block text-sm text-clay dark:text-sage-light">{c.tagline}</span>
              <p className="mt-1 text-base leading-snug text-ink/80 dark:text-night-text/80 md:text-lg">
                {c.shortDesc}
              </p>

              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="font-display text-3xl text-ink dark:text-night-text md:text-4xl">
                  {c.price}
                </span>
                <button
                  onClick={() => scrollTo('#comprar')}
                  className="rounded-full bg-clay px-6 py-3 text-sm tracking-wide text-white transition-colors hover:bg-clay-light"
                >
                  Cómo comprarla
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}