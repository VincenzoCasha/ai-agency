import { useEffect } from 'react';

/**
 * SEO por ruta sin dependencias (no react-helmet). Ajusta <title>, meta
 * description, canonical y Open Graph/Twitter en el <head> al montar la página
 * y restaura/actualiza al navegar.
 *
 * Dominio canónico configurable con VITE_SITE_URL (default crudomov.es).
 */

const SITE_ORIGIN = (import.meta?.env?.VITE_SITE_URL || 'https://crudomov.es').replace(/\/$/, '');
const SITE_NAME = 'CRUDO';
const DEFAULT_OG_IMAGE = '/img/brand/crudo-logo.png';

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * @param {object} opts
 * @param {string} opts.title  Título de página (sin sufijo de marca)
 * @param {string} opts.description  Meta description
 * @param {string} [opts.path]  Ruta para canonical/OG url (default location.pathname)
 * @param {string} [opts.image]  Imagen OG (ruta absoluta o relativa)
 * @param {string} [opts.type]  og:type (default 'website')
 */
export function useSeo({ title, description, path, image, type = 'website' } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} — Tienda de quesos en Madrid`;
    const pathName = path || (typeof window !== 'undefined' ? window.location.pathname : '/');
    const url = `${SITE_ORIGIN}${pathName}`;
    const ogImage = image
      ? (image.startsWith('http') ? image : `${SITE_ORIGIN}${image}`)
      : `${SITE_ORIGIN}${DEFAULT_OG_IMAGE}`;

    document.title = fullTitle;
    if (description) upsertMeta('name', 'description', description);
    upsertCanonical(url);

    // Open Graph
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description || '');
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('property', 'og:locale', 'es_ES');

    // Twitter
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description || '');
    upsertMeta('name', 'twitter:image', ogImage);
  }, [title, description, path, image, type]);
}

export { SITE_ORIGIN, SITE_NAME };
