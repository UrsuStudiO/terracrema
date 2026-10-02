# Terra Crema

Landing page de una sola página (demo de portfolio) para Terra Crema, una marca ficticia de cremas de cuidado natural. Cada sección usa una animación de scroll distinta: una imagen 3D que cambia de posición durante un pin, títulos gigantes que se auto-ajustan a la pantalla y un selector para armar un pedido por WhatsApp o correo.

## Secciones

| Enlace del menú | Componente | Qué hace |
|---|---|---|
| Destacado | `FeaturedShowcase` | Producto protagonista. La sección queda fija (pin) durante 3 pantallas de scroll mientras la imagen 3D pasa por tres posiciones y el texto cambia en tres actos. |
| Más productos | `MoreProducts` | Un bloque de pantalla completa por cada crema restante, con la imagen girando en 3D según el scroll. |
| Cómo comprar | `PurchaseSection` | Selector de crema y cantidad, total calculado y botones para enviar el pedido por WhatsApp o correo con el mensaje ya redactado. |
| Filosofía | `AboutSection` | Valores de la marca, marquesina de texto y footer. |

## Stack

- React 19 + Vite + Tailwind CSS v4 (vía `@tailwindcss/postcss`)
- GSAP + ScrollTrigger: pin, scrub, entradas de texto y animaciones 3D
- Lucide React: iconos
- Tipografías Fraunces e Inter (Google Fonts, cargadas en `index.html`)

Las versiones exactas están en `package.json`.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre la URL que indique Vite (por defecto http://localhost:5173).

```bash
npm run build     # build de producción en dist/
npm run preview   # sirve el build localmente
```

## Estructura

```
public/
  images/               fotos de producto (WebP)
  favicon.svg
src/
  components/
    FeaturedShowcase    sección con pin y las tres escenas del producto destacado
    MoreProducts        un bloque por cada crema restante
    PurchaseSection     selector de pedido (WhatsApp / correo)
    AboutSection        filosofía y footer
    CreamShowcase       compone las cuatro secciones anteriores
    Navbar              menú con scroll suave a cada sección y menú móvil
    ThemeToggle         botón de modo claro/oscuro
    ProductImage        imagen con marcador de color si el archivo no carga
    Marquee             cinta de texto en movimiento continuo
    TextFx              SplitTitle e initTextFx: títulos que se auto-ajustan y entran desde abajo
  context/
    ThemeContext        tema claro/oscuro (localStorage + View Transitions API)
    ScrollToContext     función de scroll suave compartida por el menú y los botones
  data/creams.js        catálogo de productos
  index.css             tema de Tailwind v4 (@theme) y estilos globales
```

## Cómo adaptarla

**Productos.** Edita el arreglo en `src/data/creams.js`. La primera crema es la protagonista de `FeaturedShowcase`; las demás aparecen en `MoreProducts` y en el selector de pedido. Cada una necesita `id`, `name`, `tagline`, `shortDesc`, `longDesc`, `price`, `color` e `image`.

**Imágenes.** Guarda los archivos en `public/images/` y referéncialos como `/images/archivo.webp`. Se recomienda WebP o PNG con fondo transparente. Si una imagen no carga, se muestra un marcador con el color de la crema.

**Pedidos.** En `src/components/PurchaseSection.jsx` cambia `WHATSAPP_NUMBER` (código de país + número, sin `+` ni espacios) y `CONTACT_EMAIL`. El precio de cada crema se lee de su campo `price` (por ejemplo `'Bs.165.00'`) y el total se muestra en bolivianos.

## Notas

- **Tema:** respeta la preferencia del sistema en la primera visita y guarda la elección del usuario. El tema se aplica con un script en `index.html` antes del primer pintado, para evitar un parpadeo al cargar. La transición circular usa la View Transitions API; en navegadores que no la soportan, o con `prefers-reduced-motion`, el cambio es directo.
- **Modo oscuro en Tailwind:** se define con `@custom-variant dark` en `src/index.css` y se activa con la clase `dark` en `<html>`.
- **Scroll:** usa scroll nativo con `scroll-snap` (solo en desktop). No usa Lenis, porque suavizar el scroll por JavaScript entra en conflicto con el pin de ScrollTrigger.
- **Responsive:** las secciones con animación 3D cambian de composición bajo 768px (`gsap.matchMedia`).
- **Movimiento reducido:** las transiciones CSS y el cambio de tema respetan `prefers-reduced-motion`. Las animaciones de GSAP (pin, scrub y entradas de texto) todavía no tienen versión reducida.
- **Datos ficticios:** los productos, precios, el número de WhatsApp y el correo de pedidos son de ejemplo.
