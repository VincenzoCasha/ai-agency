'use strict';

/**
 * Seed local de desarrollo para CRUDO V1.
 *
 * - Solo se ejecuta en NODE_ENV development o test (el wrapper db/seed.js aborta si no).
 * - Es idempotente para productos/categorias/eventos: borra y recrea.
 * - NO contiene datos reales del owner ni secretos. La credencial admin es ficticia
 *   y queda documentada en docs/runbook.md.
 */

const bcrypt = require('bcryptjs');

// Categorias (>=3 quesos, >=2 vinos, >=1 OTHER).
// El catalogo publico V1 NO expone vinos como ruta propia, pero el modelo soporta
// vinos para el caso de variantes con maridaje. Las categorias WINE existen para
// que el admin pueda etiquetarlos cuando aparezcan en variantes de tabla.
const CATEGORIES = [
  { slug: 'quesos-de-vaca',    name: 'Quesos de vaca',    type: 'CHEESE', sort_order: 10 },
  { slug: 'quesos-de-oveja',   name: 'Quesos de oveja',   type: 'CHEESE', sort_order: 20 },
  { slug: 'quesos-de-cabra',   name: 'Quesos de cabra',   type: 'CHEESE', sort_order: 30 },
  { slug: 'quesos-mezcla',     name: 'Quesos de mezcla',  type: 'CHEESE', sort_order: 40 },
  { slug: 'vinos-tintos',      name: 'Vinos tintos',      type: 'WINE',   sort_order: 50 },
  { slug: 'vinos-blancos',     name: 'Vinos blancos',     type: 'WINE',   sort_order: 60 },
  { slug: 'tablas',            name: 'Tablas para llevar', type: 'TABLA', sort_order: 70 },
  { slug: 'otros',             name: 'Otros',             type: 'OTHER',  sort_order: 99 },
];

