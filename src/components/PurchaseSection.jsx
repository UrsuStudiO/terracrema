import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MessageCircle, Mail, Minus, Plus } from 'lucide-react'
import creams from '../data/creams.js'
import ProductImage from './ProductImage.jsx'
import { SplitTitle, initTextFx } from './TextFx.jsx'

gsap.registerPlugin(ScrollTrigger)

// Reemplaza estos dos valores con tus datos reales para que los botones
// "Pedir por WhatsApp" y "Pedir por correo" funcionen.
const WHATSAPP_NUMBER = '59170000000' // código de país + número, sin "+" ni espacios
const CONTACT_EMAIL = 'hola@terracrema.example'

const FIT = {
  desktop: { head: { w: 0.94, h: 0.45 } },
  mobile: { head: { w: 0.94, h: 0.3 } },
}

function parsePrice(price) {
  return Number(String(price).replace(/[^0-9.]/g, '')) || 0
}

function formatPrice(n) {
  return `Bs.${n.toFixed(2)}`
}

export default function PurchaseSection() {
  const [selectedId, setSelectedId] = useState(creams[0].id)
  const [qty, setQty] = useState(1)

  const sectionRef = useRef(null)
  const innerRef = useRef(null)

  const selected = creams.find((c) => c.id === selectedId) ?? creams[0]
  const unitPrice = parsePrice(selected.price)
  const total = useMemo(() => unitPrice * qty, [unitPrice, qty])

  const orderText = `Hola! Quiero pedir:\n• ${selected.name} x${qty} — ${formatPrice(total)}\n\n¿Cómo seguimos?`

  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderText)}`
  const mailHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Pedido: ${selected.name}`,
  )}&body=${encodeURIComponent(orderText)}`

  /* Animaciones de scroll */
  useLayoutEffect(() => {
    const root = sectionRef.current
    const mm = gsap.matchMedia()

    mm.add({ isDesktop: '(min-width: 768px)', isMobile: '(max-width: 767px)' }, (context) => {
      const { isDesktop } = context.conditions
      const k = isDesktop ? 1 : 0.7

      // Texto gigante (entra una sola vez)
      const cleanup = initTextFx(root, isDesktop ? FIT.desktop : FIT.mobile)

      // Imagen 3D con scrub (sin pin): gira y se endereza mientras bajas
      const box = root.querySelector('[data-box]')
      const shine = root.querySelector('[data-shine]')

      gsap.set(box, { transformPerspective: 1100 })

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.querySelector('[data-grid]'),
          start: 'top 95%',
          end: 'bottom 45%',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })
      tl.fromTo(
        box,
        { rotateY: 30 * k, rotateX: 14 * k, rotateZ: -5 * k, y: 70, scale: 0.88 },
        { rotateY: -8 * k, rotateX: -3 * k, rotateZ: 2 * k, y: -20, scale: 1 },
        0,
      )
      tl.fromTo(shine, { xPercent: -120 }, { xPercent: 120 }, 0)

      return cleanup
    })

    return () => mm.revert()
  }, [])

  /* Al cambiar de crema, la imagen "entra" de nuevo (no depende del scroll) */
  useEffect(() => {
    if (!innerRef.current) return
    gsap.fromTo(
      innerRef.current,
      { opacity: 0, scale: 1.15, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'power3.out' },
    )
  }, [selectedId])

  return (
    <section
      id="comprar"
      ref={sectionRef}
      className="relative z-10 overflow-hidden bg-porcelain text-ink transition-colors duration-500 dark:bg-night dark:text-night-text"
    >
      {/* ===================== ENCABEZADO ===================== */}
      <div data-reveal data-start="top 85%" className="flex flex-col items-center px-3 pb-8 pt-24 md:pb-12 md:pt-32">
        <span data-extra className="mb-3 text-sm text-clay dark:text-sage-light md:text-lg">
          Cómo comprarla
        </span>
        <SplitTitle lines={['Arma', 'tu pedido']} fit="head" />
        <p data-extra className="mt-6 max-w-xl text-center text-sm text-ink/65 dark:text-night-text/65 md:text-lg">
          Elige tu crema y la cantidad, y te dejamos el mensaje listo para coordinar el pago y el envío
          por WhatsApp o correo.
        </p>
      </div>

      {/* ===================== IMAGEN 3D + PANEL ===================== */}
      <div
        data-grid
        className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 pb-24 md:grid-cols-2 md:gap-14 md:px-12 md:pb-32"
      >
        {/* Luz de color de la crema elegida */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/3 aspect-square w-[70vw] -translate-x-1/2 rounded-full opacity-25 blur-3xl transition-colors duration-700 md:left-[25%] md:top-1/2 md:w-[32vw] md:-translate-y-1/2"
          style={{ background: selected.color }}
        />

        {/* Imagen del producto elegido (scrub 3D) */}
        <div
          data-box
          className="relative z-10 mx-auto h-[44vh] w-[78vw] md:h-[62vh] md:w-full"
          style={{ borderRadius: '1.75rem', boxShadow: '0 50px 90px -30px rgba(0,0,0,.5)' }}
        >
          <div
            className="absolute inset-0 overflow-hidden bg-white/40 dark:bg-white/5"
            style={{ borderRadius: 'inherit' }}
          >
            <div ref={innerRef} className="absolute inset-0">
              <ProductImage cream={selected} className="absolute inset-0 h-full w-full object-contain" />
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

        {/* Panel de pedido (vidrio) */}
        <div
          data-reveal
          data-start="top 80%"
          className="relative z-10"
        >
          <div
            data-extra
            className="rounded-[1.75rem] border border-white/30 bg-white/25 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-black/30 md:p-8"
          >
            {/* Selector de producto */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
              {creams.map((c) => {
                const active = c.id === selectedId
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    aria-pressed={active}
                    className={`rounded-2xl border p-4 text-left transition-colors ${active
                        ? 'border-clay bg-clay/10 dark:border-sage-light dark:bg-sage-light/10'
                        : 'border-ink/10 hover:border-ink/25 dark:border-night-text/10 dark:hover:border-night-text/25'
                      }`}
                  >
                    <span className="block font-display text-lg text-ink dark:text-night-text">{c.name}</span>
                    <span className="mt-1 block text-sm text-ink/60 dark:text-night-text/60">{c.price}</span>
                  </button>
                )
              })}
            </div>

            {/* Cantidad + total */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
              <div>
                <span className="mb-2 block text-sm text-ink/60 dark:text-night-text/60">Cantidad</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Restar"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:border-clay dark:border-night-text/20 dark:text-night-text dark:hover:border-sage-light"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="w-6 text-center font-display text-2xl text-ink dark:text-night-text">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(20, q + 1))}
                    aria-label="Sumar"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:border-clay dark:border-night-text/20 dark:text-night-text dark:hover:border-sage-light"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <span className="mb-2 block text-sm text-ink/60 dark:text-night-text/60">Total</span>
                <span className="font-display text-4xl text-ink dark:text-night-text md:text-5xl">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {/* Botones de pedido */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-clay px-6 py-3.5 text-sm tracking-wide text-white transition-colors hover:bg-clay-light"
              >
                <MessageCircle size={17} strokeWidth={1.75} />
                Pedir por WhatsApp
              </a>
              <a
                href={mailHref}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-ink/20 px-6 py-3.5 text-sm tracking-wide text-ink transition-colors hover:border-clay dark:border-night-text/20 dark:text-night-text dark:hover:border-sage-light"
              >
                <Mail size={17} strokeWidth={1.75} />
                Pedir por correo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}