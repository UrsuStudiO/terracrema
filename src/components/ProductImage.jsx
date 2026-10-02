import { forwardRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Muestra la imagen del producto. Si el archivo no existe en
 * /public/images/, cae en un marcador visual con el color de la crema
 * para que el layout nunca se rompa.
 */
const ProductImage = forwardRef(function ProductImage(
  { cream, className = '', style = {}, draggable = false },
  ref,
) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        ref={ref}
        className={`flex items-center justify-center ${className}`}
        style={{
          background: `radial-gradient(circle at 30% 20%, ${cream.color}55, ${cream.color}dd)`,
          ...style,
        }}
      >
        <span className="font-display text-white/90 text-2xl md:text-3xl tracking-wide">
          {cream.name}
        </span>
      </div>
    )
  }

  return (
    <img
      ref={ref}
      src={cream.image}
      alt={`Crema ${cream.name}`}
      draggable={draggable}
      onError={() => setFailed(true)}
      onLoad={() => ScrollTrigger.refresh()}
      className={`select-none ${className}`}
      style={style}
    />
  )
})

export default ProductImage
