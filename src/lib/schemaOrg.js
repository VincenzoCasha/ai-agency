/**
 * Helpers pasivos para construir JSON-LD schema.org.
 * No se inyectan todavia: la integracion completa con `<head>` y prerender
 * llega en Fase 12. Aqui solo dejamos las funciones builder.
 *
 * CRUDO se modela como `Store` con extension `FoodEstablishment` (decision
 * §0.2: tienda primero, cheese bar segundo).
 */

export function buildStoreSchema(siteConfig) {
  if (!siteConfig) return null;
  return {
    '@context': 'https://schema.org',
    '@type': ['Store', 'FoodEstablishment'],
    name: siteConfig.brand || 'CRUDO',
    legalName: siteConfig.legal_name || undefined,
    address: siteConfig.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: siteConfig.address,
          addressLocality: siteConfig.city,
          addressCountry: siteConfig.country,
        }
      : undefined,
    url: typeof window !== 'undefined' ? window.location.origin : undefined,
    sameAs: [siteConfig.contact?.instagram].filter(Boolean),
  };
}

export function buildProductSchema(product) {
  if (!product) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.short_desc || product.long_desc || undefined,
    sku: product.slug,
    brand: product.producer ? { '@type': 'Brand', name: product.producer } : undefined,
    offers: {
      '@type': 'Offer',
      price: (product.price_cents / 100).toFixed(2),
      priceCurrency: 'EUR',
      availability:
        product.stock_status === 'OUT'
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
    },
  };
}

export function buildEventSchema(event) {
  if (!event) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.starts_at,
    endDate: event.ends_at || undefined,
    location: event.location
      ? { '@type': 'Place', name: event.location }
      : undefined,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    offers: {
      '@type': 'Offer',
      price: ((event.price_cents || 0) / 100).toFixed(2),
      priceCurrency: 'EUR',
    },
  };
}
