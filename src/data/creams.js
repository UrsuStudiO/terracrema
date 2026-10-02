// Agrega, quita o edita cremas aquí. La primera es la protagonista de
// FeaturedShowcase; el resto aparece en MoreProducts y en el selector de pedido.
//
// image: archivos en /public/images/, referenciados como "/images/...".

const creams = [
  {
    id: 'bruma',
    name: 'Bruma',
    tagline: 'Frescor calmante para pieles sensibles',
    shortDesc:
      'Fórmula en gel-crema con aloe y pepino que calma el enrojecimiento al instante.',
    longDesc:
      'Bruma fue creada para pieles reactivas. Su textura en gel-crema se absorbe en segundos, deja una sensación de frescor inmediata y reduce visiblemente el enrojecimiento gracias a su extracto de aloe vera y centella asiática.',
    price: 'Bs.165.00',
    color: '#6B7A4F',
    image: '/images/cream-2.webp',
  },
  {
    id: 'aurea',
    name: 'Áurea',
    tagline: 'Luminosidad natural para piel cansada',
    shortDesc:
      'Una crema ligera de día que devuelve el brillo natural de la piel en pocos usos.',
    longDesc:
      'Áurea combina manteca de karité, ácido hialurónico y un extracto de caléndula para hidratar en profundidad sin dejar sensación grasa. Pensada para uso diario, restaura la barrera cutánea y aporta luminosidad desde la primera semana.',
    price: 'Bs.185.00',
    color: '#C17A56',
    image: '/images/cream-1.webp',
  },
  {
    id: 'nocturna',
    name: 'Nocturna',
    tagline: 'Reparación intensiva mientras duermes',
    shortDesc:
      'Crema nocturna densa con retinol suave y péptidos para renovar la piel al dormir.',
    longDesc:
      'Nocturna trabaja mientras descansas: su combinación de retinol encapsulado, péptidos de colágeno y ceramidas repara la piel durante la noche, suaviza líneas de expresión y despierta la piel visiblemente más firme.',
    price: 'Bs.210.00',
    color: '#4A5D3E',
    image: '/images/cream-3.webp',
  },
]

export default creams
