import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import creams from '../data/creams.js'
import ProductImage from './ProductImage.jsx'
import Marquee from './Marquee.jsx'
import { useScrollTo } from '../context/ScrollToContext.jsx'

gsap.registerPlugin(ScrollTrigger)

const cream = creams[0]
const PIN_SCREENS = 3 // duración (en pantallas) de toda la secuencia

/* Helpers: valores en px calculados al vuelo (se recalculan en resize
   gracias a invalidateOnRefresh). Así no dependemos de unidades vh/svh
   que cambian con la barra del navegador en celular. */
const vw = (n) => () => (n * window.innerWidth) / 100
const vh = (n) => () => (n * window.innerHeight) / 100

/* Estados de la imagen (3D) por breakpoint.
   x / y son desplazamientos desde el centro de la pantalla. */
const STATES = {
  desktop: {
    s1: { x: vw(0), y: vh(24), width: vw(44), height: vh(58), rotateX: 14, rotateY: -12, rotateZ: -5, borderRadius: '2.5rem' },
    s2: { x: vw(24), y: vh(2), width: vw(26), height: vh(62), rotateX: 4, rotateY: -24, rotateZ: 3, borderRadius: '1.75rem' },
    s3: { x: vw(0), y: vh(-4), width: vw(40), height: vh(72), rotateX: -6, rotateY: 8, rotateZ: 0, borderRadius: '2rem' },
  },
  mobile: {
    s1: { x: vw(0), y: vh(27), width: vw(80), height: vh(44), rotateX: 16, rotateY: -14, rotateZ: -5, borderRadius: '2rem' },
    s2: { x: vw(0), y: vh(-20), width: vw(64), height: vh(34), rotateX: 6, rotateY: 22, rotateZ: 2, borderRadius: '1.5rem' },
    s3: { x: vw(0), y: vh(-12), width: vw(82), height: vh(46), rotateX: -6, rotateY: 0, rotateZ: 0, borderRadius: '1.75rem' },
  },
}

/* Qué tanto de la pantalla (ancho / alto) puede ocupar cada título.
   El título se auto-ajusta para llenar ese espacio. */
const FIT = {
  desktop: { hero: { w: 0.94, h: 0.5 }, detail: { w: 0.46, h: 0.42 }, full: { w: 0.9, h: 0.6 } },
  mobile: { hero: { w: 0.94, h: 0.34 }, detail: { w: 0.92, h: 0.2 }, full: { w: 0.94, h: 0.42 } },
}

/* Título: una palabra por línea, cada una dentro de una máscara
   (overflow-hidden) para que "suba" desde abajo. */
function SplitTitle({ text, fit, as: Tag = 'h2', align = 'items-center text-center', className = '' }) {
  return (
    <Tag
      data-fit={fit}
      style={{ fontSize: '12vw' }}
      className={`flex flex-col font-display leading-[0.86] tracking-tight ${align} ${className}`}
    >
      {text.split(' ').map((word, i) => (
        <span className="block overflow-hidden py-[0.04em]" key={i}>
          <span className="w block will-change-transform">{word}</span>
        </span>
      ))}
    </Tag>
  )
}