const PRODUCTS = [
  {
    slug: 'manchego-curado-12m',
    name: 'Manchego curado 12 meses',
    type: 'CHEESE', is_alcohol: false,
    price_cents: 1850, vat_rate: 10.0,
    short_desc: 'Manchego DOP curado, leche cruda de oveja.',
    long_desc:  'Pieza de oveja manchega curada 12 meses, intensidad media-alta. Notas a frutos secos y mantequilla curada.',
    producer: 'Quesos La Mancha S.L.', region: 'Castilla-La Mancha',
    milk_type: 'SHEEP', milk_treatment: 'RAW', intensity: 'STRONG',
    pairing_notes: 'Marida con tinto de crianza o cerveza tostada.',
    is_seasonal: false, is_featured: true, is_active: true,
    stock_status: 'IN_STOCK',
    categories: ['quesos-de-oveja'],
  },
  {
    slug: 'queso-tetilla',
    name: 'Tetilla gallega',
    type: 'CHEESE', is_alcohol: false,
    price_cents: 1200, vat_rate: 10.0,
    short_desc: 'Tetilla DOP, leche pasteurizada de vaca.',
    long_desc:  'Queso suave gallego, textura cremosa, sabor lacteo equilibrado.',
    producer: 'Lacteos Galicia', region: 'Galicia',
    milk_type: 'COW', milk_treatment: 'PASTEURIZED', intensity: 'MILD',
    pairing_notes: 'Perfecto con blanco joven, sidra o pan rustico.',
    is_seasonal: false, is_featured: true, is_active: true,
    stock_status: 'IN_STOCK',
    categories: ['quesos-de-vaca'],
  },
  {
    slug: 'queso-cabra-temporada',
    name: 'Cabra fresco de primavera',
    type: 'CHEESE', is_alcohol: false,
    price_cents: 1400, vat_rate: 10.0,
    short_desc: 'Queso de cabra fresco, edicion de temporada.',
    long_desc:  'Cabra fresca elaborada con leche de primavera, intensidad ligera y notas herbaceas.',
    producer: 'Granja El Encinar', region: 'Sierra Norte de Madrid',
    milk_type: 'GOAT', milk_treatment: 'PASTEURIZED', intensity: 'MILD',
    pairing_notes: 'Mejor con blanco fresco o vermut.',
    is_seasonal: true, is_featured: true, is_active: true,
    stock_status: 'LOW',
    categories: ['quesos-de-cabra'],
  },
  {
    slug: 'queso-azul-picon',
    name: 'Picón azul de Liébana',
    type: 'CHEESE', is_alcohol: false,
    price_cents: 2200, vat_rate: 10.0,
    short_desc: 'Azul DOP intenso, mezcla de leches.',
    long_desc:  'Queso azul de los Picos de Europa, mezcla de vaca, oveja y cabra. Picante y untuoso.',
    producer: 'Cooperativa Lebaniega', region: 'Cantabria',
    milk_type: 'MIXED', milk_treatment: 'RAW', intensity: 'STRONG',
    pairing_notes: 'Marida con dulces, vino oloroso o cervezas negras.',
    is_seasonal: true, is_featured: false, is_active: true,
    stock_status: 'IN_STOCK',
    categories: ['quesos-mezcla'],
  },
  {
    slug: 'queso-rulo-cabra-tomillo',
    name: 'Rulo de cabra al tomillo',
    type: 'CHEESE', is_alcohol: false,
    price_cents: 1100, vat_rate: 10.0,
    short_desc: 'Rulo de cabra cubierto de tomillo seco.',
    long_desc:  'Rulo joven de cabra recubierto de tomillo. Edicion limitada de temporada.',
    producer: 'Quesos El Aljibe', region: 'Andalucia',
    milk_type: 'GOAT', milk_treatment: 'PASTEURIZED', intensity: 'MEDIUM',
    pairing_notes: 'Recomendado con blanco aromatico.',
    is_seasonal: true, is_featured: false, is_active: true,
    stock_status: 'IN_STOCK',
    categories: ['quesos-de-cabra'],
  },
  {
    slug: 'queso-idiazabal-ahumado',
    name: 'Idiazabal ahumado',
    type: 'CHEESE', is_alcohol: false,
    price_cents: 1650, vat_rate: 10.0,
    short_desc: 'Idiazabal DOP ahumado en haya.',
    long_desc:  'Oveja latxa pastoreada, ahumado tradicional. Sabor profundo y persistente.',
    producer: 'Caserio Aralar', region: 'Pais Vasco',
    milk_type: 'SHEEP', milk_treatment: 'RAW', intensity: 'STRONG',
    pairing_notes: 'Tinto reserva o sidra natural.',
    is_seasonal: true, is_featured: true, is_active: true,
    stock_status: 'IN_STOCK',
    categories: ['quesos-de-oveja'],
  },
  // Vinos: solo modelo, no listados publicos.
  {
    slug: 'vino-tinto-ribera-crianza',
    name: 'Tinto Ribera del Duero crianza',
    type: 'WINE', is_alcohol: true,
    price_cents: 1450, vat_rate: 21.0,
    short_desc: 'Tinto crianza DO Ribera del Duero, 75 cl.',
    long_desc:  'Tinto de tempranillo crianza 12 meses en barrica. Solo disponible como variante de maridaje en tablas.',
    producer: 'Bodega Selecta', region: 'Castilla y Leon',
    milk_type: null, milk_treatment: null, intensity: null,
    pairing_notes: 'Maridaje sugerido para tablas de quesos curados.',
    is_seasonal: false, is_featured: false, is_active: true,
    stock_status: 'IN_STOCK',
    categories: ['vinos-tintos'],
  },
  {
    slug: 'vino-blanco-albarino',
    name: 'Blanco Albarino Rias Baixas',
    type: 'WINE', is_alcohol: true,
    price_cents: 1350, vat_rate: 21.0,
    short_desc: 'Albarino DO Rias Baixas, 75 cl.',
    long_desc:  'Albarino fresco y aromatico. Solo disponible como variante de maridaje en tablas.',
    producer: 'Adega Atlantica', region: 'Galicia',
    milk_type: null, milk_treatment: null, intensity: null,
    pairing_notes: 'Maridaje para tablas de quesos suaves y frescos.',
    is_seasonal: false, is_featured: false, is_active: true,
    stock_status: 'IN_STOCK',
    categories: ['vinos-blancos'],
  },
  // Tablas (type=TABLA) sin alcohol al nivel producto; las variantes con vino se modelan en product_variant.
  {
    slug: 'tabla-3-quesos',
    name: 'Tabla 3 quesos',
    type: 'TABLA', is_alcohol: false,
    price_cents: 1800, vat_rate: 10.0,
    short_desc: 'Tabla para llevar con 3 quesos seleccionados.',
    long_desc:  'Seleccion de 3 quesos de temporada. Variantes disponibles con maridaje opcional de vino (via WhatsApp).',
    producer: 'CRUDO', region: 'Madrid',
    milk_type: null, milk_treatment: null, intensity: null,
    pairing_notes: 'Tabla pensada para 1-2 personas.',
    is_seasonal: false, is_featured: true, is_active: true,
    stock_status: 'IN_STOCK',
    categories: ['tablas'],
    variants: [
      { slug: 'tabla-3-sin-vino',     label: 'Sin maridaje',          size_label: '3 quesos', pairing_label: null,            price_cents: 1800, is_alcohol: false, sort_order: 1 },
      { slug: 'tabla-3-con-tinto',    label: 'Con tinto crianza',     size_label: '3 quesos', pairing_label: 'Ribera crianza', price_cents: 3100, is_alcohol: true,  sort_order: 2 },
      { slug: 'tabla-3-con-blanco',   label: 'Con blanco albarino',   size_label: '3 quesos', pairing_label: 'Albarino',       price_cents: 3000, is_alcohol: true,  sort_order: 3 },
    ],
  },
  {
    slug: 'tabla-6-quesos',
    name: 'Tabla 6 quesos',
    type: 'TABLA', is_alcohol: false,
    price_cents: 3200, vat_rate: 10.0,
    short_desc: 'Tabla para llevar con 6 quesos seleccionados.',
    long_desc:  'Seleccion ampliada de 6 quesos de temporada. Variantes disponibles con maridaje opcional de vino (via WhatsApp).',
    producer: 'CRUDO', region: 'Madrid',
    milk_type: null, milk_treatment: null, intensity: null,
    pairing_notes: 'Tabla pensada para 3-4 personas.',
    is_seasonal: false, is_featured: true, is_active: true,
    stock_status: 'IN_STOCK',
    categories: ['tablas'],
    variants: [
      { slug: 'tabla-6-sin-vino',   label: 'Sin maridaje',      size_label: '6 quesos', pairing_label: null,            price_cents: 3200, is_alcohol: false, sort_order: 1 },
      { slug: 'tabla-6-con-tinto',  label: 'Con tinto crianza', size_label: '6 quesos', pairing_label: 'Ribera crianza', price_cents: 4800, is_alcohol: true,  sort_order: 2 },
    ],
  },
  // OTHER (no alcohol).
  {
    slug: 'pan-artesano',
    name: 'Pan artesano de masa madre',
    type: 'OTHER', is_alcohol: false,
    price_cents: 450, vat_rate: 4.0,
    short_desc: 'Hogaza pequena de masa madre, ideal para acompanar.',
    long_desc:  'Pan artesano de obrador local, masa madre fermentada 36 horas.',
    producer: 'Panaderia Maria', region: 'Madrid',
    milk_type: null, milk_treatment: null, intensity: null,
    pairing_notes: null,
    is_seasonal: false, is_featured: false, is_active: true,
    stock_status: 'IN_STOCK',
    categories: ['otros'],
  },
];

