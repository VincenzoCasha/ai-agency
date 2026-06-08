/**
 * Mock de la API pública de CRUDO para los E2E (Fase 9).
 *
 * Intercepta TODAS las llamadas a `**​/api/v1/**` y responde con JSON canónico,
 * sin tocar Express ni MariaDB. Cualquier endpoint no contemplado cae en un
 * fallback 200 vacío para que ningún test cuelgue esperando red real.
 *
 * La forma de los datos sigue la usada en `src/test/ProductCard.test.jsx` y
 * `src/lib/siteConfig.js` (FALLBACK_SITE_CONFIG).
 */

export const WHATSAPP = '+34650131861';

/**
 * Siembra una decisión de consentimiento en localStorage ANTES de cargar la
 * app, de modo que el cookie banner (fixed, bottom, z-40) no aparezca y no
 * intercepte clics ni distorsione los escaneos en specs que no son de cookies.
 * Debe llamarse antes del primer `page.goto`.
 */
export async function hideCookieBanner(page) {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem(
        'crudo:consent:v1',
        JSON.stringify({
          version: '1',
          consent_id: 'e2e-seeded',
          timestamp: new Date().toISOString(),
          analytics: false,
          marketing: false,
          preferences: false,
        }),
      );
    } catch {
      /* ignore */
    }
  });
}

// --- Datos semilla -----------------------------------------------------------

const CHEESE = {
  id: 1,
  slug: 'manchego-curado',
  name: 'Manchego curado',
  type: 'CHEESE',
  short_desc: 'Curado de oveja, 12 meses.',
  price_cents: 1450,
  stock_status: 'IN',
  is_alcohol: false,
  is_seasonal: true,
  is_featured: true,
  producer: 'Quesos La Mesa',
  region: 'Castilla-La Mancha',
  images: [],
};

const CHEESE_2 = {
  ...CHEESE,
  id: 2,
  slug: 'cabra-payoyo',
  name: 'Cabra payoyo',
  short_desc: 'Cabra de la sierra de Cádiz.',
  price_cents: 1690,
  is_seasonal: false,
  is_featured: false,
};

const CHEESE_OUT = {
  ...CHEESE,
  id: 3,
  slug: 'azul-valdeon',
  name: 'Azul de Valdeón',
  short_desc: 'Azul intenso del Bierzo.',
  price_cents: 1290,
  stock_status: 'OUT',
  is_seasonal: false,
  is_featured: false,
};

const WINE = {
  ...CHEESE,
  id: 4,
  slug: 'rioja-reserva',
  name: 'Rioja Reserva',
  type: 'WINE',
  short_desc: 'Tinto reserva, maridaje de tabla.',
  price_cents: 1800,
  is_alcohol: true,
  is_seasonal: false,
  is_featured: false,
};

export const PRODUCTS = [CHEESE, CHEESE_2, CHEESE_OUT, WINE];

const CATEGORIES = [
  { id: 1, slug: 'quesos', name: 'Quesos', kind: 'CHEESE' },
  { id: 2, slug: 'vinos', name: 'Vinos', kind: 'WINE' },
];

const EVENT = {
  id: 1,
  slug: 'cata-telperion',
  title: 'Cata Telperion',
  summary: 'Cata guiada de quesos y maridajes.',
  description: 'Una velada de cata guiada con seleccion de temporada.',
  starts_at: '2026-07-15T19:00:00.000Z',
  ends_at: '2026-07-15T21:00:00.000Z',
  location: 'CRUDO, Madrid',
  capacity: 16,
  seats_left: 8,
  price_cents: 2500,
  is_published: true,
  images: [],
};

export const EVENTS = [EVENT];

// Horario amplio todos los días para que el pickup siempre tenga slots.
const SITE_CONFIG = {
  brand: 'CRUDO',
  legal_name: 'CRUDO QUESOS S.L.U',
  vat_id: 'B-19953694',
  address: 'Calle Jose Ortega y Gasset 81, 28006 Madrid',
  city: 'Madrid',
  country: 'ES',
  domain: 'crudomov.es',
  hours: {
    mon: '10:00-20:00',
    tue: '10:00-20:00',
    wed: '10:00-20:00',
    thu: '10:00-20:00',
    fri: '10:00-20:00',
    sat: '10:00-20:00',
    sun: '10:00-20:00',
    notes: '',
  },
  pickup: { sla_text: 'Confirmamos por WhatsApp en menos de 24 horas.' },
  contact: {
    whatsapp_public: WHATSAPP,
    whatsapp_owner: WHATSAPP,
    email: 'crudomov@gmail.com',
    instagram: 'https://www.instagram.com/crudomov',
    google_maps_url: 'https://maps.google.com/?q=CRUDO',
  },
  flags: { pickup_enabled: true, pickup_paused: false, pickup_daily_capacity: 15 },
};