export default function FeaturedShowcase() {
  const sectionRef = useRef(null)
  const blobRef = useRef(null)
  const imgBoxRef = useRef(null)
  const tiltRef = useRef(null)
  const innerImgRef = useRef(null)
  const shineRef = useRef(null)

  const scrollTo = useScrollTo()

  useLayoutEffect(() => {
    const root = sectionRef.current
    const mm = gsap.matchMedia()

    mm.add(
      { isDesktop: '(min-width: 768px)', isMobile: '(max-width: 767px)' },
      (context) => {
        const { isDesktop } = context.conditions
        const S = isDesktop ? STATES.desktop : STATES.mobile
        const F = isDesktop ? FIT.desktop : FIT.mobile

        /* ---------- 1. Auto-ajuste de títulos (texto que llena la pantalla) ---------- */
        const fitTitles = () => {
          root.querySelectorAll('[data-fit]').forEach((el) => {
            const cfg = F[el.dataset.fit]
            const W = window.innerWidth * cfg.w
            const H = window.innerHeight * cfg.h
            el.style.fontSize = '100px'
            const words = [...el.children]
            const widest = Math.max(...words.map((w) => w.offsetWidth))
            const size = Math.min((100 * W) / widest, H / (words.length * 0.88))
            el.style.fontSize = `${size}px`
          })
        }
        fitTitles()
        ScrollTrigger.addEventListener('refreshInit', fitTitles)

        /* ---------- 2. Actos de texto: entran UNA sola vez (no scrub) ---------- */
        const makeAct = (n) => {
          const els = [...root.querySelectorAll(`[data-act="${n}"]`)]
          const words = els.flatMap((e) => [...e.querySelectorAll('.w')])
          const extras = els.flatMap((e) => [...e.querySelectorAll('[data-extra]')])

          // Cada palabra arranca abajo y rotada 70°, anclada en su esquina inferior izquierda
          gsap.set(words, { yPercent: 110, rotate: 70, transformOrigin: '0% 100%' })
          gsap.set(extras, { y: 30, opacity: 0 })

          const t = gsap
            .timeline({ paused: true })
            .to(words, { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.14, ease: 'power4.out' })
            .to(extras, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' }, '-=0.5')

          return { els, t, played: false }
        }

        const acts = [makeAct(0), makeAct(1), makeAct(2)]
        const play = (n) => {
          if (acts[n].played) return
          acts[n].played = true
          acts[n].t.play()
        }

        // Los actos 2 y 3 empiezan ocultos; el hero visible
        gsap.set(acts[1].els.concat(acts[2].els), { autoAlpha: 0 })

        /* ---------- 3. Entrada de la imagen + vida propia ---------- */
        gsap.set(imgBoxRef.current, {
          left: '50%',
          top: '50%',
          xPercent: -50,
          yPercent: -50,
          transformPerspective: 1100,
          ...S.s1,
        })

        gsap.fromTo(
          tiltRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 1.3, ease: 'power3.out', delay: 0.1 }
        )

        // Balanceo suave (en el hijo, no pelea con el scrub del padre)
        gsap.to(tiltRef.current, { y: 10, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 })

        gsap.delayedCall(0.35, () => play(0))

        /* ---------- 4. Inclinación 3D con el mouse (solo desktop con mouse) ---------- */
        let onMove
        if (isDesktop && window.matchMedia('(hover: hover)').matches) {
          gsap.set(tiltRef.current, { transformPerspective: 900 })
          const rx = gsap.quickTo(tiltRef.current, 'rotationX', { duration: 0.8, ease: 'power3' })
          const ry = gsap.quickTo(tiltRef.current, 'rotationY', { duration: 0.8, ease: 'power3' })
          onMove = (e) => {
            ry((e.clientX / window.innerWidth - 0.5) * 14)
            rx(-(e.clientY / window.innerHeight - 0.5) * 10)
          }
          root.addEventListener('mousemove', onMove)
        }

        /* ---------- 5. Timeline principal: pin + scrub (100% la imagen) ---------- */
        gsap.set(innerImgRef.current, { scale: 1.15 })
        gsap.set(shineRef.current, { xPercent: -120 })

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: () => `+=${window.innerHeight * PIN_SCREENS}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // Dispara cada acto de texto la primera vez que se llega a él
              const t = self.progress * PIN_SCREENS
              if (t >= 0.85) play(1)
              if (t >= 2.05) play(2)
            },
          },
        })

        // ACTO 1 → 2
        tl.to(imgBoxRef.current, { ...S.s2, ease: 'power2.inOut', duration: 0.6 }, 0.6)
        tl.to(acts[0].els, { autoAlpha: 0, duration: 0.3 }, 0.6)
        tl.to(acts[1].els, { autoAlpha: 1, duration: 0.3 }, 0.9)

        // ACTO 2 → 3
        tl.to(imgBoxRef.current, { ...S.s3, ease: 'power2.inOut', duration: 0.6 }, 1.8)
        tl.to(acts[1].els, { autoAlpha: 0, duration: 0.3 }, 1.8)
        tl.to(acts[2].els, { autoAlpha: 1, duration: 0.3 }, 2.1)

        // Capas que viajan durante TODO el scroll: reflejo, zoom interno y luz de fondo
        tl.to(shineRef.current, { xPercent: 120, duration: PIN_SCREENS }, 0)
        tl.to(innerImgRef.current, { scale: 1, duration: PIN_SCREENS }, 0)
        tl.to(
          blobRef.current,
          { x: () => window.innerWidth * 0.55, y: () => window.innerHeight * 0.35, scale: 1.5, duration: PIN_SCREENS },
          0
        )

        // Estira el timeline hasta PIN_SCREENS
        tl.set({}, {}, PIN_SCREENS)

        return () => {
          ScrollTrigger.removeEventListener('refreshInit', fitTitles)
          if (onMove) root.removeEventListener('mousemove', onMove)
        }
      }
    )

    return () => mm.revert()
  }, [])

  return (
    <>
      <section id="destacado" />

      <div
        ref={sectionRef}
        className="relative h-screen w-full overflow-hidden bg-porcelain dark:bg-night transition-colors duration-500"
      >
        {/* Luz de color que se desplaza con el scroll */}
        <div
          ref={blobRef}
          aria-hidden
          className="pointer-events-none absolute -top-40 -left-40 h-[34rem] w-[34rem] rounded-full opacity-30 blur-3xl"
          style={{ background: cream.color }}
        />

        {/* ===================== IMAGEN 3D (scrub) ===================== */}
        <div
          ref={imgBoxRef}
          className="absolute z-20"
          style={{ boxShadow: '0 50px 90px -30px rgba(0,0,0,.5)' }}
        >
          <div
            ref={tiltRef}
            className="absolute inset-0 overflow-hidden bg-white/40 dark:bg-white/5"
            style={{ borderRadius: 'inherit' }}
          >
            <div ref={innerImgRef} className="absolute inset-0">
              <ProductImage cream={cream} className="absolute inset-0 h-full w-full object-contain" />
            </div>
            {/* Reflejo que barre la imagen mientras scrolleas (da volumen) */}
            <div
              ref={shineRef}
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(115deg, transparent 38%, rgba(255,255,255,.38) 50%, transparent 62%)',
              }}
            />
          </div>
        </div>

        {/* ===================== ACTO 1 — HERO ===================== */}
        <div
          data-act="0"
          className="absolute inset-0 z-10 flex flex-col items-center px-3 pt-24 md:pt-[11vh] text-ink dark:text-night-text"
        >
          <span data-extra className="mb-2 text-sm md:text-lg text-ink/60 dark:text-night-text/60">
            Crema
          </span>

          <SplitTitle text={cream.name} fit="hero" as="h1" />

          <Marquee
            text="Terra Crema"
            className="absolute bottom-10 left-0 right-0 text-ink/10 dark:text-night-text/10"
          />
        </div>

        <p
          data-act="0"
          data-extra
          className="absolute bottom-24 right-12 z-30 hidden max-w-xs text-right text-lg text-ink/70 dark:text-night-text/70 md:block"
        >
          {cream.shortDesc}
        </p>

        <div
          data-act="0"
          aria-hidden
          className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 animate-bounce flex-col items-center gap-1 text-ink/40 dark:text-night-text/40"
        >
          <span className="text-xs">Scroll</span>
          <span>↓</span>
        </div>

        {/* ===================== ACTO 2 — DESCRIPCIÓN ===================== */}
        <div
          data-act="1"
          className="absolute inset-x-0 bottom-0 z-30 px-6 pb-10 md:inset-x-auto md:bottom-auto md:left-12 md:top-1/2 md:w-[48vw] md:-translate-y-1/2 md:px-0 md:pb-0 text-ink dark:text-night-text"
        >
          <span data-extra className="mb-2 block text-sm md:text-lg text-clay dark:text-sage-light">
            {cream.tagline}
          </span>

          <SplitTitle text={cream.name} fit="detail" align="items-start text-left" />

          <p
            data-extra
            className="mt-4 text-base leading-relaxed text-ink/75 dark:text-night-text/75 md:mt-6 md:text-2xl"
          >
            {cream.longDesc}
          </p>
        </div>

        {/* ===================== ACTO 3 — TÍTULO GIGANTE DETRÁS DE LA IMAGEN ===================== */}
        <div
          data-act="2"
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-3 text-ink dark:text-night-text"
        >
          <SplitTitle text={cream.name} fit="full" />
        </div>

        {/* Panel de compra (vidrio) */}
        <div
          data-act="2"
          className="absolute inset-x-4 bottom-5 z-30 md:inset-x-auto md:bottom-12 md:right-12 md:w-[26rem]"
        >
          <div
            data-extra
            className="rounded-3xl border border-white/30 bg-white/25 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-black/30"
          >
            <span className="block text-sm text-ink/70 dark:text-night-text/70">{cream.tagline}</span>

            <div className="mt-2 flex items-center justify-between gap-4">
              <span className="font-display text-4xl text-ink dark:text-night-text md:text-5xl">
                {cream.price}
              </span>
              <button
                onClick={() => scrollTo('#comprar')}
                className="rounded-full bg-clay px-6 py-3 text-sm tracking-wide text-white transition-colors hover:bg-clay-light"
              >
                Cómo comprarla
              </button>
            </div>

            <button
              onClick={() => scrollTo('#mas-productos')}
              className="mt-4 text-sm text-ink/70 underline underline-offset-4 transition-colors hover:text-ink dark:text-night-text/70 dark:hover:text-night-text"
            >
              Ver más productos ↓
            </button>
          </div>
        </div>
      </div>
    </>
  )
}