const CAMPAIGNS = [
  {
    slug: 'temporada-primavera',
    title: 'Temporada de primavera',
    subtitle: 'Quesos frescos seleccionados',
    hero_image_url: '/images/placeholder-campaign-spring.jpg',
    body_md: 'Descubre nuestra seleccion de quesos de primavera elaborados con leche de pasto.',
    starts_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    ends_at:   new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    is_active: true,
    products: ['queso-cabra-temporada', 'queso-rulo-cabra-tomillo', 'queso-idiazabal-ahumado'],
  },
];

const EVENTS = [
  {
    slug: 'cata-quesos-de-oveja',
    title: 'Cata de quesos de oveja',
    description_md: 'Cata guiada de 5 quesos de oveja con maridaje opcional.',
    hero_image_url: '/images/placeholder-event-1.jpg',
    starts_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    ends_at:   new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
    capacity:  12,
    price_cents: 3500,
    location: 'CRUDO, Calle Jose Ortega y Gasset 81, Madrid',
    is_active: true,
  },
  {
    slug: 'taller-quesos-azules',
    title: 'Taller de quesos azules',
    description_md: 'Aprende a apreciar y combinar quesos azules de la peninsula.',
    hero_image_url: '/images/placeholder-event-2.jpg',
    starts_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    ends_at:   new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
    capacity:  10,
    price_cents: 4000,
    location: 'CRUDO, Calle Jose Ortega y Gasset 81, Madrid',
    is_active: true,
  },
];