const PICKUP_CONFIRMATION = {
  id: 'ord_test_1',
  reference: 'CRUDO-TEST-0001',
  status: 'NEW',
  pickup_date: null,
  pickup_slot: null,
};

const ADMIN_SESSION = {
  access_token: 'test-access-token',
  refresh_token: 'test-refresh-token',
  admin: { id: 1, email: 'owner@crudomov.es', name: 'Owner' },
};

const ADMIN_DASHBOARD = {
  pickups_today: [],
  upcoming_events: [],
  new_inquiries: 0,
  availability_alerts: [],
  new_orders: 0,
};

// --- Helpers de respuesta ----------------------------------------------------

function json(body, status = 200) {
  return { status, contentType: 'application/json', body: JSON.stringify(body) };
}

function paged(items) {
  // Envelope que esperan los hooks del frontend (useProducts/useEvents):
  // payload.data = array + pagination opcional.
  return {
    data: items,
    pagination: { total: items.length, page: 1, size: items.length },
  };
}

/**
 * Registra la interceptación. Llamar al principio de cada test:
 *   await mockApi(page);
 *
 * `overrides` permite sustituir respuestas concretas por test, p.ej.:
 *   await mockApi(page, { 'POST /pickup-orders': () => json({...}, 409) });
 */
export async function mockApi(page, overrides = {}) {
  await page.route('**/api/v1/**', async (route) => {
    const req = route.request();
    const method = req.method().toUpperCase();
    const url = new URL(req.url());
    const path = url.pathname.replace(/^.*\/api\/v1/, ''); // -> "/products", etc.
    const key = `${method} ${path}`;

    // Override exacto por test.
    if (overrides[key]) {
      return route.fulfill(overrides[key](req));
    }

    // Rutas con parámetro.
    if (method === 'GET' && /^\/products\/[^/]+$/.test(path)) {
      const slug = decodeURIComponent(path.split('/').pop());
      const product = PRODUCTS.find((p) => p.slug === slug) || CHEESE;
      return route.fulfill(json(product));
    }
    if (method === 'GET' && /^\/events\/[^/]+$/.test(path)) {
      const slug = decodeURIComponent(path.split('/').pop());
      const event = EVENTS.find((e) => e.slug === slug) || EVENT;
      return route.fulfill(json(event));
    }
    if (method === 'POST' && /^\/events\/[^/]+\/reservations$/.test(path)) {
      return route.fulfill(json({ id: 'res_test_1', status: 'NEW' }, 201));
    }

    switch (key) {
      case 'GET /products':
        return route.fulfill(json(paged(PRODUCTS)));
      case 'GET /categories':
        return route.fulfill(json({ data: CATEGORIES }));
      case 'GET /events':
        return route.fulfill(json(paged(EVENTS)));
      case 'GET /site/config':
        return route.fulfill(json(SITE_CONFIG));
      case 'GET /campaigns/active':
        return route.fulfill(json({ items: [] }));
      case 'POST /pickup-orders':
        return route.fulfill(json(PICKUP_CONFIRMATION, 201));
      case 'POST /inquiries':
        return route.fulfill(json({ id: 'inq_test_1', status: 'NEW' }, 201));
      case 'POST /newsletter/subscribe':
        return route.fulfill(json({ status: 'PENDING' }, 201));
      case 'POST /consent':
        return route.fulfill(json({ ok: true }, 201));
      case 'POST /admin/auth/login':
        return route.fulfill(json(ADMIN_SESSION));
      case 'POST /admin/auth/refresh':
        return route.fulfill(json(ADMIN_SESSION));
      case 'POST /admin/auth/logout':
        return route.fulfill(json({ ok: true }));
      case 'GET /admin/dashboard':
        return route.fulfill(json(ADMIN_DASHBOARD));
      default:
        // Fallback seguro: nada cuelga esperando red real.
        if (method === 'GET') return route.fulfill(json({ data: [] }));
        return route.fulfill(json({ ok: true }));
    }
  });
}
