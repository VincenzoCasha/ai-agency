// AUTOGENERADO por scripts/build-images.mjs — NO editar a mano.
// Pipeline de imágenes V2 (Fase 4). Regenerar con: npm run build:images
//
// Cada entrada: { alt, ratio, width, height, src (mayor), srcSet (responsive) }.
// Uso en JSX:
//   import { V2_ASSETS } from '../lib/v2Assets';
//   const a = V2_ASSETS['home-hero'];
//   <img src={a.src} srcSet={a.srcSet} sizes="100vw" width={a.width}
//        height={a.height} alt={a.alt} loading="lazy" decoding="async" />

export const V2_ASSETS = {
  "home-hero": {
    "alt": "Tabla de quesos artesanos sobre madera en CRUDO",
    "ratio": "16/10",
    "width": 1800,
    "height": 1125,
    "src": "/img/v2/home-hero-1800.webp",
    "srcSet": "/img/v2/home-hero-768.webp 768w, /img/v2/home-hero-1200.webp 1200w, /img/v2/home-hero-1800.webp 1800w"
  },
  "home-hero-mobile": {
    "alt": "Tabla de quesos artesanos sobre madera en CRUDO",
    "ratio": "4/5",
    "width": 768,
    "height": 960,
    "src": "/img/v2/home-hero-mobile-768.webp",
    "srcSet": "/img/v2/home-hero-mobile-480.webp 480w, /img/v2/home-hero-mobile-768.webp 768w"
  },
  "seleccion-hero": {
    "alt": "Selección de quesos de temporada en CRUDO",
    "ratio": "16/9",
    "width": 1800,
    "height": 1013,
    "src": "/img/v2/seleccion-hero-1800.webp",
    "srcSet": "/img/v2/seleccion-hero-768.webp 768w, /img/v2/seleccion-hero-1200.webp 1200w, /img/v2/seleccion-hero-1800.webp 1800w"
  },
  "tablas-hero": {
    "alt": "Tabla de quesos con copas de vino para llevar",
    "ratio": "16/10",
    "width": 1800,
    "height": 1125,
    "src": "/img/v2/tablas-hero-1800.webp",
    "srcSet": "/img/v2/tablas-hero-768.webp 768w, /img/v2/tablas-hero-1200.webp 1200w, /img/v2/tablas-hero-1800.webp 1800w"
  },
  "eventos-hero": {
    "alt": "Cata de vinos naturales en la barra de CRUDO",
    "ratio": "16/9",
    "width": 1800,
    "height": 1013,
    "src": "/img/v2/eventos-hero-1800.webp",
    "srcSet": "/img/v2/eventos-hero-768.webp 768w, /img/v2/eventos-hero-1200.webp 1200w, /img/v2/eventos-hero-1800.webp 1800w"
  },
  "evento-poster-telperion": {
    "alt": "Cartel del evento Wine Tasting con Bodegas Telperion",
    "ratio": "3/4",
    "width": 1000,
    "height": 1333,
    "src": "/img/v2/evento-poster-telperion-1000.webp",
    "srcSet": "/img/v2/evento-poster-telperion-480.webp 480w, /img/v2/evento-poster-telperion-768.webp 768w, /img/v2/evento-poster-telperion-1000.webp 1000w"
  },
  "contacto-local": {
    "alt": "Mostrador de la tienda CRUDO en Madrid",
    "ratio": "16/9",
    "width": 1200,
    "height": 675,
    "src": "/img/v2/contacto-local-1200.webp",
    "srcSet": "/img/v2/contacto-local-768.webp 768w, /img/v2/contacto-local-1200.webp 1200w"
  },
  "fallback-queso": {
    "alt": "Queso artesano de CRUDO",
    "ratio": "1/1",
    "width": 800,
    "height": 800,
    "src": "/img/v2/fallback-queso-800.webp",
    "srcSet": "/img/v2/fallback-queso-400.webp 400w, /img/v2/fallback-queso-800.webp 800w"
  },
  "fallback-maridaje": {
    "alt": "Maridaje de vino natural en CRUDO",
    "ratio": "1/1",
    "width": 800,
    "height": 800,
    "src": "/img/v2/fallback-maridaje-800.webp",
    "srcSet": "/img/v2/fallback-maridaje-400.webp 400w, /img/v2/fallback-maridaje-800.webp 800w"
  },
  "fallback-tabla": {
    "alt": "Tabla de quesos de CRUDO",
    "ratio": "1/1",
    "width": 800,
    "height": 800,
    "src": "/img/v2/fallback-tabla-800.webp",
    "srcSet": "/img/v2/fallback-tabla-400.webp 400w, /img/v2/fallback-tabla-800.webp 800w"
  },
  "lifestyle-bodegon": {
    "alt": "Bodegón con el cartel de CRUDO",
    "ratio": "16/9",
    "width": 1200,
    "height": 675,
    "src": "/img/v2/lifestyle-bodegon-1200.webp",
    "srcSet": "/img/v2/lifestyle-bodegon-768.webp 768w, /img/v2/lifestyle-bodegon-1200.webp 1200w"
  }
};

export function getAsset(id) {
  return V2_ASSETS[id] || null;
}
