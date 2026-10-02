import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Cinta de texto que se desliza infinitamente. Puramente decorativa
 * (rellena el "vacío" visual): duplica el contenido y anima -50% en
 * X en loop, así el segundo bloque entra justo cuando el primero
 * termina de salir, sin salto.
 */
export default function Marquee({ text, className = '', speed = 16 }) {
  const trackRef = useRef(null)

  useLayoutEffect(() => {
    const tween = gsap.to(trackRef.current, {
      xPercent: -50,
      duration: speed,
      ease: 'none',
      repeat: -1,
    })
    return () => tween.kill()
  }, [speed])

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-hidden>
      <div ref={trackRef} className="inline-flex w-max">
        {[0, 1].map((rep) => (
          <span key={rep} className="inline-flex items-center">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="mx-6 font-display text-2xl md:text-3xl tracking-wide">
                {text} <span className="mx-6 opacity-40">•</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}
