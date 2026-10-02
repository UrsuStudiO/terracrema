import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Leaf, ShieldCheck, Recycle } from 'lucide-react'
import Marquee from './Marquee.jsx'
import { SplitTitle, initTextFx } from './TextFx.jsx'

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    icon: Leaf,
    title: 'Ingredientes reales',
    desc: 'Formulamos con extractos botánicos activos, sin rellenos ni fragancias sintéticas.',
  },
  {
    icon: ShieldCheck,
    title: 'Piel probada',
    desc: 'Cada fórmula se prueba en distintos tipos de piel antes de salir a la venta.',
  },
  {
    icon: Recycle,
    title: 'Envases recargables',
    desc: 'Los frascos están pensados para rellenarse, no para desecharse.',
  },
]

const FIT = {
  desktop: {
    head: { w: 0.94, h: 0.5 },
    feat: { w: 0.46, h: 0.3 },
    brand: { w: 0.96, h: 0.5 },
  },
  mobile: {
    head: { w: 0.94, h: 0.34 },
    feat: { w: 0.9, h: 0.2 },
    brand: { w: 0.94, h: 0.3 },
  },
}

export default function AboutSection() {
  const sectionRef = useRef(null)
  const [showCredit, setShowCredit] = useState(false)

  useLayoutEffect(() => {
    const root = sectionRef.current
    const mm = gsap.matchMedia()

    mm.add({ isDesktop: '(min-width: 768px)', isMobile: '(max-width: 767px)' }, (context) => {
      const { isDesktop } = context.conditions
      const k = isDesktop ? 1 : 0.7

      // Texto gigante (entra una sola vez)
      const cleanup = initTextFx(root, isDesktop ? FIT.desktop : FIT.mobile)

      // Cada fila se "levanta" en 3D con el scroll (scrub, sin pin)
      root.querySelectorAll('[data-row]').forEach((row) => {
        gsap.fromTo(
          row,
          { y: 90 * k, rotateX: 28 * k, opacity: 0.15, transformPerspective: 1000, transformOrigin: '50% 100%' },
          {
            y: 0,
            rotateX: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: row,
              start: 'top 95%',
              end: 'top 55%',
              scrub: 1,
            },
          },
        )
      })

      return cleanup
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      id="coleccion"
      ref={sectionRef}
      className="relative z-10 overflow-hidden bg-porcelain text-ink transition-colors duration-500 dark:bg-night dark:text-night-text"
    >
      {/* ===================== FILOSOFÍA ===================== */}
      <div data-reveal data-start="top 85%" className="flex flex-col items-center px-3 pb-12 pt-24 md:pb-20 md:pt-32">
        <span data-extra className="mb-3 text-sm text-clay dark:text-sage-light md:text-lg">
          Nuestra filosofía
        </span>
        <SplitTitle lines={['Ingredientes', 'que reconoces']} fit="head" />
      </div>

      <div className="px-6 md:px-16">
        {features.map((f) => (
          <div
            key={f.title}
            data-row
            data-reveal
            data-start="top 80%"
            className="grid grid-cols-1 items-center gap-6 border-t border-ink/15 py-10 dark:border-night-text/15 md:grid-cols-2 md:gap-12 md:py-16"
          >
            <SplitTitle lines={f.title.split(' ')} fit="feat" as="h3" align="items-start text-left" />

            <div data-extra className="flex items-start gap-5 md:justify-end">
              <f.icon size={26} strokeWidth={1.5} className="mt-1 shrink-0 text-clay dark:text-sage-light" />
              <p className="max-w-md text-base leading-relaxed text-ink/70 dark:text-night-text/70 md:text-2xl">
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Marquee
        text="Terra Crema"
        speed={22}
        className="mt-20 text-ink/10 dark:text-night-text/10"
      />

      {/* ===================== FOOTER ===================== */}
      <footer data-reveal data-start="top 92%" className="px-3 pb-8 pt-12 md:pt-20">
        <div className="flex justify-center">
          <SplitTitle lines={['Terra Crema']} fit="brand" as="p" />
        </div>

        <div
          data-extra
          className="mx-3 mt-10 flex flex-col items-start justify-between gap-4 border-t border-ink/10 pt-6 text-sm text-ink/60 dark:border-night-text/10 dark:text-night-text/60 sm:flex-row sm:items-center md:mx-12"
        >
          <span>© {new Date().getFullYear()} Terra Crema.</span>
          <div
            className="relative"
            onMouseEnter={() => setShowCredit(true)}
            onMouseLeave={() => setShowCredit(false)}
          >
            <div className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 overflow-hidden whitespace-nowrap">
              <span
                className={`block font-display text-[1.78rem] tracking-wide text-ink transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] dark:text-night-text ${
                  showCredit ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                }`}
              >
                Ursu<span className="text-clay">Studio</span>
              </span>
            </div>

            <a
              href="https://ursustudio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-full border border-ink/15 px-4 py-2 text-[0.68rem] uppercase tracking-[0.16em] text-ink/60 transition-colors duration-300 dark:border-night-text/15 dark:text-night-text/60"
            >
              <span className="transition-colors duration-300 group-hover:text-ink dark:group-hover:text-night-text">
                Créditos
              </span>
            </a>
          </div>
        </div>
      </footer>
    </section>
  )
}