const NEWSLETTER = [
  { email: 'suscriptor.local@example.test', source: 'seed', status: 'ACTIVE' },
];

const ADMIN_EMAIL_LOCAL = 'admin.local@example.test';
const ADMIN_PLAIN_LOCAL = 'change-me-local-only';

const SITE_CONFIG = [
  { config_key: 'pickup_paused',         value_text: 'false' },
  { config_key: 'pickup_daily_capacity', value_text: '15' },
];

async function clearDevData(conn) {
  // Orden inverso a las FKs.
  await conn.query('SET FOREIGN_KEY_CHECKS = 0');
  for (const t of [
    'pickup_order_item', 'pickup_order',
    'event_reservation', 'event',
    'campaign_product', 'campaign',
    'product_variant', 'product_image', 'product_category', 'product',
    'category',
    'newsletter_subscriber', 'inquiry', 'consent_log', 'audit_log',
    'admin_user', 'site_config',
  ]) {
    await conn.query(`DELETE FROM \`${t}\``);
  }
  await conn.query('SET FOREIGN_KEY_CHECKS = 1');
}

async function seedDatabase(conn, { log = () => {} } = {}) {
  log('· clearing dev data');
  await clearDevData(conn);

  // Categorias
  log(`· categorias: ${CATEGORIES.length}`);
  const categoryIdBySlug = {};
  for (const cat of CATEGORIES) {
    const r = await conn.query(
      'INSERT INTO category (slug, name, type, sort_order) VALUES (?, ?, ?, ?)',
      [cat.slug, cat.name, cat.type, cat.sort_order],
    );
    categoryIdBySlug[cat.slug] = Number(r.insertId);
  }

  // Productos + variantes + categorias join + 1 imagen primaria.
  log(`· productos: ${PRODUCTS.length}`);
  for (const p of PRODUCTS) {
    const r = await conn.query(
      `INSERT INTO product
       (slug, name, type, is_alcohol, price_cents, vat_rate, short_desc, long_desc,
        producer, region, milk_type, milk_treatment, intensity, pairing_notes,
        is_seasonal, is_featured, is_active, stock_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.slug, p.name, p.type, p.is_alcohol ? 1 : 0, p.price_cents, p.vat_rate,
        p.short_desc, p.long_desc, p.producer, p.region,
        p.milk_type, p.milk_treatment, p.intensity, p.pairing_notes,
        p.is_seasonal ? 1 : 0, p.is_featured ? 1 : 0, p.is_active ? 1 : 0,
        p.stock_status,
      ],
    );
    const productId = Number(r.insertId);

    for (const catSlug of p.categories) {
      await conn.query(
        'INSERT INTO product_category (product_id, category_id) VALUES (?, ?)',
        [productId, categoryIdBySlug[catSlug]],
      );
    }

    await conn.query(
      `INSERT INTO product_image (product_id, url, alt_text, sort_order, is_primary)
       VALUES (?, ?, ?, 0, 1)`,
      [productId, `/images/placeholder-${p.slug}.jpg`, `${p.name} (placeholder dev)`],
    );

    if (Array.isArray(p.variants)) {
      for (const v of p.variants) {
        await conn.query(
          `INSERT INTO product_variant
           (product_id, slug, label, size_label, pairing_label, price_cents,
            is_alcohol, is_active, sort_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)`,
          [
            productId, v.slug, v.label, v.size_label, v.pairing_label,
            v.price_cents, v.is_alcohol ? 1 : 0, v.sort_order,
          ],
        );
      }
    }
  }

  // Campanas
  log(`· campanas: ${CAMPAIGNS.length}`);
  for (const c of CAMPAIGNS) {
    const r = await conn.query(
      `INSERT INTO campaign (slug, title, subtitle, hero_image_url, body_md, starts_at, ends_at, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [c.slug, c.title, c.subtitle, c.hero_image_url, c.body_md, c.starts_at, c.ends_at, c.is_active ? 1 : 0],
    );
    const campaignId = Number(r.insertId);
    let order = 0;
    for (const productSlug of c.products) {
      const rows = await conn.query('SELECT id FROM product WHERE slug = ?', [productSlug]);
      if (rows.length === 0) continue;
      await conn.query(
        'INSERT INTO campaign_product (campaign_id, product_id, sort_order) VALUES (?, ?, ?)',
        [campaignId, Number(rows[0].id), order++],
      );
    }
  }

  // Eventos
  log(`· eventos: ${EVENTS.length}`);
  for (const e of EVENTS) {
    await conn.query(
      `INSERT INTO event
       (slug, title, description_md, hero_image_url, starts_at, ends_at, capacity, price_cents, location, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        e.slug, e.title, e.description_md, e.hero_image_url,
        e.starts_at, e.ends_at, e.capacity, e.price_cents, e.location,
        e.is_active ? 1 : 0,
      ],
    );
  }

  // Newsletter
  log(`· newsletter subscribers: ${NEWSLETTER.length}`);
  for (const n of NEWSLETTER) {
    await conn.query(
      `INSERT INTO newsletter_subscriber (email, source, status, consent_at)
       VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
      [n.email, n.source, n.status],
    );
  }

  // Admin user local (hash bcrypt; password ficticia documentada en runbook).
  const passwordHash = await bcrypt.hash(ADMIN_PLAIN_LOCAL, 10);
  await conn.query(
    `INSERT INTO admin_user (email, password_hash, role, is_active)
     VALUES (?, ?, 'ADMIN', 1)`,
    [ADMIN_EMAIL_LOCAL, passwordHash],
  );
  log(`· admin local: ${ADMIN_EMAIL_LOCAL} (password en docs/runbook.md, solo desarrollo)`);

  // Site config
  for (const cfg of SITE_CONFIG) {
    await conn.query(
      'INSERT INTO site_config (config_key, value_text) VALUES (?, ?)',
      [cfg.config_key, cfg.value_text],
    );
  }
  log(`· site_config: ${SITE_CONFIG.length}`);
}

module.exports = {
  seedDatabase,
  clearDevData,
  ADMIN_EMAIL_LOCAL,
  ADMIN_PLAIN_LOCAL,
  CATEGORIES,
  PRODUCTS,
  EVENTS,
};
