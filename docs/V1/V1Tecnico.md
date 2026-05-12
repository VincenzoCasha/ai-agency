# CRUDO - V1 Tecnico para Opus

Documento operativo para programar la V1 de CRUDO usando Claude Opus como agente de desarrollo.

Fuentes obligatorias:
- `docs/V1/CRUDO_V1_Visual_Master_Plan.html`
- `docs/AGENTS_Javi.md`

Este documento no sustituye a esas fuentes. Es una guia de ejecucion por fases con prompts copiables para que Opus implemente la web sin desviarse del alcance del V1.

## 0. Como usar este documento

1. Abre una sesion nueva de Opus por fase o subfase.
2. Pega siempre primero el **Prompt base minimo y fijo**.
3. Despues pega el prompt de la fase que toque.
4. No avances a la fase siguiente hasta que la fase actual tenga build, tests y criterios de aceptacion verdes.
5. Si Opus propone cambios de alcance, dependencias nuevas o arquitectura distinta, debe justificarlo contra `docs/V1/CRUDO_V1_Visual_Master_Plan.html` y `docs/AGENTS_Javi.md`. Si no hay justificacion clara, se rechaza.

## 0.1 Estado vivo del proyecto

Esta seccion convierte `V1Tecnico.md` en la fuente de contexto operativo del proyecto. Cada vez que Opus empiece a desarrollar debe leer primero este bloque para saber por donde vamos, que esta implementado, que falta, que esta bloqueado y cual es la siguiente fase correcta.

Regla de oro:
- Al inicio de cada sesion, Opus debe leer este bloque y no asumir que el proyecto esta desde cero.
- Al final de cada sesion con cambios reales, Opus debe actualizar solo esta seccion y, si aplica, el checklist final.
- No se deben reescribir fases ya documentadas salvo que el usuario lo pida.
- Si el codigo contradice este estado, Opus debe corregir el estado vivo o avisar antes de seguir.

### Estado actual resumido

```yaml
project: CRUDO V1
state_version: 1
last_updated: 2026-05-12
current_phase: 8.5
current_phase_name: "Refinamiento visual con assets reales"
current_focus: "Fase 8.5 completada. Pipeline mínimo `public/img/` con 13 assets reales (1 Gemini hero + 6 lifestyle + 4 brand + 1 about + 2 mascotas). 5 componentes de marca en `src/components/brand/`: RetroSign (cartel retroiluminado terracota), SaffronTileBackground (azulejo amarillo SVG), LifestylePhoto (alt requerido), BrandSticker (logo decorativo), AnimalQuesero (mascotas). Tokens Tailwind nuevos: crudo-saffron, crudo-terracota, crudo-bone. Hero refactor con imagen Gemini y overlay gradient izquierdo respetando espacio negativo intencional. SeasonalShowcase / VisitBlock / InstagramStrip / CategoryStrips refactorizados con fotos lifestyle reales y RetroSign eyebrows. Nuevo MaridajesStrip con SaffronTileBackground subtle entre CategoryStrips y EventsTeaser. ProductCard y ProductGallery con fallback editorial por tipo (CHEESE→tabla-quesos-vino, WINE→cata-vinos-naturales) en lugar de placeholder gris. Footer easter egg con BrandSticker rotado. 8 tests nuevos (RetroSign 3 + LifestylePhoto 3 + ProductCard fallback 2). 143/143 verde, lint limpio, build Vite 1706 módulos / 644KB JS gzip 177KB. Reglas vino/no alcohol intactas, contratos API sin cambios.\n\n--- Estado previo Fase 8 ---\nFase 8 completada. Home real con Hero full-bleed (overlay rgba(26,31,20,0.55), H1 Cormorant italic, eyebrow 'Vinos y quesos · Madrid', CTAs Reservar mi tabla + Cómo llegar, indicador abierto/cerrado), SeasonalShowcase con productos `seasonal=true`, CategoryStrips (Quesos / Tablas / Temporada), EventsTeaser con 3 eventos futuros, InstagramStrip editorial (sin API real), VisitBlock con direccion+horarios+Maps+WhatsApp. Catalogo `/catalogo`, `/catalogo/quesos`, `/catalogo/vinos`, `/catalogo/temporada` compartiendo `CatalogView` (toolbar con busqueda `q`, filtro categoria, toggle seasonal, limpiar filtros). ProductCard mobile-first con aspect-ratio 1/1, tags Temporada/Destacado/Agotado, precio en JetBrains Mono, CTA divergente: vino -> WhatsApp con texto prellenado `Hola, me interesa {nombre}. ¿Lo tenéis disponible en CRUDO?`, no alcohol -> `Añadir`. PDP `/producto/:slug` con ProductGallery (con miniaturas), ProductMeta, ProductLongRead (leche/tratamiento/intensidad/region/productor + historia + maridaje), RelatedProducts. Wine guard PDP: vino nunca renderiza AddToTablaButton (test cubre). Schema.org Product inyectado en JSON-LD. tablaDraft (localStorage + subscribe pattern) rechaza alcohol con AlcoholInTablaError; useTablaDraft hook expone count para StickyCTA y Hero. analytics.js dispara select_item / wine_pairing_whatsapp_click / whatsapp_click / maps_click solo con consentimiento. Lint 0 errores, build Vite 1701 modulos 347KB JS gzip 111KB, tests 135/135 verde (23 nuevos de cliente). Inventario visual real catalogado en §7.bis (1 Gemini hero + 17 fotos local + branding) y nuevas sub-secciones de assets inyectadas en Fases 8.5/9/10/12/14."
next_recommended_prompt: "Fase 9 - Mi Tabla frontend y pickup flow"
overall_status: "REVIEW_READY"
visual_assets_index: "§7.bis Inventario visual de assets reales (autoritativo). Fuente: images/ + docs/V1/Photos/ + docs/V1/Crudo/."
```

### Leyenda de estados

- `NOT_STARTED`: no se ha empezado.
- `IN_PROGRESS`: se esta implementando.
- `BLOCKED`: no se puede avanzar sin decision, contenido, credenciales o correccion previa.
- `REVIEW_READY`: implementado y pendiente de revision humana.
- `DONE`: implementado, probado y aceptado.
- `DEFERRED`: aplazado explicitamente a V1.1/V2.

### Fases y progreso

| Fase | Nombre | Estado | Implementado | Falta | Bloqueos / notas |
|------|--------|--------|--------------|-------|------------------|
| 0 | Preparacion, repo y contexto | REVIEW_READY | Estructura monolito (`src/`, `server/`, `db/`, `uploads/`, `infra/`, `.github/`), `README.md`, `.gitignore`, `.env.example`, `docs/discovery.md`, `docs/content-checklist.md`, `docs/runbook.md`, `docs/owner-admin-guide.md`, `infra/plesk/README.md`, `.github/workflows/README.md`, `.gitkeep` en carpetas vacias | Sin codigo funcional — pendiente Fase 1 | Sin bloqueos |
| 1 | Scaffold monolito Node.js Express | REVIEW_READY | `package.json`, `server.js`, `server/app.js`, `server/config/env.js`, `server/routes/health.routes.js`, `server/controllers/health.controller.js`, `server/services/health.service.js`, `server/middleware/` (error-handler, not-found, validate-request, async-handler), `server/utils/problem.js`, `db/pool.js`, `tests/health.test.js`, `vitest.config.mjs`, `eslint.config.js`, `package-lock.json` | `npm test` 3/3 OK · `npm run lint` 0 errores | Sin bloqueos |
| 2 | Modelo de datos MariaDB y seed local | REVIEW_READY | Migraciones `001_create_core_schema.sql` (17 tablas: product+product_variant+product_image+product_category, category, campaign+campaign_product, event+event_reservation, inquiry, pickup_order+pickup_order_item, newsletter_subscriber, admin_user, consent_log, audit_log, site_config) y `002_create_indexes.sql`. Migration runner con `schema_migrations` y idempotencia. Scripts npm `db:migrate`/`db:seed`/`db:reset` (abortan en production). Seed dev con 8 categorias, 11 productos (4+ quesos, 2 vinos, 2 tablas con variantes con/sin maridaje, 1 OTHER, 4+ seasonal), 1 campana activa, 2 eventos futuros, 1 admin local con bcrypt, site_config (pickup_paused/capacity). Repositories (product, category, event) y services (catalog, event, pickup-model con resolvePickupItem y findAlcoholItems para Fase 4). Tests 24/24 verde contra crudo_test (migrations, seed, repositories, services). Lint 0 errores. Documentado en docs/runbook.md §3-4. | Endpoints publicos no expuestos (Fase 3). Alcohol guard 422 no implementado (Fase 4). | Sin bloqueos |
| 3 | API Express y servicios publicos | REVIEW_READY | 12 endpoints publicos `/api/v1/{health, products, products/:slug, categories, campaigns/active, campaigns/:slug, events, events/:slug, events/:slug/reservations, inquiries, newsletter/subscribe, consent, site/config}`. Middleware `validate-request` extendido (body/query/params, type/enum/email/pattern/length/min-max, coercion query/params, defaults). Utils nuevos: `cache-control` (Cache-Control 5min) y `hash` (SHA-256+sal). Repositories: product (con paginate/buildFilters/listImages), event (con countSeatsTaken/createReservation/findActiveUpcomingBySlug), category, campaign, inquiry, newsletter (upsertActive), consent, site-config. Services: catalog (paginateProducts, getActiveProductDetail), campaign, event (decorate con seats_left/few_seats_left/is_full + createReservation con 404/422), inquiry (con allowlist publica), newsletter (provider noop o brevo placeholder), consent (expira 24m, hashes), site-config (estatico+env+DB), notification (noop+sink para tests). Validators: products, events (createReservation party_size 1-4), inquiries, newsletter, consent, common. 8 routes nuevas wireadas en app.js con cache header y rate limit POST. 52/52 tests OK (5 routes + services/repos/migrations/seed/health). Lint 0 errores. Smoke API verificado. | Pickup endpoint 422 (Fase 4), admin JWT (Fase 5), frontend (Fase 7+). | Sin bloqueos |
| 4 | Mi Tabla y alcohol guard | REVIEW_READY | Migracion `003_add_pickup_idempotency.sql` con `idempotency_key` (key_value, request_hash, status_code, response_json, resource_type, resource_id, expires_at). Repositorios `idempotency.repository.js`, `pickup-order.repository.js` (transaccion con `getPool().getConnection()` + beginTransaction/commit/rollback) y extension `product.repository.js` (`findActiveByIdsOrSlugs`, `findVariantsByIdsOrSlugs` con bulk lookup en una query). Servicio `idempotency.service.js` (stableStringify + SHA-256, lookup con expiracion, persist con TTL 24h). Servicio `pickup-order.service.js` con `PickupValidationError`, alcohol guard de producto y variante (rechaza todo carrito si hay alguno), validacion fecha (rango 0-14d, formato ISO), validacion slot (HH:mm bloques 30min dentro del horario `PICKUP_HOURS_BY_DOW`), kill switch via `site_config.pickup_paused`, stock OUT 422, precio siempre desde DB. Validador `pickup-orders.validator.js` (envoltura body) + validacion fina items en controller (qty 1-99, identifier requerido). Controller `pickup-orders.controller.js` con rejectClientSuppliedPrices (CLIENT_PRICES_NOT_ALLOWED si llega total_cents/unit_price_cents), idempotency wrapper (replay 201, 409 en conflict), errorToProblem RFC 7807 con `type` custom para alcohol guard. Ruta wireada en app.js bajo `/api/v1/pickup-orders` (rate limit 10/min/IP heredado). NotificationService extendido con `notifyNewPickupOrder` (sink en test, log en dev, fallo tolerado tras commit). 17 tests Fase 4 nuevos (15 routes + 5 idempotency unit). 72/72 tests verde con DB real. Lint 0 errores. Smoke verificado con curl: alcohol guard 422 con type pickup-alcohol-not-allowed, happy path 201 con confirmation_message. README y runbook documentan contrato. | Notification real (WhatsApp/email) en Fase 5+. Cleanup periodico de claves idempotency expiradas no implementado (solo lookup borra las caducadas). | Sin bloqueos |
| 5 | Admin backend y seguridad JWT | REVIEW_READY | Migracion `004_admin_security_and_config.sql` con `admin_refresh_token` (denylist + fingerprint anonimo). Servicios `auth.service` (login bcrypt, rotacion refresh, loadAdminFromAccessToken), `jwt.service` (sign/verify access+refresh con audience/issuer), `audit.service` (sanitize que redacta password/token y trunca strings), `storage.service` (multer JPG/PNG/WebP con MAX_UPLOAD_MB y nombres saneados, deleteByPublicUrl con guard de path), `admin-product.service` (wine guard 422 WINE_MUST_BE_ALCOHOL, slug conflict 409, soft delete, addImage/deleteImage con audit), `admin-event.service` (slug+date validation, soft delete), `admin-campaign.service` (single active enforcement con countActiveOthers), `admin-inquiry/pickup-order/event-reservation.service` (status enums + audit), `admin-site-config.service` (whitelist 3 keys, bulkSet), `admin-dashboard.service` (compact + KPIs por periodo). Repositories admin extendidos (admin-user findActiveByEmail/findById, admin-refresh-token CRUD, audit-log create/listRecent, product/event/campaign/inquiry/pickup-order adminPaginate y mutations). Middleware `authenticate-admin.js` (Bearer + req.admin) y `require-role.js` (helper futuro). 6 validators (admin-auth/products/events/campaigns/status/site-config con paginationRules+slugRule reutilizados). 9 controllers + 9 routes (admin-auth/dashboard/products/events/campaigns/inquiries/pickup-orders/event-reservations/site-config) wireadas en server/app.js bajo /api/v1/admin con JWT obligatorio salvo /auth/login y /auth/refresh, login rate-limited 5/min/IP, public POST limiter ahora skipea /admin/. Static `/uploads` servido. Tests admin (auth 10, products 9, dashboard 3, status 8, upload 3, auth.service unit 4, audit.service unit 3) + regression Fase 4 alcohol guard. 112/112 tests OK con DB real. Lint 0 errores. Smoke verificado: login emite tokens, dashboard sin token 401 TOKEN_MISSING, dashboard con token 200, public siguen abiertos. | Frontend admin (Fase 11). Notificacion real WhatsApp/email (cliente). Cleanup periodico de refresh tokens caducados. | Sin bloqueos |
| 6 | Scripts npm, build y despliegue Plesk/Contabo | REVIEW_READY | server.js sirve dist/ con cache correcto si existe (assets 30d, index.html no-cache), aviso honesto si no existe, fallback SPA que NO intercepta /api/* ni /uploads/*, mountFinalHandlers exportado para registrar 404+errorHandler despues de la SPA en produccion, graceful shutdown SIGTERM/SIGINT con failsafe 10s. Scripts npm honestos: build placeholder, build:check, dev/dev:server/dev:client, start, lint, test, test:unit, check, db:migrate/seed/reset, deploy:plesk:notes. .env.example con PUBLIC_BASE_URL y STAGING_BASE_URL. infra/plesk/README.md reescrito (Contabo+Plesk, dominio+SSL, Node app, MariaDB, env vars panel, uploads persistentes, staging noindex+basic-auth, deploy manual, smoke, rollback, seguridad). infra/scripts/backup-notes.md (Plesk Backup Manager diario 30d, restore test trimestral, recuperacion ante desastre con RTO 4h/RPO 24h). infra/scripts/deploy-checklist.md (pre/durante/post). infra/scripts/smoke.sh ejecutable. .github/workflows/pr.yml con MariaDB service para lint+test+build:check; staging.yml y production.yml skeletons con if:false. README actualizado con scripts y despliegue. Eliminado .github/workflows/README.md placeholder. | Frontend Vite real (Fase 7) sustituye build placeholder. Secrets reales y dominio definitivo pendientes del owner antes de habilitar staging.yml/production.yml. | Sin bloqueos |
| 7 | Frontend React/Vite y design system | REVIEW_READY | Scaffold React 19 + Vite + Tailwind operativo: `index.html`, `vite.config.mjs` (proxy `/api` y `/uploads` a backend en dev), `tailwind.config.mjs` con tokens CRUDO (paleta dark editorial, fuentes Cormorant Garamond + Inter + JetBrains Mono), `postcss.config.mjs`. `src/` con `main.jsx`, `App.jsx`, `routes.jsx` y 17 paginas stub (Home, Catalog, Seasonal, Tablas, MyTabla + Confirmation, Events + Detail, About, Contact, CelebrateWithUs, Wholesale, Legal, Privacy, Cookies, AdminEntry, NotFound, Product). Layout (AppShell, Header, Footer, StickyCTA, CookieBanner) + UI primitives (Button, IconButton, Input, Textarea, Select, FieldError, Badge, Tag, Spinner, Modal, PageScaffold). `src/lib/`: api client axios, consent helpers, analytics consent-aware, schema.org helpers, siteConfig, cn (clsx+tailwind-merge). Hooks `useSiteConfig`, `useConsent`. Estilos `tokens.css` + `global.css`. Build Vite verificado (1668 modulos, 546KB JS gzip 162KB, 15KB CSS gzip 4KB). Lint limpio (0 errores). | Pantallas reales con datos del API (Fases 8-11). Tests de componentes (jsdom configurado, sin specs aun). | Sin bloqueos |
| 8.5 | Refinamiento visual con assets reales | REVIEW_READY | Pipeline mínimo `public/img/{hero,lifestyle,brand,about}` con 13 assets renombrados (hero-home-cheeseboard, tabla-quesos-vino, bodegon-cartel-crudo, cata-vinos-naturales, vino-natural-mano, owner-mostrador, sticker-crudo, logo-blanco/color/texto, animal-quesero-1/2). 5 componentes de marca en `src/components/brand/`: `RetroSign` (cartel retroiluminado terracota inspirado en IMG_0205), `SaffronTileBackground` (textura azulejo amarillo SVG inline), `LifestylePhoto` (wrapper accesible con aspect-ratio + lazy + alt requerido), `BrandSticker` (logo retro decorativo rotado), `AnimalQuesero` (mascota decorativa). Tokens Tailwind nuevos: `crudo-saffron`, `crudo-saffron-grout`, `crudo-terracota`, `crudo-terracota-deep`, `crudo-bone`. Hero refactor: imagen real Gemini con overlay gradient izquierdo respetando espacio negativo, eyebrow ahora `RetroSign`. SeasonalShowcase / VisitBlock / InstagramStrip / CategoryStrips refactorizados (RetroSign eyebrows, fotos lifestyle en fondo de strips con gradient overlay, InstagramStrip con 4 fotos curadas reales). Nuevo `MaridajesStrip` con SaffronTileBackground + LifestylePhoto. ProductCard y ProductGallery con fallback editorial por tipo (CHEESE→tabla-quesos-vino.jpg, WINE→cata-vinos-naturales.jpg) en lugar de placeholder gris. Footer easter egg con BrandSticker rotado en desktop. 8 tests nuevos: RetroSign (3: texto, sizes, as prop), LifestylePhoto (3: alt requerido throws, lazy/eager, priority fetchPriority), ProductCard fallback CHEESE/WINE (2). 143/143 verde, lint limpio, build Vite 1706 módulos / 644KB JS gzip 177KB. | Optimización WebP/AVIF + script `sharp` (Fase 14). Originales `docs/V1/Photos/` siguen untracked en git (decidir si subirlos o moverlos a Drive). | Sin bloqueos |
| 8 | Public frontend: Home, Catalogo y PDP | REVIEW_READY | Home real (Hero full-bleed con overlay rgba(26,31,20,0.55), H1 Cormorant italic, CTAs Reservar mi tabla + Cómo llegar, abierto/cerrado en vivo, SeasonalShowcase con productos `seasonal=true`, CategoryStrips Quesos/Tablas/Temporada, EventsTeaser con 3 eventos futuros + seats_left, InstagramStrip editorial sin API real, VisitBlock con direccion+horarios+Maps+WhatsApp). 4 rutas catalogo: `/catalogo` general, `/catalogo/quesos` (type=CHEESE), `/catalogo/vinos` (type=WINE), `/catalogo/temporada` (seasonal=true), todas alimentadas por `CatalogView` compartido (toolbar busqueda `q` con debounce 300ms, filtro categoria, toggle seasonal, limpiar filtros, EmptyState/skeleton/error states). ProductCard aspect-ratio 1/1, tags Temporada/Destacado, StockBadge (Agotado/Pocas unidades), precio formateado es-ES en JetBrains Mono, CTA divergente: vino -> WhatsApp con texto prellenado `Hola, me interesa {nombre}. ¿Lo tenéis disponible en CRUDO?`, no alcohol -> `Añadir`. PDP `/producto/:slug` con ProductGallery (miniaturas accesibles), ProductMeta (eyebrow productor·region, H1, precio, CTA), ProductLongRead (leche/tratamiento/intensidad/origen/productor + historia + maridaje), RelatedProducts. Wine guard: PDP de vino NUNCA renderiza AddToTablaButton, muestra WineWhatsAppButton + texto "Los vinos se reservan y se pagan en CRUDO." Schema.org Product inyectado en JSON-LD. tablaDraft (localStorage + subscribe pattern) rechaza alcohol con AlcoholInTablaError; useTablaDraft expone count, items, addItem/removeItem/setQuantity/clear. StickyCTA muestra count en mobile cuando hay items. Hero CTA primario va a /mi-tabla si hay items, /catalogo si no. analytics.js dispara select_item / wine_pairing_whatsapp_click / whatsapp_click / maps_click consent-aware. Hooks: useProducts, useProduct, useCategories, useActiveCampaign, useEvents, useTablaDraft. lib/whatsapp.js (buildProductInquiryUrl + variantes). Tests cliente nuevos: tablaDraft (8 incluyendo alcohol-reject + cap 99 + persistencia localStorage), ProductCard (4 incluyendo vino-no-Añadir y OUT-disabled), ProductMeta (3 incluyendo PDP wine guard), Hero (2 incluyendo sin texto ingles), EmptyState (2), whatsapp helpers (4). | Tests Playwright E2E (Fase 12). Hero placeholder usa gradiente CSS — imagen real owner pendiente. InstagramStrip editorial sin Instagram API. Sin meta description dinamica por ruta avanzada (Fase 12). | Sin bloqueos |
| 9 | Mi Tabla frontend y pickup flow | NOT_STARTED | Nada | Store, drawer, form, confirmacion, analytics | Pendiente Fase 8 y Fase 4 |
| 10 | Eventos, contacto, newsletter, sobre y mayoristas | NOT_STARTED | Nada | Rutas publicas secundarias y formularios | Pendiente Fase 3 y Fase 7 |
| 11 | Admin frontend movil | NOT_STARTED | Nada | Login, dashboard, CRUD UI, pedidos, consultas | Pendiente Fase 5 y Fase 7 |
| 12 | Legal, cookies, SEO, analytics y prerender | NOT_STARTED | Nada | Legal, consent, GA4/Pixel, sitemap, schema, prerender | Pendiente frontend publico |
| 13 | Testing E2E, accesibilidad, performance y QA | NOT_STARTED | Nada | Playwright, axe, Lighthouse, QA | Pendiente flujos principales |
| 14 | Contenido real, imagenes y carga inicial | NOT_STARTED | Nada | Productos, fotos, eventos, campana, copy | Bloqueado por contenido owner si no existe |
| 15 | Launch, staging y production | NOT_STARTED | Nada | Staging, production, monitoring, backups, checklist | Pendiente QA y dominio/infra |

### Funcionalidades implementadas

Actualizar esta lista al terminar cada sesion con codigo. Mantener bullets concretos y verificables.

- Fase 0 completada: estructura monolito, documentacion operativa, placeholders seguros.
- Fase 1 completada: scaffold Express, health endpoint GET /api/v1/health, RFC 7807 error handler, pool MariaDB lazy, tests smoke 3/3, ESLint 0 errores.
- Fase 2 completada: schema V1 en MariaDB (17 tablas + schema_migrations) con `is_alcohol` NOT NULL default 0, indices y CHECK constraints (milk_type/treatment/intensity, stock, status, qty>0, prices>=0). Migration runner con tracking idempotente. Scripts `db:migrate`/`db:seed`/`db:reset` (production aborta). Seed dev (8 categorias, 11 productos con variantes de maridaje, 1 campana, 2 eventos, admin local, site_config). Repositories y services base. Tests 24/24 OK con DB real, lint 0 errores.
- Fase 3 completada: API publica `/api/v1` con 12 endpoints (products + slug, categories, campaigns active+slug, events + slug + reservations, inquiries, newsletter, consent, site/config, health). Middleware validate-request extendido (body/query/params, email/enum/length/pattern, coercion). Cache-Control 5min en GET publicos, rate limit 10/min/IP en POST. RFC 7807 en errores. Repositories (product paginate, event capacity, campaign, inquiry, newsletter, consent, site-config). Services con reglas (events seats_left/few_seats_left/is_full, inquiries allowlist publica, newsletter provider noop, consent expira 24m con hashes SHA-256, site-config combinando estatico+env+DB, notification noop con sink). 52/52 tests OK con DB real, lint 0 errores. Smoke API verificado con curl.
- Fase 4 completada: `POST /api/v1/pickup-orders` (Mi Tabla) con alcohol guard 422 RFC 7807 a nivel producto y variante, carrito mixto rechaza todo y no persiste nada, precio siempre desde DB, transaccion order+items, idempotency con SHA-256 estable y TTL 24h (replay 201 / 409 en conflict), kill switch via site_config.pickup_paused, validacion fecha (0-14d, ISO) y slot (HH:mm bloques 30min dentro del horario por DOW), stock OUT 422, mensaje de confirmacion indicando pago en CRUDO al recoger y WhatsApp <24h, NotificationService.notifyNewPickupOrder (sink en test, fallos tolerados tras commit). Migracion 003 idempotency_key. 17 tests nuevos, 72/72 verde, lint 0 errores. Smoke API: alcohol -> 422 con type pickup-alcohol-not-allowed, happy path -> 201.
- Fase 5 completada: backend admin con JWT (access 15m + refresh 7d con rotacion y denylist en admin_refresh_token). 28 endpoints `/api/v1/admin/**` para auth, dashboard mobile, KPIs por periodo, CRUD productos (con wine guard, soft delete, patch stock one-tap, upload imagenes via multer JPG/PNG/WebP), CRUD eventos y campanas (single active campaign), status updates auditados de pickup-orders/inquiries/event-reservations, site config admin con whitelist y kill switch verificado end-to-end. Audit log centralizado con sanitize (redacta password/token, trunca >500 chars). Storage local Plesk-friendly bajo /uploads. Login rate-limited 5/min/IP. Public POST limiter ahora skipea /admin. 40 tests admin nuevos (auth+products+dashboard+status+upload+regression), 112/112 verde, lint 0 errores.
- Fase 6 completada: server.js refactorizado con SPA estatica condicional (Cache-Control assets 30d, index.html no-cache), fallback que excluye /api/* y /uploads/*, aviso honesto si dist/ falta, graceful shutdown con failsafe; mountFinalHandlers exportado desde server/app.js para encajar 404+errorHandler despues de la SPA en produccion. Scripts npm honestos (build placeholder, build:check, check, test:unit, deploy:plesk:notes). infra/plesk/README.md reescrito (guia Contabo+Plesk accionable con SSL, Node app, MariaDB, env, staging noindex+basic-auth, smoke, rollback). infra/scripts/{backup-notes,deploy-checklist}.md + smoke.sh ejecutable. CI pr.yml con MariaDB service para lint+test+build:check; staging.yml y production.yml skeletons con if:false. README actualizado.

### Funcionalidades pendientes criticas de V1

- Cliente real Brevo para newsletter (placeholder en su sitio en Fase 3).
- Cliente WhatsApp/email transaccional para NotificationService.
- Cleanup periodico de claves idempotency caducadas (lookup borra al pasar pero sin job batch).
- Cleanup periodico de admin_refresh_token caducados (mismo patron).
- Frontend admin movil (Fase 11) que consuma estos 28 endpoints.
- Public frontend.
- `Mi Tabla`.
- Admin movil.
- Cookie consent AEPD.
- SEO/prerender.
- Analytics gated by consent.
- scripts npm + despliegue Plesk/Contabo.
- Tests E2E.

### Decisiones confirmadas

- Stack V1: JavaScript, Node.js + Express, MariaDB con paquete `mariadb`, React 19 + Vite, Tailwind CSS, PostCSS, Autoprefixer, monolito CommonJS, `server.js` sirviendo `dist/`, despliegue en Contabo con Plesk.
- V1 sin pago online.
- V1 sin venta online de alcohol.
- Posicionamiento: **TIENDA de quesos primero, cheese bar segundo, tienda de vinos tercero, wine bar cuarto**. CRUDO no se comunica como wine bar.
- Anti-referencia explicita: la web no debe parecerse a https://formaje.com.
- Catalogo publico V1 solo expone **Quesos de temporada** y **Tablas/Cajas para llevar (3, 6, 8)**. Sin catalogo de vinos publico.
- Tablas con maridaje de vino blanco/tinto: la variante con vino **se gestiona siempre via WhatsApp en V1**; solo la variante sin maridaje entra en `Mi Tabla`. No hay vino por defecto sugerido: el owner concreta maridaje, productor y precio por WhatsApp con cada cliente.
- Mix de ingresos confirmado: 60% barra, 35% queso to-go (objetivo V1 principal), 5% eventos.
- SLA pickup confirmado: 24 horas dentro del horario de apertura.
- Filtros de catalogo de queso: Nombre, Tipo de leche (vaca/oveja/cabra/mixta), Tratamiento (cruda/pasteurizada/termizada), Region, Intensidad, Maridaje.
- Stock visibility: mostrar `pocas unidades` y `agotado`.
- `Mi Tabla` solo para no alcohol.
- Razon social: CRUDO QUESOS S.L.U · CIF B-19953694 · Calle Jose Ortega y Gasset 81, 28006 Madrid.
- Horario: Lun-Vie 17:30-22:30/23:00 · Sab 12:30-22:00 · Dom 12:30-20:00. Cierre las ultimas 2 semanas de agosto.
- Capacidad pickup: 15 pedidos/dia. Kill switch admin para pausar pickups.
- WhatsApp owner (notificaciones) distinto del WhatsApp publico.
- Sin manifesto. Sin foto del owner en la web.
- Eventos iniciales V1 confirmados: Spritz and Cheese with Mikks (29/05), Spritz/Lemonade/Grilled Cheese with Mikks (30/05), Bodegas Telperion at CRUDO (06/06).
- Nueva pagina obligatoria: `Celebra tu evento con nosotros` (privatizaciones).
- Owner sin abogado: legales V1 desde plantillas auditadas AEPD.
- Cookie provider: custom AEPD-compliant en V1.
- Google Business Profile: existe. Meta Business Manager: no existe.
- PayGold: no integrado en web V1; queda como flujo offline manual del owner.
- Espanol como idioma primario; ingles via Google Translate.
- Admin disenado para owner single-operator, menos de 5 minutos al dia.
- `docs/AGENTS_Javi.md` no se modifica.

### Bloqueos actuales

- No hay codigo inicial todavia.
- ~~Logo, paleta y tipografia del owner pendientes~~ — logos y branding disponibles en `docs/V1/Crudo/` (Color V1/V2/Blanco/Negro PNG, Texto, Completo, Animales Queseros 1/2). Tipografia primaria sigue siendo Cormorant Garamond + Inter (no se ha recibido alternativa del owner; no es bloqueo).
- Lista mensual de quesos de temporada pendiente de carga via Drive (owner subira ejemplo).
- Definiciones definitivas de las 3 tablas (3/6/8 quesos): contenido por defecto, precios, maridajes blancos y tintos sugeridos.

### Pendientes de decision del owner

- Dominio final (`crudo.es` u otro) y registrador.
- Acceso DNS (Cloudflare o registrador) y plan Plesk definitivo.
- WhatsApp publico exacto y WhatsApp owner para notificaciones.
- Brevo confirmado o alternativa para newsletter y emails transaccionales.
- Apertura o no de Meta Business Manager antes de launch (afecta Pixel V1).
- Recomendacion de proveedor cookie banner si quiere upgrade (Cookiebot/Iubenda) sobre el custom AEPD.
- Validacion final de Aviso Legal, Privacidad y Cookies generados desde plantillas.
- Precios de tablas 3/6/8 con y sin maridaje.
- Campanas para meses pico (marzo, mayo, junio, octubre, diciembre).

### Registro de sesiones

Anadir una linea por sesion de trabajo. Formato recomendado:

```text
- 2026-05-04 | Fase docs | Creado V1Tecnico.md | Verificacion: lectura/estructura OK | Siguiente: Fase 0
```

Registro:

- 2026-05-04 | Fase docs | Creado V1Tecnico.md con fases y prompts para Opus | Verificacion: estructura revisada | Siguiente: Fase 0
- 2026-05-04 | Fase docs | Organizados documentos en `docs/` y V1 en `docs/V1/`; creado roadmap visual V1 | Verificacion: rutas revisadas | Siguiente: Fase 0
- 2026-05-04 | Fase docs | Stack actualizado a monolito JavaScript: React 19/Vite + Node.js/Express + MariaDB + Tailwind; despliegue objetivo Contabo + Plesk | Verificacion: documentos en revision | Siguiente: Fase 0
- 2026-05-06 | Fase docs | Integradas respuestas del owner (seccion 0.2): reposicionamiento TIENDA de quesos, eliminacion de catalogo de vinos publico, tablas (3/6/8) con maridaje opcional, datos fiscales CRUDO QUESOS S.L.U, horarios, capacidad pickup 15/dia, kill switch, eventos iniciales, nueva pagina "Celebra tu evento", eliminacion de manifesto y foto owner | Verificacion: estructura revisada, sin codigo aun | Siguiente: Fase 0
- 2026-05-06 | Fase docs | Resueltas 4 preguntas abiertas del owner: tabla con maridaje siempre via WhatsApp en V1, mix de ingresos 60/35/5, sin vino por defecto sugerido (owner acuerda por WhatsApp), SLA pickup 24h dentro del horario de apertura | Verificacion: §0.2, decisiones, pendientes y master plan §19 actualizados | Siguiente: Fase 0
- 2026-05-07 | Fase 0 | Estructura monolito creada: src/, server/, db/, uploads/, infra/, .github/. Archivos: README.md, .gitignore, .env.example, docs/discovery.md, docs/content-checklist.md, docs/runbook.md, docs/owner-admin-guide.md, infra/plesk/README.md, .github/workflows/README.md, .gitkeep en carpetas vacias | Verificacion: git status OK, sin secretos reales en .env.example | Siguiente: Fase 1
- 2026-05-07 | Fase 1 | Scaffold monolito: package.json, server.js, server/app.js, server/config/env.js, health endpoint (route+controller+service), middleware RFC 7807 (error-handler, not-found, validate-request, async-handler), server/utils/problem.js, db/pool.js, tests/health.test.js, vitest.config.mjs, eslint.config.js | Verificacion: npm test 3/3 OK · npm run lint 0 errores · Node 20.20.2 | Siguiente: Fase 2
- 2026-05-08 | Fase 2 | Modelo de datos: db/migrations/001_create_core_schema.sql (17 tablas core + product_variant + site_config), db/migrations/002_create_indexes.sql, db/migration-runner.js con schema_migrations, db/migrate.js, db/seed.js, db/reset.js, db/seeds/dev-seed.js (bcryptjs admin local, 8 cat, 11 productos, variantes con maridaje, 1 campana, 2 eventos, site_config pickup_paused), repositories product/category/event, services catalog/event/pickup-model, tests db/migrations + db/seed + repositories/product + services/catalog (24/24 con DB), tests/helpers/db-test.js, vitest config con singleFork+fileParallelism=false, README y docs/runbook.md actualizados, .env.example con DB_TEST_NAME y DB_OVERRIDE, package.json scripts db:migrate/seed/reset reales, dependencia bcryptjs anadida | Verificacion: `npm run db:migrate` aplicadas=2 OK en crudo_dev y crudo_test · `npm run db:seed` OK · `npm test` 24/24 verde · `npm run lint` 0 errores · `NODE_ENV=production npm run db:seed` aborta con exit=1 · `NODE_ENV=production npm run db:reset` aborta con exit=1 | Siguiente: Fase 3
- 2026-05-08 | Fase 3 | API publica: server/middleware/validate-request.js extendido (body/query/params, email/enum/pattern/length/min-max, coercion query/params, defaults), server/utils/cache-control.js (5min SWR), server/utils/hash.js (SHA-256+sal), repositories campaign/inquiry/newsletter/consent/site-config + product (paginate/listImages/findActiveBySlug) + event (countSeatsTaken/createReservation/findActiveUpcomingBySlug), services campaign/inquiry/newsletter/consent/site-config/notification + catalog (paginateProducts/getActiveProductDetail) + event (decorate seats_left/few_seats_left/is_full + createReservation 404/422), 6 validators (products/events/inquiries/newsletter/consent/common con slug+pagination), 8 controllers, 8 routes wireadas en server/app.js (`/api/v1/products`, `/categories`, `/campaigns`, `/events`, `/inquiries`, `/newsletter`, `/consent`, `/site`), 5 test files de routes + smoke services existentes, helper tests/helpers/app-test.js, env.js extendido (BREVO_API_KEY, PUBLIC_WHATSAPP/INSTAGRAM/GOOGLE_MAPS_URL), .env.example actualizado, README con tabla de endpoints, docs/runbook.md §4.bis con notas operativas | Verificacion: `npm test` 52/52 verde · `npm run lint` 0 errores · smoke con curl: GET /health/products/site/config 200 OK, GET /products/no-existe 404 RFC 7807, POST /inquiries con body vacio 400 RFC 7807 con errors[] | Siguiente: Fase 4
- 2026-05-08 | Fase 4 | Mi Tabla backend: db/migrations/003_add_pickup_idempotency.sql (idempotency_key con TTL 24h), repositories idempotency/pickup-order (transaccion con beginTransaction/commit/rollback) + extension product (findActiveByIdsOrSlugs, findVariantsByIdsOrSlugs bulk), services idempotency (stableStringify+SHA-256, lookup/persist con expiracion) y pickup-order (alcohol guard producto+variante 422, carrito mixto rechaza todo, precio desde DB, validacion fecha 0-14d, slot HH:mm bloques 30min por DOW, kill switch site_config.pickup_paused, stock OUT 422, mensaje confirmacion ES con pago tienda y WhatsApp <24h), validator pickup-orders.validator (envoltura body), controller pickup-orders.controller (rejectClientSuppliedPrices, validateItemShapes, idempotency wrapper, errorToProblem RFC 7807 con type custom para alcohol guard), route pickup-orders.routes wireada bajo /api/v1/pickup-orders, NotificationService.notifyNewPickupOrder (sink test, fallo tolerado tras commit), tests pickup-orders.routes.test (15) + idempotency.service.test (5) | Verificacion: `npm test` 72/72 verde con DB real · `npm run lint` 0 errores · smoke con curl: vino -> 422 type pickup-alcohol-not-allowed code ALCOHOL_NOT_ALLOWED_IN_PICKUP con invalid_items, manchego -> 201 con order_id, total_cents, items, confirmation_message en espanol | Siguiente: Fase 5
- 2026-05-08 | Fase 5 | Admin backend + JWT: db/migrations/004_admin_security_and_config.sql (admin_refresh_token con denylist + fingerprint anonimo). Dependencias jsonwebtoken y multer anadidas. Servicios jwt (sign/verify access+refresh con audience/issuer + nonce), auth (login bcrypt, rotacion refresh, loadAdminFromAccessToken), audit (sanitize redacta passwords/tokens y trunca strings >500), storage (multer JPG/PNG/WebP con MAX_UPLOAD_MB, nombres saneados, deleteByPublicUrl con guard de path), admin-product (wine guard 422 WINE_MUST_BE_ALCOHOL, slug 409, soft delete, addImage/deleteImage), admin-event (slug+date validation), admin-campaign (single active enforcement), admin-inquiry/pickup-order/event-reservation (status updates auditados), admin-site-config (whitelist 3 keys), admin-dashboard (compact + KPIs today/7d/30d con pickup by_status/revenue/avg ticket/reservas/newsletter). Repositories admin-user/admin-refresh-token/audit-log + extensiones product/event/campaign/inquiry/pickup-order/site-config con adminPaginate y mutations. Middleware authenticate-admin (Bearer + req.admin) con require-role helper. 6 validators admin (auth/products/events/campaigns/status/site-config). 9 controllers + 9 routes admin wireadas en server/app.js bajo /api/v1/admin con JWT obligatorio salvo /auth/login y /auth/refresh, login rate-limited 5/min/IP, public POST limiter skipea /admin. Static `/uploads` servido por Express. Helpers tests/helpers/admin-test.js. Tests admin-auth (10) + admin-products (9) + admin-dashboard (3) + admin-status (8 con kill switch verificado) + admin-upload (3 con multer real) + auth.service unit (4) + audit.service unit (3) + regression alcohol guard. vitest.config con JWT_SECRET/COOKIE_SECRET/UPLOADS_DIR para tests | Verificacion: `npm test` 112/112 verde con DB real (40 tests admin nuevos) · `npm run lint` 0 errores · smoke con curl: login emite access+refresh tokens · GET /admin/dashboard sin token -> 401 TOKEN_MISSING · con token -> 200 con bloques compactos · public /products sigue 200 abierto sin auth · refresh rota y reuso del viejo -> 401 REFRESH_TOKEN_REVOKED | Siguiente: Fase 6
- 2026-05-08 | Fase 6 | Operativa Plesk/Contabo: server.js con mountStaticDist (Cache-Control 30d/no-cache, fallback excluye /api/* y /uploads/*, aviso honesto si dist/ falta, graceful shutdown con failsafe 10s); server/app.js exporta mountFinalHandlers para 404+errorHandler post-SPA en produccion. package.json con scripts honestos (build placeholder con mensaje claro, build:check sin fingir, check=lint+test, test:unit, dev:client placeholder, deploy:plesk:notes). .env.example con PUBLIC_BASE_URL/STAGING_BASE_URL. infra/plesk/README.md reescrito (Contabo+Plesk paso a paso, dominio+SSL, Node app, MariaDB con DB separada staging, env vars panel, uploads persistentes, staging con noindex header + robots Disallow + basic-auth, deploy SSH paso a paso, smoke checklist post-deploy, rollback con/sin migracion, seguridad). infra/scripts/backup-notes.md (Plesk Backup Manager diario 30d con cifrado, restore test trimestral en staging, recuperacion ante desastre con RTO 4h/RPO 24h). infra/scripts/deploy-checklist.md (pre/durante/post). infra/scripts/smoke.sh ejecutable con bash+curl+jq. .github/workflows/pr.yml con MariaDB 10.11 service container, npm ci+lint+migrate test+test+build:check; staging.yml y production.yml como skeletons documentados con if:false hasta que owner finalice secrets. Eliminado .github/workflows/README.md placeholder. README.md y docs/runbook.md actualizados | Verificacion: `npm test` 112/112 verde · `npm run lint` 0 errores · `npm run build` placeholder honesto exit 0 sin generar dist falso · `npm run build:check` confirma estado real · server smoke en NODE_ENV=production sin dist -> arranca con AVISO claro y endpoints OK · server smoke con dist/ minimo -> sirve SPA en `/` y rutas SPA random, /api 404 sigue siendo problem+json, /uploads no existente NO devuelve index.html, Cache-Control assets 30d e index.html max-age=0 · infra/scripts/smoke.sh contra :3000 -> 6/6 ok | Siguiente: Fase 7
- 2026-05-12 | Fase 7 | Scaffold frontend React 19 + Vite 6 + Tailwind con tokens CRUDO: `index.html`, `vite.config.mjs` (proxy `/api` y `/uploads` a backend dev), `tailwind.config.mjs` (paleta dark editorial, Cormorant Garamond + Inter + JetBrains Mono), `postcss.config.mjs`. `src/` con main.jsx, App.jsx, routes.jsx; 17 paginas stub (Home, Catalog, Seasonal, Tablas, MyTabla + Confirmation, Events + Detail, About, Contact, CelebrateWithUs, Wholesale, Legal, Privacy, Cookies, AdminEntry, NotFound, Product); layout (AppShell, Header, Footer, StickyCTA, CookieBanner); UI primitives accesibles (Button, IconButton, Input, Textarea, Select, FieldError, Badge, Tag, Spinner, Modal, PageScaffold); lib (api axios, consent, analytics consent-aware, schema.org, siteConfig, cn); hooks useSiteConfig/useConsent; tokens.css + global.css. eslint extendido a `src/`. | Verificacion: `npm run build` -> 1668 modulos, 546KB JS gzip 162KB, 15KB CSS gzip 4KB · `npm run lint` 0 errores tras eliminar `eslint-disable-next-line no-console` huerfano en IconButton · `npm test` 112/112 verde (sin specs de cliente aun) | Siguiente: Fase 8
- 2026-05-12 | Fase docs | Inventario visual catalogado: revisadas 17 fotos en docs/V1/Photos/ + 1 Gemini hero en images/ + branding en docs/V1/Crudo/. Anadidas a V1Tecnico.md: §7.bis (inventario autoritativo asset->uso con patron visual del local), §17.1 Fase 8.5 (prompt completo para refinamiento visual con componentes de marca RetroSign/SaffronTileBackground/LifestylePhoto/BrandSticker/AnimalQuesero + refactor Hero/Cards/Footer), sub-bloques "Assets visuales" en Fases 9 (Mi Tabla hero/empty/success), 10 (About/Eventos/Mayoristas/Contacto + pipeline minimo), 12 (OG images 1200x630 por ruta) y 14 (mapeo completo origen->destino + pipeline sharp + EXIF rotation). Actualizado §0.1 con visual_assets_index, fila Fase 8.5 en tabla, bloqueo de logos resuelto. Verificacion: lectura/estructura OK, sin cambios de codigo. Siguiente: Fase 8.5 o continuar con commit/push de Fase 8.
- 2026-05-12 | Fase 8.5 | Refinamiento visual con assets reales. Pipeline mínimo: copiados 13 assets desde `images/` + `docs/V1/Photos/` + `docs/V1/Crudo/` a `public/img/{hero,lifestyle,brand,about}` con naming semántico kebab-case. Tokens CRUDO nuevos: crudo-saffron #E8B547, crudo-saffron-grout #C99A36, crudo-terracota #FF8A47, crudo-terracota-deep #E0703A, crudo-bone #F5EFE6. 5 componentes de marca en `src/components/brand/`: RetroSign (cartel retroiluminado terracota con shadow inset orange-glow), SaffronTileBackground (SVG pattern azulejo amarillo con intensity subtle/normal), LifestylePhoto (alt obligatorio con throw si vacío + lazy/eager priority), BrandSticker (logo color rotado decorativo aria-hidden), AnimalQuesero (mascotas decorativas). Hero refactor: imagen real `/img/hero/hero-home-cheeseboard.png` con overlay gradient izquierdo `linear-gradient(90deg, rgba(26,31,20,0.78) 0%, 0.62 35%, 0.30 65%, 0 100%)` respetando espacio negativo intencional del Gemini; eyebrow ahora RetroSign. SeasonalShowcase eyebrow RetroSign "De temporada". CategoryStrips refactor con fotos lifestyle de fondo (tabla-quesos-vino, bodegon-cartel-crudo, cata-vinos-naturales) y overlay gradient. VisitBlock con RetroSign + LifestylePhoto bodegón. InstagramStrip placeholder reemplazado por 4 fotos curadas reales. MaridajesStrip nuevo entre CategoryStrips y EventsTeaser (SaffronTileBackground subtle + RetroSign + LifestylePhoto cata + copy "Los vinos se reservan y se pagan en CRUDO"). ProductCard fallback editorial por tipo CHEESE/WINE (en lugar de placeholder gris CRUDO); ProductGallery PDP idem con productType prop. Footer easter egg con BrandSticker rotation -12 size 84 en esquina derecha desktop. Tests nuevos: RetroSign (3), LifestylePhoto (3 incluyendo throw si alt vacío), ProductCard fallback CHEESE/WINE (2). | Verificación: `npm run lint` 0 errores (tras corregir fetchPriority camelCase) · `npm test` 143/143 verde (135 anteriores + 8 nuevos) · `npm run build` 1706 módulos 644KB JS gzip 177KB · smoke local pendiente verificar Hero visual con dev server. Originales `docs/V1/Photos/` y `docs/V1/Crudo/` siguen untracked (decidir tracking más tarde). | Siguiente: Fase 9
- 2026-05-12 | Fase 8 | Frontend publico Home + Catalogo + PDP. Hooks `useProducts`, `useProduct`, `useCategories`, `useActiveCampaign`, `useEvents`, `useTablaDraft`. Lib `whatsapp.js` (buildProductInquiryUrl + variantes), `tablaDraft.js` (localStorage + subscribe pattern, AlcoholInTablaError, cap 99 unidades). Catalog components: `StockBadge`, `EmptyState`, `ProductCard`, `ProductGrid` + `ProductGridSkeleton`, `CatalogToolbar` (busqueda con debounce 300ms, select categoria, toggle seasonal, limpiar filtros), `CatalogView` (compartido por 4 rutas). Product components: `ProductGallery` (miniaturas accesibles), `ProductMeta`, `ProductLongRead` (atributos leche/tratamiento/intensidad/region/productor + historia + maridaje), `WineWhatsAppButton` (texto "Los vinos se reservan y se pagan en CRUDO."), `AddToTablaButton` (feedback "Añadido a Mi Tabla"), `RelatedProducts`. Home components: `Hero` (overlay rgba(26,31,20,0.55), abierto/cerrado en vivo, CTA dinamico segun draft), `SeasonalShowcase`, `CategoryStrips`, `EventsTeaser` (3 eventos + seats_left/few_seats_left/is_full), `InstagramStrip` (placeholder editorial), `VisitBlock`. Pages reescritas: `HomePage`, `CatalogPage`, `SeasonalPage`, `ProductPage` (con buildProductSchema JSON-LD inline, trackSelectItem, useEffect title/meta). Pages nuevas: `CatalogQuesoPage` (type=CHEESE), `CatalogVinosPage` (type=WINE). Rutas anadidas en `routes.jsx`: `/catalogo/quesos`, `/catalogo/vinos`. `StickyCTA` ahora muestra count del draft cuando hay items. Tests cliente: tablaDraft (8: alcohol-reject + cap 99 + persistencia + remove + setQuantity), ProductCard (4: precio+seasonal+Añadir cheese, wine WhatsApp con nombre y wa.me/34xxx, OUT disabled, link a PDP), ProductMeta (3: PDP wine guard nunca Añadir, link WhatsApp con nombre, h1+eyebrow+precio), Hero (2: H1 unico + CTAs + sin texto ingles), EmptyState (2), whatsapp helpers (4). | Verificacion: `npm install` OK (177 paquetes) · `npm run lint` 0 errores · `npm run build` 1701 modulos 347KB JS gzip 111KB CSS 20KB gzip 5KB · `npm test` 135/135 verde (112 backend + 23 cliente nuevos, 60.5s con DB real para backend) · Smoke visual queda pendiente con dev server | Siguiente: Fase 9

### Instrucciones para actualizar este estado

Al final de cada sesion, Opus debe:

1. Actualizar `last_updated`.
2. Actualizar `current_phase`, `current_phase_name`, `current_focus`, `next_recommended_prompt` y `overall_status`.
3. Cambiar el estado de la fase trabajada.
4. Completar `Implementado`, `Falta` y `Bloqueos / notas` con informacion real.
5. Anadir funcionalidades implementadas nuevas.
6. Quitar de pendientes criticos lo que ya este DONE.
7. Anadir decisiones confirmadas nuevas.
8. Anadir bloqueos nuevos si existen.
9. Anadir una linea en `Registro de sesiones`.
10. Actualizar el checklist final si una casilla ya esta realmente hecha y verificada.

No marcar una fase como `DONE` si no pasan sus criterios de aceptacion y verificacion.

## 0.2 Respuestas del owner (2026-05-06) — fuente autoritativa

Este bloque recoge las respuestas formales del owner sobre el V1 Master Plan y **prevalece sobre cualquier otra seccion** de este documento o de los HTML de docs/V1/. Cuando el resto del documento contradiga esta seccion, gana esta seccion: Opus debe actualizar el contenido afectado en cuanto toque la fase correspondiente.

### Posicionamiento de marca (cambio fundamental)

- CRUDO es **TIENDA DE QUESOS** primero, **cheese bar** segundo, **tienda de vinos** tercero, **wine bar** cuarto. El queso siempre va primero, el vino siempre va segundo.
- Concepto principal: TIENDA. NO es un wine bar.
- Eyebrow/headline copy y meta descriptions deben reflejar `TIENDA DE QUESOS · MADRID` (no `VINOS Y QUESOS · MADRID`).
- Brand feeling V1: `Curated. Warm. Artisan. Confident. Local.` Nunca describir CRUDO como wine bar en copy publico.
- **Prohibido**: la web no puede parecerse en estructura, copy, paleta, tipografia o tono a https://formaje.com — tratarlo como anti-referencia explicita.

### Datos fiscales y legales

- Razon social: **CRUDO QUESOS S.L.U**
- C.I.F.: **B-19953694**
- Direccion fiscal: **Calle de Jose Ortega y Gasset 81, 28006 Madrid, Madrid**
- Estos datos se usan en `Aviso Legal`, `Politica de Privacidad`, `Politica de Cookies`, footer publico y firma de emails transaccionales.
- Owner NO tiene abogado: Aviso Legal / Privacidad / Cookies se redactan a partir de plantillas auditadas (AEPD/RGPD) y se entregan al owner para validacion final.
- Owner NO tiene proveedor de cookie banner: V1 implementa banner custom AEPD-compliant; recomendar Cookiebot o Iubenda solo si el owner pide upgrade.

### Catalogo: cambio estructural

- **Eliminar el catalogo de vinos como entidad publica**. El vino no aparece en navegacion, no tiene rutas propias y no tiene PDP independiente.
- El catalogo publico se reduce a **dos secciones**:
  1. `Quesos de temporada` — los quesos del mes/temporada, rotan **mensualmente** segun decida el owner.
  2. `Tablas y cajas para llevar` — producto principal de la tienda. Formatos fijos: **3 quesos**, **6 quesos**, **8 quesos**. Cada formato tiene variantes opcionales de maridaje: sin maridaje, con maridaje de **vino blanco**, con maridaje de **vino tinto**.
- La variante con maridaje de vino se considera item con alcohol y se gestiona **siempre via WhatsApp en V1** (confirmado por owner 2026-05-06). Solo la variante **sin maridaje** entra en `Mi Tabla`; las variantes con vino blanco o tinto disparan el flujo `WineWhatsAppButton` con mensaje prellenado. No se selecciona vino por defecto: el owner acuerda el maridaje concreto (productor/region/precio) por WhatsApp con cada cliente.
- Filtros de catalogo de quesos (todos opcionales y combinables): **Nombre**, **Tipo de leche** (vaca, oveja, cabra, mixta), **Tratamiento de leche** (cruda, pasteurizada, termizada), **Region**, **Intensidad** (suave, media, intensa), **Maridaje**.
- Visibilidad de stock: **mostrar** `pocas unidades` y `agotado`. No ocultar.

### Sitemap publico V1

- Home
- Catalogo (landing del catalogo)
  - Quesos de temporada
  - Tablas y cajas para llevar
- Detalle de producto (queso o tabla)
- Eventos
- Detalle de evento
- **Celebra tu evento con nosotros** (nueva seccion: privatizaciones, cumpleanos, reuniones, catas privadas)
- Sobre CRUDO
- Contacto
- Mayoristas
- Mi Tabla
- Confirmacion
- Aviso Legal / Privacidad / Cookies
- Admin (oculto)

Las rutas `/catalogo/quesos` y `/catalogo/vinos` quedan **eliminadas** y se sustituyen por `/catalogo/temporada` y `/tablas`.

### Operativa y horarios

- Horario:
  - Lunes a viernes: **17:30 – 22:30/23:00**
  - Sabado: **12:30 – 22:00**
  - Domingo: **12:30 – 20:00**
- Cierre anual: **ultimas dos semanas de agosto**.
- Capacidad pickup diaria: **15 pedidos/dia maximo**.
- WhatsApp del owner para notificaciones: **distinto** del WhatsApp publico (campos separados en `site_config`: `OWNER_WHATSAPP` interno, `PUBLIC_WHATSAPP` publico).
- **Kill switch** en admin: el owner puede pausar nuevas reservas de pickup en dias saturados. Estado expuesto a frontend para mostrar mensaje "Hoy no admitimos mas pickups, vuelve manana" sin romper la UX.
- SLA de confirmacion pickup: **24 horas dentro del horario de apertura** (confirmado por owner 2026-05-06). Copy publico debe usar literalmente: "Te confirmamos por WhatsApp en menos de 24 horas dentro de nuestro horario de apertura."

### PayGold (pago remoto fuera de tienda)

- El owner usa **PayGold** (link de pago via SMS/email desde el datafono) para clientes que no estan fisicamente en la tienda y quieren regalar producto.
- V1: **no se integra PayGold en la web**. Se documenta como opcion offline que el owner activa manualmente cuando la inquiry pickup viene de fuera de Madrid.
- En la confirmacion de pickup, anadir copy opcional: "Si no puedes recoger en persona, escribenos por WhatsApp y te enviamos un link de pago seguro." (sin promesa de fulfillment online).

### Datos comerciales y marketing

- Revenue semanal medio actual: **900–1100 €**.
- Coste primer hire (Madrid hosteleria, bruto + cargas): **~2000 €/mes** (objetivo financiero del V1).
- Mix de ingresos hoy (confirmado por owner 2026-05-06): **60% consumo en barra**, **35% queso to-go** (objetivo principal de promocion en V1), **5% eventos** (segundo objetivo de promocion). Total 100%.
- Meses pico para campanas: **marzo, mayo, junio, octubre, diciembre**.
- Definicion de exito a 60 dias: incremento de ventas y de impacto en Instagram. Para eventos: lleno completo + lista de espera que justifique abrir segunda fecha.

### Contenido obligatorio antes de construir — actualizado

Cambios sobre la lista del Master Plan §18:

- **Eliminar**: `Brand manifesto (About)` 200–300 palabras. No se redacta manifesto.
- **Eliminar**: `Owner portrait` y fotos del owner en la web. El owner NO quiere su foto en la web. Las fotos personales pueden ir solo en Instagram.
- **Eliminar**: lista de 20–40 productos genericos. Se sustituye por la **lista mensual de quesos de temporada** que el owner subira al drive como ejemplo, mas las definiciones de las **3 tablas/cajas** (3, 6, 8 quesos) con sus variantes de maridaje.
- **Mantener**: hero, fotos de producto en formato cuadrado fondo madera oscura, fotos de ambiente/lifestyle, fotos de eventos, copy de productos, descripciones cortas/largas, copy de newsletter, copy de confirmacion pickup.
- **Anadir**: copy de la nueva seccion `Celebra tu evento con nosotros`.
- **Logo, paleta de color y tipografia**: provistos por el owner via Drive (placeholder hasta recepcion). Sustituyen los design tokens visuales del V1 Master Plan §17 cuando lleguen; los tokens del §7 de este doc se mantienen como fallback hasta recibir la marca real.

### Eventos iniciales V1 (datos confirmados)

| Fecha | Titulo | Precio | Capacidad |
|-------|--------|--------|-----------|
| 2026-05-29 | Spritz and Cheese with Mikks | 17 € (spritz + quesito) | 15 terraza, 10 dentro |
| 2026-05-30 | Spritz, Lemonade and Grilled Cheese with Mikks | Spritz 10 € · Grilled cheese 11 € · Lemonade 5 € | 15 terraza, 10 dentro |
| 2026-06-06 | Bodegas Telperion at CRUDO | 25 € (6 quesos + 3 vinos + sorpresas) | 15 terraza |

### Decisiones tecnicas y de cuentas

- Dominio: aun **no adquirido** (recomendacion `crudo.es` o equivalente, queda pendiente).
- Acceso DNS: pendiente (Cloudflare o registrador segun decida el owner).
- Google Business Profile: **YES**, ya existe.
- Meta Business Manager: **NO** existe — V1 implementa Meta Pixel solo si el owner abre cuenta antes de launch; si no, se aplaza a V1.1.
- Plataforma email: pendiente de confirmacion (Brevo recomendado).
- Lanzamiento: **ASAP**.

### V2 — nota de scope

- El owner advierte que la idea de "data scaffolding para ecommerce V2" tiene implicaciones legales serias: una S.L.U debe almacenar y proteger datos personales hasta 5 anos, con responsabilidad de tratamiento y obligaciones AEPD/RGPD. **V1 no debe implementar nada que asuma ecommerce V2 como decidido**. Se documenta la idea como hipotesis, no como roadmap aprobado.

### Acciones derivadas para Opus

Cuando una fase posterior toque cualquiera de los temas de arriba, debe alinearse con esta seccion antes de implementar. En particular:

- Fase 2 (modelo de datos): anadir campos `milk_type`, `milk_treatment`, `intensity`, `pairing` a `product`; anadir entidad `tabla` (o subtipo de `product` con `type='TABLA'`) con tamanos y variantes de maridaje; anadir flag `pickup_paused` en `site_config` para el kill switch.
- Fase 3 (API publica): exponer filtros de catalogo de quesos por los nuevos campos; exponer estado `pickup_paused`; eliminar endpoints especificos de wine si los hubiera planificado.
- Fase 4 (Mi Tabla y alcohol guard): la regla 422 sigue vigente para tablas con maridaje de vino; el frontend debe redirigir esas variantes a WhatsApp.
- Fase 8 (frontend publico): rutas `/catalogo/temporada` y `/tablas`; eliminar `/catalogo/quesos` y `/catalogo/vinos`; copy reposicionado a TIENDA DE QUESOS.
- Fase 10 (eventos, contacto, etc.): anadir pagina `Celebra tu evento con nosotros`; cargar los 3 eventos iniciales tal cual.
- Fase 12 (legal/cookies/SEO): incluir razon social, CIF y direccion fiscal en footer y legales; banner cookies custom AEPD; schema.org `Store` (no `Restaurant` como tipo principal — opcionalmente combinar con `FoodEstablishment`).
- Fase 14 (contenido): cargar los quesos de temporada y las 3 tablas como contenido inicial real; sin manifesto, sin foto del owner.

## 1. Reglas no negociables de V1

Estas reglas deben aparecer en todos los prompts importantes.

- La V1 no es una landing. Es un sistema comercial para aumentar visitas, reservas de pickup de queso, eventos y lista de email.
- Objetivo de negocio: generar ingresos recurrentes suficientes para contratar a una segunda persona (~2000 €/mes brutos + cargas en hosteleria Madrid).
- Posicionamiento: CRUDO es **TIENDA de quesos primero, cheese bar segundo, tienda de vinos tercero, wine bar cuarto**. La comunicacion publica nunca describe CRUDO como wine bar. Anti-referencia: la web no puede parecerse a https://formaje.com.
- Operativa: CRUDO lo gestiona una sola persona. El admin debe poder usarse en movil en menos de 5 minutos al dia.
- Idioma visible del producto: espanol. Debe ser compatible con Google Translate: HTML semantico, `lang="es"`, texto no incrustado en imagenes, copy claro y sin expresiones dificiles de traducir.
- No hay pago online en V1. PayGold del owner queda como flujo offline manual, no integrado en la web V1.
- No hay venta online de alcohol en V1.
- **No existe catalogo publico de vinos**. El vino solo aparece como variante de maridaje opcional dentro de las tablas para llevar (3, 6, 8 quesos). Las variantes con maridaje de vino redirigen a WhatsApp.
- Todo producto o variante con `is_alcohol=true` debe tener CTA principal de WhatsApp: `Preguntanos por WhatsApp`.
- El backend debe rechazar `POST /api/v1/pickup-orders` con HTTP 422 si algun item referencia un producto o variante con `is_alcohol=true`.
- `Mi Tabla` solo admite productos no alcoholicos (queso de temporada y tablas en variante sin maridaje).
- El pago se realiza en CRUDO al recoger; el owner puede ofrecer link de pago remoto via PayGold offline solo para clientes fuera de Madrid (no integrado en la web).
- El mensaje al usuario debe indicar confirmacion por WhatsApp en menos de 24 horas durante horario de apertura.
- Admin con JWT.
- Public site V1: Home, Catalogo (landing), Quesos de temporada, Tablas y cajas, Detalle de producto, Eventos, Detalle de evento, **Celebra tu evento con nosotros**, Sobre CRUDO, Contacto, Mayoristas, Mi Tabla, Confirmacion, Aviso Legal, Privacidad, Cookies, Admin.
- Mobile-first real, probado en viewport tipo iPhone e Instagram in-app browser.
- Cookie banner AEPD custom: Aceptar, Rechazar, Configurar con peso visual equivalente; GA4 y Pixel solo tras consentimiento. Owner no tiene Cookiebot/Iubenda contratado.
- Analytics: GA4, Search Console, Meta Pixel (solo si owner abre Meta Business Manager antes de launch) y eventos `select_item`, `pickup_request`, `wine_pairing_whatsapp_click`, `event_inquiry`, `generate_lead`.
- SEO: prerender de catalogo y PDP, sitemap.xml, robots.txt, Open Graph, schema.org `Store`/`FoodEstablishment`/`Product`/`Event`/`FAQ` (no `Restaurant` como tipo principal — CRUDO es tienda).
- Datos fiscales obligatorios en footer y legales: CRUDO QUESOS S.L.U, CIF B-19953694, Calle Jose Ortega y Gasset 81, 28006 Madrid.
- Horario publico: Lun-Vie 17:30-22:30/23:00, Sab 12:30-22:00, Dom 12:30-20:00. Cierre las ultimas 2 semanas de agosto.
- Capacidad pickup maxima: 15 pedidos/dia. Admin con kill switch para pausar nuevos pickups.
- Stock visibility: mostrar `pocas unidades` y `agotado`, no ocultar.
- Filtros obligatorios de catalogo de queso: Nombre, Tipo de leche, Tratamiento, Region, Intensidad, Maridaje.
- Catalogo rota mensualmente segun decida el owner.
- Stack V1: JavaScript, Node.js + Express, MariaDB con paquete `mariadb`, React 19 + Vite, Tailwind CSS, PostCSS, Autoprefixer, monolito CommonJS, `server.js` sirviendo `dist/`, Contabo + Plesk para despliegue, almacenamiento local/Plesk para V1, Brevo/nodemailer para emails.
- Stripe queda instalado/documentado solo como preparacion tecnica si se decide V2; en V1 no se activa pago online ni webhooks reales.
- No Redsys, cuentas de usuario cliente, loyalty, reviews, app movil, stock realtime ni i18n completo en V1.

## 2. Reglas de ingenieria desde docs/AGENTS_Javi.md

Opus debe seguir estas reglas durante todo el proyecto.

- No modificar `docs/AGENTS_Javi.md`. Es contrato de solo lectura.
- Leer contexto antes de actuar: `docs/AGENTS_Javi.md`, `docs/V1/CRUDO_V1_Visual_Master_Plan.html`, README/docs si ya existen, arquitectura si existe, historial git si hace falta.
- Codigo, clases, variables, comentarios tecnicos inline y tests en ingles.
- Documentacion tecnica, README y guias en espanol.
- SQL con keywords en INGLES MAYUSCULAS e identificadores en `snake_case`.
- JavaScript en frontend y backend.
- CommonJS en `package.json` para backend y scripts de servidor.
- Node.js con Express como backend principal.
- MariaDB como base de datos usando el paquete `mariadb`.
- SQL versionado en archivos `.sql` dentro de `db/migrations/`; seeds locales en `db/seeds/`.
- `package-lock.json` o `pnpm-lock.yaml` versionado; elegir un gestor y no mezclar.
- Arquitectura backend por modulos: Route -> Controller -> Service -> Repository -> MariaDB.
- Validacion de requests por middleware/helper centralizado; no validar de forma dispersa en cada controlador.
- Mapeos simples en JavaScript; no crear capas innecesarias.
- Sin secretos hardcodeados. Todo via variables de entorno y `.env.example`.
- Tests: backend Vitest o Jest + Supertest, MariaDB test DB si aplica; frontend Vitest, Testing Library, axe; E2E Playwright.
- Cobertura objetivo del contrato: >80% cuando aplique. El V1 minimo pide al menos 60% en paquetes `service` y `web`, pero se debe apuntar a 80%.
- Error handling con RFC 7807 `application/problem+json`.
- Antes de declarar DONE: lint, tests, build, arranque local sin crash si aplica, docs actualizadas, sin secretos.

## 3. Stack y estructura objetivo

Estructura monolito:

```text
crudo/
  package.json                 # CommonJS
  server.js                    # Express API + static dist server
  vite.config.js
  tailwind.config.js
  postcss.config.js
  eslint.config.js
  index.html
  src/                         # React 19 + Vite frontend
    main.jsx
    App.jsx
    pages/
    components/
    hooks/
    lib/
    styles/
  server/                      # Express backend
    app.js
    routes/
    controllers/
    services/
    repositories/
    middleware/
    config/
    utils/
  db/
    pool.js
    migrations/
    seeds/
  uploads/
    .gitkeep
  infra/
    plesk/
      README.md
    scripts/
      backup-notes.md
  docs/
    discovery.md
    content-checklist.md
    owner-admin-guide.md
    runbook.md
  .github/workflows/
  README.md
  .env.example
```

Frontend recomendado:
- React 19
- Vite
- JavaScript
- Tailwind CSS
- PostCSS
- Autoprefixer
- React Router
- axios para llamadas API
- estado ligero propio para `Mi Tabla` o helper dedicado
- clsx, class-variance-authority y tailwind-merge para variantes visuales
- Lucide icons
- canvas-confetti solo para microcelebracion de confirmacion si no degrada performance
- Tokens CRUDO mapeados en `tailwind.config.js`
- CSS global minimo para fuentes, scroll, focus rings y tokens que Tailwind no cubra bien

Backend recomendado:
- Node.js
- Express
- MariaDB con paquete `mariadb`
- bcryptjs
- jsonwebtoken
- helmet
- express-rate-limit
- cookie-parser
- cors
- dotenv
- multer y sharp para imagenes
- nodemailer para correos
- pdfkit, pdf-lib y exceljs solo si hay exportes/documentos admin realmente requeridos
- stripe y `@stripe/stripe-js` preparados solo para V2; no activar pago online en V1
- axios, slugify, xmlbuilder2 y sepa-xml solo donde haya uso real
- ESLint
- concurrently
- Vitest/Jest + Supertest

Infra:
- `npm run dev` con concurrently para Vite + Express
- `vite build` genera `dist/`
- `server.js` sirve `dist/` y la API Express bajo `/api/v1`
- Servidor Contabo como VPS/servidor productivo
- Plesk para dominio, SSL, Node.js app, MariaDB, backups y despliegue
- MariaDB gestionada desde Plesk/Contabo
- DNS gestionado desde el registrador o Plesk segun configuracion final; CDN externo queda opcional, no obligatorio en V1
- Imagenes en filesystem gestionado por Plesk para V1; object storage/CDN queda aplazado si el volumen lo justifica
- Brevo newsletter y emails
- WhatsApp Business via Twilio/360dialog o adaptador simulable localmente

## 4. Modelo de datos V1

Tablas obligatorias:

- `product`: `id`, `slug`, `name`, `type` (`CHEESE`, `WINE`, `TABLA`, `OTHER`), `is_alcohol`, `price_cents`, `vat_rate`, `short_desc`, `long_desc`, `producer`, `region`, `milk_type` (`COW`, `SHEEP`, `GOAT`, `MIXED`, NULL para no quesos), `milk_treatment` (`RAW`, `PASTEURIZED`, `THERMIZED`, NULL para no quesos), `intensity` (`MILD`, `MEDIUM`, `STRONG`, NULL para no quesos), `pairing_notes`, `is_seasonal`, `is_featured`, `is_active`, `stock_status` (`IN_STOCK`, `LOW`, `OUT`), `created_at`, `updated_at`. Nota: `type='WINE'` queda como tipo interno para representar maridajes incluidos en variantes de tabla; no se expone en endpoints publicos del catalogo.
- `product_variant`: `id`, `product_id`, `slug`, `name`, `size` (`3`, `6`, `8` para tablas), `pairing_type` (`NONE`, `WHITE_WINE`, `RED_WINE`), `is_alcohol`, `price_cents`, `is_active`, timestamps. Las tablas se modelan como `product` con `type='TABLA'` y al menos una variante por combinacion de tamano y maridaje. Variantes con `pairing_type` distinto de `NONE` heredan `is_alcohol=true`.
- `product_image`: `id`, `product_id`, `url`, `alt_text`, `sort_order`, `is_primary`, timestamps.
- `category`: `id`, `slug`, `name`, `type`, `sort_order`, timestamps.
- `product_category`: `product_id`, `category_id`.
- `campaign`: `id`, `slug`, `title`, `subtitle`, `hero_image_url`, `body_md`, `starts_at`, `ends_at`, `is_active`, timestamps.
- `campaign_product`: `campaign_id`, `product_id`, `sort_order`.
- `event`: `id`, `slug`, `title`, `description_md`, `hero_image_url`, `starts_at`, `ends_at`, `capacity`, `price_cents`, `location`, `is_active`, timestamps.
- `event_reservation`: `id`, `event_id`, `name`, `email`, `phone`, `party_size`, `notes`, `status` (`NEW`, `CONFIRMED`, `CANCELLED`), timestamps.
- `inquiry`: `id`, `type` (`CONTACT`, `WHOLESALE`, `PICKUP`), `name`, `email`, `phone`, `message`, `payload_json`, `status`, timestamps.
- `pickup_order`: `id`, `name`, `email`, `phone`, `pickup_date`, `pickup_slot`, `notes`, `total_cents`, `status` (`NEW`, `CONFIRMED`, `READY`, `PICKED_UP`, `CANCELLED`), timestamps.
- `pickup_order_item`: `id`, `pickup_order_id`, `product_id`, `qty`, `unit_price_cents`.
- `newsletter_subscriber`: `id`, `email`, `source`, `consent_at`, `ip`, `status`, timestamps.
- `admin_user`: `id`, `email`, `password_hash`, `role` (`ADMIN`, `STAFF`), `is_active`, timestamps.
- Recomendado para cookies: `consent_log`: `id`, `consent_id`, `analytics`, `marketing`, `preferences`, `ip_hash`, `user_agent_hash`, `created_at`, `expires_at`.
- Recomendado para auditoria admin: `audit_log`: `id`, `actor_admin_user_id`, `action`, `entity_type`, `entity_id`, `payload_json`, `created_at`.

Reglas del modelo:
- Los precios siempre en centimos como enteros.
- `slug` unico e indexado.
- Todas las entidades publicas tienen `is_active`.
- `is_alcohol` es el campo critico de V1, tanto a nivel `product` como `product_variant`.
- Los filtros publicos del catalogo de queso operan sobre `milk_type`, `milk_treatment`, `region`, `intensity`, `pairing_notes` y `name`.
- El catalogo publico V1 expone unicamente `type='CHEESE'` (con `is_seasonal=true` para la vista de temporada) y `type='TABLA'`. `type='WINE'` no aparece en endpoints publicos del catalogo.
- `site_config` debe incluir al menos: `legal_business_name` (CRUDO QUESOS S.L.U), `legal_cif` (B-19953694), `legal_address` (Calle Jose Ortega y Gasset 81, 28006 Madrid), `public_whatsapp`, `owner_whatsapp`, `pickup_paused` (boolean kill switch), `pickup_daily_capacity` (default 15), `opening_hours_json`, `holiday_closures_json`, `pickup_sla_text`.
- No anadir `location_id` en V1.
- No anadir tablas de traduccion en V1.

## 5. Endpoints obligatorios

Todos bajo `/api/v1`.

Publicos:

- `GET /products`
- `GET /products/{slug}`
- `GET /categories`
- `GET /campaigns/active`
- `GET /campaigns/{slug}`
- `GET /events`
- `GET /events/{slug}`
- `POST /events/{slug}/reservations`
- `POST /inquiries`
- `POST /pickup-orders`
- `POST /newsletter/subscribe`
- `POST /consent`
- `GET /site/config`

Admin con JWT:

- `POST /admin/auth/login`
- `POST /admin/auth/refresh`
- `GET /admin/dashboard`
- `GET/POST/PUT/DELETE /admin/products`
- `POST /admin/products/{id}/images`
- `GET/POST/PUT/DELETE /admin/events`
- `GET/POST/PUT/DELETE /admin/campaigns`
- `GET/PATCH /admin/inquiries`
- `GET/PATCH /admin/pickup-orders`
- `GET/PATCH /admin/event-reservations`
- `GET/PUT /admin/site/config`
- `GET /admin/kpis`

Cross-cutting:
- Pagination `page`, `size`, default 20.
- Public GET cacheable durante 5 minutos.
- Admin requiere `Authorization: Bearer <JWT>`.
- POST publicos con rate limit 10 req/min/IP.
- `Idempotency-Key` en `pickup-orders` y `reservations`.
- CORS solo para dominios permitidos.
- Errores RFC 7807.
- Notificaciones owner: WhatsApp ping y digest email.

## 6. Rutas frontend obligatorias

- `/`
- `/catalogo`
- `/catalogo/temporada`
- `/tablas`
- `/producto/:slug`
- `/eventos`
- `/eventos/:slug`
- `/celebra-con-nosotros`
- `/sobre-crudo`
- `/contacto`
- `/mayoristas`
- `/mi-tabla`
- `/mi-tabla/confirmacion`
- `/aviso-legal`
- `/privacidad`
- `/cookies`
- `/admin`
- `/admin/productos`
- `/admin/eventos`
- `/admin/campanas`
- `/admin/pedidos`
- `/admin/consultas`
- `/admin/configuracion`

## 7. Design tokens obligatorios

Crear `src/styles/tokens.css` o definir tokens en `src/styles/global.css` con estos valores como fuente unica:

```css
:root {
  --color-bg-primary: #1A1F14;
  --color-bg-secondary: #1E1C18;
  --color-bg-elevated: #252420;
  --color-bg-light: #F2EAD8;
  --color-bg-light-soft: #EAE0CB;
  --color-text-primary: #F2EAD8;
  --color-text-secondary: #C7BFAD;
  --color-text-muted: #8A8473;
  --color-text-inverse: #1A1F14;
  --color-accent: #B5713A;
  --color-accent-hover: #C8804A;
  --color-accent-soft: #3A2A1E;
  --color-gold: #B89668;
  --color-success: #6B8E5A;
  --color-warning: #C8893E;
  --color-error: #A8443A;
  --color-border: rgba(242,234,216,0.12);
  --color-border-strong: rgba(242,234,216,0.24);

  --font-display: "Cormorant Garamond", "Times New Roman", serif;
  --font-body: "Inter", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 96px;
  --space-10: 128px;
  --space-11: 160px;
  --space-12: 200px;

  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-pill: 999px;

  --shadow-soft: 0 8px 32px rgba(0,0,0,0.35);
  --shadow-elev: 0 16px 48px rgba(0,0,0,0.45);
}
```

Prohibido visualmente:
- Blanco puro `#FFFFFF`.
- Negro puro `#000000`.
- Grises frios, azules o neon.
- Estetica SaaS generica.
- Botones demasiado redondeados.
- Carruseles auto-rotatorios, parallax o scroll-jacking.

## 7.bis Inventario visual de assets reales (2026-05-12)

Esta seccion es **fuente autoritativa de mapeo asset -> componente** para todas las fases >= 8. Cualquier fase que use placeholders genericos debe consultar este indice primero. Si un asset cambia de ubicacion o se sustituye por una version optimizada, actualizar este indice.

### Carpetas fuente
- `images/` (raiz del repo): assets nuevos generados/curados, **1 imagen** actual:
  - `Gemini_Generated_Image_149guw149guw149g.png` — bodegon AI: tabla de quesos con bodega al fondo, lampara terracota, **espacio negativo verde oscuro a la izquierda intencional para overlay**.
- `docs/V1/Photos/` (originales): 17 fotos reales del local CRUDO + 1 MP4 (`DB18FE7B-*.MP4`):
  - `IMG_0205.JPG`, `IMG_0206.JPG`, `IMG_0207.JPG` — bodegon real interior: botellas (Rayo en Rama, Alperi, La Pertia), copas vacias, posavasos Le Gruyere, **cartel CRUDO retroiluminado naranja** sobre pared ladrillo blanco.
  - `IMG_1117.jpeg`, `IMG_1118.jpeg` — botella vino natural con etiqueta arte cyberpunk en mano, entorno almacen/tienda.
  - `IMG_1582.jpeg` — tabla de quesos completa en plato metalico: Manchego, Brie, queso azul, nueces, uvas, miel, dos copas tinto, sobre azulejo amarillo CRUDO.
  - `IMG_8952.JPG`, `IMG_8953.JPG`, `IMG_8954.JPG` — mostrador con queseras enteras, vino, owner sonriendo, ambiente "tienda real".
  - `IMG_8956.JPG`, `IMG_8957.JPG` — copas tumbadas en soporte madera, **sticker logo CRUDO retro marron/blanco**, pato suizo Le Gruyere, sobre azulejo amarillo.
  - `IMG_9525.JPG`, `IMG_9526.JPG`, `IMG_9527.JPG`, `IMG_9528.JPG` — tres botellas vinos naturales (El Rayo en Rama, Bisus, Brave Rama) + plato pequeño quesos + bowl crackers + decantador, sobre azulejo amarillo.
  - `IMG_9602.JPG` — botella Penedes Ull de Llebre 2023 (Les Vinyerons) en mano.
- `docs/V1/Crudo/`: branding oficial:
  - `Logo Crudo - PNG - Color V1.png`, `V2.png`, `Blanco.png`, `Negro.png`.
  - `Crudo_Completo.png`, `Crudo_Texto.png`.
  - `1.01 - Animales Queseros.png`, `2.01 - Animales Queseros.png` — ilustraciones mascotas/animales queseros.
  - `final1.png`, `carta_quesos_vinos (1) (1).html` — referencia carta.

### Patron visual del local (firma CRUDO)
- **Azulejo mustard/saffron** (amarillo brillante, mate) -> material de firma; usar como background pattern en secciones lifestyle.
- **Cartel CRUDO retroiluminado naranja** -> componente reutilizable `<RetroSign>` para eyebrows decorativos, 404, success states.
- **Tipografia retro chunky** del logo -> ya capturada en sticker IMG_8956; usar como decorativo, no como tipografia primaria (Cormorant/Inter mandan).
- **Pared ladrillo blanco** + **luces calidas puntuales** -> textura sugerida para hero alt y About.
- **Vinos naturales con etiquetas artisticas** -> destacar visualmente como diferenciador vs vino industrial.
- **Patito Le Gruyere** + **posavasos suizos** -> humor sutil, usar en footer easter egg o 404 (no en producto serio).

### Mapeo asset -> uso en V1

| Asset | Uso primario | Uso secundario | Notas |
|---|---|---|---|
| `images/Gemini_*.png` | **Hero home** (overlay texto izq) | OG image Home, hero `/sobre-crudo` alt | Espacio negativo izq es **invariante de composicion** — overlay debe respetarlo. |
| `IMG_0205-0207.JPG` | Hero secundario `/sobre-crudo` o `/contacto` | Strip lifestyle Home, OG Contacto | Cartel CRUDO visible -> reforzar marca. |
| `IMG_1117/1118/9602.jpeg` | Featured "Vinos naturales" en `/catalogo/vinos` | Hero `/mayoristas`, ficha producto vino destacado | Etiquetas artisticas atraen click. |
| `IMG_1582.jpeg` | **Hero `/mi-tabla`** y `/catalogo/quesos` | PDP queso fallback, OG Catalogo, hero `/eventos` | Imagen mas "shoppable" — usar siempre que se hable de tabla. |
| `IMG_8952-8954.JPG` | **Hero `/sobre-crudo`** + bloque "Owner" | Strip "Como hacemos las tablas" Home | Owner visible -> humaniza marca. |
| `IMG_8956/8957.JPG` | Footer easter egg, 404, FormSuccess decorativo | Branding Instagram strip placeholder | Sticker retro = identidad de marca. |
| `IMG_9525-9528.JPG` | **Hero `/eventos`** + cards de catas | Strip "Maridajes" Home, hero `/mayoristas` alt | Vibe "experiencia compartida". |
| `Logo Crudo - PNG - Blanco.png` | Logo header sobre fondos oscuros, OG fallback | Loading splash si existe | Conservar SVG si owner provee. |
| `Logo Crudo - PNG - Negro.png` | Logo sobre fondos claros (raro en CRUDO) | Print/factura | - |
| `Animales Queseros*.png` | Decorativo `/sobre-crudo`, `/mi-tabla` empty state | Ilustracion 404 alternativa | Mascotas; uso editorial, no producto. |
| `Crudo_Completo.png`, `Crudo_Texto.png` | Logo header, footer, OG | - | Verificar transparencia. |

### Componentes nuevos sugeridos (a crear en Fase 8.5 o segun necesidad)
- `src/components/brand/RetroSign.jsx` — caja con sombra interior naranja calida emulando el cartel retroiluminado de IMG_0205. Props: `text`, `size`, `as` (`h2` por defecto).
- `src/components/brand/SaffronTileBackground.jsx` — fondo CSS con textura azulejo amarillo (SVG pattern o repeating-linear-gradient). Para secciones lifestyle.
- `src/components/brand/LifestylePhoto.jsx` — wrapper de `<img>` con aspect-ratio reservado, `loading="lazy"`, `srcset` desktop/mobile, `alt` obligatorio.
- `src/components/brand/BrandSticker.jsx` — render del sticker logo retro como elemento decorativo (no link, no logo principal).
- `src/components/brand/AnimalQuesero.jsx` — ilustracion mascota inline (1.01 o 2.01).

### Pipeline de assets (a implementar en Fase 14, preparable antes)
1. **Origen**: `docs/V1/Photos/` y `images/` no se sirven publicamente.
2. **Destino publico**: `public/img/` con subcarpetas semanticas: `hero/`, `lifestyle/`, `products/`, `events/`, `about/`, `brand/`.
3. **Conversion**: cada origen genera 3 outputs: WebP @1x, WebP @2x, JPG fallback. Script `scripts/optimize-images.js` con `sharp`.
4. **Naming**: kebab-case semantico, no IDs: `hero-home-cheeseboard.webp`, no `IMG_1582.webp`.
5. **EXIF rotation**: los originales tienen orientacion EXIF rotada — el script debe aplicar rotacion al exportar.
6. **Alt text**: obligatorio, en espanol, descriptivo, sin "imagen de" prefijo.

### Reglas duras de uso visual
- **Nunca** usar fotos de stock genericas si existe equivalente en este inventario.
- **Nunca** alterar el espacio negativo izquierdo de la imagen Gemini (Hero home) — el overlay esta diseñado para esa composicion.
- **Nunca** usar los logos sobre fondos que dañen contraste (Logo blanco sobre amarillo saffron = no).
- Las mascotas Animales Queseros son **decorativas**, no marca primaria.
- El cartel retroiluminado y el sticker retro son **firmas visuales** — usarlos refuerza marca; abusar los banaliza.
- Todas las fotos del local tienen **orientacion EXIF rotada**; verificar siempre output rotation antes de servir.

## 8. Prompt base minimo y fijo

Pega este bloque al inicio de **cada nueva sesion de Opus**, antes de cualquier prompt de fase, continuacion, revision o correccion. Este prompt no implementa una fase por si solo: solo carga contexto, fija reglas y obliga a Opus a sincronizarse con el estado real del proyecto.

```text
Actua como agente senior full-stack para construir CRUDO V1.

Antes de proponer, editar o ejecutar nada, lee en este orden:
- docs/AGENTS_Javi.md
- docs/V1/CRUDO_V1_Visual_Master_Plan.html
- docs/V1/V1Tecnico.md
- README.md, docs/, ARCHITECTURE.md o contexto existente si existen

Despues de leer, localiza en `docs/V1/V1Tecnico.md` la seccion `0.1 Estado vivo del proyecto` y usala como fuente de contexto operativo:
- fase actual
- que esta implementado
- que falta
- bloqueos
- decisiones confirmadas
- siguiente prompt recomendado

Antes de tocar codigo:
1. Inspecciona el estado real del repositorio: estructura, archivos clave, package.json, scripts, env examples, migraciones, tests y git status.
2. Compara el estado real contra `0.1 Estado vivo del proyecto`.
3. Si hay contradiccion, no asumas. Di cual es la diferencia y actualiza el estado vivo si es seguro, o pide decision si afecta a alcance/arquitectura.
4. Resume en 5-8 bullets: fase real, objetivo inmediato, archivos que vas a tocar, pruebas que esperas ejecutar y riesgos.

Reglas duras de proyecto:
- No modifiques docs/AGENTS_Javi.md.
- No inventes alcance fuera del V1.
- Documentacion, README y guias en espanol.
- Codigo, variables, funciones, comentarios tecnicos inline y tests en ingles.
- Backend Node.js + Express + MariaDB usando el paquete `mariadb`.
- Frontend React 19 + Vite + Tailwind CSS, mobile-first, espanol, semantic HTML, compatible con Google Translate.
- Arquitectura monolito CommonJS: `server.js` sirve API `/api/v1` y el build `dist/`; frontend en `src/`, backend en `server/`, SQL en `db/`.
- Validacion de requests centralizada antes de controladores. No dupliques reglas de negocio entre UI y backend.
- No pago online activo en V1.
- No venta online de alcohol en V1.
- Wine/products with `is_alcohol=true` are visible in catalog/PDP but cannot be added to Mi Tabla.
- `POST /api/v1/pickup-orders` must reject alcohol items with HTTP 422 and RFC 7807 problem detail.
- Admin must be phone-friendly and usable in <= 5 min/day by one owner.
- Secrets only via env vars and `.env.example`; never hardcode real secrets.
- Local dev: `npm run dev`. Production: `vite build` + `server.js` on Contabo/Plesk.
- Stripe may exist only as V2 preparation; do not activate payment flow or real webhooks in V1.

Modo de trabajo:
- Si recibes un prompt de fase, implementa solo esa fase.
- Si recibes un prompt de continuacion, detecta lo ya hecho y continua sin rehacer desde cero.
- Si recibes un prompt de revision, prioriza bugs, riesgos, desviaciones del V1 y tests faltantes.
- No termines con solo un plan si la tarea pide implementar y no estas bloqueado.
- Mantén cambios pequenos, coherentes con el stack confirmado y sin refactors ajenos.

Antes de marcar algo como DONE:
- Ejecuta las verificaciones relevantes disponibles: lint, tests, build y/o arranque local.
- Si no puedes ejecutar algo, explica exactamente por que y que comando queda pendiente.
- Actualiza `docs/V1/V1Tecnico.md` en `0.1 Estado vivo del proyecto`: fase, implementado, falta, bloqueos, registro de sesion, siguiente prompt recomendado y checklist si aplica.
- Si afecta al roadmap visual, actualiza tambien `docs/V1/v1TecnicoVisual.html`.

Respuesta final obligatoria:
- Que se hizo.
- Archivos cambiados.
- Verificacion ejecutada y resultado.
- Riesgos o pendientes reales.
- Siguiente prompt/fase recomendada.
```

## 9. Fase 0 - Preparacion, repo y contexto

Objetivo: dejar el repo listo para programar sin ambiguedades.

Entregables:
- Estructura monolito creada.
- `README.md` con comandos.
- `.gitignore`.
- `.env.example`.
- `docs/discovery.md`.
- `docs/content-checklist.md`.
- `docs/runbook.md` inicial.
- `docs/owner-admin-guide.md` inicial.
- Confirmacion de alcance V1/V1.1/V2.

Prompt para Opus:

```text
Usa el Prompt base minimo y fijo.

Implementa exclusivamente la Fase 0 de CRUDO V1: preparacion del repositorio y contexto operativo.

Objetivo de esta fase:
Dejar el repositorio preparado para que la Fase 1 pueda crear el monolito JavaScript sin ambiguedades. En esta fase NO se implementa todavia la app, ni Express real, ni React real, ni base de datos real. Solo se crean estructura, documentacion operativa, placeholders seguros y archivos de contexto.

Contexto tecnico confirmado:
- Stack V1: JavaScript, CommonJS, Node.js + Express, MariaDB con paquete `mariadb`, React 19 + Vite, Tailwind CSS, PostCSS, Autoprefixer.
- Arquitectura objetivo: monolito con `server.js`, frontend en `src/`, backend en `server/`, SQL en `db/`, uploads locales en `uploads/`.
- Produccion: servidor Contabo gestionado con Plesk.
- V1 sin pago online activo y sin venta online de alcohol.
- Stripe puede aparecer solo como placeholder desactivado para V2; no crear flujo de pago ni webhook real.

Antes de editar:
1. Ejecuta inspeccion del repo:
   - lista carpetas y archivos principales
   - revisa si existen `package.json`, `README.md`, `.env.example`, `.gitignore`, `src/`, `server/`, `db/`, `infra/`, `docs/`
   - revisa `git status --short`
2. Identifica archivos existentes que no debes sobrescribir sin leerlos antes.
3. Si ya existe algun archivo objetivo, actualizalo preservando contenido util y evitando borrar cambios ajenos.
4. No modifiques `docs/AGENTS_Javi.md`.

Archivos y carpetas que debes crear o actualizar:
1. Carpetas base:
   - `src/`
   - `server/`
   - `server/routes/`
   - `server/controllers/`
   - `server/services/`
   - `server/repositories/`
   - `server/middleware/`
   - `server/config/`
   - `server/utils/`
   - `db/`
   - `db/migrations/`
   - `db/seeds/`
   - `uploads/`
   - `infra/`
   - `infra/plesk/`
   - `infra/scripts/`
   - `docs/`
   - `.github/workflows/`

2. Placeholders seguros:
   - crea `.gitkeep` en carpetas vacias que deban versionarse: `uploads/`, `db/migrations/`, `db/seeds/`, `infra/scripts/` si procede.
   - no crees codigo funcional innecesario todavia.

3. `README.md`:
   Debe estar en espanol y contener:
   - que es CRUDO V1 y objetivo de negocio
   - stack confirmado
   - arquitectura de carpetas
   - comandos previstos aunque aun no existan: `npm run dev`, `npm run build`, `npm start`, `npm test`, `npm run lint`, `npm run db:migrate`, `npm run db:seed`
   - reglas criticas:
     - no pago online activo en V1
     - no venta online de alcohol
     - vino visible pero solo WhatsApp
     - Mi Tabla solo no alcohol
     - backend debe rechazar alcohol con HTTP 422
   - despliegue previsto: Contabo + Plesk
   - nota de que Fase 1 creara el scaffold tecnico real

4. `.gitignore`:
   Debe cubrir como minimo:
   - `node_modules/`
   - `dist/`
   - `build/`
   - `.env`
   - `.env.*` excepto `.env.example`
   - logs
   - cache
   - archivos temporales de sistema
   - carpetas IDE comunes sin eliminar configuracion util si ya existe
   - uploads reales, pero manteniendo `uploads/.gitkeep`

5. `.env.example`:
   Debe contener placeholders, nunca secretos reales:
   - `NODE_ENV=development`
   - `PORT=3000`
   - `CLIENT_DEV_URL=http://localhost:5173`
   - `CORS_ALLOWED_ORIGINS=http://localhost:5173`
   - `DB_HOST=localhost`
   - `DB_PORT=3306`
   - `DB_NAME=crudo`
   - `DB_USER=crudo`
   - `DB_PASSWORD=change_me`
   - `JWT_SECRET=change_me_min_32_chars`
   - `JWT_EXPIRES_IN=15m`
   - `JWT_REFRESH_EXPIRES_IN=7d`
   - `COOKIE_SECRET=change_me_min_32_chars`
   - `UPLOADS_DIR=uploads`
   - `MAX_UPLOAD_MB=8`
   - `BREVO_API_KEY=`
   - `SMTP_HOST=`
   - `SMTP_PORT=587`
   - `SMTP_USER=`
   - `SMTP_PASS=`
   - `OWNER_WHATSAPP=`
   - `OWNER_EMAIL=`
   - `VITE_API_BASE=/api/v1`
   - `VITE_GA_ID=`
   - `VITE_META_PIXEL=`
   - `VITE_PUBLIC_WHATSAPP=`
   - `VITE_GOOGLE_MAPS_URL=`
   - `STRIPE_SECRET_KEY=` con comentario "V2 only, disabled in V1"
   - `VITE_STRIPE_PUBLIC_KEY=` con comentario "V2 only, disabled in V1"

6. `docs/discovery.md`:
   Debe ser una checklist accionable en espanol, agrupada por:
   - negocio y objetivos financieros
   - horarios y operativa
   - capacidad pickup
   - productos y precios
   - alcohol y WhatsApp
   - eventos
   - contenido visual
   - dominio, Contabo y Plesk
   - legal/cookies
   - analytics y marketing
   - owner/admin
   Incluye preguntas concretas, columna/checkbox de estado y notas.

   Pre-rellenar como `RESUELTO` con los datos confirmados por el owner el 2026-05-06 (ver §0.2):
   - posicionamiento TIENDA de quesos
   - razon social CRUDO QUESOS S.L.U, CIF B-19953694, direccion Ortega y Gasset 81, 28006 Madrid
   - horario semanal y cierre ultimas 2 semanas de agosto
   - capacidad pickup 15/dia y kill switch
   - mostrar stock bajo/agotado
   - filtros de catalogo de queso (nombre, leche, tratamiento, region, intensidad, maridaje)
   - WhatsApp owner separado del WhatsApp publico
   - revenue medio semanal 900-1100€ y target hire 2000€/mes
   - meses pico marzo, mayo, junio, octubre, diciembre
   - mix actual 60% barra · 45% to-go · 5% eventos
   - sin foto del owner en la web, sin manifesto
   - 3 eventos iniciales con fechas, precios y capacidad
   - Google Business Profile existe; Meta Business Manager no
   - sin abogado y sin proveedor de cookie banner
   - PayGold offline, no integrado en V1
   - lanzamiento ASAP

   Mantener como `PENDIENTE`:
   - dominio final y registrador
   - acceso DNS y plan Plesk
   - WhatsApp publico exacto y WhatsApp owner exactos
   - SLA de confirmacion pickup
   - Brevo confirmado o alternativa
   - apertura o no de Meta Business Manager antes de launch
   - lista mensual real de quesos de temporada (subira el owner via Drive)
   - precios y maridajes por defecto de las 3 tablas (3/6/8)
   - logo, paleta y tipografia (subira el owner via Drive)
   - validacion final de Aviso Legal, Privacidad y Cookies generados desde plantilla
   - decision sobre la variante de tabla con maridaje de vino: WhatsApp puro vs pickup con flag

7. `docs/content-checklist.md`:
   Debe listar contenido necesario con estado pendiente. Aplicar overrides de la seccion 0.2 (sin manifesto, sin foto del owner):
   - hero desktop 16:9
   - hero mobile 9:16
   - lista mensual de quesos de temporada (foto 1:1 min 1600x1600 fondo madera oscura, nombre, slug, precio, tipo de leche, tratamiento, region, intensidad, productor, descripcion corta y larga, `is_alcohol=false`)
   - definicion de las 3 tablas (3, 6, 8 quesos) con foto, descripcion y precios para variantes sin maridaje, con maridaje blanco y con maridaje tinto
   - 6-10 fotos lifestyle / ambiente / interior (sin retrato del owner)
   - 3 eventos iniciales confirmados (29/05 Spritz and Cheese with Mikks · 30/05 Spritz, Lemonade and Grilled Cheese with Mikks · 06/06 Bodegas Telperion at CRUDO)
   - copy de la pagina `Celebra tu evento con nosotros`
   - copy de about/Sobre CRUDO sin manifesto: maximo 2-3 parrafos descriptivos en tono TIENDA de quesos
   - datos fiscales obligatorios para footer y legales: CRUDO QUESOS S.L.U · CIF B-19953694 · Calle Jose Ortega y Gasset 81, 28006 Madrid
   - logo, paleta y tipografia del owner (pendiente Drive)
   - copy de confirmacion pickup con mencion opcional a link de pago remoto via PayGold (offline, manual)
   - textos legales (Aviso Legal, Privacidad, Cookies) generados desde plantillas AEPD y validados por owner
   - copy Google-Translate-friendly

8. `docs/runbook.md`:
   Debe ser inicial, aunque todavia no haya codigo:
   - local dev previsto
   - variables de entorno
   - MariaDB local/Plesk
   - migraciones y seeds previstos
   - build Vite previsto
   - arranque `server.js`
   - staging en Plesk
   - production en Plesk
   - backups Plesk/Contabo
   - restore test manual
   - rollback manual
   - checklist de smoke test

9. `docs/owner-admin-guide.md`:
   Debe explicar el futuro admin desde el punto de vista del owner:
   - objetivo: usarlo en movil en menos de 5 minutos al dia
   - rutina manana <= 90s
   - rutina cierre <= 90s
   - rutina semanal <= 10 min
   - pedidos pickup
   - marcar producto agotado
   - crear/editar evento
   - revisar consultas
   - kill switch de pickup si se implementa en fases posteriores
   - no incluir instrucciones tecnicas complejas

10. `infra/plesk/README.md`:
   Debe documentar el destino de despliegue:
   - Contabo como servidor
   - Plesk para dominio, SSL, Node.js app, MariaDB y backups
   - dominio principal y staging
   - document root/application root/startup file previstos
   - `npm install`, `npm run build`, `npm start`
   - variables de entorno en Plesk
   - backups de DB y uploads
   - notas de seguridad basicas

11. `.github/workflows/README.md` o placeholder:
   Si no vas a crear workflows reales aun, deja un README indicando que CI se creara en fases posteriores.

Prohibido en esta fase:
- No instalar dependencias.
- No crear `package.json` funcional salvo que ya exista y solo haya que documentarlo; el scaffold real es Fase 1.
- No crear Express real.
- No crear React real.
- No crear migraciones SQL reales todavia.
- No crear Stripe/webhooks/pagos.
- No meter datos reales sensibles.
- No borrar documentos V1 existentes.
- No modificar `docs/AGENTS_Javi.md`.

Actualizacion del estado vivo:
Al terminar, actualiza solo la seccion `0.1 Estado vivo del proyecto` de `docs/V1/V1Tecnico.md`:
- `last_updated`
- `current_phase`: 0
- `current_phase_name`: "Preparacion, repo y contexto"
- `current_focus`: resumen real de lo creado
- `overall_status`: `REVIEW_READY` si todo esta creado y verificado; `IN_PROGRESS` si falta algo; `BLOCKED` si hay bloqueo
- tabla de Fase 0 con implementado/falta/notas reales
- funcionalidades implementadas: no anadas funcionalidad de producto, solo preparacion repo/docs
- registro de sesion con fecha y verificacion
- siguiente prompt recomendado: "Fase 1 - Scaffold monolito Node.js Express" si Fase 0 queda lista

Si creas o cambias informacion que afecte al roadmap visual, actualiza tambien `docs/V1/v1TecnicoVisual.html` para reflejar el estado de Fase 0.

Criterios de aceptacion:
- La estructura monolito existe.
- Los docs iniciales existen y estan en espanol.
- `.env.example` no contiene secretos reales.
- `.gitignore` protege secretos, dependencias, build output y uploads reales.
- El alcance V1/V1.1/V2 queda claro.
- Plesk/Contabo queda documentado.
- `docs/AGENTS_Javi.md` no se modifica.
- No se implementa codigo funcional de fases posteriores.

Verificacion obligatoria:
- Ejecuta `git status --short`.
- Lista archivos/carpetas creados o modificados.
- Comprueba que no hay secretos reales en `.env.example`.
- Si existe `rg`, ejecuta una busqueda razonable de terminos prohibidos en archivos creados: secretos reales, passwords reales, Stripe activo, pago online activo.
- No ejecutes `npm install` en esta fase.

Respuesta final:
- Resumen de Fase 0.
- Archivos creados/modificados.
- Verificacion ejecutada.
- Estado vivo actualizado o motivo si no se pudo.
- Siguiente prompt recomendado.
```

## 10. Fase 1 - Scaffold monolito Node.js Express

Entregables:
- `package.json` CommonJS
- `server.js`
- Express app en `server/app.js`
- Pool MariaDB inicial en `db/pool.js`
- Rutas/controladores/servicios base
- Configuracion por env
- Health endpoint
- Tests smoke

Prompt para Opus:

```text
Usa el Prompt base minimo y fijo.

Implementa la Fase 1: scaffold monolito Node.js Express de CRUDO V1.

Objetivo de esta fase:
Crear el scaffold tecnico real del monolito JavaScript para que CRUDO V1 tenga una base ejecutable, testeable y desplegable en Plesk/Contabo. Esta fase debe dejar Express, configuracion por entorno, health check, pool MariaDB inicial, helpers transversales y tests smoke funcionando. No implementes todavia modelo de datos real, catalogo, pickup, admin, React visual ni logica comercial.

Contexto obligatorio:
- La Fase 0 debe estar terminada o al menos suficientemente preparada. Si detectas que faltan archivos base criticos (`README.md`, `.env.example`, carpetas `server/`, `db/`, `docs/`), completa solo lo imprescindible para que Fase 1 sea coherente y documenta la diferencia.
- Stack V1: JavaScript, CommonJS, Node.js + Express, MariaDB con paquete `mariadb`, React 19 + Vite en fases posteriores, Tailwind CSS en fases posteriores, monolito con `server.js` sirviendo API `/api/v1` y `dist/` en produccion.
- Produccion objetivo: servidor Contabo gestionado con Plesk.
- V1 sin pago online activo y sin venta online de alcohol.
- No actives Stripe, Redsys, webhooks de pago, cuentas de cliente ni ecommerce de alcohol.

Stack obligatorio de esta fase:
- Node.js
- JavaScript
- CommonJS
- Express
- MariaDB con paquete `mariadb`
- dotenv
- cors
- helmet
- express-rate-limit
- cookie-parser
- Vitest
- Supertest para tests HTTP
- ESLint

Antes de editar:
1. Lee el estado vivo en `docs/V1/V1Tecnico.md` y confirma si Fase 0 esta `DONE`, `REVIEW_READY`, `IN_PROGRESS` o `NOT_STARTED`.
2. Inspecciona el repo:
   - `git status --short`
   - existencia de `package.json`, `package-lock.json`, `server.js`, `server/`, `src/`, `db/`, `.env.example`, `.gitignore`, `README.md`
   - contenido de archivos que ya existan antes de sobrescribirlos
3. Si `package.json` ya existe, actualizalo preservando scripts/dependencias utiles y evitando mezclar gestores. Usa npm y versiona `package-lock.json`.
4. Si hay cambios ajenos en archivos que debes tocar, trabaja con ellos y no los reviertas.
5. No modifiques `docs/AGENTS_Javi.md`.

Dependencias recomendadas:
- Produccion:
  - `express`
  - `mariadb`
  - `dotenv`
  - `cors`
  - `helmet`
  - `express-rate-limit`
  - `cookie-parser`
  - `morgan` solo si se usa de forma sobria y sin imprimir PII
- Desarrollo:
  - `vitest`
  - `supertest`
  - `eslint`
  - `concurrently`
  - `nodemon` si se usa para `dev:server`

Puedes ejecutar `npm install` en esta fase. Si falla por red/sandbox, documenta el fallo y deja el comando exacto pendiente.

Tareas:
1. Crea o actualiza el proyecto Node en la raiz del repo:
   - `package.json` con `"type": "commonjs"` o sin `"type"` si CommonJS queda claro
   - `package-lock.json` generado con npm
   - nombre privado del paquete, por ejemplo `crudo-v1`
   - `engines.node` recomendado para LTS par consolidada, preferiblemente `>=20`

2. Configura scripts npm:
   - `dev`: arranque local combinado preparado para backend y futuro Vite
   - `dev:server`: servidor Express con reload si `nodemon` esta instalado
   - `dev:client`: placeholder claro si Vite aun no existe, o `vite --host 0.0.0.0` si ya esta instalado
   - `build`: si no existe frontend todavia, usa un placeholder honesto que no genere `dist/` ni finja un build completo
   - `start`: `node server.js`
   - `lint`: ESLint sobre `server/`, `db/`, `tests/` y `server.js`
   - `test`: Vitest en modo run
   - `db:migrate`: placeholder seguro que indique que Fase 2 creara migraciones reales
   - `db:seed`: placeholder seguro que indique que Fase 2 creara seeds reales
   - `deploy:plesk:notes`: imprime o referencia notas de `infra/plesk/README.md` si procede

3. Crea o completa estructura:
   - `server.js`
   - `server/app.js`
   - `server/config/env.js`
   - `server/config/index.js` solo si aporta claridad
   - `server/routes/`
   - `server/routes/health.routes.js`
   - `server/controllers/`
   - `server/controllers/health.controller.js`
   - `server/services/`
   - `server/services/health.service.js`
   - `server/repositories/`
   - `server/middleware/`
   - `server/middleware/error-handler.js`
   - `server/middleware/not-found.js`
   - `server/middleware/validate-request.js`
   - `server/middleware/async-handler.js`
   - `server/utils/problem.js`
   - `server/utils/http.js` si hace falta para constantes simples
   - `db/pool.js`
   - `db/migrations/`
   - `db/seeds/`
   - `tests/`
   - `tests/health.test.js`
   - `tests/app.test.js` si separas smoke general de health

4. Configura `server/config/env.js`:
   - cargar `.env` con dotenv
   - validar y normalizar variables basicas sin libreria pesada si no es necesaria
   - valores por defecto seguros para local:
     - `NODE_ENV=development`
     - `PORT=3000`
     - `CLIENT_DEV_URL=http://localhost:5173`
     - `CORS_ALLOWED_ORIGINS=http://localhost:5173`
   - variables MariaDB:
     - `DB_HOST`
     - `DB_PORT`
     - `DB_NAME`
     - `DB_USER`
     - `DB_PASSWORD`
   - secretos como `JWT_SECRET` y `COOKIE_SECRET` deben venir de env; no hardcodees secretos reales
   - en `test`, permite defaults seguros para que Supertest no dependa de una base de datos real

5. Configura Express en `server/app.js`:
   - helmet
   - CORS por env, aceptando solo origenes configurados
   - JSON/body parsers con limites razonables
   - cookie-parser
   - rate limit preparado para `/api/v1` o para POST publicos sin bloquear tests
   - rutas bajo `/api/v1`
   - `GET /api/v1/health`
   - handler 404 RFC 7807
   - error handler RFC 7807 con content type `application/problem+json`
   - no exponer stack trace en produccion

6. Crea helpers transversales minimos:
   - `asyncHandler(fn)` para rutas async
   - `createProblem()` o equivalente para RFC 7807
   - `validateRequest(schemaOrRules)` como middleware centralizado preparado para fases posteriores
   - no metas validaciones de negocio todavia

7. Crea `server.js`:
   - importa `app`
   - arranca en `PORT`
   - maneja `SIGTERM` y `SIGINT` cerrando el pool si existe
   - en produccion debe estar preparado para servir `dist/` si existe
   - si `dist/` no existe en local, no debe romper la API

8. Crea `db/pool.js`:
   - usa paquete `mariadb`
   - variables `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
   - exporta `getPool()`, `query()` si procede, `pingDatabase()` y `closePool()`
   - no conecta agresivamente al importar el modulo
   - si MariaDB no esta disponible en local, health debe responder con API viva y DB degradada de forma clara, sin crashear el proceso

9. Crea health endpoint:
   - `GET /api/v1/health`
   - response JSON estable:
     - `status`: `ok` o `degraded`
     - `service`: `crudo-api`
     - `version`
     - `environment`
     - `uptime`
     - `timestamp`
     - `checks.database.status`: `ok`, `skipped` o `error`
   - en `NODE_ENV=test`, la comprobacion DB puede estar mockeada/skipped para no exigir MariaDB real
   - si DB falla en development, HTTP puede ser 200 con `status=degraded`; si decides 503, justificalo y ajusta tests

10. Actualiza `.env.example` solo si faltan variables necesarias de Fase 1. No metas secretos reales.

11. Crea tests smoke con Vitest + Supertest:
   - app levanta con Supertest
   - health responde
   - 404 devuelve RFC 7807
   - error handler devuelve RFC 7807
   - no requiere MariaDB real para pasar en CI/local basico

12. Configura ESLint:
   - reglas pragmaticas para JavaScript CommonJS
   - no bloquear por estilo cosmetico excesivo
   - detectar variables/imports sin usar
   - scripts y tests deben poder ejecutarse en Windows/PowerShell

13. Actualiza documentacion minima:
   - `README.md`: comandos reales instalados, como arrancar backend, como ejecutar tests/lint, notas de DB local
   - `docs/runbook.md`: comandos reales de Fase 1 y comportamiento del health check
   - `infra/plesk/README.md`: si cambia el startup file o comandos reales

Prohibido en esta fase:
- No crear migraciones SQL reales de tablas V1; eso es Fase 2.
- No implementar endpoints de productos, categorias, campanas, eventos, pickup, newsletter, consent ni admin.
- No implementar React visual ni design system; eso empieza en Fase 7.
- No activar pagos online, Stripe, Redsys ni webhooks.
- No permitir venta online de alcohol.
- No crear autenticacion JWT funcional todavia salvo variables/env placeholder.
- No introducir TypeScript, ORM, Prisma, Sequelize, Next.js, Docker obligatorio ni arquitectura distinta sin justificacion explicita.
- No hardcodear secretos, telefonos privados, emails reales o credenciales.

Actualizacion del estado vivo:
Al terminar, actualiza solo la seccion `0.1 Estado vivo del proyecto` de `docs/V1/V1Tecnico.md`:
- `last_updated`
- `current_phase`: 1
- `current_phase_name`: "Scaffold monolito Node.js Express"
- `current_focus`: resumen real de lo creado
- `overall_status`: `REVIEW_READY` si tests/lint pasan; `IN_PROGRESS` si queda algo tecnico menor; `BLOCKED` si faltan permisos, red o decision critica
- tabla de Fase 1 con implementado/falta/notas reales
- tabla de Fase 2 debe quedar como siguiente fase si Fase 1 esta lista
- funcionalidades implementadas: anade solo scaffold tecnico, health endpoint y helpers base; no anadas funcionalidades comerciales
- registro de sesion con fecha y verificacion
- siguiente prompt recomendado: "Fase 2 - Modelo de datos MariaDB y seed local" si Fase 1 queda lista

Si cambias comandos, estructura o estado que afecte al roadmap visual, actualiza tambien `docs/V1/v1TecnicoVisual.html`.

Criterios de aceptacion:
- `package.json` existe, usa npm y CommonJS, y contiene scripts reales o placeholders honestos.
- `server.js` arranca Express sin crash.
- API vive bajo `/api/v1`.
- `GET /api/v1/health` responde en local/test sin exigir MariaDB real.
- El pool MariaDB esta preparado, pero no conecta al importar.
- Los errores usan RFC 7807 `application/problem+json`.
- La validacion de requests queda centralizada como helper/middleware base.
- `npm test` pasa.
- `npm run lint` pasa si ESLint esta configurado.
- `npm start` arranca o se valida con smoke equivalente si no se puede dejar proceso corriendo.
- `.env.example` no contiene secretos reales y cubre variables de Fase 1.
- `README.md` y `docs/runbook.md` reflejan comandos reales.
- `docs/AGENTS_Javi.md` no se modifica.
- No hay endpoints de negocio ni logica V1 adelantada.

Verificacion obligatoria:
- Ejecuta `npm test`.
- Ejecuta `npm run lint` si existe.
- Ejecuta `npm start` o una verificacion equivalente de arranque sin dejar procesos vivos.
- Ejecuta `git status --short`.
- Lista archivos creados/modificados.
- Comprueba que `.env.example` no contiene secretos reales.
- Si `npm install` o cualquier verificacion falla por red/sandbox, reportalo con comando exacto pendiente y no marques la fase como `DONE`.

Respuesta final:
- Resumen de Fase 1.
- Archivos creados/modificados.
- Verificacion ejecutada y resultado.
- Estado vivo actualizado o motivo si no se pudo.
- Riesgos o pendientes reales.
- Siguiente prompt recomendado.
```

## 11. Fase 2 - Modelo de datos MariaDB y seed local

Objetivo: crear schema real V1 y datos de desarrollo suficientes.

Entregables:
- `db/migrations/*.sql`
- Repositories/services JavaScript
- Seed local en `db/seeds/seed.js` o `db/seeds/*.sql`
- Tests repository/service con base de datos de test

Prompt para Opus:

```text
Usa el Prompt base minimo y fijo.

Implementa la Fase 2: modelo de datos V1 de CRUDO con MariaDB.

Objetivo de esta fase:
Crear el schema real V1 de CRUDO en MariaDB, los scripts de migracion/seed local y una capa repository/service minima que permita probar el modelo sin exponer todavia endpoints de negocio. El resultado debe dejar `is_alcohol` como regla estructural del sistema, con datos seed que demuestren la separacion entre vino visible y productos no alcoholicos reservables en fases posteriores.

Contexto obligatorio:
- Fase 1 debe haber dejado `package.json`, `server.js`, `server/app.js`, `db/pool.js`, tests y scripts base.
- Stack confirmado: JavaScript, CommonJS, Node.js + Express, MariaDB con paquete `mariadb`, SQL versionado en `db/migrations/`, seeds locales en `db/seeds/`.
- Arquitectura backend: Route -> Controller -> Service -> Repository -> MariaDB. En esta fase solo se crean repositories/services suficientes para validar datos y preparar fases 3-5.
- V1 no tiene pago online ni venta online de alcohol.
- El vino debe existir en catalogo y PDP en fases posteriores, pero no debe poder entrar en `Mi Tabla`; en esta fase solo se modela `is_alcohol` y se deja preparado el dato. El bloqueo 422 completo es Fase 4.
- Produccion Plesk nunca debe ejecutar seeds de desarrollo automaticamente.

Antes de editar:
1. Lee `docs/V1/V1Tecnico.md`, especialmente `0.1 Estado vivo del proyecto`, y confirma si Fase 1 esta realmente lista.
2. Inspecciona:
   - `package.json` y scripts actuales
   - `db/pool.js`
   - `db/migrations/`
   - `db/seeds/`
   - `server/repositories/`
   - `server/services/`
   - `tests/`
   - `.env.example`
   - `git status --short`
3. Si Fase 1 no esta completa, no rehagas todo: completa solo lo imprescindible para que migraciones, seeds y tests puedan vivir en el scaffold existente, y documenta el desfase.
4. No modifiques `docs/AGENTS_Javi.md`.
5. No borres migraciones/seeds existentes sin leerlos y justificarlo.

Decisiones tecnicas:
- Usar migraciones SQL planas en `db/migrations/`.
- Usar scripts JavaScript CommonJS para ejecutar migraciones y seeds desde npm.
- Usar MariaDB directamente con el paquete `mariadb`; no introducir ORM.
- SQL:
  - keywords en INGLES MAYUSCULAS
  - tablas/columnas/indices/FK en `snake_case`
  - nombres de constraints claros
  - precios siempre en centimos enteros
  - timestamps `created_at`, `updated_at`
- Para enums, preferir `VARCHAR(...)` con constraints/checks solo si la version MariaDB objetivo lo soporta de forma fiable. Si no, usar `VARCHAR` + validacion en service y documentar el motivo.
- Todas las migraciones deben ser idempotentes de forma razonable para local/dev si se reejecuta el script, o el script debe registrar/aplicar migraciones una sola vez mediante tabla `schema_migrations`.

Archivos a crear o actualizar:
1. Migraciones:
   - `db/migrations/001_create_core_schema.sql`
   - `db/migrations/002_create_indexes.sql` si prefieres separar indices
   - evitar demasiados archivos si no aportan claridad

2. Scripts DB:
   - `db/migrate.js`
   - `db/seed.js`
   - `db/reset.js` solo si es seguro y limitado a `NODE_ENV=development` o `test`
   - helper compartido si hace falta, por ejemplo `db/migration-runner.js`

3. Seeds:
   - `db/seeds/dev-seed.sql` o `db/seeds/dev-seed.js`
   - el seed debe ser local/dev/test, nunca produccion

4. Repositories/services minimos:
   - `server/repositories/product.repository.js`
   - `server/repositories/category.repository.js`
   - `server/repositories/event.repository.js`
   - `server/repositories/admin-user.repository.js` solo si hace falta para verificar seed admin
   - `server/services/catalog.service.js`
   - `server/services/event.service.js`
   - `server/services/pickup-model.service.js` o similar solo para validar datos de pickup sin implementar endpoint

5. Tests:
   - `tests/db/migrations.test.js`
   - `tests/db/seed.test.js`
   - `tests/repositories/product.repository.test.js`
   - `tests/services/catalog.service.test.js`
   - usa nombres ajustados al patron real del repo si ya existe otro convenio

6. Documentacion:
   - `README.md`: comandos reales `db:migrate`, `db:seed`, `db:reset` si existe
   - `docs/runbook.md`: como preparar MariaDB local/test, ejecutar migraciones/seeds y evitar seeds en produccion
   - `.env.example`: variables de test DB si faltan, por ejemplo `DB_TEST_NAME=crudo_test`

Schema obligatorio:
1. `product`
   - `id`
   - `slug` unico
   - `name`
   - `type` (`CHEESE`, `WINE`, `OTHER`)
   - `is_alcohol`
   - `price_cents`
   - `vat_rate`
   - `short_desc`
   - `long_desc`
   - `producer`
   - `region`
   - `is_seasonal`
   - `is_featured`
   - `is_active`
   - `stock_status` (`IN_STOCK`, `LOW`, `OUT`)
   - `created_at`, `updated_at`

2. `product_image`
   - `id`, `product_id`, `url`, `alt_text`, `sort_order`, `is_primary`, timestamps

3. `category`
   - `id`, `slug`, `name`, `type`, `sort_order`, timestamps

4. `product_category`
   - `product_id`, `category_id`
   - PK compuesta

5. `campaign`
   - `id`, `slug`, `title`, `subtitle`, `hero_image_url`, `body_md`, `starts_at`, `ends_at`, `is_active`, timestamps

6. `campaign_product`
   - `campaign_id`, `product_id`, `sort_order`
   - PK compuesta o unique equivalente

7. `event`
   - `id`, `slug`, `title`, `description_md`, `hero_image_url`, `starts_at`, `ends_at`, `capacity`, `price_cents`, `location`, `is_active`, timestamps

8. `event_reservation`
   - `id`, `event_id`, `name`, `email`, `phone`, `party_size`, `notes`, `status` (`NEW`, `CONFIRMED`, `CANCELLED`), timestamps

9. `inquiry`
   - `id`, `type` (`CONTACT`, `WHOLESALE`, `PICKUP`), `name`, `email`, `phone`, `message`, `payload_json`, `status`, timestamps

10. `pickup_order`
   - `id`, `name`, `email`, `phone`, `pickup_date`, `pickup_slot`, `notes`, `total_cents`, `status` (`NEW`, `CONFIRMED`, `READY`, `PICKED_UP`, `CANCELLED`), timestamps

11. `pickup_order_item`
   - `id`, `pickup_order_id`, `product_id`, `qty`, `unit_price_cents`

12. `newsletter_subscriber`
   - `id`, `email`, `source`, `consent_at`, `ip`, `status`, timestamps

13. `admin_user`
   - `id`, `email`, `password_hash`, `role` (`ADMIN`, `STAFF`), `is_active`, timestamps

14. `consent_log`
   - `id`, `consent_id`, `analytics`, `marketing`, `preferences`, `ip_hash`, `user_agent_hash`, `created_at`, `expires_at`

15. `audit_log`
   - `id`, `actor_admin_user_id`, `action`, `entity_type`, `entity_id`, `payload_json`, `created_at`

Constraints e indices obligatorios:
- `slug` unico en `product`, `category`, `campaign`, `event`.
- FK con nombres claros, por ejemplo `fk_product_image_product`.
- Indices para:
  - `product(type, is_active)`
  - `product(is_alcohol, is_active)`
  - `product(is_seasonal, is_featured)`
  - `event(starts_at, is_active)`
  - `pickup_order(status, pickup_date)`
  - `inquiry(type, status)`
  - `newsletter_subscriber(email)`
- `price_cents`, `total_cents`, `unit_price_cents` no negativos.
- `qty > 0`.
- `party_size > 0`.
- `capacity >= 0`.
- `is_alcohol` no nullable y default false.
- `payload_json` debe ser `JSON` o `LONGTEXT` con validacion segun compatibilidad MariaDB; documenta la decision.

Seed local obligatorio:
- Categorias:
  - al menos 3 categorias de queso
  - al menos 2 categorias de vino
  - al menos 1 categoria `OTHER`
- Productos:
  - minimo 10 productos
  - minimo 4 quesos no alcoholicos
  - minimo 2 vinos con `is_alcohol=true`
  - minimo 1 producto `OTHER`
  - minimo 4 productos `is_seasonal=true`
  - minimo 3 productos `is_featured=true`
  - imagen primaria placeholder con alt text para varios productos si el schema lo permite
- 1 campana activa con productos asociados.
- 2 eventos futuros activos.
- 1 newsletter subscriber de prueba.
- 1 admin user local activo con hash bcrypt de desarrollo.
  - No guardes password real en claro.
  - Puedes documentar en README/runbook una credencial local ficticia solo si queda claramente marcada como desarrollo, por ejemplo `admin.local@example.test` / `change-me-local-only`, y el hash debe corresponder solo al entorno local.

Scripts npm:
- `npm run db:migrate`: aplica migraciones pendientes a `DB_NAME`.
- `npm run db:seed`: carga seed solo si `NODE_ENV` es `development` o `test`; en `production` debe abortar.
- `npm run db:reset`: opcional; si existe, debe abortar fuera de `development` y `test`.
- `npm test`: debe incluir o poder incluir tests de repositories/services.

Tests obligatorios:
1. Migraciones:
   - se pueden aplicar desde cero en DB de test si esta disponible.
   - crean tabla `schema_migrations` o mecanismo equivalente.
2. Seed:
   - carga productos alcohol y no alcohol.
   - vinos seed tienen `is_alcohol=true`.
   - quesos/no alcohol tienen `is_alcohol=false`.
3. Repositories/services:
   - listar productos activos.
   - filtrar por `type`.
   - filtrar por `is_alcohol`.
   - obtener producto por slug con categorias.
   - unique slug falla o se maneja de forma testeada.
   - eventos futuros activos se ordenan por fecha.
4. Pickup model:
   - `pickup_order_item` puede referenciar `product`.
   - No implementes todavia el rechazo 422 por alcohol; deja test pendiente/documentado para Fase 4 si aparece la tentacion.

Si no hay MariaDB disponible:
- No inventes que la fase esta completa.
- Ejecuta los tests que no dependan de DB.
- Deja documentado el comando exacto para preparar DB local/test.
- Marca la fase como `IN_PROGRESS` o `BLOCKED` segun corresponda, no `DONE`.

Prohibido en esta fase:
- No crear endpoints Express publicos de catalogo/eventos/newsletter/admin; eso es Fase 3 y Fase 5.
- No implementar `POST /api/v1/pickup-orders`; eso es Fase 4.
- No implementar frontend.
- No activar pagos online ni Stripe.
- No crear tablas de V2 como cuentas de cliente, loyalty, reviews, pagos, stock realtime, location multi-sede o traducciones.
- No usar ORM.
- No ejecutar seeds en produccion.
- No guardar secretos reales ni datos reales del owner.

Actualizacion del estado vivo:
Al terminar, actualiza solo la seccion `0.1 Estado vivo del proyecto` de `docs/V1/V1Tecnico.md`:
- `last_updated`
- `current_phase`: 2
- `current_phase_name`: "Modelo de datos MariaDB y seed local"
- `current_focus`: resumen real de migraciones, seed, scripts y tests
- `overall_status`: `REVIEW_READY` si migraciones/seed/tests pasan; `IN_PROGRESS` si queda DB/test pendiente; `BLOCKED` si falta MariaDB o decision critica
- tabla de Fase 2 con implementado/falta/notas reales
- tabla de Fase 3 como siguiente fase si Fase 2 queda lista
- funcionalidades implementadas: anade solo modelo de datos, scripts DB, seed local y repositories/services base
- registro de sesion con fecha y verificacion
- siguiente prompt recomendado: "Fase 3 - Contratos API y servicios publicos" si Fase 2 queda lista
- checklist final: solo marca items relacionados con scripts npm/MariaDB o modelo si estan realmente verificados

Si cambias estado, scripts o estructura que afecte al roadmap visual, actualiza tambien `docs/V1/v1TecnicoVisual.html`.

Criterios de aceptacion:
- Las migraciones SQL se pueden ejecutar desde cero en una MariaDB local/test.
- Existe un mecanismo claro para no reaplicar migraciones ya aplicadas.
- Seeds solo cargan en local/dev/test y abortan en production.
- `is_alcohol` existe, es no nullable, tiene default seguro y esta testeado.
- El seed contiene vinos con `is_alcohol=true` y productos no alcoholicos con `is_alcohol=false`.
- Repositories/services basicos funcionan contra MariaDB.
- No hay endpoints de negocio adelantados.
- No hay secretos reales.
- SQL usa nombres claros, tablas/columnas en `snake_case` y keywords en MAYUSCULAS.
- `npm test` pasa o documenta claramente que falta MariaDB y no marca fase como completa.
- `npm run lint` pasa si esta configurado.
- README/runbook explican migraciones, seeds y preparacion de DB local/test.
- `docs/AGENTS_Javi.md` no se modifica.

Verificacion obligatoria:
- Ejecuta `npm run db:migrate` con DB disponible.
- Ejecuta `npm run db:seed` con DB disponible.
- Ejecuta `npm test`.
- Ejecuta `npm run lint` si existe.
- Ejecuta `git status --short`.
- Lista archivos creados/modificados.
- Comprueba que los seeds no contienen secretos reales.
- Comprueba que `NODE_ENV=production npm run db:seed` aborta o documenta por que no se pudo probar en Windows/PowerShell con comando equivalente.
- Reporta cualquier verificacion no ejecutada y el motivo real.

Respuesta final:
- Resumen de Fase 2.
- Archivos creados/modificados.
- Verificacion ejecutada y resultado.
- Estado vivo actualizado o motivo si no se pudo.
- Riesgos o pendientes reales.
- Siguiente prompt recomendado.
```

## 12. Fase 3 - Contratos API y servicios publicos

Objetivo: implementar endpoints publicos de catalogo, campanas, eventos, inquiries, newsletter y site config.

Entregables:
- Validadores completos para endpoints publicos
- Rutas Express organizadas y documentadas
- Services
- Routes Express por modulo
- Problem JSON
- Rate limiting
- Tests route/service

Prompt para Opus:

```text
Usa el Prompt base minimo y fijo.

Implementa la Fase 3: API publica de CRUDO V1.

Objetivo de esta fase:
Implementar la API publica V1 que alimentara el frontend: catalogo, categorias, campanas, eventos, reservas de eventos, consultas, newsletter, consentimiento y configuracion publica del sitio. Esta fase debe exponer contratos HTTP estables bajo `/api/v1`, usando validacion centralizada, RFC 7807, rate limiting y repositories/services contra MariaDB. No implementes todavia `Mi Tabla`/pickup orders, admin JWT ni frontend.

Contexto obligatorio:
- Fase 1 debe haber dejado Express, RFC 7807, health, middleware de validacion y tests base.
- Fase 2 debe haber dejado MariaDB schema, seed local y repositories/services base.
- Stack: JavaScript, CommonJS, Express, MariaDB con paquete `mariadb`.
- Arquitectura obligatoria: Route -> Validator middleware -> Controller -> Service -> Repository -> MariaDB.
- Public site en espanol, compatible con Google Translate, sin pago online y sin venta online de alcohol.
- Los vinos con `is_alcohol=true` se pueden listar y ver en catalogo/PDP, pero en esta fase no se crea ningun endpoint para anadirlos a `Mi Tabla`. El bloqueo backend 422 pertenece a Fase 4.

Antes de editar:
1. Lee `docs/V1/V1Tecnico.md`, especialmente `0.1 Estado vivo del proyecto`, y confirma si Fase 2 esta realmente lista.
2. Inspecciona:
   - `server/app.js`
   - `server/routes/`
   - `server/controllers/`
   - `server/services/`
   - `server/repositories/`
   - `server/middleware/validate-request.js`
   - `server/utils/problem.js`
   - `db/migrations/`
   - `db/seeds/`
   - `tests/`
   - `package.json`
   - `git status --short`
3. Si faltan piezas minimas de Fase 1 o Fase 2, completa solo lo necesario para que la API publica pueda apoyarse en ellas, y documenta el desfase.
4. No modifiques `docs/AGENTS_Javi.md`.
5. No cambies el schema sin crear migracion nueva o sin justificar que es correccion de Fase 2 aun no consolidada.

Endpoints publicos obligatorios:
- `GET /api/v1/products`
- `GET /api/v1/products/:slug`
- `GET /api/v1/categories`
- `GET /api/v1/campaigns/active`
- `GET /api/v1/campaigns/:slug`
- `GET /api/v1/events`
- `GET /api/v1/events/:slug`
- `POST /api/v1/events/:slug/reservations`
- `POST /api/v1/inquiries`
- `POST /api/v1/newsletter/subscribe`
- `POST /api/v1/consent`
- `GET /api/v1/site/config`

Archivos a crear o actualizar:
1. Rutas:
   - `server/routes/products.routes.js`
   - `server/routes/categories.routes.js`
   - `server/routes/campaigns.routes.js`
   - `server/routes/events.routes.js`
   - `server/routes/inquiries.routes.js`
   - `server/routes/newsletter.routes.js`
   - `server/routes/consent.routes.js`
   - `server/routes/site-config.routes.js`
   - actualiza el router principal bajo `/api/v1`

2. Controladores:
   - `server/controllers/products.controller.js`
   - `server/controllers/categories.controller.js`
   - `server/controllers/campaigns.controller.js`
   - `server/controllers/events.controller.js`
   - `server/controllers/inquiries.controller.js`
   - `server/controllers/newsletter.controller.js`
   - `server/controllers/consent.controller.js`
   - `server/controllers/site-config.controller.js`

3. Servicios:
   - `server/services/catalog.service.js`
   - `server/services/campaign.service.js`
   - `server/services/event.service.js`
   - `server/services/inquiry.service.js`
   - `server/services/newsletter.service.js`
   - `server/services/consent.service.js`
   - `server/services/site-config.service.js`
   - `server/services/notification.service.js` con adaptador noop/local

4. Repositories:
   - completa o crea repositories necesarios para product/category/campaign/event/inquiry/newsletter/consent/site-config.
   - No mezcles SQL en controladores.

5. Validadores:
   - `server/validators/products.validator.js`
   - `server/validators/events.validator.js`
   - `server/validators/inquiries.validator.js`
   - `server/validators/newsletter.validator.js`
   - `server/validators/consent.validator.js`
   - `server/validators/common.validator.js` si hace falta
   - si el proyecto ya usa otra ubicacion para validadores, respeta ese patron.

6. Tests:
   - `tests/routes/products.routes.test.js`
   - `tests/routes/events.routes.test.js`
   - `tests/routes/inquiries.routes.test.js`
   - `tests/routes/newsletter.routes.test.js`
   - `tests/routes/consent.routes.test.js`
   - `tests/services/catalog.service.test.js`
   - `tests/services/event.service.test.js`
   - ajusta nombres al patron real si ya existe.

Contratos y comportamiento:
1. `GET /products`
   - Devuelve solo productos `is_active=true`.
   - Incluye productos alcoholicos y no alcoholicos.
   - Los vinos deben exponer `is_alcohol=true` para que el frontend sepa que el CTA sera WhatsApp.
   - Soporta paginacion:
     - `page`, default 1
     - `size`, default 20, max 50
   - Soporta filtros:
     - `type`: `CHEESE`, `WINE`, `OTHER`
     - `category`: slug de categoria
     - `seasonal`: boolean
     - `featured`: boolean
     - `q`: busqueda simple por nombre/productor/region
   - Orden default: featured primero, seasonal despues, nombre ascendente o criterio claro documentado.
   - Response incluye `items` y `pagination`.

2. `GET /products/:slug`
   - Devuelve producto activo por slug.
   - Incluye categorias e imagenes ordenadas.
   - Si no existe o no esta activo: 404 RFC 7807.
   - No crea logica de `Mi Tabla`; solo expone datos suficientes para que fases frontend decidan CTA.

3. `GET /categories`
   - Devuelve categorias ordenadas por `sort_order`, `name`.
   - Permite query opcional `type`.

4. `GET /campaigns/active`
   - Devuelve campana activa en ventana de fechas o `null`/404 segun contrato que elijas, pero documentalo y testea.
   - Incluye productos asociados activos.

5. `GET /campaigns/:slug`
   - Devuelve campana activa por slug con productos activos.
   - 404 RFC 7807 si no existe/no activa/fuera de ventana.

6. `GET /events`
   - Devuelve eventos futuros `is_active=true`.
   - Orden por `starts_at` ascendente.
   - Incluye capacidad restante si hay reservas.
   - Incluye indicador `few_seats_left=true` si quedan menos del 30% de plazas.

7. `GET /events/:slug`
   - Devuelve evento futuro activo.
   - Incluye capacidad restante y `few_seats_left`.
   - Si esta lleno, response debe permitir al frontend sustituir form por mensaje/waitlist futuro, sin implementar waitlist real salvo que ya exista.

8. `POST /events/:slug/reservations`
   - Request:
     - `name` requerido
     - `email` requerido y valido
     - `phone` requerido o opcional segun decision documentada; preferible requerido para owner
     - `party_size` entero 1-4
     - `notes` opcional con limite razonable
   - Rechaza evento inexistente, inactivo, pasado o lleno.
   - Crea reserva con status `NEW`.
   - Debe ser idempotente si llega `Idempotency-Key`; si no implementas persistencia completa aun, documenta deuda para Fase 4/5 y evita doble insercion en tests donde sea razonable.
   - Emite notificacion interna/noop para owner.

9. `POST /inquiries`
   - Tipos permitidos: `CONTACT`, `WHOLESALE`.
   - `PICKUP` queda reservado para Fase 4 si se usa internamente.
   - Request:
     - `type`
     - `name`
     - `email`
     - `phone` opcional salvo que falte email
     - `message`
     - `payload` opcional para datos especificos de formulario
   - Guarda `payload_json`.
   - Status inicial `NEW`.
   - Emite notificacion interna/noop.

10. `POST /newsletter/subscribe`
   - Request:
     - `email`
     - `source`
     - consentimiento explicito o campo equivalente si el frontend lo envia.
   - Guarda `consent_at`, `ip`, `source`, `status`.
   - Implementa interfaz `NewsletterProvider` o adaptador equivalente.
   - Si no hay `BREVO_API_KEY`, usar noop/mock local sin fallar el request.
   - Preparar double opt-in via Brevo, pero sin depender de credenciales reales en tests.

11. `POST /consent`
   - Request:
     - `consent_id`
     - `analytics`
     - `marketing`
     - `preferences`
   - Guarda log con hashes de IP/user agent si ya hay helper; si no, implementa hashing simple con `crypto` y salt/env si existe.
   - `expires_at` recomendado a 24 meses.
   - No carga cookies por si mismo; solo registra decision.

12. `GET /site/config`
   - Devuelve configuracion publica necesaria para frontend:
     - nombre CRUDO
     - direccion placeholder si no hay real
     - horarios placeholder/documentados
     - WhatsApp publico desde env o placeholder seguro
     - Instagram
     - Google Maps URL
     - pickup SLA: confirmacion por WhatsApp en menos de 24h
     - flags publicos como `pickup_enabled`
   - No expone secretos ni emails privados no publicos.

Cross-cutting:
- Public GET cacheable 5 minutos:
  - `Cache-Control: public, max-age=300, stale-while-revalidate=60` o variante razonable.
- POST publicos:
  - rate limit 10 req/min/IP.
  - body limit razonable.
- Validacion:
  - centralizada antes de controladores.
  - 400 para request mal formado.
  - 422 para request sintacticamente valido pero no procesable por regla de negocio.
- Errores:
  - RFC 7807 `application/problem+json`.
  - 404 para recursos no encontrados.
  - 409 para conflicto/idempotencia si aplica.
  - no filtrar errores SQL al cliente.
- Seguridad:
  - no secretos hardcodeados.
  - CORS sigue limitado por env.
  - no logs con PII completa.
- Responses:
  - JSON estable.
  - nombres en `snake_case` o `camelCase` segun patron ya elegido; si no existe patron, usa `snake_case` para alinearlo con DB y documentalo.

Notificaciones:
- Crea `NotificationService` con metodos para:
  - nueva inquiry
  - nueva event reservation
  - newsletter subscribe si aporta valor
- En local/test debe ser noop o in-memory spy.
- No integrar proveedor WhatsApp real todavia salvo adaptador pasivo. No bloquear requests por fallo de proveedor externo.

Tests obligatorios:
1. Routes con Supertest:
   - products list happy path.
   - product detail 200 y 404.
   - categories list.
   - active campaign.
   - events list y detail.
   - reservation happy path.
   - reservation invalid payload.
   - reservation full event.
   - inquiry CONTACT/WHOLESALE happy path.
   - newsletter subscribe sin Brevo API key.
   - consent log.
   - rate limit en un POST publico si el test no queda fragil.

2. Service tests:
   - filtros de catalogo.
   - solo entidades activas publicas.
   - eventos pasados no aparecen.
   - calculo de capacidad restante y `few_seats_left`.
   - newsletter provider noop.
   - consent expiry 24 meses.

3. Error tests:
   - validacion devuelve problem detail.
   - 404 devuelve problem detail.
   - error interno no filtra detalles SQL.

Si no hay MariaDB disponible:
- Ejecuta tests unitarios/noop que no dependan de DB.
- No marques Fase 3 como completa.
- Documenta comandos pendientes: migrar, seed, test con DB.
- Actualiza estado vivo como `IN_PROGRESS` o `BLOCKED`.

Prohibido en esta fase:
- No implementar `POST /api/v1/pickup-orders`; eso es Fase 4.
- No implementar alcohol guard 422 completo de pickup; solo asegurar que productos exponen `is_alcohol`.
- No crear endpoints admin ni JWT; eso es Fase 5.
- No implementar frontend.
- No activar pagos online, Stripe ni Redsys.
- No introducir ORM o framework nuevo.
- No crear tablas V2 ni cambiar el alcance V1.

Actualizacion del estado vivo:
Al terminar, actualiza solo la seccion `0.1 Estado vivo del proyecto` de `docs/V1/V1Tecnico.md`:
- `last_updated`
- `current_phase`: 3
- `current_phase_name`: "API Express y servicios publicos"
- `current_focus`: resumen real de endpoints, validadores, services, tests y pendientes
- `overall_status`: `REVIEW_READY` si API/tests/lint pasan; `IN_PROGRESS` si queda DB/test pendiente; `BLOCKED` si falta MariaDB o decision critica
- tabla de Fase 3 con implementado/falta/notas reales
- tabla de Fase 4 como siguiente fase si Fase 3 queda lista
- funcionalidades implementadas: anade solo API publica y servicios publicos reales
- registro de sesion con fecha y verificacion
- siguiente prompt recomendado: "Fase 4 - Mi Tabla y alcohol guard" si Fase 3 queda lista
- checklist final: marca solo rutas publicas/formularios backend si estan realmente verificados

Si cambias estado, rutas o arquitectura que afecte al roadmap visual, actualiza tambien `docs/V1/v1TecnicoVisual.html`.

Criterios de aceptacion:
- Todos los endpoints publicos de Fase 3 existen bajo `/api/v1`.
- Validadores centralizados antes de controladores.
- Controllers no contienen SQL.
- Services conservan reglas de negocio.
- Repositories encapsulan MariaDB.
- Public GET cache headers 5 minutos.
- POST publicos con rate limit.
- RFC 7807 en validacion, 404 y errores.
- Products expone correctamente `is_alcohol`.
- Public endpoints devuelven datos seed si DB esta migrada/seedeada.
- Newsletter funciona con adaptador noop si no hay Brevo.
- Consent se guarda sin cargar cookies no esenciales.
- `npm test` pasa con DB disponible o se documenta claramente bloqueo.
- `npm run lint` pasa si existe.
- README/runbook documentan rutas, comandos y dependencias externas noop.
- `docs/AGENTS_Javi.md` no se modifica.
- No se implementa pickup completo, admin ni pagos.

Verificacion obligatoria:
- Ejecuta `npm run db:migrate` si DB esta disponible.
- Ejecuta `npm run db:seed` si DB esta disponible.
- Ejecuta `npm test`.
- Ejecuta `npm run lint` si existe.
- Ejecuta un smoke de API con Supertest o comando equivalente para `/api/v1/health` y al menos `/api/v1/products`.
- Ejecuta `git status --short`.
- Lista archivos creados/modificados.
- Comprueba que no hay secretos reales ni credenciales Brevo/WhatsApp hardcodeadas.
- Reporta cualquier verificacion no ejecutada y el motivo real.

Respuesta final:
- Resumen de Fase 3.
- Endpoints implementados.
- Archivos creados/modificados.
- Verificacion ejecutada y resultado.
- Estado vivo actualizado o motivo si no se pudo.
- Riesgos o pendientes reales.
- Siguiente prompt recomendado.
```

## 13. Fase 4 - Mi Tabla y alcohol guard

Objetivo: implementar la funcionalidad comercial mas critica de V1.

Entregables:
- `POST /api/v1/pickup-orders`
- Calculo de precios
- Validacion de slots
- Bloqueo de alcohol con 422
- Idempotency-Key
- Notificacion owner
- Tests negativos/positivos

Prompt para Opus:

```text
Usa el Prompt base minimo y fijo.

Implementa la Fase 4: Mi Tabla pickup inquiry flow en backend.

Objetivo de esta fase:
Implementar el flujo backend de `Mi Tabla` como solicitud de pickup sin pago online, limitado estrictamente a productos no alcoholicos. Esta fase debe crear `POST /api/v1/pickup-orders`, calcular precios desde servidor, persistir pedido e items en MariaDB, aplicar idempotencia, emitir notificacion owner mediante adaptador noop/local y bloquear cualquier producto con `is_alcohol=true` con HTTP 422 RFC 7807.

Regla critica no negociable:
- Vino/alcohol se puede ver en catalogo/PDP, pero nunca reservar mediante `Mi Tabla`.
- Si cualquier line item referencia un producto con `is_alcohol=true`, `POST /api/v1/pickup-orders` debe responder HTTP 422 con `application/problem+json`.
- Si el request mezcla queso/no alcohol + vino/alcohol, se rechaza todo el pedido y no se persiste nada.
- El frontend tambien ocultara el boton, pero el backend es la defensa final.
- No hay pago online. El mensaje al cliente debe indicar pago en CRUDO al recoger y confirmacion por WhatsApp en menos de 24 horas.

Contexto obligatorio:
- Fase 1 debe haber dejado Express, RFC 7807, validacion centralizada y tests.
- Fase 2 debe haber dejado tablas `product`, `pickup_order`, `pickup_order_item` e `is_alcohol`.
- Fase 3 debe haber dejado API publica, catalogo y `NotificationService` o equivalente noop.
- Stack: JavaScript, CommonJS, Express, MariaDB con paquete `mariadb`.
- Arquitectura: Route -> Validator middleware -> Controller -> Service -> Repository -> MariaDB.

Antes de editar:
1. Lee `docs/V1/V1Tecnico.md`, especialmente `0.1 Estado vivo del proyecto`, y confirma si Fase 3 esta realmente lista.
2. Inspecciona:
   - `server/routes/`
   - `server/controllers/`
   - `server/services/`
   - `server/repositories/`
   - `server/validators/`
   - `server/middleware/validate-request.js`
   - `server/utils/problem.js`
   - `db/migrations/`
   - `tests/`
   - `package.json`
   - `git status --short`
3. Si faltan piezas minimas de fases previas, completa solo lo imprescindible para implementar pickup sin rehacer arquitectura.
4. No modifiques `docs/AGENTS_Javi.md`.
5. Si necesitas modificar schema para idempotencia, crea una migracion nueva y documenta el motivo.

Endpoint obligatorio:
- `POST /api/v1/pickup-orders`

Contrato HTTP:
1. Headers:
   - `Content-Type: application/json`
   - `Idempotency-Key`: recomendado; obligatorio si decides endurecer el contrato. Si no viene, acepta el request pero documenta el riesgo de doble envio.

2. Request body:
   - `name`: string requerido
   - `email`: email requerido
   - `phone`: string requerido
   - `pickup_date`: fecha `YYYY-MM-DD` requerida
   - `pickup_slot`: string requerido, por ejemplo `18:00`
   - `notes`: string opcional con limite razonable
   - `items`: array requerido, minimo 1
     - `product_id` o `product_slug`: uno de los dos requerido
     - `qty`: entero requerido, `>= 1`

3. Response 201:
   - `order_id`
   - `status`: `NEW`
   - `total_cents`
   - `currency`: `EUR`
   - `items`
   - `confirmation_message`: texto en espanol indicando:
     - pedido recibido
     - pago en CRUDO al recoger
     - confirmacion por WhatsApp en menos de 24 horas

4. Errores:
   - 400: JSON mal formado, campos ausentes o tipos incorrectos.
   - 404: producto inexistente o no activo.
   - 409: conflicto de idempotencia.
   - 422: producto alcoholico, stock `OUT`, fecha/slot no permitido, items vacios si lo tratas como regla de negocio.
   - 429: rate limit.
   - Todos los errores deben ser RFC 7807 `application/problem+json`.

Archivos a crear o actualizar:
1. Rutas/controladores/validadores:
   - `server/routes/pickup-orders.routes.js`
   - `server/controllers/pickup-orders.controller.js`
   - `server/validators/pickup-orders.validator.js`
   - registrar la ruta bajo `/api/v1`

2. Servicios:
   - `server/services/pickup-order.service.js`
   - `server/services/idempotency.service.js` o helper equivalente
   - `server/services/notification.service.js` si no existe o hay que ampliarlo
   - `server/services/site-config.service.js` si se usa para horarios/slots

3. Repositories:
   - `server/repositories/pickup-order.repository.js`
   - completar `product.repository.js` para resolver productos activos por ids/slugs
   - `server/repositories/idempotency.repository.js` si usas tabla dedicada

4. DB/migraciones:
   - Si el schema de Fase 2 no soporta idempotencia, crea migracion nueva, por ejemplo:
     - `db/migrations/003_add_pickup_idempotency.sql`
   - Opciones aceptables:
     - tabla `idempotency_key` con key, request_hash, response_json, status_code, resource_type, resource_id, expires_at
     - o columnas controladas en `pickup_order` si es mas simple y suficiente
   - No rompas migraciones existentes.

5. Tests:
   - `tests/routes/pickup-orders.routes.test.js`
   - `tests/services/pickup-order.service.test.js`
   - `tests/services/idempotency.service.test.js` si existe servicio separado

Validacion centralizada:
- Usar middleware/helper existente de validacion.
- No validar payload manualmente dentro del controlador salvo conversion superficial.
- Limites recomendados:
  - `name`: 2-120 chars
  - `email`: formato email, max 160 chars
  - `phone`: 6-30 chars
  - `notes`: max 1000 chars
  - `items`: 1-30 lineas
  - `qty`: 1-99
- Rechazar payloads con `total_cents`, `unit_price_cents` o precio enviado por cliente. El cliente nunca decide precios.

Reglas de negocio de `PickupOrderService`:
1. Cargar todos los productos activos solicitados desde MariaDB.
2. Detectar productos inexistentes/inactivos y devolver 404 o 422 de forma consistente y testeada.
3. Si cualquier producto tiene `is_alcohol=true`, lanzar 422:
   - `type`: `/problems/pickup-alcohol-not-allowed`
   - `title`: `Alcohol products cannot be reserved for pickup`
   - `detail`: mensaje claro en espanol o ingles tecnico consistente con API
   - incluir `invalid_items` con slug/id si no expone datos sensibles
4. Rechazar productos `stock_status='OUT'`.
5. Calcular `unit_price_cents` y `total_cents` desde DB.
6. No aceptar precios desde cliente.
7. Validar fecha:
   - no pasada
   - no mas alla de un limite razonable, por ejemplo 14 o 30 dias
   - si no hay horarios reales en `site_config`, usar reglas locales documentadas como placeholder seguro
8. Validar slot:
   - formato `HH:mm`
   - incrementos de 30 minutos
   - dentro de horario pickup configurado o placeholder documentado
9. Guardar `pickup_order` y `pickup_order_item` en una transaccion.
10. Status inicial `NEW`.
11. Si falla cualquier validacion, no persistir pedido ni items.
12. Emitir notificacion owner despues de commit, no antes.

Idempotencia:
- Usar `Idempotency-Key` para evitar dobles envios por retry/red.
- Misma key + mismo payload:
  - devuelve la misma respuesta y mismo status code que el primer request exitoso.
- Misma key + payload distinto:
  - devuelve 409 RFC 7807.
- Si el primer intento falla por validacion antes de persistir, no es obligatorio guardar la key; si la guardas, documenta el comportamiento.
- Hash del payload normalizado con `crypto`.
- Expiracion recomendada: 24 horas.
- Tests deben cubrir retry exitoso y conflicto.

Notificaciones:
- Ampliar `NotificationService` con `notifyNewPickupOrder(order)`.
- En local/test:
  - noop o in-memory spy.
  - no fallar el request si faltan credenciales.
- Preparar mensaje owner con:
  - nombre
  - telefono
  - fecha/slot
  - resumen items
  - total
- Preparar digest email end-of-day como metodo invocable si encaja, pero no crear scheduler complejo en esta fase.
- No integrar proveedor WhatsApp real si exige credenciales o alta externa; dejar adaptador pasivo/noop.

Rate limiting y seguridad:
- Aplicar rate limit de POST publico: 10 req/min/IP.
- No loguear PII completa.
- No hardcodear telefono owner real, email real ni secretos.
- No exponer stack traces.
- Mantener CORS por env.

Tests obligatorios:
1. Happy path:
   - pedido con 2 productos no alcoholicos.
   - status `NEW`.
   - total calculado desde DB.
   - items persistidos.
   - response contiene mensaje de pago en tienda y WhatsApp <24h.

2. Alcohol guard:
   - producto vino `is_alcohol=true` -> 422 RFC 7807.
   - mezcla queso + vino -> 422 y no persiste nada.
   - test debe verificar que no se crea `pickup_order`.

3. Validaciones:
   - items vacios.
   - qty invalida.
   - producto inexistente/inactivo.
   - producto `OUT`.
   - fecha pasada.
   - slot mal formado.
   - slot fuera de horario.

4. Idempotencia:
   - misma key + mismo payload -> misma respuesta.
   - misma key + payload distinto -> 409.
   - retry no duplica filas.

5. Notificaciones:
   - se llama `notifyNewPickupOrder` tras commit.
   - si notification noop falla simulado, el pedido no debe romperse si ya se decidio tolerancia; documenta comportamiento.

6. Error handling:
   - 400/404/409/422 devuelven `application/problem+json`.
   - errores SQL no se filtran al cliente.

Si no hay MariaDB disponible:
- Ejecuta tests unitarios de validacion/idempotencia pura si existen.
- No marques Fase 4 como completa.
- Documenta comandos pendientes para DB, migracion, seed y tests.
- Actualiza estado vivo como `IN_PROGRESS` o `BLOCKED`.

Prohibido en esta fase:
- No aceptar ni procesar pagos online.
- No integrar Stripe/Redsys ni webhooks.
- No permitir alcohol en pickup bajo ninguna condicion.
- No confiar en el frontend para bloquear alcohol.
- No implementar frontend `Mi Tabla`; eso es Fase 9.
- No crear admin UI/backend completo; Fase 5 cubre admin backend.
- No crear stock realtime complejo ni reservas con hold de inventario.
- No crear cuentas de cliente.
- No introducir ORM o arquitectura nueva.

Actualizacion del estado vivo:
Al terminar, actualiza solo la seccion `0.1 Estado vivo del proyecto` de `docs/V1/V1Tecnico.md`:
- `last_updated`
- `current_phase`: 4
- `current_phase_name`: "Mi Tabla y alcohol guard"
- `current_focus`: resumen real de pickup endpoint, alcohol guard, idempotencia, notificaciones y tests
- `overall_status`: `REVIEW_READY` si endpoint/tests/lint pasan; `IN_PROGRESS` si queda DB/test pendiente; `BLOCKED` si falta MariaDB o decision critica
- tabla de Fase 4 con implementado/falta/notas reales
- tabla de Fase 5 como siguiente fase si Fase 4 queda lista
- funcionalidades implementadas: anade pickup backend, alcohol guard 422, idempotencia y notificacion noop si estan verificados
- quita de pendientes criticos solo lo realmente implementado y probado
- registro de sesion con fecha y verificacion
- siguiente prompt recomendado: "Fase 5 - Admin backend y seguridad JWT" si Fase 4 queda lista
- checklist final: marca `Backend 422 alcohol guard` y `Pickup flow sin pago online` solo si tests pasan

Si cambias estado, rutas o arquitectura que afecte al roadmap visual, actualiza tambien `docs/V1/v1TecnicoVisual.html`.

Criterios de aceptacion:
- `POST /api/v1/pickup-orders` existe bajo `/api/v1`.
- El endpoint nunca acepta alcohol.
- Test explicito de alcohol guard verde.
- Mixed cart con alcohol no persiste pedido.
- Total se calcula desde DB.
- Pedido e items se guardan en transaccion.
- Idempotencia evita duplicados y detecta conflictos.
- Mensaje de confirmacion indica pago en tienda y confirmacion por WhatsApp en menos de 24h.
- Notificacion owner usa noop/local si faltan credenciales.
- No hay pagos online ni Stripe/Redsys activo.
- RFC 7807 en 400/404/409/422.
- `npm test` pasa con DB disponible o se documenta claramente bloqueo.
- `npm run lint` pasa si existe.
- README/runbook documentan contrato pickup, idempotencia y limitaciones V1.
- `docs/AGENTS_Javi.md` no se modifica.

Verificacion obligatoria:
- Ejecuta `npm run db:migrate` si DB esta disponible.
- Ejecuta `npm run db:seed` si DB esta disponible.
- Ejecuta `npm test`.
- Ejecuta `npm run lint` si existe.
- Ejecuta smoke de API para:
  - happy path no alcohol
  - wine/alcohol -> 422
- Ejecuta `git status --short`.
- Lista archivos creados/modificados.
- Comprueba que no hay secretos reales ni pagos activos.
- Reporta cualquier verificacion no ejecutada y el motivo real.

Respuesta final:
- Resumen de Fase 4.
- Endpoint y reglas implementadas.
- Archivos creados/modificados.
- Verificacion ejecutada y resultado.
- Estado vivo actualizado o motivo si no se pudo.
- Riesgos o pendientes reales.
- Siguiente prompt recomendado.
```

## 14. Fase 5 - Admin backend y seguridad JWT

Objetivo: permitir al owner gestionar catalogo, eventos, campanas, pedidos e inquiries desde movil.

Entregables:
- Login JWT
- CRUD admin
- Dashboard
- Image upload adapter
- Audit
- Tests de seguridad

Prompt para Opus:

```text
Usa el Prompt base minimo y fijo.

Implementa la Fase 5: backend admin y seguridad JWT.

Objetivo de esta fase:
Implementar el backend admin de CRUDO V1 protegido con JWT para que una sola persona pueda gestionar catalogo, eventos, campanas, pedidos pickup, reservas e inquiries desde movil en menos de 5 minutos al dia. Esta fase es solo backend: no implementes UI admin todavia.

Restriccion operativa:
- El owner trabaja solo.
- El admin debe soportar este ritmo:
  - manana <= 90s: ver pedidos de hoy, eventos de hoy, nuevas consultas, confirmar pedidos y marcar productos agotados.
  - durante servicio: cero admin obligatorio.
  - cierre <= 90s: marcar pedidos como `PICKED_UP` y revisar consultas.
  - semanal <= 10 min: revisar KPIs, publicar campana y crear/editar evento.
- Cualquier flujo backend que obligue al frontend a mas de 3 taps para una accion diaria debe marcarse como riesgo y simplificarse con endpoint de accion rapida.

Contexto obligatorio:
- Fase 1: Express, RFC 7807, validacion centralizada, env y tests.
- Fase 2: schema MariaDB con `admin_user`, `audit_log`, `product`, `event`, `campaign`, `pickup_order`, `inquiry`, `event_reservation`.
- Fase 3: API publica funcionando.
- Fase 4: pickup backend y alcohol guard 422 funcionando.
- Stack: JavaScript, CommonJS, Express, MariaDB con paquete `mariadb`.
- Arquitectura: Route -> Auth/Validator middleware -> Controller -> Service -> Repository -> MariaDB.
- Public endpoints deben seguir abiertos. Solo `/api/v1/admin/**` requiere JWT.

Antes de editar:
1. Lee `docs/V1/V1Tecnico.md`, especialmente `0.1 Estado vivo del proyecto`, y confirma si Fase 4 esta realmente lista.
2. Inspecciona:
   - `server/app.js`
   - `server/routes/`
   - `server/controllers/`
   - `server/services/`
   - `server/repositories/`
   - `server/middleware/`
   - `server/validators/`
   - `server/utils/problem.js`
   - `db/migrations/`
   - `uploads/`
   - `tests/`
   - `.env.example`
   - `package.json`
   - `git status --short`
3. Si falta alguna pieza minima de fases previas, completa solo lo imprescindible y documenta el desfase.
4. No modifiques `docs/AGENTS_Javi.md`.
5. Si necesitas tocar schema, crea migracion nueva. No edites migraciones ya aplicadas salvo que el proyecto aun no haya ejecutado Fase 2 y lo justifiques.

Dependencias permitidas si no existen:
- `bcryptjs` para password hashing.
- `jsonwebtoken` para JWT.
- `multer` para uploads.
- `sharp` solo si se implementa procesamiento real de imagenes y no complica la fase.
- No introducir Passport, ORM, CMS ni framework admin.

Endpoints admin obligatorios:
- `POST /api/v1/admin/auth/login`
- `POST /api/v1/admin/auth/refresh`
- `POST /api/v1/admin/auth/logout` si usas refresh tokens persistidos o denylist
- `GET /api/v1/admin/dashboard`
- `GET /api/v1/admin/kpis`
- `GET /api/v1/admin/products`
- `POST /api/v1/admin/products`
- `GET /api/v1/admin/products/:id`
- `PUT /api/v1/admin/products/:id`
- `PATCH /api/v1/admin/products/:id/stock`
- `DELETE /api/v1/admin/products/:id` o soft delete mediante `is_active=false`
- `POST /api/v1/admin/products/:id/images`
- `DELETE /api/v1/admin/products/:id/images/:image_id`
- `GET /api/v1/admin/events`
- `POST /api/v1/admin/events`
- `GET /api/v1/admin/events/:id`
- `PUT /api/v1/admin/events/:id`
- `DELETE /api/v1/admin/events/:id` o soft delete
- `GET /api/v1/admin/campaigns`
- `POST /api/v1/admin/campaigns`
- `GET /api/v1/admin/campaigns/:id`
- `PUT /api/v1/admin/campaigns/:id`
- `DELETE /api/v1/admin/campaigns/:id` o soft delete
- `GET /api/v1/admin/inquiries`
- `PATCH /api/v1/admin/inquiries/:id`
- `GET /api/v1/admin/pickup-orders`
- `PATCH /api/v1/admin/pickup-orders/:id`
- `GET /api/v1/admin/event-reservations`
- `PATCH /api/v1/admin/event-reservations/:id`
- `GET /api/v1/admin/site/config`
- `PUT /api/v1/admin/site/config`

Archivos a crear o actualizar:
1. Rutas:
   - `server/routes/admin-auth.routes.js`
   - `server/routes/admin-dashboard.routes.js`
   - `server/routes/admin-products.routes.js`
   - `server/routes/admin-events.routes.js`
   - `server/routes/admin-campaigns.routes.js`
   - `server/routes/admin-inquiries.routes.js`
   - `server/routes/admin-pickup-orders.routes.js`
   - `server/routes/admin-event-reservations.routes.js`
   - `server/routes/admin-site-config.routes.js`

2. Controladores:
   - `server/controllers/admin-auth.controller.js`
   - `server/controllers/admin-dashboard.controller.js`
   - `server/controllers/admin-products.controller.js`
   - `server/controllers/admin-events.controller.js`
   - `server/controllers/admin-campaigns.controller.js`
   - `server/controllers/admin-inquiries.controller.js`
   - `server/controllers/admin-pickup-orders.controller.js`
   - `server/controllers/admin-event-reservations.controller.js`
   - `server/controllers/admin-site-config.controller.js`

3. Servicios:
   - `server/services/auth.service.js`
   - `server/services/jwt.service.js`
   - `server/services/admin-dashboard.service.js`
   - `server/services/admin-product.service.js`
   - `server/services/admin-event.service.js`
   - `server/services/admin-campaign.service.js`
   - `server/services/admin-inquiry.service.js`
   - `server/services/admin-pickup-order.service.js`
   - `server/services/admin-event-reservation.service.js`
   - `server/services/admin-site-config.service.js`
   - `server/services/audit.service.js`
   - `server/services/storage.service.js`

4. Repositories:
   - `server/repositories/admin-user.repository.js`
   - `server/repositories/audit-log.repository.js`
   - completar repositories de products/events/campaigns/inquiries/pickup/reservations/site-config.

5. Middleware/validadores:
   - `server/middleware/authenticate-admin.js`
   - `server/middleware/require-role.js` si hay roles `ADMIN`/`STAFF`
   - `server/validators/admin-auth.validator.js`
   - `server/validators/admin-products.validator.js`
   - `server/validators/admin-events.validator.js`
   - `server/validators/admin-campaigns.validator.js`
   - `server/validators/admin-status.validator.js`
   - `server/validators/admin-site-config.validator.js`

6. DB/migraciones:
   - Si falta soporte para refresh tokens, site config o audit fields, crea migracion nueva:
     - `db/migrations/004_admin_security_and_config.sql` o nombre secuencial real.
   - No crear tablas de cliente, roles complejos o permisos granulares V2.

7. Tests:
   - `tests/routes/admin-auth.routes.test.js`
   - `tests/routes/admin-products.routes.test.js`
   - `tests/routes/admin-dashboard.routes.test.js`
   - `tests/routes/admin-status.routes.test.js`
   - `tests/services/auth.service.test.js`
   - `tests/services/audit.service.test.js`
   - `tests/services/storage.service.test.js`

Autenticacion y seguridad:
1. Login:
   - Busca admin activo por email.
   - Verifica password con bcrypt.
   - Devuelve access token JWT corto (`JWT_EXPIRES_IN`, default 15m).
   - Devuelve refresh token si implementas refresh real.
   - Nunca devuelve `password_hash`.

2. JWT:
   - Claims minimos: `sub`, `email`, `role`, `iat`, `exp`.
   - Firma con `JWT_SECRET` desde env.
   - Rechaza tokens expirados, mal firmados o de usuario inactivo.
   - Respuestas 401/403 RFC 7807.

3. Refresh:
   - Si hay tabla de refresh tokens: persistir hash del refresh token, expiracion y revocacion.
   - Si decides refresh stateless por simplicidad V1, documenta riesgo y testea expiracion.

4. Passwords:
   - `admin_user.password_hash` siempre hash bcrypt.
   - Seed local puede tener credencial ficticia documentada solo para desarrollo.
   - No hardcodear password real.

5. Rate limiting:
   - Login con rate limit mas estricto, por ejemplo 5 intentos/min/IP.
   - Admin API con rate limit razonable.

6. CSRF:
   - Si usas `Authorization: Bearer <token>`, documenta que CSRF no aplica como cookies de sesion.
   - Si usas cookies httpOnly para refresh, documenta estrategia `SameSite` y proteccion.

Dashboard owner:
- `GET /admin/dashboard` debe devolver un payload compacto para mobile:
  - pickup orders de hoy por status.
  - proximos pickup `NEW`.
  - eventos de hoy/proximos.
  - reservas nuevas.
  - inquiries nuevas.
  - productos `LOW`/`OUT`.
  - acciones rapidas disponibles.
- No devolver tablas gigantes por defecto.
- Usar limites razonables: max 10-20 items por bloque.

KPIs:
- `GET /admin/kpis` debe devolver resumen simple:
  - pickup orders por periodo.
  - total pickup `PICKED_UP` en centimos si existe.
  - avg ticket.
  - event reservations.
  - newsletter subscribers.
  - inquiries nuevas.
- No implementar analytics GA4 backend todavia.

CRUD productos:
- Campos admin:
  - `name`, `slug`, `type`, `is_alcohol`, `price_cents`, `vat_rate`, `short_desc`, `long_desc`, `producer`, `region`, `is_seasonal`, `is_featured`, `is_active`, `stock_status`, categorias.
- Crear vino con `type='WINE'` debe forzar o validar `is_alcohol=true` salvo justificacion explicita.
- Crear queso/no alcohol debe permitir `is_alcohol=false`.
- `PATCH /stock` debe permitir accion rapida mobile:
  - `IN_STOCK`, `LOW`, `OUT`
- Soft delete preferido: `is_active=false`.
- Auditar creates/updates/deletes.

CRUD eventos:
- Campos:
  - title, slug, description_md, hero_image_url, starts_at, ends_at, capacity, price_cents, location, is_active.
- Validar fechas coherentes.
- Soft delete preferido.
- Auditar cambios.

CRUD campanas:
- Campos:
  - title, slug, subtitle, hero_image_url, body_md, starts_at, ends_at, is_active, productos asociados.
- Debe permitir activar/desactivar.
- Evitar mas de una campana activa simultanea si esa regla ya esta decidida; si no, documentar decision.
- Auditar cambios.

Status updates:
- Pickup orders:
  - permitidos: `NEW`, `CONFIRMED`, `READY`, `PICKED_UP`, `CANCELLED`.
  - PATCH parcial con status y optional note/admin note si existe.
  - endpoint debe soportar acciones rapidas mobile.
- Inquiries:
  - usar statuses existentes. Si hace falta ampliar enum a `NEW`, `IN_PROGRESS`, `DONE`, `SPAM`, crear migracion.
- Event reservations:
  - `NEW`, `CONFIRMED`, `CANCELLED`.
- Validar transiciones basicas y documentar si se permiten saltos por simplicidad V1.
- Auditar status changes.

Image upload:
- Usar `multer` con limites:
  - max size segun `MAX_UPLOAD_MB`.
  - tipos permitidos: jpeg, png, webp.
- Storage local compatible con Plesk:
  - raiz desde `UPLOADS_DIR`.
  - rutas publicas controladas, por ejemplo `/uploads/products/...`.
  - nombres saneados y unicos.
- Si usas `sharp`:
  - generar WebP y/o resize razonable.
  - no bloquear fase si sharp complica instalacion; documentar pendiente.
- Crear `product_image` con:
  - url
  - alt_text
  - sort_order
  - is_primary
- Alt text por defecto: `{producer} {name}, {region}` con fallback limpio.
- Tests deben usar storage fake/temp y no escribir uploads reales permanentes.

Audit:
- `audit_log` obligatorio para acciones admin importantes:
  - login success/fail si no guarda PII excesiva.
  - product create/update/delete/stock/image.
  - event/campaign create/update/delete.
  - pickup/inquiry/reservation status update.
  - site config update.
- Guardar:
  - actor_admin_user_id
  - action
  - entity_type
  - entity_id
  - payload_json resumido/saneado
  - created_at
- No guardar passwords, tokens ni PII innecesaria en audit.

Validacion y errores:
- Validadores centralizados antes de controladores.
- 400 para payload mal formado.
- 401 sin token/token invalido.
- 403 rol insuficiente.
- 404 recurso no encontrado.
- 409 conflicto slug/estado si aplica.
- 422 regla de negocio.
- Todo RFC 7807 `application/problem+json`.

Prohibido en esta fase:
- No implementar frontend admin.
- No cambiar public site salvo para no romper rutas.
- No activar pagos online.
- No permitir alcohol en `Mi Tabla`; conserva tests Fase 4.
- No crear roles/permisos complejos de empresa.
- No crear CMS/blog.
- No usar almacenamiento cloud obligatorio.
- No hardcodear secretos ni credenciales reales.

Tests obligatorios:
1. Auth/security:
   - login valido.
   - login invalido.
   - password hash se verifica.
   - admin endpoints rechazan sin token.
   - admin endpoints rechazan token invalido/expirado.
   - public endpoints siguen abiertos.

2. Products:
   - crear producto no alcohol.
   - crear vino con `is_alcohol=true`.
   - crear `type=WINE` con `is_alcohol=false` debe corregirse o rechazarse segun decision testeada.
   - update stock one-tap.
   - soft delete/inactive.
   - audit registrado.

3. Dashboard/status:
   - dashboard devuelve pedidos de hoy, eventos, inquiries y stock bajo.
   - PATCH pickup status.
   - PATCH inquiry status.
   - PATCH reservation status.
   - audit registrado.

4. Upload:
   - upload imagen valida.
   - rechaza tipo no permitido.
   - rechaza tamano excesivo si se puede simular.
   - crea product_image.

5. Regression:
   - alcohol guard de Fase 4 sigue pasando.
   - public products siguen exponiendo vinos como visibles.

Si no hay MariaDB disponible:
- Ejecuta tests unitarios puros de auth/jwt/validators/storage fake.
- No marques Fase 5 como completa.
- Documenta comandos pendientes para DB/migracion/seed/tests.
- Actualiza estado vivo como `IN_PROGRESS` o `BLOCKED`.

Actualizacion del estado vivo:
Al terminar, actualiza solo la seccion `0.1 Estado vivo del proyecto` de `docs/V1/V1Tecnico.md`:
- `last_updated`
- `current_phase`: 5
- `current_phase_name`: "Admin backend y seguridad JWT"
- `current_focus`: resumen real de auth, admin endpoints, dashboard, CRUD, uploads, audit y tests
- `overall_status`: `REVIEW_READY` si endpoints/tests/lint pasan; `IN_PROGRESS` si queda DB/test pendiente; `BLOCKED` si falta MariaDB o decision critica
- tabla de Fase 5 con implementado/falta/notas reales
- tabla de Fase 6 como siguiente fase si Fase 5 queda lista
- funcionalidades implementadas: anade solo admin backend, JWT, CRUD, audit y uploads si estan verificados
- quita de pendientes criticos solo lo realmente implementado y probado
- registro de sesion con fecha y verificacion
- siguiente prompt recomendado: "Fase 6 - scripts npm, build y despliegue Plesk/Contabo" si Fase 5 queda lista
- checklist final: marca `Admin JWT`, `Image upload local/Plesk adapter` y piezas admin solo si tests pasan

Si cambias estado, rutas o arquitectura que afecte al roadmap visual, actualiza tambien `docs/V1/v1TecnicoVisual.html`.

Criterios de aceptacion:
- Admin endpoints existen bajo `/api/v1/admin`.
- Admin endpoints estan protegidos por JWT.
- Public endpoints siguen abiertos.
- Passwords usan bcrypt.
- No se devuelven password hashes ni secretos.
- CRUD producto permite vino visible con `is_alcohol=true`.
- Crear `type=WINE` no puede acabar como reservable por accidente.
- Dashboard mobile-first devuelve bloques accionables y compactos.
- Status updates soportan rutina diaria del owner.
- Upload local/Plesk funciona o queda fake/test documentado si falta dependencia.
- Audit registra acciones importantes sin PII excesiva.
- Alcohol guard Fase 4 sigue verde.
- `npm test` pasa con DB disponible o se documenta claramente bloqueo.
- `npm run lint` pasa si existe.
- README/runbook documentan auth admin, credenciales dev ficticias, uploads y variables env.
- `docs/AGENTS_Javi.md` no se modifica.

Verificacion obligatoria:
- Ejecuta `npm run db:migrate` si DB esta disponible.
- Ejecuta `npm run db:seed` si DB esta disponible.
- Ejecuta `npm test`.
- Ejecuta `npm run lint` si existe.
- Ejecuta smoke API para:
  - login admin.
  - endpoint admin protegido sin token -> 401.
  - dashboard con token -> 200.
  - public health/products siguen abiertos.
- Ejecuta `git status --short`.
- Lista archivos creados/modificados.
- Comprueba que no hay secretos reales, tokens hardcodeados ni password en claro fuera de credencial dev ficticia documentada.
- Reporta cualquier verificacion no ejecutada y el motivo real.

Respuesta final:
- Resumen de Fase 5.
- Endpoints admin implementados.
- Archivos creados/modificados.
- Verificacion ejecutada y resultado.
- Estado vivo actualizado o motivo si no se pudo.
- Riesgos o pendientes reales.
- Siguiente prompt recomendado.
```

## 15. Fase 6 - scripts npm/MariaDB e infraestructura Plesk/Contabo

Objetivo: levantar localmente web, API y DB con un comando, y dejar documentado el despliegue productivo en servidor Contabo gestionado con Plesk.

Entregables:
- scripts npm revisados
- build Vite en `dist/`
- `server.js` sirviendo `dist/`
- `infra/plesk/README.md`
- Guia de variables/env en Plesk
- Guia de backups Plesk/Contabo
- CI inicial

Prompt para Opus:

```text
Usa el Prompt base minimo y fijo.

Implementa la Fase 6: scripts npm/MariaDB e infraestructura Plesk/Contabo.

Objetivo de esta fase:
Consolidar la operativa tecnica del monolito para desarrollo local, CI y despliegue en Contabo/Plesk: scripts npm coherentes, `server.js` preparado para servir API y `dist/`, variables de entorno documentadas, guia Plesk accionable, backups MariaDB/uploads y workflows iniciales. Esta fase no debe construir frontend real si Fase 7 aun no existe; debe dejar el camino preparado sin fingir builds inexistentes.

Contexto obligatorio:
- Fases 1-5 pueden existir completas o parcialmente. La Fase 6 puede avanzar tras el scaffold, pero debe detectar el estado real antes de exigir frontend.
- Stack confirmado: JavaScript, CommonJS, Express, MariaDB con paquete `mariadb`, React 19 + Vite en `src/` cuando exista, `server.js` sirviendo `dist/` en produccion.
- Produccion objetivo: servidor Contabo gestionado con Plesk.
- Plesk gestionara dominio, SSL, Node.js app, variables de entorno, MariaDB y backups.
- No introducir Docker obligatorio, PM2 obligatorio, CDN obligatorio ni object storage obligatorio en V1.
- No activar pagos online ni secretos reales.

Antes de editar:
1. Lee `docs/V1/V1Tecnico.md`, especialmente `0.1 Estado vivo del proyecto`.
2. Inspecciona:
   - `package.json`
   - `package-lock.json`
   - `server.js`
   - `server/app.js`
   - `src/`, `index.html`, `vite.config.js`, `tailwind.config.js` si existen
   - `.env.example`
   - `README.md`
   - `docs/runbook.md`
   - `infra/plesk/README.md`
   - `infra/scripts/`
   - `.github/workflows/`
   - `db/migrate.js`, `db/seed.js` si existen
   - `git status --short`
3. Si no existe frontend/Vite todavia, no crees UI real. Puedes preparar scripts/placeholders honestos y documentar que Fase 7 activara el build Vite real.
4. Si ya existe frontend/Vite, configura `npm run build` como `vite build` y verifica.
5. No modifiques `docs/AGENTS_Javi.md`.
6. No borres workflows/docs existentes sin leerlos.

Scripts npm objetivo:
1. Desarrollo:
   - `npm run dev`: Express + Vite con `concurrently` si Vite existe; si no existe, debe arrancar backend y mostrar mensaje claro de que Fase 7 activara cliente.
   - `npm run dev:server`: backend Express.
   - `npm run dev:client`: Vite si existe; placeholder honesto si no existe.

2. Produccion/build:
   - `npm run build`: `vite build` si Vite existe; si no, placeholder honesto que no cree `dist/` falso y documente Fase 7.
   - `npm start`: `node server.js`.

3. Calidad:
   - `npm test`
   - `npm run lint`
   - `npm run check` opcional para agrupar lint/test/build si encaja.

4. DB:
   - `npm run db:migrate`
   - `npm run db:seed`
   - `npm run db:reset` solo si ya existe y aborta fuera de `development`/`test`.

5. Infra:
   - `npm run deploy:plesk:notes`: muestra o referencia comandos/docs de Plesk sin ejecutar deploy real.

`server.js`:
- Debe montar API bajo `/api/v1`.
- Debe servir `dist/` solo si existe.
- En produccion:
  - si `dist/index.html` existe, servir assets estaticos y fallback a `index.html` para rutas React no API.
  - si `dist/` no existe, API debe seguir arrancando y loguear aviso claro.
- En development:
  - no debe depender de `dist/`.
  - no debe romper si Vite corre separado.
- Debe no interceptar `/api/v1/*`.
- Debe servir uploads locales de forma controlada si ya existe StorageService:
  - `/uploads/...` desde `UPLOADS_DIR`
  - sin listar directorios.
- Debe manejar cierre limpio del pool MariaDB.

Variables de entorno:
Actualiza `.env.example` si faltan variables de infra:
- `NODE_ENV`
- `PORT`
- `CLIENT_DEV_URL`
- `CORS_ALLOWED_ORIGINS`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_TEST_NAME`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `JWT_REFRESH_EXPIRES_IN`
- `COOKIE_SECRET`
- `UPLOADS_DIR`
- `MAX_UPLOAD_MB`
- `PUBLIC_BASE_URL`
- `STAGING_BASE_URL`
- `VITE_API_BASE`
- `VITE_PUBLIC_WHATSAPP`
- `VITE_GOOGLE_MAPS_URL`
- `VITE_GA_ID`
- `VITE_META_PIXEL`
- `BREVO_API_KEY`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `OWNER_WHATSAPP`
- `OWNER_EMAIL`
- Stripe placeholders solo V2 disabled si ya estaban.

Documentacion obligatoria:
1. `README.md`:
   - comandos reales disponibles.
   - requisitos locales: Node LTS, MariaDB, npm.
   - como arrancar backend.
   - como correr migraciones/seeds.
   - como correr tests/lint/build.
   - nota clara si build frontend queda pendiente de Fase 7.

2. `docs/runbook.md`:
   - local dev.
   - variables de entorno.
   - migraciones y seeds.
   - health checks.
   - smoke tests.
   - deploy manual high-level.
   - rollback manual.
   - backups y restore test.
   - staging noindex/basic-auth plan.

3. `infra/plesk/README.md`:
   - Contabo como servidor.
   - Plesk como panel para dominio, SSL, Node.js app, MariaDB y backups.
   - dominios previstos:
     - produccion: dominio canonico pendiente.
     - staging: `staging.<domain>` pendiente.
   - configuracion Plesk:
     - Application root.
     - Document root recomendado.
     - Startup file: `server.js`.
     - Node.js version LTS.
     - variables de entorno en panel Plesk.
     - comandos: `npm install`, `npm run build`, `npm start` o restart desde Plesk.
   - SSL Let's Encrypt.
   - MariaDB desde Plesk.
   - `uploads/` persistente y backup.
   - staging protegido/noindex.
   - checklist smoke post-deploy.

4. `infra/scripts/backup-notes.md`:
   - backup MariaDB desde Plesk.
   - backup uploads.
   - backup de `.env` gestionado fuera de git.
   - retencion recomendada 30 dias.
   - restore test manual.
   - snapshot/backup Contabo si aplica.
   - advertencia: no ejecutar seeds en produccion.

5. `.github/workflows/`:
   - `pr.yml` para lint/test/build o lint/test si build frontend aun no existe.
   - `staging.yml` skeleton manual si tiene sentido, sin secretos reales.
   - `production.yml` skeleton manual o README explicando deploy manual Plesk.
   - Workflows deben usar placeholders/secrets de GitHub, nunca valores reales.

CI:
- `pr.yml` debe:
  - checkout.
  - setup Node LTS.
  - `npm ci`.
  - `npm run lint` si existe.
  - `npm test`.
  - `npm run build` solo si el script es real y estable; si build es placeholder pre-Fase 7, documenta la limitacion y no generes falso verde confuso.
- Si tests requieren MariaDB, una de estas:
  - configurar service MariaDB en GitHub Actions.
  - o separar tests DB y documentar pendiente.
- No meter credenciales reales.

Plesk/deploy:
- No ejecutar deploy real.
- No pedir credenciales.
- No asumir dominio definitivo.
- Dejar comandos y checklist:
  - instalar deps.
  - ejecutar migraciones.
  - cargar seed solo staging/dev si corresponde.
  - build frontend si existe.
  - restart Node app.
  - verificar `/api/v1/health`.
  - verificar ruta publica.
  - verificar uploads.
  - verificar robots/noindex staging.

Backups:
- Documentar backup programado Plesk para:
  - DB MariaDB.
  - archivos de app relevantes.
  - `uploads/`.
- Documentar snapshot/backup Contabo como segunda capa si disponible.
- Retencion recomendada: 30 dias.
- Restore test:
  - restaurar DB en entorno test/staging.
  - restaurar uploads.
  - smoke `/api/v1/health`.

Prohibido en esta fase:
- No implementar pantallas React reales si Fase 7 no existe.
- No crear contenido visual real.
- No activar pagos online.
- No meter secretos, IPs privadas, claves SSH, passwords Plesk ni tokens GitHub.
- No hacer deploy real a Plesk/Contabo.
- No introducir Docker obligatorio, Kubernetes, PM2 obligatorio, Nginx manual obligatorio o CDN obligatorio.
- No cambiar stack confirmado.
- No romper endpoints publicos/admin existentes.

Tests/verificacion esperada:
- `npm run lint` si existe.
- `npm test`.
- `npm run build` si es real; si es placeholder, verificar que el mensaje es honesto.
- `npm start` o smoke equivalente sin dejar proceso vivo.
- `npm run db:migrate` y `npm run db:seed` si DB disponible.
- Verificar `server.js` con y sin `dist/` si es razonable.
- Verificar `git status --short`.

Si no hay MariaDB o frontend:
- MariaDB ausente:
  - documenta comandos pendientes.
  - no marques DB/integracion como DONE.
- Frontend ausente:
  - deja build/frontend como preparado para Fase 7.
  - no marques `build Vite en dist/` como completo.

Actualizacion del estado vivo:
Al terminar, actualiza solo la seccion `0.1 Estado vivo del proyecto` de `docs/V1/V1Tecnico.md`:
- `last_updated`
- `current_phase`: 6
- `current_phase_name`: "Scripts npm, build y despliegue Plesk/Contabo"
- `current_focus`: resumen real de scripts, server static, Plesk docs, backups y CI
- `overall_status`: `REVIEW_READY` si scripts/docs/verificaciones pasan; `IN_PROGRESS` si frontend/DB pendiente impide cerrar algo; `BLOCKED` si falta decision critica
- tabla de Fase 6 con implementado/falta/notas reales
- tabla de Fase 7 como siguiente fase si corresponde
- funcionalidades implementadas: anade solo scripts, infra docs, CI y servir `dist/` si verificado
- quita de pendientes criticos solo lo realmente implementado y probado
- registro de sesion con fecha y verificacion
- siguiente prompt recomendado: "Fase 7 - Frontend React/Vite y design system" si backend/infra queda listo
- checklist final: marca scripts npm/MariaDB, Plesk, Contabo, backups o CI solo si realmente quedan verificados/documentados

Si cambias estado, scripts o infraestructura que afecte al roadmap visual, actualiza tambien `docs/V1/v1TecnicoVisual.html`.

Criterios de aceptacion:
- Scripts npm existen y son honestos respecto al estado real del frontend.
- `npm run dev` permite arrancar backend y, si existe Vite, cliente tambien.
- `npm start` arranca `server.js`.
- `server.js` sirve API y esta preparado para `dist/` sin romper si `dist/` no existe.
- `.env.example` cubre variables necesarias sin secretos.
- README/runbook documentan comandos reales.
- Plesk/Contabo queda documentado de forma accionable.
- Backups y restore test quedan documentados.
- CI inicial existe o queda documentado con limitaciones claras.
- Staging queda planificado como noindex/basic-auth.
- No hay secretos.
- No se ejecuta deploy real.
- `docs/AGENTS_Javi.md` no se modifica.

Verificacion obligatoria:
- Ejecuta `npm run lint` si existe.
- Ejecuta `npm test`.
- Ejecuta `npm run build` si es real; si no, ejecuta el placeholder y confirma que no finge build.
- Ejecuta `npm start` o smoke equivalente sin dejar proceso vivo.
- Ejecuta `npm run db:migrate` y `npm run db:seed` si DB esta disponible.
- Ejecuta `git status --short`.
- Lista archivos creados/modificados.
- Comprueba que workflows/docs/env no contienen secretos reales.
- Reporta cualquier verificacion no ejecutada y el motivo real.

Respuesta final:
- Resumen de Fase 6.
- Scripts/infra/CI documentados o implementados.
- Archivos creados/modificados.
- Verificacion ejecutada y resultado.
- Estado vivo actualizado o motivo si no se pudo.
- Riesgos o pendientes reales.
- Siguiente prompt recomendado.
```

## 16. Fase 7 - Scaffold frontend y design system

Objetivo: crear la app React/Vite con rutas, tokens, layout y sistema visual CRUDO.

Entregables:
- React/Vite funcionando
- Rutas
- Tailwind configurado con tokens CRUDO
- Componentes base accesibles
- Componentes base
- Providers
- API client
- Analytics consent-aware

Prompt para Opus:

```text
Usa el Prompt base minimo y fijo.

Implementa la Fase 7: scaffold frontend React/Vite y design system editorial de CRUDO.

Objetivo de esta fase:
Crear el scaffold frontend real con React 19 + Vite + Tailwind, rutas V1, design tokens CRUDO, layout base, componentes UI accesibles, API client, analytics consent-aware y cookie banner AEPD base. Esta fase prepara la experiencia visual y tecnica, pero no debe construir todavia Home/Catalogo/PDP completos ni el flujo real de Mi Tabla; eso empieza en Fases 8 y 9.

Contexto obligatorio:
- Fase 6 debe haber dejado scripts npm y `server.js` preparado para `dist/`.
- Stack confirmado: React 19, Vite, JavaScript, Tailwind CSS, PostCSS, Autoprefixer, React Router, axios, lucide-react.
- Idioma visible: espanol.
- HTML semantico compatible con Google Translate.
- Visual: dark editorial gastronomy, no SaaS generico.
- No pago online, no venta online de alcohol.
- Vinos seran WhatsApp-only en fases posteriores; en esta fase deja helpers/labels preparados sin implementar PDP real.

Antes de editar:
1. Lee `docs/V1/V1Tecnico.md`, especialmente `0.1 Estado vivo del proyecto`.
2. Inspecciona:
   - `package.json`
   - `vite.config.js`
   - `tailwind.config.js`
   - `postcss.config.js`
   - `index.html`
   - `src/`
   - `server.js`
   - `.env.example`
   - `README.md`
   - `docs/runbook.md`
   - tests existentes
   - `git status --short`
3. Si ya existe frontend, respeta patrones y actualiza sin reescribir a ciegas.
4. No modifiques `docs/AGENTS_Javi.md`.
5. Usa JavaScript. No introducir TypeScript ni archivos `.ts/.tsx`.

Dependencias frontend permitidas:
- `@vitejs/plugin-react`
- `vite`
- `react`
- `react-dom`
- `react-router-dom`
- `tailwindcss`
- `postcss`
- `autoprefixer`
- `axios`
- `lucide-react`
- `clsx`
- `class-variance-authority`
- `tailwind-merge`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `@testing-library/user-event`
- `jsdom`
- `vitest`
- `axe-core` o `jest-axe` si encaja sin friccion.
- `canvas-confetti` solo si se deja preparado para confirmacion posterior; no usarlo todavia si no aporta.

Archivos a crear o actualizar:
1. Configuracion:
   - `index.html`
   - `vite.config.js`
   - `tailwind.config.js`
   - `postcss.config.js`
   - actualizar `package.json` scripts:
     - `dev`
     - `dev:client`
     - `build`
     - `preview`
     - `test`
     - `test:ui` opcional
     - `lint`

2. Entrypoints:
   - `src/main.jsx`
   - `src/App.jsx`
   - `src/routes.jsx`

3. Estilos:
   - `src/styles/global.css`
   - `src/styles/tokens.css` si prefieres separar tokens

4. Layout:
   - `src/components/layout/AppShell.jsx`
   - `src/components/layout/Header.jsx`
   - `src/components/layout/Footer.jsx`
   - `src/components/layout/StickyCTA.jsx`
   - `src/components/layout/CookieBanner.jsx`

5. UI base:
   - `src/components/ui/Button.jsx`
   - `src/components/ui/IconButton.jsx`
   - `src/components/ui/Input.jsx`
   - `src/components/ui/Textarea.jsx`
   - `src/components/ui/Select.jsx`
   - `src/components/ui/Modal.jsx`
   - `src/components/ui/Tag.jsx`
   - `src/components/ui/Badge.jsx`
   - `src/components/ui/FieldError.jsx`
   - `src/components/ui/Spinner.jsx`
   - `src/components/ui/Toast.jsx` solo si hay patron simple

6. Lib/hooks:
   - `src/lib/api.js`
   - `src/lib/analytics.js`
   - `src/lib/consent.js`
   - `src/lib/schemaOrg.js`
   - `src/lib/siteConfig.js`
   - `src/hooks/useConsent.js`
   - `src/hooks/useSiteConfig.js`

7. Pages placeholder:
   - `src/pages/HomePage.jsx`
   - `src/pages/CatalogPage.jsx`
   - `src/pages/ProductPage.jsx`
   - `src/pages/EventsPage.jsx`
   - `src/pages/EventDetailPage.jsx`
   - `src/pages/AboutPage.jsx`
   - `src/pages/ContactPage.jsx`
   - `src/pages/WholesalePage.jsx`
   - `src/pages/MyTablaPage.jsx`
   - `src/pages/MyTablaConfirmationPage.jsx`
   - `src/pages/LegalPage.jsx`
   - `src/pages/PrivacyPage.jsx`
   - `src/pages/CookiesPage.jsx`
   - `src/pages/AdminEntryPage.jsx`
   - `src/pages/NotFoundPage.jsx`

8. Tests:
   - `src/App.test.jsx`
   - `src/components/layout/CookieBanner.test.jsx`
   - `src/components/ui/Button.test.jsx`
   - `src/components/ui/Input.test.jsx`
   - `src/lib/analytics.test.js`
   - ajusta nombres si el repo ya tiene otro patron.

Rutas obligatorias:
- `/`
- `/catalogo`
- `/catalogo/quesos`
- `/catalogo/vinos`
- `/catalogo/temporada`
- `/producto/:slug`
- `/eventos`
- `/eventos/:slug`
- `/sobre-crudo`
- `/contacto`
- `/mayoristas`
- `/mi-tabla`
- `/mi-tabla/confirmacion`
- `/aviso-legal`
- `/privacidad`
- `/cookies`
- `/admin`
- `*` NotFound

Alcance de placeholders:
- Cada ruta debe renderizar una pantalla semantica minima, en espanol, con titulo real y una estructura visual coherente.
- No crear contenido final de Home/Catalogo/PDP; Fase 8 lo hara.
- No crear formularios finales complejos; Fases 9-10 los haran.
- No crear UI admin real; Fase 11 lo hara.
- Evitar texto visible tipo "Lorem ipsum", "TODO", "Coming soon" o ingles publico.

Design tokens obligatorios:
Crear una fuente unica en `src/styles/tokens.css` o `global.css` con estos tokens exactos:

```css
:root {
  --color-bg-primary: #1A1F14;
  --color-bg-secondary: #1E1C18;
  --color-bg-elevated: #252420;
  --color-bg-light: #F2EAD8;
  --color-bg-light-soft: #EAE0CB;
  --color-text-primary: #F2EAD8;
  --color-text-secondary: #C7BFAD;
  --color-text-muted: #8A8473;
  --color-text-inverse: #1A1F14;
  --color-accent: #B5713A;
  --color-accent-hover: #C8804A;
  --color-accent-soft: #3A2A1E;
  --color-gold: #B89668;
  --color-success: #6B8E5A;
  --color-warning: #C8893E;
  --color-error: #A8443A;
  --color-border: rgba(242,234,216,0.12);
  --color-border-strong: rgba(242,234,216,0.24);
  --font-display: "Cormorant Garamond", "Times New Roman", serif;
  --font-body: "Inter", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}
```

Tailwind:
- Mapear colores, fuentes, spacing, radius y sombras a tokens CRUDO.
- Radius maximo 8px salvo `pill` para casos concretos.
- No usar paleta Tailwind default como lenguaje visual principal.
- No usar blanco puro `#FFFFFF`, negro puro `#000000`, azul, neon ni gradientes purple/blue.
- Letter spacing normal por defecto; no usar tracking negativo.

Tipografia:
- H1/H2/H3: Cormorant Garamond.
- Body/UI: Inter.
- Precios/codigos: JetBrains Mono.
- Cargar fuentes en `index.html` o CSS con preconnect si se usa Google Fonts.
- Fallback correcto si fonts no cargan.

Layout:
- `Header`:
  - logo CRUDO.
  - nav minimo.
  - links a catalogo, eventos, contacto.
  - iconos lucide para menu/mobile, WhatsApp/Maps si aplica.
  - mobile-first.
- `Footer`:
  - direccion/horarios desde `siteConfig` con placeholders seguros.
  - legal links.
  - newsletter placeholder no funcional o preparado para Fase 10.
  - aviso +18 y consumo responsable.
- `StickyCTA`:
  - preparado para mobile sin tapar footer/legal.
  - no activar compra/pago.
- No cards dentro de cards.
- No orbs/blobs/decoraciones genericas.

Componentes UI:
- Botones:
  - variantes `primary`, `secondary`, `ghost`, `danger`.
  - estados disabled/loading/focus.
  - tap target minimo 44x44.
- Inputs/select/textarea:
  - label accesible.
  - error visible con texto, no solo color.
  - `aria-describedby` cuando haya error.
- Modal:
  - focus trap basico o comportamiento accesible razonable.
  - cierre con Escape.
  - `aria-modal`.
- IconButton:
  - requiere `aria-label`.
- Todos los componentes deben evitar layout shift por cambios de texto/loading.

API client:
- `src/lib/api.js`:
  - axios instance.
  - base URL desde `VITE_API_BASE`, default `/api/v1`.
  - timeout razonable.
  - normalizar errores RFC 7807 para frontend.
  - no hardcodear dominios.
- `useSiteConfig` debe consumir `/site/config` si API esta disponible y tener fallback local seguro si falla.

Cookie banner y consent:
- `CookieBanner` debe tener:
  - Aceptar.
  - Rechazar.
  - Configurar.
  - peso visual equivalente.
- No cargar ni disparar GA4/Pixel antes de consentimiento.
- Persistir consentimiento local con version/fecha.
- Preparar `POST /consent` contra API si existe; si falla, no romper UX.
- Categorias:
  - necesarias.
  - analiticas.
  - marketing.
- Tests deben verificar que analytics no dispara antes de aceptar.

Analytics:
- `src/lib/analytics.js`, no TypeScript.
- Exponer funciones:
  - `trackSelectItem`
  - `trackPickupRequest`
  - `trackWineWhatsAppClick`
  - `trackGenerateLead`
  - `trackWhatsAppClick`
  - `trackMapsClick`
- Todas son noop sin consentimiento adecuado.
- No inyectar scripts GA4/Pixel reales todavia si no hay consentimiento.
- No hardcodear IDs reales.

Schema/SEO base:
- `src/lib/schemaOrg.js` con helpers pasivos para:
  - Restaurant.
  - Product.
  - Event.
- No implementar prerender ni SEO completo; Fase 12.
- `index.html` debe tener `lang="es"` y meta basicos.

Accesibilidad:
- HTML semantico.
- Un solo `main`.
- Focus ring visible.
- Tap targets >= 44x44.
- Contraste suficiente con tokens.
- Estados de error con texto.
- Nav mobile usable con teclado.
- No esconder texto importante en imagenes.

Tests obligatorios:
- App renderiza y rutas placeholder principales existen.
- Header nav renderiza.
- Footer legal links renderizan.
- CookieBanner:
  - aceptar persiste consentimiento.
  - rechazar persiste rechazo.
  - configurar permite categorias.
  - analytics no dispara antes de consentimiento.
- Button:
  - variantes renderizan.
  - disabled/loading.
  - accesible por rol.
- Input:
  - label/error/aria.
- API client:
  - base URL por env/default.
  - problem detail se normaliza si hay helper.
- Axe smoke en App o layout si se incorpora axe.

Prohibido en esta fase:
- No construir Home/Catalogo/PDP finales.
- No implementar carrito/Mi Tabla real.
- No permitir vino en Mi Tabla.
- No implementar admin frontend real.
- No activar GA4/Pixel antes de consentimiento.
- No meter pago online.
- No introducir TypeScript.
- No usar UI kit pesado.
- No usar blanco puro, negro puro, azul, neon o estetica SaaS generica.
- No dejar textos publicos en ingles.

Actualizacion del estado vivo:
Al terminar, actualiza solo la seccion `0.1 Estado vivo del proyecto` de `docs/V1/V1Tecnico.md`:
- `last_updated`
- `current_phase`: 7
- `current_phase_name`: "Frontend React/Vite y design system"
- `current_focus`: resumen real de scaffold frontend, rutas, tokens, layout, cookie banner, analytics y tests
- `overall_status`: `REVIEW_READY` si build/tests/lint pasan; `IN_PROGRESS` si queda algun punto menor; `BLOCKED` si falta dependencia o decision critica
- tabla de Fase 7 con implementado/falta/notas reales
- tabla de Fase 8 como siguiente fase si Fase 7 queda lista
- funcionalidades implementadas: anade solo scaffold frontend, design system base, rutas placeholder y consent base si estan verificados
- quita de pendientes criticos solo lo realmente implementado y probado
- registro de sesion con fecha y verificacion
- siguiente prompt recomendado: "Fase 8 - Public frontend: Home, Catalogo y PDP" si Fase 7 queda lista
- checklist final: marca solo React/Vite, tokens, rutas base o cookie banner base si estan realmente verificados

Si cambias estado, rutas o visual system que afecte al roadmap visual, actualiza tambien `docs/V1/v1TecnicoVisual.html`.

Criterios de aceptacion:
- React/Vite funciona en `src/`.
- `npm run build` genera `dist/`.
- `server.js` puede servir `dist/` tras build si Fase 6 lo preparo.
- Todas las rutas placeholder V1 existen.
- Tokens CRUDO exactos existen como fuente unica.
- Tailwind usa tokens CRUDO.
- Layout base mobile-first.
- Header/Footer/CookieBanner renderizan.
- Cookie banner no dispara analytics antes de consentimiento.
- Componentes UI base son accesibles.
- No hay UI SaaS generica ni colores prohibidos.
- No hay texto publico en ingles.
- `npm test` pasa.
- `npm run lint` pasa si existe.
- README/runbook actualizados si cambian comandos frontend.
- `docs/AGENTS_Javi.md` no se modifica.

Verificacion obligatoria:
- Ejecuta `npm install` si faltan dependencias y esta permitido por entorno.
- Ejecuta `npm run build`.
- Ejecuta `npm test`.
- Ejecuta `npm run lint` si existe.
- Ejecuta smoke local:
  - `npm run dev` o `npm run dev:client` si se puede sin dejar procesos vivos.
- Revisa CSS/config para confirmar que no hay blanco puro, negro puro, azul/neon como base visual.
- Ejecuta `git status --short`.
- Lista archivos creados/modificados.
- Reporta cualquier verificacion no ejecutada y el motivo real.

Respuesta final:
- Resumen de Fase 7.
- Rutas/componentes base creados.
- Archivos creados/modificados.
- Verificacion ejecutada y resultado.
- Estado vivo actualizado o motivo si no se pudo.
- Riesgos o pendientes reales.
- Siguiente prompt recomendado.
```

## 17. Fase 8 - Public frontend: Home, Catalogo y PDP

Objetivo: construir las pantallas publicas que convierten trafico en browsing, WhatsApp y Mi Tabla.

Entregables:
- Home real
- Catalogo con filtros
- PDP queso/no alcohol
- PDP vino WhatsApp-only
- Product cards
- Schema.org Product
- GA4 events

Prompt para Opus:

```text
Usa el Prompt base minimo y fijo.

Implementa la Fase 8: frontend publico para Home, Catalogo y PDP.

Objetivo de esta fase:
Construir las primeras pantallas publicas reales de CRUDO V1: Home, catalogo filtrable y PDP de producto. Estas pantallas deben convertir trafico en exploracion, WhatsApp para vinos y preparacion de `Mi Tabla` para productos no alcoholicos, sin implementar todavia el checkout/formulario pickup completo de Fase 9.

Contexto obligatorio:
- Fase 7 debe haber dejado React/Vite, rutas, tokens CRUDO, layout, API client, analytics consent-aware y cookie banner.
- Fase 3 debe exponer API publica de productos/categorias/campanas/eventos/site config.
- Fase 4 debe existir en backend para alcohol guard, pero esta fase solo implementa UI de catalogo/PDP.
- Stack frontend: React 19, Vite, JavaScript, Tailwind, React Router, axios.
- Idioma visible: espanol.
- Visual: dark editorial gastronomy, mobile-first, nada SaaS generico.
- No pago online.
- Vino visible, pero WhatsApp-only. Nunca `Anadir a mi tabla` para `is_alcohol=true`.

Antes de editar:
1. Lee `docs/V1/V1Tecnico.md`, especialmente `0.1 Estado vivo del proyecto`.
2. Inspecciona:
   - `src/routes.jsx`
   - `src/pages/`
   - `src/components/layout/`
   - `src/components/ui/`
   - `src/lib/api.js`
   - `src/lib/analytics.js`
   - `src/lib/schemaOrg.js`
   - `src/styles/`
   - `package.json`
   - tests existentes
   - `git status --short`
3. Si falta parte de Fase 7, completa solo lo imprescindible para estas pantallas sin redisenar todo.
4. No modifiques `docs/AGENTS_Javi.md`.
5. Usa JavaScript. No introducir TypeScript ni archivos `.ts/.tsx`.

Pantallas obligatorias:
- Home: `/`
- Catalogo general: `/catalogo`
- Quesos: `/catalogo/quesos`
- Vinos: `/catalogo/vinos`
- Temporada: `/catalogo/temporada`
- Producto: `/producto/:slug`

Componentes a crear o completar:
1. Home:
   - `src/components/home/Hero.jsx`
   - `src/components/home/SeasonalShowcase.jsx`
   - `src/components/home/CategoryStrips.jsx`
   - `src/components/home/EventsTeaser.jsx`
   - `src/components/home/InstagramStrip.jsx`
   - `src/components/home/VisitBlock.jsx`

2. Catalogo:
   - `src/components/catalog/CatalogToolbar.jsx`
   - `src/components/catalog/ProductCard.jsx`
   - `src/components/catalog/ProductGrid.jsx`
   - `src/components/catalog/EmptyState.jsx`
   - `src/components/catalog/StockBadge.jsx`

3. Producto:
   - `src/components/product/ProductGallery.jsx`
   - `src/components/product/ProductMeta.jsx`
   - `src/components/product/ProductLongRead.jsx`
   - `src/components/product/AddToTablaButton.jsx`
   - `src/components/product/WineWhatsAppButton.jsx`
   - `src/components/product/RelatedProducts.jsx`

4. Data/hooks:
   - `src/hooks/useProducts.js`
   - `src/hooks/useProduct.js`
   - `src/hooks/useCategories.js`
   - `src/hooks/useCampaign.js`
   - `src/hooks/useEvents.js` si Home muestra teaser.
   - `src/lib/mockData.js` solo si API no esta disponible; debe estar aislado y documentado como temporal.
   - `src/lib/whatsapp.js`
   - `src/lib/tablaDraft.js` o helper minimo para add no alcohol, dejando el store completo para Fase 9.

Datos/API:
- Usar `src/lib/api.js` y axios contra API real:
  - `GET /products`
  - `GET /products/:slug`
  - `GET /categories`
  - `GET /campaigns/active`
  - `GET /events`
  - `GET /site/config`
- Si API no esta disponible en dev:
  - usar mocks temporales en `src/lib/mockData.js`.
  - no mezclar mocks con componentes.
  - dejar comentario claro y deuda en docs/runbook o estado vivo.
- Los productos deben manejar:
  - `is_alcohol`
  - `stock_status`
  - `is_seasonal`
  - `is_featured`
  - imagenes y alt text
  - categorias

Home:
- Hero full-bleed, no dentro de card:
  - 90vh mobile, 80vh desktop.
  - imagen real si existe; si no, placeholder local claramente sustituible.
  - overlay `rgba(26,31,20,0.55)`.
  - eyebrow: `VINOS Y QUESOS · MADRID`.
  - H1 Cormorant italic, max 6 palabras.
  - CTAs:
    - `Reservar mi tabla` -> `/catalogo` o `/mi-tabla` segun estado del store.
    - `Como llegar` -> Maps URL de site config.
  - metadata de horarios/abierto-cerrado si site config lo permite.
- SeasonalShowcase:
  - productos `is_seasonal=true`.
  - cards con aspect-ratio estable.
- CategoryStrips:
  - Quesos, Vinos, Temporada.
- EventsTeaser:
  - max 2-3 eventos futuros.
  - link a `/eventos`.
- InstagramStrip:
  - placeholder editorial, no integrar API Instagram real.
- VisitBlock:
  - direccion, horarios, Maps, WhatsApp.

Catalogo:
- `/catalogo` lista todos los productos activos.
- `/catalogo/quesos` aplica `type=CHEESE`.
- `/catalogo/vinos` aplica `type=WINE`.
- `/catalogo/temporada` aplica `seasonal=true`.
- Toolbar:
  - filtro categoria.
  - filtro temporada/destacados si encaja.
  - busqueda `q`.
  - limpiar filtros.
- EmptyState en espanol.
- Loading y error states cuidados.
- No layout shift: grid con dimensiones estables.

ProductCard:
- Imagen cuadrada con `aspect-ratio: 1 / 1`.
- Tag `Temporada`, `Destacado`, `Agotado` segun datos.
- Producer + region como eyebrow.
- Nombre con Cormorant.
- Descripcion corta/tasting note.
- Precio en JetBrains Mono.
- CTA:
  - vino/alcohol: `WhatsApp`.
  - no alcohol: `Anadir`.
- Hover sutil en desktop.
- Tap target >= 44px.
- No mostrar boton disabled que parezca comprable si producto es vino.

PDP:
- Desktop: 2 columnas.
- Mobile: stacked.
- Gallery con aspect-ratio reservado.
- Meta/CTA visible sin tapar contenido.
- Historia/productor/region/descripcion larga.
- Categorias y related products si hay datos.
- Estado stock claro:
  - `OUT` no permite add/WhatsApp principal debe indicar disponibilidad segun tipo.
- Schema Product via `schemaOrg`.
- Meta title/description basicos.

Regla vino/alcohol:
- Si `product.is_alcohol === true`:
  - Nunca renderizar `AddToTablaButton`.
  - Renderizar `WineWhatsAppButton`.
  - Link `wa.me` con texto prellenado:
    - `Hola, me interesa {nombre}. ¿Lo tenéis disponible en CRUDO?`
  - Texto visible:
    - `Los vinos se reservan y se pagan en CRUDO.`
  - Track `wine_whatsapp_click` solo si consentimiento lo permite.
- Tests deben cubrir que el boton de Mi Tabla no aparece para vino.

Regla no alcohol:
- Si `product.is_alcohol === false`:
  - Renderizar `AddToTablaButton`.
  - El boton puede usar un helper/store minimo para guardar draft local de `Mi Tabla`.
  - No implementar formulario pickup completo; Fase 9.
  - Track `select_item` y, si creas evento adicional, documenta nombre.
- El helper debe rechazar productos con `is_alcohol=true` aunque el componente no lo muestre.

Mi Tabla en esta fase:
- Permitido:
  - helper minimo `tablaDraft` o `useTablaDraft`.
  - add/remove basico para no alcohol.
  - contador en header/sticky CTA si ya existe.
- Prohibido:
  - formulario pickup real.
  - submit a `/pickup-orders`.
  - confirmacion final.
  - logica compleja de slots/fechas.

SEO base:
- Cada pantalla debe actualizar title/meta de forma basica con helper existente o componente simple.
- Home prepara schema.org Restaurant si ya existe helper.
- PDP genera schema.org Product.
- No implementar prerender completo; Fase 12.
- No meter copy en imagenes.

Analytics:
- Usar `src/lib/analytics.js`.
- Eventos:
  - `select_item` al abrir/ver producto o seleccionar card si ya existe patron.
  - `wine_whatsapp_click`.
  - `whatsapp_click`.
  - `maps_click`.
- Todas las llamadas deben ser noop sin consentimiento.
- No cargar GA4/Pixel directamente.

Visual:
- Mantener tokens CRUDO.
- No blanco puro, negro puro, azul, neon.
- No paleta beige/crema dominante sin contraste dark CRUDO.
- No UI SaaS generica.
- Cards con radius <= 8px.
- No cards dentro de cards.
- No carrusel auto-rotatorio.
- No parallax/scroll-jacking.
- Imagenes con `loading="lazy"` salvo hero principal.
- Hero debe insinuar siguiente seccion en mobile/desktop.

Accesibilidad:
- H1 unico por pagina.
- Imagenes con alt text.
- Links/botones con nombre accesible.
- Focus visible.
- Tap targets >= 44x44.
- Filtros usables con teclado.
- Estados loading/error anunciables razonablemente.
- No usar solo color para stock/error.

Tests obligatorios:
1. Home:
   - renderiza hero, CTAs y secciones principales.
   - no muestra texto ingles publico.

2. Catalogo:
   - ProductCard renderiza seasonal/stock/price.
   - filtros queso/vino/temporada llaman API o filtran correctamente segun implementacion.
   - EmptyState aparece sin productos.

3. PDP:
   - `is_alcohol=true` muestra solo WhatsApp CTA.
   - `is_alcohol=true` no muestra `Anadir a mi tabla`.
   - `is_alcohol=false` muestra `Anadir a mi tabla`.
   - wine WhatsApp link incluye nombre del producto.
   - product schema existe.

4. Mi Tabla draft:
   - add no alcohol funciona.
   - reject alcohol en helper.

5. Visual/layout smoke:
   - imagenes reservan aspect ratio.
   - no hay CLS evidente por ausencia de dimensiones.

Si API no esta disponible:
- Tests deben mockear API en capa `api.js`/hooks, no en componentes profundos.
- Documentar que mocks son temporales.
- No marcar integracion API real como DONE si no se verifico.

Prohibido en esta fase:
- No implementar pickup form ni POST `/pickup-orders`.
- No permitir vino en Mi Tabla.
- No implementar eventos/contacto/newsletter completos; Fase 10.
- No implementar admin frontend; Fase 11.
- No activar pagos online.
- No activar GA4/Pixel antes de consentimiento.
- No usar TypeScript.
- No introducir librerias de UI pesadas.
- No crear contenido real definitivo si faltan assets owner; usar placeholders marcados.

Actualizacion del estado vivo:
Al terminar, actualiza solo la seccion `0.1 Estado vivo del proyecto` de `docs/V1/V1Tecnico.md`:
- `last_updated`
- `current_phase`: 8
- `current_phase_name`: "Public frontend: Home, Catalogo y PDP"
- `current_focus`: resumen real de Home, Catalogo, PDP, vino WhatsApp-only, Mi Tabla draft, SEO base y tests
- `overall_status`: `REVIEW_READY` si build/tests/lint pasan; `IN_PROGRESS` si queda integracion API/assets pendiente; `BLOCKED` si falta dependencia o decision critica
- tabla de Fase 8 con implementado/falta/notas reales
- tabla de Fase 9 como siguiente fase si Fase 8 queda lista
- funcionalidades implementadas: anade solo Home/Catalogo/PDP y reglas de CTA si estan verificadas
- quita de pendientes criticos solo lo realmente implementado y probado
- registro de sesion con fecha y verificacion
- siguiente prompt recomendado: "Fase 9 - Mi Tabla frontend y pickup flow" si Fase 8 queda lista
- checklist final: marca Home, Catalogo, PDP, Vinos WhatsApp-only y no alcohol con Mi Tabla draft solo si tests pasan

Si cambias estado, rutas o visual system que afecte al roadmap visual, actualiza tambien `docs/V1/v1TecnicoVisual.html`.

Criterios de aceptacion:
- Home real existe y no parece plantilla generica.
- Catalogo filtra por general/quesos/vinos/temporada.
- PDP producto existe.
- Vino nunca muestra `Anadir a mi tabla`.
- Vino muestra WhatsApp CTA con texto prellenado.
- No alcohol muestra `Anadir a mi tabla`.
- Helper/store draft rechaza alcohol.
- Mobile-first y accesible.
- Imagenes tienen aspect-ratio estable.
- SEO base y Product schema existen.
- Analytics respeta consentimiento.
- `npm run build` pasa.
- `npm test` pasa.
- `npm run lint` pasa si existe.
- No hay texto publico en ingles.
- `docs/AGENTS_Javi.md` no se modifica.

Verificacion obligatoria:
- Ejecuta `npm run build`.
- Ejecuta `npm test`.
- Ejecuta `npm run lint` si existe.
- Ejecuta smoke local con `npm run dev` o equivalente si se puede sin dejar procesos vivos.
- Si Playwright ya esta configurado, captura mobile/desktop de Home, Catalogo y PDP vino/no alcohol.
- Revisa CSS/config para confirmar que no hay blanco puro, negro puro, azul/neon como base visual.
- Ejecuta `git status --short`.
- Lista archivos creados/modificados.
- Reporta cualquier verificacion no ejecutada y el motivo real.

Respuesta final:
- Resumen de Fase 8.
- Pantallas y reglas vino/no alcohol implementadas.
- Archivos creados/modificados.
- Verificacion ejecutada y resultado.
- Estado vivo actualizado o motivo si no se pudo.
- Riesgos o pendientes reales.
- Siguiente prompt recomendado.
```

## 17.1 Fase 8.5 - Refinamiento visual con assets reales (back-addition)

Esta sub-fase aparece **despues** de Fase 8 porque Fase 8 quedo `REVIEW_READY` con placeholders y composiciones genericas. Ahora que existe el inventario visual (`§7.bis`), Fase 8.5 reemplaza placeholders por assets reales en Home, Catalogo y PDP, y crea los componentes de marca firma (`<RetroSign>`, `<SaffronTileBackground>`, `<LifestylePhoto>`, `<BrandSticker>`). No introduce nuevas rutas ni cambia logica de negocio.

Objetivo: que el front ya construido **se sienta CRUDO**, no plantilla.

Entregables:
- Hero home con `images/Gemini_*.png` y overlay sobre espacio negativo izquierdo
- Componentes de marca: `RetroSign`, `SaffronTileBackground`, `LifestylePhoto`, `BrandSticker`, `AnimalQuesero`
- Strip "Maridajes" en Home con IMG_9525
- ProductCard con fallback de imagen si producto no tiene asset (placeholder editorial, no generico)
- VisitBlock con IMG_0205-0207 de fondo o accent
- SeasonalShowcase con frame de azulejo saffron sutil
- Footer easter egg con BrandSticker o AnimalQuesero
- Pipeline minimo de assets: copia `images/` y subset de `docs/V1/Photos/` a `public/img/` con naming semantico (sin script de optimizacion todavia, eso es Fase 14)

Prompt para Opus:

```text
Usa el Prompt base minimo y fijo.

Implementa la Fase 8.5: refinamiento visual del frontend publico (Home, Catalogo, PDP) usando los assets reales catalogados en `§7.bis Inventario visual de assets reales` de `docs/V1/V1Tecnico.md`.

Objetivo de esta fase:
Fase 8 quedo funcional pero con placeholders genericos. Esta fase reemplaza placeholders por fotos reales del local CRUDO, crea los componentes de marca firma (cartel retroiluminado, azulejo saffron, sticker retro) y deja Home/Catalogo/PDP con identidad visual coherente. No cambia rutas, contratos API ni reglas de negocio. Mantiene vino WhatsApp-only y no alcohol en Mi Tabla.

Contexto obligatorio:
- Fase 8 esta en REVIEW_READY. No reescribir Home/Catalogo/PDP desde cero; refinar.
- Lee `§7.bis Inventario visual de assets reales` en `docs/V1/V1Tecnico.md` antes de tocar nada. Es fuente autoritativa del mapeo asset -> componente.
- Assets disponibles:
  - `images/Gemini_Generated_Image_149guw149guw149g.png` (Hero home)
  - `docs/V1/Photos/IMG_*.JPG/.jpeg` (17 fotos del local)
  - `docs/V1/Crudo/*.png` (logos, ilustraciones, sticker retro)
- Stack: React 19, Vite, JavaScript, Tailwind. Sin TypeScript.

Antes de editar:
1. Lee `docs/V1/V1Tecnico.md` completo (especialmente `§0.1` y `§7.bis`).
2. Inspecciona:
   - `src/components/home/Hero.jsx`
   - `src/components/home/SeasonalShowcase.jsx`
   - `src/components/home/CategoryStrips.jsx`
   - `src/components/home/VisitBlock.jsx`
   - `src/components/catalog/ProductCard.jsx`
   - `src/components/product/ProductGallery.jsx`
   - `src/components/layout/Footer.jsx`
   - `public/` (existe? estructura?)
   - `tailwind.config.js` para tokens existentes
   - tests existentes
3. No modifiques `docs/AGENTS_Javi.md`.
4. No introducir TypeScript.

Pipeline minimo de assets:
- Crear `public/img/` con subcarpetas: `hero/`, `lifestyle/`, `brand/`, `about/`.
- Copiar (no mover, los originales se conservan):
  - `images/Gemini_*.png` -> `public/img/hero/hero-home-cheeseboard.png`
  - `docs/V1/Photos/IMG_1582 2.jpeg` -> `public/img/lifestyle/tabla-quesos-vino.jpg`
  - `docs/V1/Photos/IMG_0205 2.JPG` -> `public/img/lifestyle/bodegon-cartel-crudo.jpg`
  - `docs/V1/Photos/IMG_9525 2.JPG` -> `public/img/lifestyle/cata-vinos-naturales.jpg`
  - `docs/V1/Photos/IMG_8954 2.JPG` -> `public/img/about/owner-mostrador.jpg`
  - `docs/V1/Crudo/Logo Crudo - PNG - Blanco.png` -> `public/img/brand/logo-blanco.png`
  - `docs/V1/Crudo/Crudo_Texto.png` -> `public/img/brand/logo-texto.png`
  - `docs/V1/Crudo/1.01 - Animales Queseros.png` -> `public/img/brand/animal-quesero-1.png`
- No ejecutar optimizacion WebP/AVIF en esta fase; Fase 14 hara pipeline `sharp`.
- Aplicar rotacion EXIF manualmente si las copias salen rotadas (los originales tienen `Orientation=6`).
- Si una imagen no se puede usar por orientacion/calidad, documentar en respuesta final.

Componentes de marca nuevos (en `src/components/brand/`):

1. `RetroSign.jsx`:
   - Caja con borde redondeado pequeño (8px), background `#FF8A47` (terracota calida tipo cartel del local), sombra interior orange-glow, texto en blanco hueso (#F5EFE6).
   - Props: `text` (string), `as` (string, default "span"), `size` ("sm"|"md"|"lg", default "md").
   - Padding tactil. No clickable por defecto.
   - Uso: eyebrows decorativos en secciones lifestyle, 404, success states de formularios.

2. `SaffronTileBackground.jsx`:
   - Wrapper que aplica background pattern de azulejo amarillo (#E8B547 base + lineas grout #C99A36 sutil).
   - Implementacion: SVG inline o `background-image` con SVG data-uri.
   - Props: `as` (string), `className`, `children`, `intensity` ("subtle"|"normal", default "subtle").
   - Uso: fondo de bloque "Maridajes", footer easter egg.

3. `LifestylePhoto.jsx`:
   - Wrapper de `<img>` con aspect-ratio reservado (`aspect-[4/3]` default, configurable).
   - `loading="lazy"`, `decoding="async"`.
   - Props: `src`, `alt` (obligatorio, no opcional), `aspectRatio` (string Tailwind), `className`, `priority` (boolean — si true, `loading="eager"` y `fetchpriority="high"`).
   - Skeleton/placeholder oscuro mientras carga.

4. `BrandSticker.jsx`:
   - Render del sticker logo retro como elemento decorativo (rotacion ligera, sombra suave).
   - Props: `rotation` (number, grados, default -8), `size` (number, px, default 80).
   - Uso: footer easter egg, decoracion en empty states.

5. `AnimalQuesero.jsx`:
   - Render de ilustracion mascota.
   - Props: `variant` ("1"|"2", default "1"), `size`, `className`.
   - `aria-hidden="true"` por defecto (decorativo).

Refinamientos por componente existente:

1. `Hero.jsx`:
   - Cambiar background a `public/img/hero/hero-home-cheeseboard.png` con `loading="eager"` y `fetchpriority="high"`.
   - Overlay actual `rgba(26,31,20,0.55)` solo sobre **la mitad izquierda** (gradient `linear-gradient(90deg, rgba(26,31,20,0.75) 0%, rgba(26,31,20,0.45) 50%, rgba(26,31,20,0) 100%)`) — respetar la composicion intencional del asset.
   - Eyebrow usa `<RetroSign text="VINOS Y QUESOS · MADRID" size="sm" />` en lugar de span plano.
   - CTAs y H1 anchored a la izquierda en columna estrecha (max-w-md desktop).
   - Mantener 90vh mobile / 80vh desktop.

2. `SeasonalShowcase.jsx`:
   - Frame del bloque con `<SaffronTileBackground intensity="subtle">` o un borde superior azulejo.
   - Eyebrow `<RetroSign text="DE TEMPORADA" size="sm" />`.
   - Cards mantienen `aspect-ratio: 1/1`.

3. `CategoryStrips.jsx`:
   - Cada strip (Quesos / Vinos / Temporada) usa una foto representativa de fondo con overlay oscuro:
     - Quesos -> `public/img/lifestyle/tabla-quesos-vino.jpg`
     - Vinos -> `public/img/lifestyle/cata-vinos-naturales.jpg`
     - Temporada -> reusar Hero o lifestyle bodegon.
   - Texto centrado sobre overlay, CTA `Ver`.

4. Nuevo bloque `MaridajesStrip.jsx` (entre SeasonalShowcase y CategoryStrips):
   - Background `<SaffronTileBackground intensity="subtle">`.
   - Eyebrow `<RetroSign text="MARIDAJES" size="sm" />`.
   - H2 corto editorial.
   - 1-2 `<LifestylePhoto>` con copy adjunto.
   - Sin CTA explicito (es bloque editorial).

5. `VisitBlock.jsx`:
   - Background o accent con `public/img/lifestyle/bodegon-cartel-crudo.jpg` overlay 60%.
   - Direccion, horarios, CTAs WhatsApp/Maps/Instagram destacados.

6. `ProductCard.jsx`:
   - Si producto no tiene `images[0].url`, fallback a placeholder editorial **especifico por tipo**:
     - `type=CHEESE` -> recorte 1:1 de `tabla-quesos-vino.jpg`.
     - `type=WINE` -> recorte 1:1 de `cata-vinos-naturales.jpg`.
     - otro -> placeholder oscuro CRUDO con texto "Sin imagen".
   - No usar fallback gris generico.

7. `ProductGallery.jsx` (PDP):
   - Misma logica de fallback por tipo.
   - Si producto tiene 1 sola imagen, no mostrar thumbnails.

8. `Footer.jsx`:
   - Esquina inferior derecha (desktop) / abajo centrado (mobile): `<BrandSticker rotation={-12} size={72} />` como easter egg.
   - Tooltip o alt: "Hecho con queso en Madrid" (humor sutil).

9. `InstagramStrip.jsx`:
   - Hasta que API Instagram este integrada, usar 4-6 fotos curadas del inventario (IMG_1582, IMG_0205, IMG_9525, IMG_8957) como placeholder editorial **honesto** con badge "@crudomov" y enlace externo.

Tailwind extension:
- Añadir en `tailwind.config.js` color tokens:
  - `crudo-saffron: #E8B547`
  - `crudo-saffron-grout: #C99A36`
  - `crudo-terracota: #FF8A47`
  - `crudo-bone: #F5EFE6`
- No tocar tokens ya existentes (`crudo-dark`, etc.). Solo añadir.

Analytics/SEO:
- No cambiar contratos de eventos existentes.
- Actualizar `<meta property="og:image">` en Home a `/img/hero/hero-home-cheeseboard.png` absoluto.

Accesibilidad:
- Todas las `<LifestylePhoto>` tienen `alt` descriptivo en espanol.
- `<RetroSign>` con texto: el texto cuenta como contenido accesible.
- `<AnimalQuesero>` y `<BrandSticker>` decorativos: `aria-hidden="true"`.
- Overlay del Hero no debe reducir contraste de H1 por debajo de WCAG AA.

Tests obligatorios:
1. `RetroSign` renderiza el texto y aplica clases base.
2. `LifestylePhoto` falla en build/runtime si falta `alt` (PropTypes warning o invariant).
3. `Hero` sigue mostrando un solo H1 y CTAs accesibles.
4. `ProductCard` usa fallback por tipo cuando no hay imagen (testear con producto sin `images`).
5. Regresion: Vino sigue WhatsApp-only, no alcohol sigue con Mi Tabla.

Prohibido en esta fase:
- No cambiar rutas ni endpoints.
- No cambiar reglas alcohol.
- No introducir TypeScript ni librerias UI pesadas.
- No optimizar imagenes con sharp/avif (eso es Fase 14).
- No publicar contenido owner privado de las fotos (caras, sin consentimiento; las fotos de owner son OK porque las provee el owner).
- No abusar de los componentes de marca: 1 `RetroSign` por seccion como maximo; sticker solo en footer.
- No carrusel auto-rotatorio en MaridajesStrip.

Actualizacion del estado vivo:
Al terminar, actualiza `0.1 Estado vivo del proyecto`:
- `last_updated`
- `current_phase`: 8.5
- `current_phase_name`: "Refinamiento visual con assets reales"
- `current_focus`: resumen de Hero refinado, componentes de marca, strip Maridajes, fallbacks por tipo
- `overall_status`: `REVIEW_READY` si build/tests/lint pasan
- registro de sesion con fecha y verificacion
- siguiente prompt recomendado: "Fase 9 - Mi Tabla frontend y pickup flow"

Criterios de aceptacion:
- Hero usa imagen real con overlay que respeta el espacio negativo izquierdo.
- Existen los 5 componentes de marca (`RetroSign`, `SaffronTileBackground`, `LifestylePhoto`, `BrandSticker`, `AnimalQuesero`).
- Home tiene strip Maridajes nuevo.
- ProductCard tiene fallback editorial por tipo, no gris generico.
- Footer tiene sticker easter egg.
- `public/img/` poblado con assets renombrados semanticamente.
- Reglas vino/no alcohol siguen intactas.
- `npm run build`, `npm test`, `npm run lint` pasan.
- No hay texto ingles publico nuevo.

Verificacion obligatoria:
- `npm run build`
- `npm test`
- `npm run lint`
- Smoke local Home + 1 PDP queso + 1 PDP vino.
- `git status --short` y listado de archivos.

Respuesta final:
- Resumen Fase 8.5.
- Componentes de marca creados.
- Assets copiados a `public/img/` (lista).
- Refinamientos por componente.
- Verificacion ejecutada.
- Estado vivo actualizado.
- Siguiente prompt recomendado.
```

## 18. Fase 9 - Mi Tabla frontend y pickup flow

Objetivo: implementar drawer, formulario y confirmacion de reserva sin pago online.

Entregables:
- `TablaDrawer`
- `TablaSummary`
- `PickupForm`
- `/mi-tabla`
- `/mi-tabla/confirmacion`
- Integracion POST `/pickup-orders`
- Tracking `pickup_request`
- Tests

Prompt para Opus:

```text
Usa el Prompt base minimo y fijo.

Implementa la Fase 9: Mi Tabla frontend y pickup inquiry flow.

Objetivo de esta fase:
Implementar la experiencia frontend completa de `Mi Tabla`: store local, drawer/resumen, pagina `/mi-tabla`, formulario pickup, integracion con `POST /api/v1/pickup-orders`, idempotencia, confirmacion y manejo seguro de errores. Todo debe dejar claro que no hay pago online y que CRUDO confirma por WhatsApp en menos de 24 horas.

Reglas no negociables:
- `Mi Tabla` solo admite productos no alcoholicos.
- Si por cualquier razon llega un producto `is_alcohol=true` al estado local, el store debe rechazarlo/eliminarlo y bloquear submission.
- Si backend responde 422 por alcohol, la UI debe mostrar error seguro y no mostrar confirmacion.
- No hay checkout ni pago online.
- Texto obligatorio visible en formulario y/o resumen:
  - `Reserva tu tabla. El pago se realiza en CRUDO al recoger. Te confirmaremos por WhatsApp en menos de 24 horas.`
- Para vinos, la UI debe dirigir a WhatsApp, no a `Mi Tabla`.

Contexto obligatorio:
- Fase 8 debe haber dejado ProductCard/PDP con `AddToTablaButton` solo para no alcohol y `WineWhatsAppButton` para vino.
- Fase 4 debe haber dejado backend `POST /api/v1/pickup-orders` con alcohol guard 422 e idempotencia.
- Fase 7 debe haber dejado API client, analytics consent-aware, layout y componentes UI.
- Stack frontend: React 19, Vite, JavaScript, Tailwind, React Router, axios.
- Idioma visible: espanol.

Antes de editar:
1. Lee `docs/V1/V1Tecnico.md`, especialmente `0.1 Estado vivo del proyecto`.
2. Inspecciona:
   - `src/routes.jsx`
   - `src/pages/MyTablaPage.jsx`
   - `src/pages/MyTablaConfirmationPage.jsx`
   - `src/components/product/AddToTablaButton.jsx`
   - `src/components/layout/Header.jsx`
   - `src/components/layout/StickyCTA.jsx`
   - `src/lib/api.js`
   - `src/lib/analytics.js`
   - `src/lib/tablaDraft.js` si existe
   - `src/hooks/`
   - tests existentes
   - `package.json`
   - `git status --short`
3. Si Fase 8 dejo un helper draft, evolucionarlo a store real sin romper tests existentes.
4. No modifiques `docs/AGENTS_Javi.md`.
5. Usa JavaScript. No introducir TypeScript ni archivos `.ts/.tsx`.

Archivos a crear o actualizar:
1. Store/hooks:
   - `src/store/tablaStore.js` o `src/hooks/useTabla.js` segun patron existente.
   - `src/lib/idempotency.js`
   - `src/lib/pickupApi.js`
   - `src/lib/pickupValidation.js`

2. Componentes Mi Tabla:
   - `src/components/tabla/TablaDrawer.jsx`
   - `src/components/tabla/TablaSummary.jsx`
   - `src/components/tabla/TablaLineItem.jsx`
   - `src/components/tabla/PickupForm.jsx`
   - `src/components/tabla/PickupSuccess.jsx`
   - `src/components/tabla/TablaEmptyState.jsx`
   - `src/components/tabla/AlcoholBlockedNotice.jsx`

3. Paginas:
   - `src/pages/MyTablaPage.jsx`
   - `src/pages/MyTablaConfirmationPage.jsx`

4. Integraciones:
   - actualizar `AddToTablaButton`.
   - actualizar Header/StickyCTA con contador si existe.
   - actualizar routes si hace falta.

5. Tests:
   - `src/store/tablaStore.test.js` o `src/hooks/useTabla.test.jsx`
   - `src/components/tabla/TablaDrawer.test.jsx`
   - `src/components/tabla/PickupForm.test.jsx`
   - `src/pages/MyTablaPage.test.jsx`
   - `src/pages/MyTablaConfirmationPage.test.jsx`

Store `Mi Tabla`:
- API minima:
  - `addItem(product)`
  - `removeItem(productIdOrSlug)`
  - `updateQty(productIdOrSlug, qty)`
  - `clear()`
  - `hydrate()`
  - `getTotalCents()`
  - `getItemCount()`
  - `getPayloadItems()`
- Debe persistir en `localStorage`.
- Debe tolerar localStorage corrupto:
  - limpiar estado invalido.
  - no romper render.
- Debe guardar solo datos necesarios:
  - id/slug
  - name
  - qty
  - unit price snapshot para UI
  - image/thumb
  - is_alcohol
- Debe recalcular total UI desde items guardados.
- Backend recalcula precio real; la UI nunca envia precios como autoridad.
- Debe rechazar `is_alcohol=true` en `addItem`.
- Debe eliminar cualquier item alcoholico al hidratar estado antiguo/corrupto.
- Qty:
  - minimo 1.
  - maximo razonable, por ejemplo 99.
  - si llega 0, eliminar item.

TablaDrawer:
- Desktop: drawer derecho.
- Mobile: full-screen sheet o panel grande usable.
- Debe mostrar:
  - line items con thumbnail, nombre, qty stepper/input, precio, quitar.
  - total.
  - CTA `Reservar para recoger`.
  - nota: `Para reservar vinos, escríbenos por WhatsApp.`
  - texto obligatorio de pago en tienda/confirmacion WhatsApp.
- Debe tener:
  - focus management razonable.
  - cierre con Escape.
  - tap targets >= 44px.
  - no tapar legal/footer de forma permanente.

Pagina `/mi-tabla`:
- Si tabla vacia:
  - EmptyState con CTA a `/catalogo`.
- Si hay items:
  - resumen.
  - PickupForm.
  - texto obligatorio visible.
- Debe volver a validar que no hay alcohol antes de renderizar formulario.

PickupForm:
- Campos:
  - `name`
  - `email`
  - `phone`
  - `pickup_date`
  - `pickup_slot`
  - `notes`
- Validacion cliente:
  - name requerido.
  - email requerido y formato valido.
  - phone requerido.
  - pickup_date requerido, no pasado.
  - pickup_slot requerido, formato `HH:mm`.
  - notes max 1000.
  - tabla no vacia.
  - sin alcohol.
- Slots:
  - incrementos de 30 min.
  - usar site config si existe.
  - si no hay horarios reales, usar placeholder documentado y no presentarlo como definitivo.
- UX:
  - errores en texto, no solo color.
  - loading state.
  - submit disabled mientras envia.
  - si error red, permitir reintento.
  - retry automatico maximo una vez solo para error de red seguro.

API submission:
- Endpoint: `POST /api/v1/pickup-orders`.
- Usar `src/lib/api.js`.
- Crear `Idempotency-Key` por submission:
  - persistirla durante retry.
  - generar nueva si usuario cambia payload tras error.
- Payload:
  - name, email, phone, pickup_date, pickup_slot, notes.
  - items con `product_id` o `product_slug` y `qty`.
- No enviar precios como autoridad.
- Manejar responses:
  - 201: guardar datos de confirmacion, limpiar tabla, navegar a `/mi-tabla/confirmacion`.
  - 400/422: mostrar errores claros.
  - 422 alcohol: mostrar mensaje seguro, eliminar/bloquear items alcoholicos si existen, no confirmar.
  - 409 idempotency conflict: pedir revisar y reenviar, generar nueva key si el usuario confirma.
  - 429: mensaje de espera.
  - 500/red: mensaje de error sin perder tabla.

Confirmacion `/mi-tabla/confirmacion`:
- Debe mostrar:
  - order ID si existe.
  - total.
  - items resumidos si vienen en response o estado de navegacion.
  - mensaje:
    - pago en CRUDO al recoger.
    - confirmacion por WhatsApp en menos de 24h.
  - CTA WhatsApp.
  - CTA Como llegar.
  - link volver a catalogo.
  - bloque newsletter opt-in preparado o componente simple si ya existe.
- Si el usuario entra sin estado/order:
  - mostrar estado seguro con CTA a catalogo o Mi Tabla.
- No mostrar "pedido pagado" ni lenguaje de compra online.

Analytics:
- Usar `trackPickupRequest` solo tras response exitoso 201.
- Payload analytics:
  - total_cents.
  - item_count.
  - contents sin PII.
- No trackear PII.
- No disparar si no hay consentimiento.
- No duplicar evento en retry idempotente si ya se marco exito.

Accesibilidad/visual:
- Mobile-first.
- Tap targets >= 44px.
- Focus visible.
- Drawer/form usable con teclado.
- Mensajes de error asociados a campos.
- No cards dentro de cards.
- No UI SaaS generica.
- Mantener tokens CRUDO.
- No blanco puro, negro puro, azul/neon.

Tests obligatorios:
1. Store:
   - add non-alcohol item.
   - reject alcohol item.
   - hydrate elimina alcohol de localStorage.
   - total updates.
   - qty 0 elimina item.
   - localStorage corrupto no rompe.

2. Drawer:
   - render items.
   - update qty.
   - remove item.
   - CTA visible.
   - nota de vinos por WhatsApp visible.

3. PickupForm:
   - validacion campos requeridos.
   - invalid email.
   - invalid/past date.
   - invalid slot.
   - submit disabled mientras loading.
   - successful submit navega a confirmacion y limpia tabla.

4. API errors:
   - 422 alcohol muestra error seguro y no confirma.
   - 409 idempotency conflict muestra error.
   - network error retry once.
   - 500 no pierde tabla.

5. Confirmacion:
   - muestra pago en tienda.
   - muestra WhatsApp <24h.
   - no muestra pago online.

6. Regression:
   - ProductPage vino sigue sin `Anadir a mi tabla`.
   - ProductPage no alcohol puede anadir.

Si API no esta disponible:
- Mockear `pickupApi` en tests.
- No marcar integracion real como DONE.
- Documentar comando pendiente para probar con backend.

Assets visuales (consultar `§7.bis`):
- `/mi-tabla` hero/empty state usa `public/img/lifestyle/tabla-quesos-vino.jpg` (IMG_1582) — es la imagen mas "shoppable" del inventario.
- Si `Mi Tabla` esta vacia: empty state con `<AnimalQuesero variant="1" />` + copy editorial "Aun no has elegido quesos. Empieza por nuestra carta." + CTA a `/catalogo/quesos`.
- Confirmacion post-submit: `<RetroSign text="¡PEDIDO RECIBIDO!" />` + copy "Te confirmamos por WhatsApp en menos de 24 h. Pagas en CRUDO al recoger."
- TablaDrawer (mobile/desktop): no usar fotos lifestyle dentro del drawer (puede ralentizar overlay). Solo imagen de producto 1:1.
- Color terracota del `RetroSign` debe contrastar suficiente sobre fondo dark CRUDO (verificar WCAG AA).

Prohibido en esta fase:
- No integrar Stripe/Redsys.
- No crear checkout.
- No mostrar pago online.
- No permitir alcohol.
- No ocultar el alcohol guard solo en UI; store y submission tambien deben proteger.
- No implementar admin frontend.
- No implementar paginas eventos/contacto completas.
- No trackear PII.
- No usar TypeScript.

Actualizacion del estado vivo:
Al terminar, actualiza solo la seccion `0.1 Estado vivo del proyecto` de `docs/V1/V1Tecnico.md`:
- `last_updated`
- `current_phase`: 9
- `current_phase_name`: "Mi Tabla frontend y pickup flow"
- `current_focus`: resumen real de store, drawer, formulario, API, confirmacion, alcohol UI guard y tests
- `overall_status`: `REVIEW_READY` si build/tests/lint pasan; `IN_PROGRESS` si queda integracion API pendiente; `BLOCKED` si falta dependencia o decision critica
- tabla de Fase 9 con implementado/falta/notas reales
- tabla de Fase 10 como siguiente fase si Fase 9 queda lista
- funcionalidades implementadas: anade solo Mi Tabla frontend y pickup flow si estan verificados
- quita de pendientes criticos solo lo realmente implementado y probado
- registro de sesion con fecha y verificacion
- siguiente prompt recomendado: "Fase 10 - Eventos, contacto, newsletter, sobre y mayoristas" si Fase 9 queda lista
- checklist final: marca Mi Tabla, no alcohol con Mi Tabla y pickup flow sin pago online solo si tests pasan

Si cambias estado, rutas o UX que afecte al roadmap visual, actualiza tambien `docs/V1/v1TecnicoVisual.html`.

Criterios de aceptacion:
- Store de Mi Tabla persiste y recupera estado.
- Store rechaza/elimina alcohol.
- Drawer/resumen funciona en mobile y desktop.
- `/mi-tabla` muestra resumen y formulario.
- Submission usa `Idempotency-Key`.
- Submission no envia precios como autoridad.
- Backend 422 alcohol se maneja correctamente.
- Confirmacion deja claro pago en tienda y WhatsApp <24h.
- No hay checkout ni pago.
- Analytics respeta consentimiento y no trackea PII.
- `npm run build` pasa.
- `npm test` pasa.
- `npm run lint` pasa si existe.
- `docs/AGENTS_Javi.md` no se modifica.

Verificacion obligatoria:
- Ejecuta `npm run build`.
- Ejecuta `npm test`.
- Ejecuta `npm run lint` si existe.
- Ejecuta smoke local de flujo add item -> Mi Tabla -> submit mock/real si se puede sin dejar procesos vivos.
- Si Playwright ya esta configurado, captura mobile de drawer/form/confirmacion.
- Revisa que no hay texto de pago online ni Stripe/Redsys activo.
- Ejecuta `git status --short`.
- Lista archivos creados/modificados.
- Reporta cualquier verificacion no ejecutada y el motivo real.

Respuesta final:
- Resumen de Fase 9.
- Flujo Mi Tabla implementado.
- Archivos creados/modificados.
- Verificacion ejecutada y resultado.
- Estado vivo actualizado o motivo si no se pudo.
- Riesgos o pendientes reales.
- Siguiente prompt recomendado.
```

## 19. Fase 10 - Eventos, contacto, newsletter, sobre y mayoristas

Objetivo: completar las rutas publicas secundarias que generan visitas, reservas y leads.

Entregables:
- Eventos
- Detalle evento
- Reservation form
- Contacto
- Mayoristas
- Newsletter
- Sobre CRUDO
- Maps/WhatsApp/Instagram CTAs

Prompt para Opus:

```text
Usa el Prompt base minimo y fijo.

Implementa la Fase 10: Eventos, Contacto, Newsletter, Sobre CRUDO y Mayoristas.

Objetivo de esta fase:
Completar las rutas publicas secundarias de CRUDO V1 que generan visitas, reservas de eventos, consultas, leads mayoristas y newsletter: `/eventos`, `/eventos/:slug`, `/contacto`, `/sobre-crudo` y `/mayoristas`. Esta fase debe integrar formularios con la API publica, mantener copy en espanol, CTAs mobile-first y analytics consent-aware, sin crear sistema nativo de reserva de mesas ni ecommerce B2B.

Contexto obligatorio:
- Fase 7 debe haber dejado layout, rutas base, componentes UI, API client, cookie banner y analytics consent-aware.
- Fase 8 debe haber dejado Home/Catalogo/PDP y posiblemente `VisitBlock`.
- Fase 3 debe exponer endpoints publicos:
  - `GET /events`
  - `GET /events/:slug`
  - `POST /events/:slug/reservations`
  - `POST /inquiries`
  - `POST /newsletter/subscribe`
  - `GET /site/config`
- Stack frontend: React 19, Vite, JavaScript, Tailwind, React Router, axios.
- Idioma visible: espanol.
- No pago online.
- No venta online de alcohol.
- No crear reservas de mesa. Eventos/tastings si; mesas normales no.

Antes de editar:
1. Lee `docs/V1/V1Tecnico.md`, especialmente `0.1 Estado vivo del proyecto`.
2. Inspecciona:
   - `src/routes.jsx`
   - `src/pages/EventsPage.jsx`
   - `src/pages/EventDetailPage.jsx`
   - `src/pages/ContactPage.jsx`
   - `src/pages/AboutPage.jsx`
   - `src/pages/WholesalePage.jsx`
   - `src/components/home/VisitBlock.jsx`
   - `src/components/layout/Footer.jsx`
   - `src/components/ui/`
   - `src/lib/api.js`
   - `src/lib/analytics.js`
   - `src/hooks/`
   - tests existentes
   - `package.json`
   - `git status --short`
3. Si falta parte de fases previas, completa solo lo imprescindible para estas rutas sin redisenar todo.
4. No modifiques `docs/AGENTS_Javi.md`.
5. Usa JavaScript. No introducir TypeScript ni archivos `.ts/.tsx`.

Pantallas obligatorias:
- `/eventos`
- `/eventos/:slug`
- `/contacto`
- `/sobre-crudo`
- `/mayoristas`

Componentes a crear o completar:
1. Eventos:
   - `src/components/events/EventCard.jsx`
   - `src/components/events/EventList.jsx`
   - `src/components/events/EventDetail.jsx`
   - `src/components/events/ReservationForm.jsx`
   - `src/components/events/EventCapacityBadge.jsx`

2. Formularios/leads:
   - `src/components/forms/ContactForm.jsx`
   - `src/components/forms/WholesaleForm.jsx`
   - `src/components/forms/NewsletterForm.jsx`
   - `src/components/forms/FormSuccess.jsx`
   - `src/components/forms/FormError.jsx`

3. Contacto/visita:
   - `src/components/contact/ContactCtas.jsx`
   - `src/components/contact/MapBlock.jsx`
   - completar `src/components/home/VisitBlock.jsx` si falta.

4. Sobre:
   - `src/components/about/AboutIntro.jsx`
   - `src/components/about/ManifestoBlock.jsx`
   - `src/components/about/OwnerSpaceBlock.jsx`

5. Hooks/lib:
   - `src/hooks/useEvents.js`
   - `src/hooks/useEvent.js`
   - `src/lib/eventsApi.js`
   - `src/lib/inquiriesApi.js`
   - `src/lib/newsletterApi.js`
   - `src/lib/formValidation.js`
   - `src/lib/contactLinks.js`

6. Tests:
   - `src/components/events/ReservationForm.test.jsx`
   - `src/pages/EventsPage.test.jsx`
   - `src/pages/EventDetailPage.test.jsx`
   - `src/components/forms/ContactForm.test.jsx`
   - `src/components/forms/WholesaleForm.test.jsx`
   - `src/components/forms/NewsletterForm.test.jsx`
   - `src/pages/ContactPage.test.jsx`

Eventos `/eventos`:
- Cargar `GET /events`.
- Mostrar solo eventos futuros activos si API no lo filtra ya.
- Ordenar por fecha ascendente si API no lo garantiza.
- Cada `EventCard` debe mostrar:
  - titulo.
  - fecha.
  - hora.
  - ubicacion.
  - precio si existe.
  - capacidad restante o estado `quedan pocas plazas` si menos del 30%.
  - CTA `Ver evento`.
- Loading, empty y error states en espanol.
- Empty state debe invitar a newsletter/contacto, no inventar eventos.

Detalle evento `/eventos/:slug`:
- Cargar `GET /events/:slug`.
- Mostrar:
  - titulo.
  - fecha/hora.
  - precio.
  - ubicacion.
  - hero image/placeholder con alt.
  - descripcion.
  - capacidad restante o `quedan pocas plazas`.
- Si evento esta lleno:
  - sustituir formulario por mensaje claro.
  - si API no soporta waitlist, no crear waitlist falsa.
  - CTA alternativo: WhatsApp/contacto.
- Si evento es pasado/inactivo/no existe:
  - 404/estado seguro con CTA a `/eventos`.

ReservationForm:
- Integra `POST /events/:slug/reservations`.
- Campos:
  - `name`
  - `email`
  - `phone`
  - `party_size` 1-4
  - `notes`
- Validacion cliente:
  - name requerido.
  - email requerido y valido.
  - phone requerido.
  - party_size entero 1-4.
  - notes max 1000.
- On submit:
  - loading state.
  - errores por campo y general.
  - success state en la pagina.
  - texto claro: solicitud recibida, CRUDO confirmara.
  - admin lo vera como reservation `NEW` via backend.
- Usar `Idempotency-Key` si backend lo soporta.
- No cobrar ni pedir datos de pago.

Contacto `/contacto`:
- Mostrar:
  - ContactForm.
  - WhatsApp CTA.
  - Como llegar/Maps.
  - Instagram.
  - horarios/direccion desde site config.
  - MapBlock con embed accesible o link si embed no esta configurado.
- ContactForm:
  - `type=CONTACT`.
  - campos: name, email, phone opcional si email presente, message.
  - validar email o phone segun datos.
  - `POST /inquiries`.
  - success state claro.
  - track `generate_lead` tras exito, sin PII.

Mayoristas `/mayoristas`:
- Enfoque B2B/distribucion queso.
- No ecommerce B2B.
- No lista privada de precios.
- Copy claro en espanol:
  - quesos artesanos.
  - restaurantes/tiendas/horeca.
  - contacto para disponibilidad y condiciones.
- WholesaleForm:
  - `type=WHOLESALE`.
  - campos:
    - business_name.
    - contact_name/name.
    - email.
    - phone.
    - message.
  - guardar campos extra en `payload`.
  - `POST /inquiries`.
  - success state.
  - track `generate_lead` tras exito, sin PII.

Newsletter:
- Completar `NewsletterForm` en footer y paginas clave si ya esta presente.
- Integrar `POST /newsletter/subscribe`.
- Campos:
  - email.
  - source.
  - consentimiento explicito si el formulario lo requiere.
- Mostrar:
  - double opt-in via Brevo si backend lo prepara.
  - mensaje de revisar email.
- Si Brevo/API no disponible:
  - manejar error/noop de forma clara sin romper pagina.
- Track `generate_lead` tras exito, sin PII.
- No suscribir sin consentimiento.

Sobre CRUDO `/sobre-crudo`:
- Crear pagina editorial no generica:
  - intro de CRUDO.
  - manifesto placeholder editable.
  - owner/space photos placeholder claramente sustituible.
  - links a catalogo, eventos, contacto.
- Copy:
  - espanol simple.
  - compatible con Google Translate.
  - sin textos en imagenes.
- No fingir historia real si no existe contenido owner; usar placeholder honesto y documentar pendiente.

VisitBlock/CTAs:
- CTAs visibles y mobile-friendly:
  - WhatsApp.
  - Como llegar.
  - Instagram.
- Usar `siteConfig`.
- Links:
  - WhatsApp `wa.me` con texto prellenado general.
  - Maps URL desde env/site config.
  - Instagram `@crudomov` si confirmado en docs.
- Track:
  - `whatsapp_click`.
  - `maps_click`.
  - `generate_lead`.
- No trackear PII.
- No disparar analytics sin consentimiento.

Assets visuales (consultar `§7.bis`):
- `/sobre-crudo` hero: `public/img/about/owner-mostrador.jpg` (IMG_8954, Stefano sonriendo detras del mostrador) full-bleed 60vh con overlay gradient sutil. Reforzar marca con `<RetroSign text="DESDE 2024 EN MADRID" size="sm" />` como eyebrow (ajustar año real cuando owner confirme).
- `/sobre-crudo` bloque "manifesto": dos columnas: texto + `<LifestylePhoto src="/img/lifestyle/bodegon-cartel-crudo.jpg" alt="Bodegon en CRUDO con vinos naturales y cartel retroiluminado" aspectRatio="aspect-[4/5]" />`.
- `/sobre-crudo` bloque "Owner/Space": grid 3 fotos: IMG_8952, IMG_8953, IMG_8954 (mostrador, quesera, owner).
- `/sobre-crudo` footer-block: ilustracion `<AnimalQuesero variant="2" />` como decorativo + copy editorial corto.
- `/eventos` hero: `public/img/lifestyle/cata-vinos-naturales.jpg` (IMG_9525, tres botellas + plato quesos + decantador) overlay 50%. Eyebrow `<RetroSign text="EVENTOS" size="sm" />`.
- `/eventos` EventCard: si evento no tiene `hero_image_url`, fallback editorial usando IMG_9525-9528 segun tipo (cata vinos / tabla maridajes).
- `/eventos/:slug` detalle: hero del evento; si falta, fallback `/img/lifestyle/cata-vinos-naturales.jpg`.
- `/contacto` hero/accent: `public/img/lifestyle/bodegon-cartel-crudo.jpg` con overlay; MapBlock embebido debajo. Acompañar con `<RetroSign text="VISITANOS" size="sm" />`.
- `/mayoristas` hero: foto botella vino natural en mano (`docs/V1/Photos/IMG_1117 2.jpeg` -> `public/img/lifestyle/vino-natural-mano.jpg`) — comunica "producto seleccionado a mano". Eyebrow `<RetroSign text="HORECA Y DISTRIBUCION" size="sm" />`.
- Pipeline minimo Fase 10:
  - Copiar a `public/img/about/`: IMG_8952, IMG_8953 (renombrar `mostrador-quesera.jpg`, `mostrador-vino.jpg`).
  - Copiar a `public/img/lifestyle/`: IMG_1117 -> `vino-natural-mano.jpg`, IMG_0206 -> `bodegon-cartel-crudo-2.jpg` (alt del primero).
  - Verificar EXIF rotation.
- Newsletter form success state: `<BrandSticker rotation={-10} size={56} />` + copy "Revisa tu correo para confirmar la suscripcion" — humor sutil sin banalizar.
- FormError: NO usar sticker ni mascotas (no humor en errores). Solo iconografia sobria.

Visual:
- Mantener tokens CRUDO.
- Mobile-first.
- No UI SaaS.
- No cards dentro de cards.
- Cards radius <= 8px.
- Imagenes con aspect-ratio estable.
- No blanco puro, negro puro, azul/neon.
- Formularios sobrios, legibles y tactiles.
- Botones/tap targets >= 44px.
- No carruseles auto-rotatorios ni parallax.

Accesibilidad:
- Un H1 por pagina.
- Labels reales en todos los inputs.
- Errores asociados con `aria-describedby`.
- Success/error no dependen solo de color.
- Focus visible.
- Forms navegables con teclado.
- Map embed con title o fallback link.
- Links externos con texto accesible.

SEO base:
- Title/meta basicos por pagina.
- Event detail genera schema.org Event si helper existe.
- ContactPage puede preparar Organization/LocalBusiness si helper existe.
- No implementar prerender completo; Fase 12.

Tests obligatorios:
1. Eventos:
   - `/eventos` renderiza eventos futuros.
   - empty state sin eventos.
   - EventCard muestra pocas plazas si aplica.
   - `/eventos/:slug` renderiza detalle.
   - evento lleno no muestra form.

2. ReservationForm:
   - validacion required/invalid.
   - submit happy path.
   - error API.
   - success state.

3. ContactForm:
   - validacion.
   - submit CONTACT.
   - success state.
   - track `generate_lead` sin PII.

4. WholesaleForm:
   - validacion.
   - submit WHOLESALE con payload.
   - no comportamiento ecommerce.

5. NewsletterForm:
   - email invalido.
   - consentimiento si aplica.
   - submit success.
   - error API.

6. CTAs:
   - WhatsApp link correcto.
   - Maps link correcto.
   - Instagram link correcto.

7. Regression:
   - Mi Tabla sigue sin aceptar alcohol.
   - Vino PDP sigue WhatsApp-only.

Si API no esta disponible:
- Mockear API en capa `eventsApi`, `inquiriesApi`, `newsletterApi`.
- No marcar integracion API real como DONE.
- Documentar comandos pendientes para probar con backend.

Prohibido en esta fase:
- No implementar reserva de mesas nativa.
- No implementar checkout ni pagos.
- No crear ecommerce B2B.
- No permitir alcohol en Mi Tabla.
- No activar GA4/Pixel antes de consentimiento.
- No implementar admin frontend.
- No introducir TypeScript.
- No usar UI kit pesado.
- No inventar contenido real del owner si no existe.

Actualizacion del estado vivo:
Al terminar, actualiza solo la seccion `0.1 Estado vivo del proyecto` de `docs/V1/V1Tecnico.md`:
- `last_updated`
- `current_phase`: 10
- `current_phase_name`: "Eventos, contacto, newsletter, sobre y mayoristas"
- `current_focus`: resumen real de eventos, formularios, CTAs, newsletter, sobre y tests
- `overall_status`: `REVIEW_READY` si build/tests/lint pasan; `IN_PROGRESS` si queda integracion API/contenido pendiente; `BLOCKED` si falta dependencia o decision critica
- tabla de Fase 10 con implementado/falta/notas reales
- tabla de Fase 11 como siguiente fase si Fase 10 queda lista
- funcionalidades implementadas: anade solo rutas publicas secundarias y formularios si estan verificados
- quita de pendientes criticos solo lo realmente implementado y probado
- registro de sesion con fecha y verificacion
- siguiente prompt recomendado: "Fase 11 - Admin frontend movil" si Fase 10 queda lista
- checklist final: marca Eventos, Contacto, Mayoristas, Newsletter y Sobre CRUDO solo si tests pasan

Si cambias estado, rutas o UX que afecte al roadmap visual, actualiza tambien `docs/V1/v1TecnicoVisual.html`.

Criterios de aceptacion:
- `/eventos`, `/eventos/:slug`, `/contacto`, `/sobre-crudo` y `/mayoristas` existen.
- Eventos futuros se muestran ordenados.
- Reservation form funciona y no cobra.
- ContactForm y WholesaleForm envian inquiries correctas.
- NewsletterForm integra API y consentimiento.
- CTAs WhatsApp/Maps/Instagram funcionan en mobile.
- No se anade sistema nativo de reserva de mesas.
- No se anade ecommerce B2B.
- Formularios tienen validacion cliente y servidor via API.
- Analytics respeta consentimiento y no trackea PII.
- Mobile-first y accesible.
- `npm run build` pasa.
- `npm test` pasa.
- `npm run lint` pasa si existe.
- `docs/AGENTS_Javi.md` no se modifica.

Verificacion obligatoria:
- Ejecuta `npm run build`.
- Ejecuta `npm test`.
- Ejecuta `npm run lint` si existe.
- Ejecuta smoke local de eventos/contacto/mayoristas/newsletter si se puede sin dejar procesos vivos.
- Si Playwright ya esta configurado, captura mobile de `/eventos`, `/contacto` y `/mayoristas`.
- Revisa que no hay textos de pago online, reserva de mesas o ecommerce B2B.
- Ejecuta `git status --short`.
- Lista archivos creados/modificados.
- Reporta cualquier verificacion no ejecutada y el motivo real.

Respuesta final:
- Resumen de Fase 10.
- Rutas/formularios implementados.
- Archivos creados/modificados.
- Verificacion ejecutada y resultado.
- Estado vivo actualizado o motivo si no se pudo.
- Riesgos o pendientes reales.
- Siguiente prompt recomendado.
```

## 20. Fase 11 - Admin frontend movil

Objetivo: construir backoffice usable en telefono por una sola persona.

Entregables:
- Login
- AdminShell
- Dashboard
- Product CRUD
- Event/Campaign CRUD
- Orders/Inquiries
- Stock toggles
- Image upload

Prompt para Opus:

```text
Usa el Prompt base minimo y fijo.

Implementa la Fase 11: frontend admin movil para owner de CRUDO.

Objetivo de esta fase:
Construir el frontend admin mobile-first de CRUDO V1 para que el owner gestione pedidos, stock, productos, eventos, campanas, consultas y configuracion desde el telefono en menos de 5 minutos al dia. Esta fase consume el backend admin de Fase 5 y no debe modificar el funcionamiento del public site.

Regla de diseno no negociable:
- No es un dashboard SaaS decorativo.
- Es una herramienta de servicio para una persona entre clientes.
- Cada accion diaria debe ser 1 tap o 1 form submission cuando sea razonable.
- Si un flujo diario supera 3 taps, simplificalo o documenta el riesgo.
- Prioriza lectura rapida, botones grandes y estados claros sobre densidad de datos.
- No usar tablas densas en mobile.

Contexto obligatorio:
- Fase 5 debe exponer `/api/v1/admin/**` con JWT.
- Fase 7 debe haber dejado React/Vite, layout, componentes UI, API client y rutas base.
- Fase 8-10 deben haber dejado public site funcional. No romperlo.
- Stack frontend: React 19, Vite, JavaScript, Tailwind, React Router, axios.
- Idioma visible admin: espanol.
- Codigo y tests en ingles.
- No pago online.
- Crear/editar vino debe mantener `is_alcohol=true` para que public PDP siga WhatsApp-only.

Antes de editar:
1. Lee `docs/V1/V1Tecnico.md`, especialmente `0.1 Estado vivo del proyecto`.
2. Inspecciona:
   - `src/routes.jsx`
   - `src/pages/AdminEntryPage.jsx`
   - `src/components/ui/`
   - `src/lib/api.js`
   - `src/lib/analytics.js`
   - `src/hooks/`
   - public pages ya implementadas
   - tests existentes
   - `package.json`
   - `git status --short`
3. Si falta parte de Fase 7 o Fase 5, completa solo lo imprescindible para admin frontend y documenta el desfase.
4. No modifiques `docs/AGENTS_Javi.md`.
5. Usa JavaScript. No introducir TypeScript ni archivos `.ts/.tsx`.

Rutas admin obligatorias:
- `/admin`
- `/admin/productos`
- `/admin/productos/nuevo`
- `/admin/productos/:id`
- `/admin/eventos`
- `/admin/eventos/nuevo`
- `/admin/eventos/:id`
- `/admin/campanas`
- `/admin/campanas/nuevo`
- `/admin/campanas/:id`
- `/admin/pedidos`
- `/admin/consultas`
- `/admin/configuracion`

Archivos a crear o actualizar:
1. API/admin:
   - `src/lib/adminApi.js`
   - `src/lib/adminAuth.js`
   - `src/lib/adminStorage.js`
   - `src/hooks/useAdminAuth.js`
   - `src/hooks/useAdminResource.js` si ayuda.

2. Layout/admin shell:
   - `src/components/admin/AdminShell.jsx`
   - `src/components/admin/AdminBottomNav.jsx`
   - `src/components/admin/AdminTopBar.jsx`
   - `src/components/admin/AdminProtectedRoute.jsx`
   - `src/components/admin/AdminEmptyState.jsx`
   - `src/components/admin/AdminErrorState.jsx`
   - `src/components/admin/AdminActionButton.jsx`

3. Pages:
   - `src/pages/admin/AdminLoginPage.jsx`
   - `src/pages/admin/AdminDashboardPage.jsx`
   - `src/pages/admin/AdminProductsPage.jsx`
   - `src/pages/admin/AdminProductEditPage.jsx`
   - `src/pages/admin/AdminEventsPage.jsx`
   - `src/pages/admin/AdminEventEditPage.jsx`
   - `src/pages/admin/AdminCampaignsPage.jsx`
   - `src/pages/admin/AdminCampaignEditPage.jsx`
   - `src/pages/admin/AdminOrdersPage.jsx`
   - `src/pages/admin/AdminInquiriesPage.jsx`
   - `src/pages/admin/AdminConfigPage.jsx`

4. Components:
   - `src/components/admin/LoginForm.jsx`
   - `src/components/admin/DashboardCard.jsx`
   - `src/components/admin/QuickActions.jsx`
   - `src/components/admin/ProductEditor.jsx`
   - `src/components/admin/ProductListItem.jsx`
   - `src/components/admin/ImageUploader.jsx`
   - `src/components/admin/EventEditor.jsx`
   - `src/components/admin/CampaignEditor.jsx`
   - `src/components/admin/OrderCard.jsx`
   - `src/components/admin/InquiryCard.jsx`
   - `src/components/admin/StatusPill.jsx`
   - `src/components/admin/ConfigForm.jsx`

5. Tests:
   - `src/pages/admin/AdminLoginPage.test.jsx`
   - `src/pages/admin/AdminDashboardPage.test.jsx`
   - `src/pages/admin/AdminProductsPage.test.jsx`
   - `src/components/admin/ProductEditor.test.jsx`
   - `src/components/admin/OrderCard.test.jsx`
   - `src/components/admin/AdminProtectedRoute.test.jsx`

Admin API client:
- Usar `src/lib/api.js` o extenderlo.
- Base URL: `/api/v1/admin`.
- Adjuntar `Authorization: Bearer <token>` en endpoints admin.
- Manejar:
  - 401 -> limpiar sesion y redirigir a `/admin`.
  - 403 -> mostrar acceso denegado.
  - RFC 7807 -> mensaje claro en UI.
- No loguear tokens.
- No guardar secrets en localStorage.

Auth:
- Login email/password.
- Guardar access token de forma razonable:
  - memoria + localStorage/sessionStorage si el proyecto ya usa ese patron.
  - documentar tradeoff en runbook si se guarda en storage.
- Refresh:
  - implementar si backend lo soporta.
  - si no, logout al expirar y documentar.
- Logout:
  - limpiar token.
  - llamar endpoint logout si existe.
- Protected routes:
  - usuario no autenticado -> `/admin`.
  - conservar redirect target si es sencillo.
- UI:
  - formulario mobile.
  - errores claros.
  - no revelar si email existe.

AdminShell:
- Mobile-first.
- Bottom nav o compact nav con:
  - Inicio.
  - Productos.
  - Pedidos.
  - Consultas.
  - Mas/Config.
- Botones >= 44px.
- Estados loading/error vacios.
- Public header/footer no deben aparecer dentro del admin si distraen.
- Admin debe ser visualmente sobrio, con tokens CRUDO, sin look SaaS generico.

Dashboard:
- Consumir `GET /admin/dashboard`.
- Mostrar bloques compactos:
  - pedidos pickup de hoy.
  - pedidos `NEW`.
  - eventos de hoy/proximos.
  - consultas nuevas.
  - productos `LOW`/`OUT`.
  - reservas nuevas.
- Acciones rapidas:
  - confirmar pedido.
  - marcar `READY`.
  - marcar `PICKED_UP`.
  - marcar producto agotado.
  - abrir WhatsApp con respuesta prellenada.
- Cada accion debe mostrar:
  - pending/loading.
  - success.
  - error recuperable.
- No usar tablas densas.

Productos:
- Lista searchable.
- Filtros rapidos:
  - stock.
  - tipo.
  - activo/inactivo.
- Product editor:
  - `name`
  - `slug`
  - `type`
  - `is_alcohol`
  - `producer`
  - `region`
  - `price_cents` o euros UI convertido a cents
  - `vat_rate`
  - `short_desc`
  - `long_desc`
  - `is_seasonal`
  - `is_featured`
  - `is_active`
  - `stock_status`
  - categorias si API lo soporta
- Regla vino:
  - si `type=WINE`, forzar o advertir `is_alcohol=true`.
  - no permitir guardar vino como reservable por accidente.
  - test obligatorio.
- Image upload:
  - usar endpoint admin upload.
  - preview local.
  - loading/error.
  - alt text editable o default.
- Acciones rapidas:
  - marcar `OUT`.
  - marcar `LOW`.
  - marcar `IN_STOCK`.

Eventos:
- Lista de eventos.
- Editor:
  - title.
  - slug.
  - starts_at / ends_at.
  - capacity.
  - price.
  - location.
  - description_md.
  - image/hero URL si backend lo soporta.
  - is_active.
- Validar fechas coherentes.
- No crear reserva de mesas.

Campanas:
- Lista.
- Editor:
  - title.
  - subtitle.
  - body_md.
  - hero_image_url.
  - starts_at / ends_at.
  - is_active.
  - productos asociados si backend lo soporta.
- Evitar flujo largo; si asociar productos es complejo, hacerlo searchable/simple o documentar pendiente.

Pedidos pickup:
- Lista por status/date.
- Cards mobile con:
  - nombre.
  - telefono.
  - pickup date/slot.
  - status.
  - total.
  - items resumidos.
- PATCH status:
  - `NEW`
  - `CONFIRMED`
  - `READY`
  - `PICKED_UP`
  - `CANCELLED`
- Quick WhatsApp:
  - link prellenado segun status.
  - no enviar automaticamente si no hay integracion real.
- Acciones diarias deben ser rapidas.

Consultas:
- Lista contact/wholesale.
- Filtros:
  - type.
  - status.
- Card con:
  - nombre.
  - email/phone.
  - mensaje.
  - fecha.
  - status.
- PATCH status.
- Reply links:
  - email mailto.
  - WhatsApp si phone.
- No mostrar PII innecesaria en logs/tests.

Configuracion:
- Form para site config publico si backend existe:
  - direccion.
  - horarios.
  - WhatsApp publico.
  - Instagram.
  - Google Maps URL.
  - pickup_enabled si existe.
- Si kill switch pickup no existe:
  - no inventar backend.
  - documentar pendiente V1.1 o mostrarlo disabled con nota interna si aporta.

UX mobile:
- No tablas horizontales obligatorias.
- Cards/list items escaneables.
- Primary action visible.
- Confirmacion ligera para acciones destructivas/cancelaciones.
- Optimistic update solo si se puede revertir bien; si no, esperar respuesta.
- Pull-to-refresh no obligatorio.
- Offline: mostrar error claro, no perder formulario en edicion.

Accesibilidad:
- Labels en formularios.
- Errores con texto.
- Focus visible.
- Botones con nombre accesible.
- Tap targets >= 44px.
- No usar solo color para status.
- Formularios largos segmentados.

Tests obligatorios:
1. Auth:
   - login flow.
   - login error.
   - unauthenticated redirect.
   - token expirado/401 limpia sesion.
   - logout.

2. Dashboard:
   - renderiza bloques principales.
   - quick action PATCH status.
   - error de accion se muestra.

3. Productos:
   - lista productos.
   - product editor crea no alcohol.
   - product editor crea vino con `is_alcohol=true`.
   - `type=WINE` con `is_alcohol=false` se corrige o bloquea segun implementacion.
   - stock quick action llama PATCH.
   - image upload muestra preview/success/error.

4. Pedidos/consultas:
   - orders list render.
   - patch pickup status.
   - WhatsApp prefill correcto.
   - inquiries list render.
   - patch inquiry status.

5. Config:
   - config form carga y guarda.

6. Regression:
   - public site routes siguen renderizando.
   - wine PDP sigue WhatsApp-only.
   - Mi Tabla sigue rechazando alcohol.

7. Mobile smoke:
   - Testing Library con viewport simulado si disponible.
   - Playwright mobile si ya esta configurado.

Si backend admin no esta disponible:
- Mockear admin API en tests.
- No marcar integracion real como DONE.
- Documentar comandos pendientes para probar con backend.

Prohibido en esta fase:
- No implementar backend admin nuevo salvo pequenos ajustes imprescindibles.
- No romper public site.
- No crear dashboards densos de escritorio.
- No crear charts/KPIs decorativos si no ayudan al owner.
- No permitir vino reservable.
- No activar pagos online.
- No introducir TypeScript.
- No usar UI kit pesado.
- No guardar tokens en logs.

Actualizacion del estado vivo:
Al terminar, actualiza solo la seccion `0.1 Estado vivo del proyecto` de `docs/V1/V1Tecnico.md`:
- `last_updated`
- `current_phase`: 11
- `current_phase_name`: "Admin frontend movil"
- `current_focus`: resumen real de login, shell, dashboard, CRUD, pedidos, consultas, config, uploads y tests
- `overall_status`: `REVIEW_READY` si build/tests/lint pasan; `IN_PROGRESS` si queda integracion API pendiente; `BLOCKED` si falta dependencia o decision critica
- tabla de Fase 11 con implementado/falta/notas reales
- tabla de Fase 12 como siguiente fase si Fase 11 queda lista
- funcionalidades implementadas: anade solo admin frontend si esta verificado
- quita de pendientes criticos solo lo realmente implementado y probado
- registro de sesion con fecha y verificacion
- siguiente prompt recomendado: "Fase 12 - Legal, cookies, SEO, analytics y prerender" si Fase 11 queda lista
- checklist final: marca Admin movil, admin <=5 min/dia e image upload UI solo si tests pasan

Si cambias estado, rutas o UX que afecte al roadmap visual, actualiza tambien `docs/V1/v1TecnicoVisual.html`.

Criterios de aceptacion:
- Login admin funciona.
- Rutas admin protegidas.
- Owner puede hacer rutina manana/cierre desde movil.
- Dashboard no usa tablas densas inutilizables.
- Product editor protege `is_alcohol=true` para vinos.
- Pedidos e inquiries permiten acciones rapidas.
- Upload UI funciona o queda documentado si depende de backend.
- Public site no se rompe.
- Mi Tabla sigue rechazando alcohol.
- `npm run build` pasa.
- `npm test` pasa.
- `npm run lint` pasa si existe.
- `docs/AGENTS_Javi.md` no se modifica.

Verificacion obligatoria:
- Ejecuta `npm run build`.
- Ejecuta `npm test`.
- Ejecuta `npm run lint` si existe.
- Ejecuta smoke local de login/dashboard/productos/pedidos si se puede sin dejar procesos vivos.
- Si Playwright esta configurado, captura mobile de login, dashboard y pedidos.
- Revisa que no hay logs/tokens hardcodeados.
- Ejecuta `git status --short`.
- Lista archivos creados/modificados.
- Reporta cualquier verificacion no ejecutada y el motivo real.

Respuesta final:
- Resumen de Fase 11.
- Rutas/admin flows implementados.
- Archivos creados/modificados.
- Verificacion ejecutada y resultado.
- Estado vivo actualizado o motivo si no se pudo.
- Riesgos o pendientes reales.
- Siguiente prompt recomendado.
```

## 21. Fase 12 - Legal, cookies, SEO, analytics y prerender

Objetivo: dejar la web medible, legalmente preparada y rastreable.

Entregables:
- Legal pages
- Cookie banner completo
- Consent mode
- GA4/Pixel gated
- Sitemap/robots
- Prerender catalogo/PDP
- Schema.org
- Open Graph/Twitter cards

Prompt para Opus:

```text
Usa el Prompt base minimo y fijo.

Implementa la Fase 12: legal, cookies, SEO, analytics y prerender.

Objetivo de esta fase:
Dejar CRUDO V1 legalmente preparado, medible y rastreable: paginas legales placeholder revisables por abogado, cookie banner AEPD completo, consentimiento persistido y enviado al backend, GA4/Meta Pixel estrictamente gated por consentimiento, metadata SEO, Open Graph, schema.org, sitemap, robots y prerender de rutas publicas clave. Esta fase no sustituye revision legal profesional.

Contexto obligatorio:
- Fase 7 debe haber creado CookieBanner base, `src/lib/analytics.js`, `src/lib/consent.js`, `src/lib/schemaOrg.js` y rutas legales placeholder.
- Fases 8-10 deben haber creado Home, Catalogo, PDP, Eventos y formularios.
- Backend Fase 3 debe exponer `POST /api/v1/consent` y datos publicos para productos/eventos.
- Idioma visible: espanol claro y compatible con Google Translate.
- V1 sin pago online y sin venta online de alcohol.
- No cargar GA4, Meta Pixel ni cookies no esenciales antes de consentimiento.

Antes de editar:
1. Lee `docs/V1/V1Tecnico.md`, especialmente `0.1 Estado vivo del proyecto`.
2. Inspecciona:
   - `index.html`
   - `vite.config.js`
   - `src/routes.jsx`
   - `src/pages/LegalPage.jsx`
   - `src/pages/PrivacyPage.jsx`
   - `src/pages/CookiesPage.jsx`
   - `src/components/layout/CookieBanner.jsx`
   - `src/lib/analytics.js`
   - `src/lib/consent.js`
   - `src/lib/schemaOrg.js`
   - `src/lib/api.js`
   - `src/pages/HomePage.jsx`
   - `src/pages/ProductPage.jsx`
   - `src/pages/EventDetailPage.jsx`
   - `public/` si existe
   - `package.json`
   - tests existentes
   - `git status --short`
3. Si falta parte de fases previas, completa solo lo imprescindible y documenta el desfase.
4. No modifiques `docs/AGENTS_Javi.md`.
5. Usa JavaScript. No introducir TypeScript ni archivos `.ts/.tsx`.

Archivos a crear o actualizar:
1. Legal:
   - `src/pages/LegalPage.jsx`
   - `src/pages/PrivacyPage.jsx`
   - `src/pages/CookiesPage.jsx`
   - `src/content/legal.js` si ayuda a separar copy.

2. Cookies/consent:
   - `src/components/layout/CookieBanner.jsx`
   - `src/components/layout/CookieSettingsModal.jsx`
   - `src/lib/consent.js`
   - `src/lib/analytics.js`
   - `src/lib/metaPixel.js` si separas proveedor.
   - `src/lib/ga4.js` si separas proveedor.

3. SEO/schema:
   - `src/components/seo/Seo.jsx`
   - `src/components/seo/JsonLd.jsx`
   - `src/lib/schemaOrg.js`
   - `src/lib/seo.js`
   - `scripts/generate-sitemap.js`
   - `scripts/prerender.js` si no usas plugin.
   - `public/robots.txt` o generacion en build.
   - `public/sitemap.xml` generado o documentado.

4. Tests:
   - `src/components/layout/CookieBanner.test.jsx`
   - `src/lib/consent.test.js`
   - `src/lib/analytics.test.js`
   - `src/lib/schemaOrg.test.js`
   - `src/pages/LegalPage.test.jsx`
   - `src/pages/CookiesPage.test.jsx`
   - `tests/seo/sitemap.test.js` o ubicacion equivalente.

Legal:
- Crear o completar rutas:
  - `/aviso-legal`
  - `/privacidad`
  - `/cookies`
- Copy placeholder en espanol, claro y revisable.
- Cada pagina debe incluir aviso visible:
  - `Contenido pendiente de revision legal profesional.`
- Incluir placeholders para:
  - razon social.
  - NIF/CIF.
  - domicilio fiscal.
  - email legal/contacto.
  - dominio definitivo.
  - responsable del tratamiento.
- Privacidad:
  - formularios contacto/mayoristas/eventos/newsletter.
  - finalidad.
  - base legal.
  - conservacion.
  - derechos RGPD.
  - encargados/proveedores placeholder.
- Cookies:
  - categorias.
  - proveedor.
  - finalidad.
  - duracion.
  - como cambiar consentimiento.
- Alcohol:
  - +18.
  - consumo responsable.
  - prohibida venta a menores.
  - recordar que V1 no vende alcohol online.
- No inventar datos legales reales si no estan confirmados.

Cookie banner AEPD:
- Botones visibles con peso visual equivalente:
  - `Aceptar`
  - `Rechazar`
  - `Configurar`
- Categorias:
  - necesarias: siempre activas.
  - analiticas.
  - marketing.
- Configurar:
  - modal/panel accesible.
  - toggles claros.
  - guardar seleccion.
  - boton guardar.
- Persistencia:
  - consentimiento versionado.
  - timestamp.
  - expiracion recomendada.
  - localStorage/cookie propia necesaria.
- Backend:
  - enviar `POST /api/v1/consent`.
  - si falla, no romper UX; reintentar o documentar pendiente.
- Debe existir forma de reabrir configuracion desde `/cookies`.
- No cargar cookies/scripts no esenciales antes del consentimiento.

Analytics:
- GA4:
  - cargar script solo tras consentimiento analitico.
  - `VITE_GA_ID` desde env.
  - no hardcodear ID real.
  - eventos:
    - `select_item`
    - `pickup_request`
    - `wine_whatsapp_click`
    - `generate_lead`
    - `maps_click`
    - `whatsapp_click`
- Meta Pixel:
  - cargar script solo tras consentimiento marketing.
  - `VITE_META_PIXEL` desde env.
  - pageview solo tras consentimiento marketing.
  - custom events solo tras consentimiento marketing.
- Consent Mode v2:
  - si se implementa GA consent mode, default denied antes de consentimiento.
  - actualizar consent tras aceptar/configurar.
- Todas las funciones analytics deben ser noop sin consentimiento.
- No trackear PII:
  - nombres.
  - emails.
  - telefonos.
  - notas de formularios.
- Tests deben demostrar que antes de consentimiento no se inyectan scripts ni eventos.

SEO basico:
- `index.html`:
  - `lang="es"`.
  - title base.
  - description base.
  - theme-color con token CRUDO.
- Por pagina:
  - title.
  - meta description.
  - canonical si `PUBLIC_BASE_URL` existe.
  - Open Graph title/description/image.
  - Twitter card.
- Pages:
  - Home.
  - Catalogo.
  - Catalogo quesos/vinos/temporada.
  - PDP.
  - Eventos.
  - Detalle evento.
  - Sobre.
  - Contacto.
  - Mayoristas.
  - Legal.
- No meter copy en imagenes.
- Espanol claro y traducible.

OG images por ruta (consultar `§7.bis`):
- Generar variantes optimizadas WebP/JPG 1200x630 (16:9 social-safe) bajo `public/img/og/`:
  - `og-home.jpg` <- recorte de `/img/hero/hero-home-cheeseboard.png` (encuadrar tabla quesos + lampara).
  - `og-catalogo.jpg` <- recorte de `/img/lifestyle/tabla-quesos-vino.jpg` (IMG_1582).
  - `og-catalogo-vinos.jpg` <- recorte de `/img/lifestyle/cata-vinos-naturales.jpg` (IMG_9525).
  - `og-catalogo-quesos.jpg` <- mismo que catalogo o variante 16:9 mas cerrada de IMG_1582.
  - `og-sobre.jpg` <- recorte de `/img/about/owner-mostrador.jpg` (IMG_8954).
  - `og-eventos.jpg` <- recorte de `/img/lifestyle/cata-vinos-naturales.jpg`.
  - `og-contacto.jpg` <- recorte de `/img/lifestyle/bodegon-cartel-crudo.jpg` (IMG_0205, cartel CRUDO visible para reforzar marca en preview).
  - `og-mayoristas.jpg` <- recorte de `/img/lifestyle/vino-natural-mano.jpg` (IMG_1117).
- PDP producto: usar `images[0].url` del producto si existe. Si no, fallback OG por tipo (`og-catalogo-quesos.jpg` o `og-catalogo-vinos.jpg`).
- PDP evento: usar `hero_image_url` si existe; si no, `og-eventos.jpg`.
- Naming: kebab-case, semantico, no IDs.
- Tag `<meta property="og:image">` debe ser **URL absoluta** (concat `PUBLIC_BASE_URL`).
- Reservar `<meta property="og:image:alt">` con descripcion espanol corta (max 100 chars).
- Twitter card `summary_large_image`.
- No texto incrustado en OG images (el preview rendea texto encima por Twitter/Linkedin/WhatsApp/Slack).
- Verificacion: `curl -s URL | grep og:image` debe devolver path absoluto.

Schema.org:
- Home:
  - Restaurant o LocalBusiness/Restaurant.
  - address placeholder si falta dato real.
  - telephone/URL solo si publicos.
- Product PDP:
  - Product.
  - name, description, image, offers si precio existe.
  - Para vino, no indicar online sale. Si se usa Offer, dejar claro disponibilidad/in-store segun schema permitido o evitar Offer si crea confusion.
- Event detail:
  - Event.
  - name, startDate, location, image, description.
- FAQ:
  - solo si hay FAQs visibles reales en pagina.
- JSON-LD debe renderizarse como `application/ld+json`.

Sitemap:
- Generar `sitemap.xml` con:
  - rutas publicas estaticas.
  - catalogo.
  - productos activos.
  - eventos activos/futuros.
  - paginas legales.
- Excluir:
  - `/admin`.
  - rutas de confirmacion privadas/efimeras si no aportan SEO.
  - staging si base URL indica staging.
- Si API/DB no disponible en build:
  - fallback a rutas estaticas y documentar que productos/eventos se incluiran cuando haya datos.
- Script npm recomendado:
  - `npm run seo:sitemap`.

Robots:
- Production:
  - allow public.
  - include sitemap URL si `PUBLIC_BASE_URL` existe.
- Staging:
  - noindex/bloqueo documentado.
  - si se genera robots por env, usar `NODE_ENV`/`PUBLIC_BASE_URL`/`STAGING_BASE_URL`.
- No bloquear assets necesarios.

Prerender:
- Objetivo:
  - mejorar SEO de catalogo/PDP/eventos sin migrar stack.
- Rutas:
  - `/`
  - `/catalogo`
  - `/catalogo/quesos`
  - `/catalogo/vinos`
  - `/catalogo/temporada`
  - PDP activos si datos disponibles.
  - eventos activos/futuros si datos disponibles.
- Implementacion:
  - usar plugin pequeno o script propio si encaja.
  - no introducir Next.js.
  - no romper Vite build.
  - si no hay API/DB disponible, dejar prerender estatico minimo y documentar pendiente.
- Script recomendado:
  - `npm run prerender`.
- `npm run build` debe integrar o documentar paso.

Tests obligatorios:
1. Legal:
   - rutas legales renderizan.
   - aviso de revision legal existe.
   - +18/no venta online alcohol aparece.

2. Cookies:
   - banner muestra Aceptar/Rechazar/Configurar.
   - botones tienen peso visual equivalente razonable.
   - aceptar guarda analiticas/marketing.
   - rechazar bloquea analiticas/marketing.
   - configurar guarda seleccion.
   - `/cookies` permite reabrir configuracion.

3. Analytics:
   - no inyecta GA4/Pixel antes de consentimiento.
   - `select_item` noop antes de consentimiento.
   - aceptar analiticas permite GA4.
   - aceptar marketing permite Pixel.
   - rechazar no dispara no esenciales.
   - no se envia PII en eventos probados.

4. SEO/schema:
   - Home JSON-LD existe.
   - PDP Product JSON-LD existe.
   - Event JSON-LD existe.
   - meta title/description existe.
   - Open Graph tags existen.

5. Sitemap/robots:
   - sitemap incluye rutas estaticas.
   - sitemap incluye producto/evento seed si datos disponibles.
   - sitemap excluye `/admin`.
   - robots production incluye sitemap.
   - staging noindex/bloqueo documentado o generado.

Prohibido en esta fase:
- No cargar GA4/Pixel antes de consentimiento.
- No hardcodear IDs reales de GA/Meta.
- No afirmar cumplimiento legal definitivo.
- No inventar datos legales reales.
- No activar venta online de alcohol.
- No activar pagos.
- No migrar a Next.js.
- No introducir un CMP externo pesado sin justificacion.
- No romper cookie banner existente ni public site.
- No usar TypeScript.

Actualizacion del estado vivo:
Al terminar, actualiza solo la seccion `0.1 Estado vivo del proyecto` de `docs/V1/V1Tecnico.md`:
- `last_updated`
- `current_phase`: 12
- `current_phase_name`: "Legal, cookies, SEO, analytics y prerender"
- `current_focus`: resumen real de legal, consent, analytics, SEO, sitemap, robots, prerender y tests
- `overall_status`: `REVIEW_READY` si build/tests/lint pasan; `IN_PROGRESS` si queda API/prerender/legal pendiente; `BLOCKED` si falta decision critica
- tabla de Fase 12 con implementado/falta/notas reales
- tabla de Fase 13 como siguiente fase si Fase 12 queda lista
- funcionalidades implementadas: anade solo legal/cookies/SEO/analytics/prerender si estan verificados
- quita de pendientes criticos solo lo realmente implementado y probado
- registro de sesion con fecha y verificacion
- siguiente prompt recomendado: "Fase 13 - Testing E2E, accesibilidad, performance y QA" si Fase 12 queda lista
- checklist final: marca legal, cookies, analytics gated, schema, sitemap/robots y prerender solo si tests pasan

Si cambias estado, rutas, SEO o consent que afecte al roadmap visual, actualiza tambien `docs/V1/v1TecnicoVisual.html`.

Criterios de aceptacion:
- Legal pages existen y avisan de revision legal pendiente.
- Cookie banner cumple estructura AEPD: Aceptar/Rechazar/Configurar con peso equivalente.
- No se cargan cookies/scripts no esenciales antes de consentimiento.
- GA4 y Meta Pixel estan gated por consentimiento correcto.
- Consent se persiste y se envia a backend si endpoint disponible.
- `/cookies` permite revisar/cambiar configuracion.
- Meta tags, OG/Twitter y schema existen en paginas clave.
- Sitemap y robots existen o se generan por script.
- Staging puede bloquearse/noindex.
- Prerender de rutas clave existe o queda documentado como pendiente si faltan datos/API.
- Espanol claro y traducible.
- `npm run build` pasa.
- `npm test` pasa.
- `npm run lint` pasa si existe.
- `docs/AGENTS_Javi.md` no se modifica.

Verificacion obligatoria:
- Ejecuta `npm run build`.
- Ejecuta `npm test`.
- Ejecuta `npm run lint` si existe.
- Ejecuta `npm run seo:sitemap` si existe.
- Ejecuta `npm run prerender` si existe.
- Ejecuta smoke local de legal/cookies/Home/PDP/Event si se puede sin dejar procesos vivos.
- Revisa que no se inyectan GA4/Pixel antes de consentimiento.
- Revisa que no hay IDs reales hardcodeados ni datos legales inventados como definitivos.
- Ejecuta `git status --short`.
- Lista archivos creados/modificados.
- Reporta cualquier verificacion no ejecutada y el motivo real.

Respuesta final:
- Resumen de Fase 12.
- Legal/cookies/SEO/analytics/prerender implementados.
- Archivos creados/modificados.
- Verificacion ejecutada y resultado.
- Estado vivo actualizado o motivo si no se pudo.
- Riesgos o pendientes reales.
- Siguiente prompt recomendado.
```

## 22. Fase 13 - Testing E2E, accesibilidad, performance y QA

Objetivo: validar V1 end-to-end antes de contenido real y launch.

Entregables:
- Playwright
- E2E criticos
- Axe/a11y
- Lighthouse scripts
- QA checklist

Prompt para Opus:

```text
Usa el Prompt base minimo y fijo.

Implementa la Fase 13: test suite E2E, accesibilidad, performance y QA.

Objetivo de esta fase:
Crear y ejecutar la suite de QA de CRUDO V1 antes de contenido real y launch: tests backend/frontend consolidados, Playwright E2E, accesibilidad con axe, Lighthouse/performance scripts, fixtures de test, mocks seguros para proveedores externos y checklist manual de dispositivos. Esta fase debe corregir fallos criticos que aparezcan; no limitarse a documentarlos si son bloqueantes.

Contexto obligatorio:
- Fases 1-12 deberian estar implementadas o en estado verificable.
- Stack: Node/Express/MariaDB + React/Vite.
- Reglas criticas:
  - No pago online.
  - No venta online de alcohol.
  - Vino visible pero WhatsApp-only.
  - `POST /api/v1/pickup-orders` rechaza alcohol con 422.
  - Cookie consent bloquea GA4/Pixel hasta consentimiento.
  - Admin mobile <= 5 min/dia.
- No depender de servicios externos reales para E2E: Brevo/WhatsApp/GA4/Meta deben ser mock/noop.

Antes de editar:
1. Lee `docs/V1/V1Tecnico.md`, especialmente `0.1 Estado vivo del proyecto`.
2. Inspecciona:
   - `package.json`
   - `vitest.config.*` si existe
   - `playwright.config.*` si existe
   - `tests/`
   - `src/**/*.test.*`
   - `server/**/*.test.*`
   - `db/`
   - `docs/runbook.md`
   - `.github/workflows/`
   - `git status --short`
3. Ejecuta primero las pruebas existentes para tener baseline si el entorno lo permite.
4. No modifiques `docs/AGENTS_Javi.md`.
5. No usar TypeScript si el repo esta en JavaScript.

Archivos a crear o actualizar:
1. Config:
   - `playwright.config.js`
   - `vitest.config.js` si falta o necesita jsdom/node split.
   - `tests/setup/` para setup comun.

2. E2E:
   - `tests/e2e/public-pickup.spec.js`
   - `tests/e2e/wine-whatsapp.spec.js`
   - `tests/e2e/events.spec.js`
   - `tests/e2e/contact-newsletter.spec.js`
   - `tests/e2e/admin-mobile.spec.js`
   - `tests/e2e/cookies.spec.js`

3. Fixtures/helpers:
   - `tests/fixtures/products.js`
   - `tests/fixtures/events.js`
   - `tests/fixtures/admin.js`
   - `tests/helpers/e2e-db.js`
   - `tests/helpers/mock-providers.js`
   - `tests/helpers/test-server.js` si hace falta.

4. A11y/performance:
   - `tests/a11y/a11y.spec.js` o tests axe integrados.
   - `scripts/lighthouse.js` o `docs/lighthouse.md` si no se automatiza.
   - `docs/qa-checklist.md` o seccion en `docs/runbook.md`.

5. Docs/scripts:
   - actualizar `package.json`.
   - actualizar `docs/runbook.md`.
   - actualizar CI si procede.

Scripts npm objetivo:
- `npm test`: unit/integration estable.
- `npm run test:backend` si separa backend.
- `npm run test:frontend` si separa frontend.
- `npm run test:e2e`: Playwright.
- `npm run test:a11y`: axe si separado.
- `npm run test:all`: lint + tests + build + e2e si razonable.
- `npm run lighthouse`: si se automatiza.
- `npm run build`.
- `npm run lint`.

Backend tests minimos:
1. Unit/service:
   - price calc.
   - slug generation si existe.
   - pickup validation.
   - alcohol guard.
   - idempotency.
   - consent expiry/hash.
   - auth/JWT.

2. Repository/service con MariaDB test:
   - products/categories.
   - events/reservations.
   - pickup orders/items.
   - admin user/audit.

3. Route tests:
   - public GET happy paths.
   - POST reservation happy/error.
   - POST inquiry/newsletter/consent.
   - POST pickup happy.
   - POST pickup alcohol -> 422.
   - admin endpoints reject unauthenticated.
   - admin login happy/error.

4. Security/regression:
   - no secrets in responses.
   - admin protected.
   - public endpoints remain public.
   - Stripe/payment endpoints not active.

Frontend tests minimos:
- ProductCard.
- ProductPage wine WhatsApp-only.
- ProductPage no alcohol AddToTabla.
- Tabla store rejects alcohol.
- PickupForm validation/submission/errors.
- ReservationForm validation/submission.
- ContactForm/WholesaleForm.
- NewsletterForm.
- CookieBanner/Consent.
- Admin login/protected route/dashboard actions.
- Legal routes render.
- Schema JSON-LD.
- axe smoke en Home, PDP, Mi Tabla, Contacto y Admin dashboard si posible.

Playwright journeys obligatorios:
1. Pickup no alcohol:
   - Home -> Catalogo -> cheese/no alcohol PDP -> add to tabla -> submit pickup -> confirmation.
   - Assert no payment language.
   - Assert WhatsApp <24h message.

2. Wine WhatsApp-only:
   - Catalogo/PDP vino -> no `Anadir a mi tabla`.
   - `Preguntanos por WhatsApp` visible.
   - Assert `wa.me/...` with product name prefilled.

3. Alcohol guard full stack:
   - Si se puede manipular localStorage/API para meter wine en tabla, submit debe terminar en safe error/422 and no success.
   - Backend route 422 probado aunque UI bloquee.

4. Event reservation:
   - Event detail -> reserve seat -> confirmation.
   - Full event state if fixture exists.

5. Contact/wholesale/newsletter:
   - Contact form submit.
   - Wholesale form submit.
   - Newsletter subscribe with double opt-in mocked/noop.

6. Cookie consent:
   - Before consent, no GA4/Pixel scripts.
   - Accept analytics -> GA allowed.
   - Reject -> non-essential remains blocked.
   - Configure -> partial consent works.

7. Admin mobile:
   - Login.
   - Dashboard loads.
   - Create/edit product with `type=WINE` and `is_alcohol=true`.
   - Public catalog/PDP shows WhatsApp CTA and no Mi Tabla.
   - Quick stock action.

8. Legal/SEO smoke:
   - legal pages render.
   - sitemap/robots accessible if served.

Fixtures and DB:
- Tests should use test DB, not development/production DB.
- Required fixtures:
  - at least 1 cheese/no alcohol active.
  - at least 1 wine active with `is_alcohol=true`.
  - at least 1 seasonal product.
  - at least 1 future event.
  - admin user test.
- Seed must be deterministic.
- Do not run dev seeds in production.
- If MariaDB is unavailable:
  - run non-DB tests.
  - mark DB/E2E blocked, not DONE.

External providers:
- WhatsApp:
  - never send real messages in tests.
  - assert link href/prefill.
- Brevo:
  - noop/mock.
- GA4/Meta:
  - mock script injection/events.
  - no real network.
- Maps:
  - assert link URL, no need to load Google Maps iframe in E2E.

Accessibility:
- Configure axe where practical.
- Test:
  - Home.
  - Catalog/PDP.
  - Mi Tabla form.
  - Event reservation form.
  - Contact form.
  - Cookie settings.
  - Admin dashboard.
- Fail on serious/critical violations unless justified.
- Manual checks:
  - keyboard nav.
  - focus visible.
  - labels/errors.
  - tap target >= 44px.

Lighthouse/performance:
- Provide script or documented command for:
  - Home.
  - Catalogo.
  - PDP.
  - Event detail.
- Targets:
  - Performance mobile >= 90 where realistic with local assets.
  - Accessibility >= 95.
  - SEO >= 95/100.
  - Best Practices >= 90.
- If local environment or placeholders prevent target, document exact reason and remediation.

Manual QA checklist:
- iPhone Safari.
- Instagram in-app browser.
- Android Chrome.
- iPad/tablet.
- Desktop Chrome.
- Desktop Safari.
- Desktop Firefox.
- Slow 3G / throttled network.
- Broken network in all forms.
- Cookie consent flows.
- Wine WhatsApp path.
- Mi Tabla no alcohol path.
- Admin mobile morning routine.
- Legal pages.
- Lighthouse Home/Catalog/PDP.

CI:
- Update PR workflow if safe:
  - npm ci.
  - lint.
  - unit/integration tests.
  - build.
  - optional Playwright with browser install/cache.
- If E2E requires MariaDB service, configure it or document why manual for now.
- Do not add secrets.

Prohibido en esta fase:
- No relajar alcohol guard tests.
- No saltarse failing tests sin documentar causa real.
- No hacer tests que dependan de servicios externos reales.
- No meter credenciales reales.
- No activar pagos.
- No introducir TypeScript.
- No cambiar arquitectura para facilitar tests si rompe fases previas.
- No marcar DONE con E2E criticos rojos.

Correccion de fallos:
- Si los tests descubren bugs criticos de V1, corrige en el codigo.
- Prioridad de fixes:
  1. alcohol guard backend/frontend.
  2. pagos online accidentales.
  3. cookie consent/GA4/Pixel.
  4. admin auth.
  5. forms que pierden datos o confirman falsamente.
  6. a11y critical.
  7. build/lint failures.
- Mantener fixes acotados y documentar cualquier deuda.

Actualizacion del estado vivo:
Al terminar, actualiza solo la seccion `0.1 Estado vivo del proyecto` de `docs/V1/V1Tecnico.md`:
- `last_updated`
- `current_phase`: 13
- `current_phase_name`: "Testing E2E, accesibilidad, performance y QA"
- `current_focus`: resumen real de tests, E2E, a11y, Lighthouse, QA checklist y bugs corregidos
- `overall_status`: `REVIEW_READY` si suite critica pasa; `IN_PROGRESS` si quedan tests no criticos; `BLOCKED` si falta DB/browser/decision critica
- tabla de Fase 13 con implementado/falta/notas reales
- tabla de Fase 14 como siguiente fase si Fase 13 queda lista
- funcionalidades implementadas: anade solo test/QA infra y fixes reales
- quita de pendientes criticos solo lo realmente probado
- registro de sesion con fecha y verificacion
- siguiente prompt recomendado: "Fase 14 - Contenido real, imagenes y carga inicial" si Fase 13 queda lista
- checklist final: marca tests/E2E/a11y/Lighthouse/iPhone-IG solo si realmente verificado

Si cambias estado, tests o QA que afecte al roadmap visual, actualiza tambien `docs/V1/v1TecnicoVisual.html`.

Criterios de aceptacion:
- `npm run build` pasa.
- `npm run lint` pasa si existe.
- `npm test` pasa.
- Playwright instalado/configurado.
- E2E criticos pasan o estan bloqueados por causa externa documentada.
- Alcohol guard probado backend + frontend + E2E.
- Cookie consent probado.
- Admin mobile probado.
- a11y critical/serious sin fallos sin justificar.
- Lighthouse commands disponibles y resultado documentado.
- QA checklist manual creado/actualizado.
- No hay dependencia de servicios externos reales.
- `docs/AGENTS_Javi.md` no se modifica.

Verificacion obligatoria:
- Ejecuta `npm run build`.
- Ejecuta `npm run lint` si existe.
- Ejecuta `npm test`.
- Ejecuta `npm run test:e2e` si Playwright y entorno estan disponibles.
- Ejecuta `npm run test:a11y` si existe.
- Ejecuta `npm run lighthouse` si existe o documenta comando manual.
- Ejecuta `git status --short`.
- Lista archivos creados/modificados.
- Reporta cualquier verificacion no ejecutada y el motivo real.

Respuesta final:
- Resumen de Fase 13.
- Tests/QA implementados.
- Bugs corregidos si hubo.
- Archivos creados/modificados.
- Verificacion ejecutada y resultado.
- Estado vivo actualizado o motivo si no se pudo.
- Riesgos o pendientes reales.
- Siguiente prompt recomendado.
```

## 23. Fase 14 - Contenido real, imagenes y carga inicial

Objetivo: reemplazar placeholders por contenido real y preparar launch.

Entregables:
- 20-40 productos cargados
- Imagenes optimizadas
- 3 eventos
- Campana activa
- Copy real
- Legal revisado como pendiente de abogado si aplica

Prompt para Opus:

```text
Usa el Prompt base minimo y fijo.

Implementa la Fase 14: carga de contenido real y preparacion visual.

Objetivo de esta fase:
Cargar y preparar el contenido real de CRUDO V1 para launch: productos, imagenes, eventos, campana activa, copy publico y checklist de contenido. Esta fase debe reemplazar placeholders solo cuando existan datos/assets reales confirmados, documentar lo pendiente y verificar que las reglas criticas siguen intactas: vino visible pero WhatsApp-only, no alcohol en Mi Tabla, sin pago online.

Contexto obligatorio:
- Fases 8-12 deben haber dejado frontend publico, SEO/legal/cookies y rutas principales.
- Fase 2/3/5 deben permitir cargar productos/eventos/campanas via seeds/scripts/admin/API.
- Fuente visual y producto:
  - `docs/V1/CRUDO_V1_Visual_Master_Plan.html`
  - `docs/content-checklist.md`
  - assets reales disponibles en repo o carpeta indicada por el owner.
- Idioma visible: espanol simple, compatible con Google Translate.
- No inventar datos reales del owner.
- No publicar placeholders como si fueran contenido real.

Antes de editar:
1. Lee `docs/V1/V1Tecnico.md`, especialmente `0.1 Estado vivo del proyecto`.
2. Lee `docs/content-checklist.md`.
3. Inspecciona:
   - assets reales disponibles (`assets/`, `public/`, `uploads/`, `images/` u otra carpeta existente).
   - `db/seeds/`
   - scripts de importacion si existen.
   - `src/pages/HomePage.jsx`
   - `src/components/home/`
   - `src/lib/mockData.js` si existe.
   - admin/product data existing fixtures.
   - `docs/runbook.md`
   - `package.json`
   - `git status --short`
4. Clasifica contenido como:
   - real confirmado.
   - placeholder visible.
   - placeholder no publicado.
   - pendiente owner.
5. No modifiques `docs/AGENTS_Javi.md`.
6. No borres assets no usados sin confirmacion.

Fuentes de contenido aceptadas:
- CSV/JSON/Markdown proporcionado por owner.
- Imagenes reales del repo.
- Datos ya cargados en DB local/admin.
- Copy aprobado en docs.
- Si no hay datos reales suficientes, crear plantillas y placeholders claramente marcados, no contenido falso.

Productos:
- Objetivo: 20-40 productos si hay contenido real.
- Campos obligatorios:
  - `name`
  - `slug`
  - `type`: `CHEESE`, `WINE`, `OTHER`
  - `is_alcohol`
  - `price_cents`
  - `vat_rate`
  - `short_desc`
  - `long_desc`
  - `producer`
  - `region`
  - `is_seasonal`
  - `is_featured`
  - `is_active`
  - `stock_status`
  - categorias
  - imagen primaria con alt text
- Reglas:
  - Todo `type=WINE` debe tener `is_alcohol=true` salvo excepcion documentada.
  - Quesos/no alcohol deben tener `is_alcohol=false`.
  - Slugs estables y sin acentos.
  - Precios en centimos.
  - No cargar productos con precio/descripciones inventadas como reales.
- Si no hay CSV/JSON:
  - crear `docs/product-import-template.csv`.
  - documentar columnas y ejemplo ficticio claramente marcado.

Imagenes:
- **Fuente autoritativa**: `§7.bis Inventario visual de assets reales` en `docs/V1/V1Tecnico.md`. Antes de cargar nada nuevo, mapear todos los assets ya existentes en `images/` y `docs/V1/Photos/` segun ese indice.
- Clasificar:
  - producto 1:1.
  - hero desktop 16:9.
  - hero mobile 9:16.
  - lifestyle.
  - owner/interior.
  - eventos.
  - OG/social 1200x630 (16:9 social-safe).
  - brand (logos, sticker, mascotas).
- Optimizar solo copias generadas, no destruir originales.
- Formatos:
  - WebP si pipeline existe.
  - AVIF opcional si ya existe soporte.
  - conservar fallback jpg/png si hace falta.
- Requisitos:
  - product minimo recomendado 1600x1600 origen si existe.
  - hero desktop 16:9.
  - hero mobile 9:16.
  - OG 1200x630 absolutos.
  - alt text descriptivo en espanol.
  - no texto incrustado en imagen.
  - no imagenes gigantes sin compresion.
- Pipeline `scripts/optimize-images.js` (a crear en esta fase):
  - Input: `public/img/_originals/` (copia de `images/` + subset de `docs/V1/Photos/`).
  - Output: `public/img/{hero,lifestyle,products,about,events,brand,og}/` con WebP @1x y @2x + JPG fallback.
  - Aplicar rotacion EXIF al exportar (los originales de `docs/V1/Photos/` tienen `Orientation=6`).
  - Stripping de metadata GPS y autor (privacidad).
  - Dependencia: `sharp` (devDependency).
  - Script invocable con `npm run img:optimize`.
- Naming semantico kebab-case obligatorio (`hero-home-cheeseboard.webp`, no `IMG_1582.webp`).
- Mapeo origen -> destino recomendado:
  - `images/Gemini_Generated_Image_149guw149guw149g.png` -> `hero/hero-home-cheeseboard.{webp,jpg}`
  - `docs/V1/Photos/IMG_1582 2.jpeg` -> `lifestyle/tabla-quesos-vino.{webp,jpg}`
  - `docs/V1/Photos/IMG_0205 2.JPG` -> `lifestyle/bodegon-cartel-crudo.{webp,jpg}`
  - `docs/V1/Photos/IMG_0206 2.JPG` -> `lifestyle/bodegon-cartel-crudo-2.{webp,jpg}`
  - `docs/V1/Photos/IMG_0207 2.JPG` -> `lifestyle/bodegon-cartel-crudo-3.{webp,jpg}`
  - `docs/V1/Photos/IMG_1117 2.jpeg` -> `lifestyle/vino-natural-mano.{webp,jpg}`
  - `docs/V1/Photos/IMG_1118 2.jpeg` -> `lifestyle/vino-natural-mano-2.{webp,jpg}`
  - `docs/V1/Photos/IMG_8952 2.JPG` -> `about/mostrador-quesera.{webp,jpg}`
  - `docs/V1/Photos/IMG_8953 2.JPG` -> `about/mostrador-vino.{webp,jpg}`
  - `docs/V1/Photos/IMG_8954 2.JPG` -> `about/owner-mostrador.{webp,jpg}`
  - `docs/V1/Photos/IMG_8956 2.JPG` -> `brand/copas-sticker-crudo.{webp,jpg}`
  - `docs/V1/Photos/IMG_8957 2.JPG` -> `brand/copas-sticker-crudo-2.{webp,jpg}`
  - `docs/V1/Photos/IMG_9525 2.JPG` -> `lifestyle/cata-vinos-naturales.{webp,jpg}`
  - `docs/V1/Photos/IMG_9526 2.JPG` -> `lifestyle/cata-vinos-naturales-2.{webp,jpg}`
  - `docs/V1/Photos/IMG_9527 2.JPG` -> `lifestyle/cata-vinos-naturales-3.{webp,jpg}`
  - `docs/V1/Photos/IMG_9528 2.JPG` -> `lifestyle/cata-vinos-naturales-4.{webp,jpg}`
  - `docs/V1/Photos/IMG_9602 2.JPG` -> `lifestyle/vino-natural-penedes.{webp,jpg}`
  - `docs/V1/Crudo/Logo Crudo - PNG - Blanco.png` -> `brand/logo-blanco.png` (mantener PNG por transparencia).
  - `docs/V1/Crudo/Logo Crudo - PNG - Negro.png` -> `brand/logo-negro.png`.
  - `docs/V1/Crudo/Crudo_Texto.png` -> `brand/logo-texto.png`.
  - `docs/V1/Crudo/1.01 - Animales Queseros.png` -> `brand/animal-quesero-1.png`.
  - `docs/V1/Crudo/2.01 - Animales Queseros.png` -> `brand/animal-quesero-2.png`.
- OG variants (1200x630) generados desde:
  - `og/og-home.jpg` <- recorte de Gemini hero.
  - `og/og-catalogo.jpg`, `og/og-catalogo-quesos.jpg` <- recorte IMG_1582.
  - `og/og-catalogo-vinos.jpg`, `og/og-eventos.jpg` <- recorte IMG_9525.
  - `og/og-sobre.jpg` <- recorte IMG_8954.
  - `og/og-contacto.jpg` <- recorte IMG_0205 (cartel CRUDO visible).
  - `og/og-mayoristas.jpg` <- recorte IMG_1117.
- Verificacion EXIF rotation: testear que las copias en `public/img/lifestyle/` y `about/` salen con orientacion correcta (no rotadas 90deg).
- Si pipeline `sharp` no se puede instalar en esta fase: documentar comando pendiente y dejar JPG/PNG sin optimizar pero con naming semantico correcto.

Eventos:
- Cargar 3 eventos iniciales si hay datos reales:
  - title.
  - slug.
  - description_md.
  - hero_image_url.
  - starts_at.
  - ends_at.
  - capacity.
  - price_cents.
  - location.
  - is_active.
- Si no hay eventos reales:
  - crear placeholders no publicados (`is_active=false`) o plantilla `docs/event-import-template.csv`.
  - no mostrar eventos inventados como activos.

Campana activa:
- Crear una campana de temporada solo si hay productos/copy reales suficientes.
- Si no hay copy real:
  - crear placeholder no activo.
  - documentar pendiente.
- Debe asociar productos activos y coherentes.

Home/copy:
- Ajustar Home con copy real si existe:
  - H1 max 6 palabras.
  - subtitle 1 frase.
  - section eyebrows claros.
  - CTAs reales.
- Copy en espanol:
  - simple.
  - traducible.
  - sin expresiones opacas.
  - sin ingles visible.
- No prometer ecommerce, delivery, pagos online ni venta online de alcohol.
- Mantener tono editorial CRUDO, no plantilla generica.

Legal:
- Si hay datos legales reales, rellenar placeholders con cuidado.
- Si no hay revision de abogado:
  - mantener aviso de revision legal pendiente.
  - no marcar legal como DONE.

Mock data:
- Si existen mocks temporales:
  - reemplazarlos por API/seed real si es posible.
  - si siguen siendo necesarios, dejarlos aislados y documentados.
- No dejar mocks mezclados con datos reales sin etiqueta.

Scripts/import:
- Si existe pipeline DB:
  - crear o actualizar `db/seeds/content-seed.js` o script equivalente para contenido real/staging.
  - asegurar que no se ejecuta automaticamente en production sin confirmacion.
- Si se importa CSV:
  - validar columnas.
  - validar `is_alcohol`.
  - validar precios.
  - dry-run si es posible.
- Documentar comandos en runbook.

Tests/verificaciones obligatorias:
- Productos:
  - hay suficientes productos activos si se cargaron reales.
  - vinos tienen `is_alcohol=true`.
  - no alcohol tiene `is_alcohol=false`.
  - slugs unicos.
  - imagen primaria/alt text si existe.
- Frontend:
  - Home no parece plantilla generica.
  - Catalogo muestra productos.
  - PDP vino muestra WhatsApp-only.
  - PDP queso/no alcohol muestra Mi Tabla.
  - no hay texto publico en ingles.
- Performance:
  - imagenes no son desproporcionadamente grandes.
  - aspect ratios estables.
- Legal/content:
  - placeholders pendientes documentados.
  - legal pendiente de abogado si aplica.

Prohibido en esta fase:
- No inventar contenido real.
- No publicar placeholders como reales.
- No cambiar reglas de alcohol.
- No activar pagos online.
- No permitir vino en Mi Tabla.
- No borrar assets originales sin confirmacion.
- No ejecutar seeds de contenido real en production.
- No usar imagenes con texto incrustado como fuente principal de copy.
- No meter datos personales privados del owner sin confirmacion.

Actualizacion del estado vivo:
Al terminar, actualiza solo la seccion `0.1 Estado vivo del proyecto` de `docs/V1/V1Tecnico.md`:
- `last_updated`
- `current_phase`: 14
- `current_phase_name`: "Contenido real, imagenes y carga inicial"
- `current_focus`: resumen real de productos, imagenes, eventos, campana, copy, legal y pendientes owner
- `overall_status`: `REVIEW_READY` si contenido real suficiente y build/tests pasan; `IN_PROGRESS` si faltan assets/copy; `BLOCKED` si falta contenido owner critico
- tabla de Fase 14 con implementado/falta/notas reales
- tabla de Fase 15 como siguiente fase si Fase 14 queda lista
- funcionalidades implementadas: anade solo contenido/carga/assets reales verificados
- quita de pendientes criticos solo lo realmente completado
- registro de sesion con fecha y verificacion
- siguiente prompt recomendado: "Fase 15 - Launch, staging y production" si Fase 14 queda lista
- checklist final: marca contenido real, imagenes, productos, eventos y copy solo si estan verificados

Si cambias estado, contenido o visual que afecte al roadmap visual, actualiza tambien `docs/V1/v1TecnicoVisual.html`.

Criterios de aceptacion:
- Home no parece plantilla generica.
- Catalogo tiene productos reales suficientes o placeholders no publicados documentados.
- Imagenes estan optimizadas o pendientes documentadas.
- Vinos aparecen en catalogo/PDP pero solo con WhatsApp.
- Productos no alcoholicos mantienen Mi Tabla.
- No hay texto ingles visible en public.
- Los placeholders pendientes estan documentados y no se confunden con contenido real.
- `docs/content-checklist.md` queda actualizado.
- `npm run build` pasa.
- `npm test` pasa.
- `npm run lint` pasa si existe.
- `docs/AGENTS_Javi.md` no se modifica.

Verificacion obligatoria:
- Ejecuta import/seed de contenido en local/staging si existe y es seguro.
- Ejecuta `npm run build`.
- Ejecuta `npm test`.
- Ejecuta `npm run lint` si existe.
- Ejecuta smoke local de Home/Catalogo/PDP vino/PDP no alcohol si se puede sin dejar procesos vivos.
- Revisa tamanos/formato de imagenes incorporadas.
- Revisa que no hay texto ingles visible en public.
- Revisa que no hay vino en Mi Tabla.
- Ejecuta `git status --short`.
- Lista archivos creados/modificados.
- Reporta cualquier verificacion no ejecutada y el motivo real.

Respuesta final:
- Resumen de Fase 14.
- Contenido/assets cargados o pendientes.
- Archivos creados/modificados.
- Verificacion ejecutada y resultado.
- Estado vivo actualizado o motivo si no se pudo.
- Riesgos o pendientes reales.
- Siguiente prompt recomendado.
```

## 24. Fase 15 - Launch, staging y production

Objetivo: desplegar con control, medicion y rollback.

Entregables:
- Staging
- Production manual deploy
- Plesk domain/app config
- HTTPS
- Backups
- Monitoring
- Launch checklist

Prompt para Opus:

```text
Usa el Prompt base minimo y fijo.

Implementa la Fase 15: staging, production y launch readiness.

Objetivo de esta fase:
Preparar CRUDO V1 para lanzamiento controlado: staging protegido, production en Contabo/Plesk, HTTPS, variables de entorno, backups, restore test, monitoring, smoke tests, checklist T-7/T-0/T+7, rollback y handoff al owner. Esta fase puede documentar pasos manuales y generar runbooks/scripts, pero no debe ejecutar deploy real ni pedir credenciales.

Contexto obligatorio:
- Fases 1-14 deben estar `REVIEW_READY` o `DONE` antes de production.
- Infra objetivo: servidor Contabo gestionado con Plesk.
- App objetivo: monolito CommonJS con `server.js`, API `/api/v1`, Vite build en `dist/`.
- MariaDB gestionada desde Plesk/Contabo.
- Uploads locales/Plesk para V1.
- Dominio final puede seguir pendiente; si falta, usar placeholders y marcar bloqueo.
- No exponer secretos ni copiarlos a docs.

Antes de editar:
1. Lee `docs/V1/V1Tecnico.md`, especialmente `0.1 Estado vivo del proyecto`.
2. Revisa:
   - `README.md`
   - `docs/runbook.md`
   - `infra/plesk/README.md`
   - `infra/scripts/backup-notes.md`
   - `.env.example`
   - `.github/workflows/`
   - `package.json`
   - `server.js`
   - `robots.txt`/sitemap/prerender si existen
   - `docs/content-checklist.md`
   - `git status --short`
3. Verifica si existen decisiones owner:
   - dominio final.
   - telefono WhatsApp publico.
   - email owner/publico.
   - horarios.
   - legal revisado.
   - Plesk/Contabo acceso disponible.
4. No modifiques `docs/AGENTS_Javi.md`.
5. No ejecutes deploy real ni comandos remotos sin instruccion explicita del owner.

Archivos a crear o actualizar:
- `docs/runbook.md`
- `infra/plesk/README.md`
- `infra/scripts/backup-notes.md`
- `infra/launch-checklist.md`
- `infra/rollback.md`
- `infra/smoke-tests.md`
- `.github/workflows/pr.yml`
- `.github/workflows/staging.yml` skeleton/manual si procede
- `.github/workflows/production.yml` manual skeleton si procede
- `.env.example` solo placeholders
- `docs/owner-admin-guide.md` si cambia handoff owner

Preflight tecnico:
- Ejecutar o documentar:
  - `npm ci` o `npm install`
  - `npm run lint`
  - `npm test`
  - `npm run build`
  - `npm run test:e2e` si existe
  - `npm run test:a11y` si existe
  - `npm run lighthouse` si existe
- No avanzar a production si:
  - alcohol guard falla.
  - cookie consent falla.
  - admin auth falla.
  - build falla.
  - legal/cookies no estan al menos preparados.
  - no hay backup/rollback documentado.

Staging:
- Preparar documentacion para:
  - subdominio `staging.<domain>`.
  - Plesk domain/subdomain.
  - SSL Let's Encrypt.
  - Node.js app con startup `server.js`.
  - env staging.
  - DB staging o DB local separada de production.
  - uploads staging.
  - basic-auth desde Plesk o proteccion equivalente.
  - `robots.txt` bloqueado/noindex.
  - meta noindex si procede.
- Staging debe permitir:
  - smoke test completo.
  - contenido real validable.
  - owner review.
  - legal/cookie validation.
- Nunca usar production DB como staging sin backup/decision explicita.

Production:
- Preparar documentacion para:
  - dominio canonico final.
  - redirects www/non-www.
  - SSL Let's Encrypt.
  - Node.js app en Plesk:
    - application root.
    - document root si aplica.
    - startup file `server.js`.
    - Node LTS.
    - variables de entorno.
  - `npm ci`/`npm install`.
  - `npm run build`.
  - `npm run db:migrate`.
  - restart app desde Plesk.
  - `dist/` servido por `server.js`.
  - uploads persistentes.
- Production no debe:
  - ejecutar seed dev.
  - exponer `.env`.
  - exponer stack traces.
  - indexar staging.

Variables de entorno:
- Documentar checklist Plesk para:
  - `NODE_ENV=production`
  - `PORT`
  - `PUBLIC_BASE_URL`
  - `CORS_ALLOWED_ORIGINS`
  - `DB_HOST`
  - `DB_PORT`
  - `DB_NAME`
  - `DB_USER`
  - `DB_PASSWORD`
  - `JWT_SECRET`
  - `COOKIE_SECRET`
  - `UPLOADS_DIR`
  - `BREVO_API_KEY`
  - `SMTP_*`
  - `OWNER_WHATSAPP`
  - `OWNER_EMAIL`
  - `VITE_*`
- No incluir valores reales.
- Indicar longitud/rotacion recomendada de secrets.

Backups:
- Plesk:
  - backup programado DB MariaDB.
  - backup archivos de app.
  - backup `uploads/`.
  - retencion recomendada 30 dias.
- Contabo:
  - snapshot/backup servidor si disponible.
- Restore test:
  - restaurar DB en staging/test.
  - restaurar uploads.
  - smoke `/api/v1/health`.
  - validar catalogo/PDP.
- Documentar responsable y frecuencia.
- No marcar backups como DONE sin restore test documentado o bloqueo claro.

Monitoring:
- Uptime:
  - UptimeRobot o equivalente.
  - endpoints:
    - `/api/v1/health`
    - Home.
- Error tracking:
  - Sentry opcional si se incorpora.
  - si no, documentar logs Plesk y revision manual inicial.
- Alertas:
  - email/Telegram/Slack si existe canal.
  - owner o maintainer.
- Logs:
  - no PII innecesaria.
  - no secrets.

Analytics/search:
- GA4:
  - verificar ID desde env.
  - eventos consent-aware.
  - no dispara antes de consentimiento.
- Search Console:
  - dominio canonical.
  - sitemap submit.
  - inspect URL launch day.
- Meta Pixel:
  - gated by marketing consent.
- Rich results:
  - validar schema Restaurant/Product/Event.
- Google Business Profile:
  - actualizar website link.
- Instagram:
  - actualizar bio @crudomov con dominio canonical.

CI/CD:
- PR workflow:
  - npm ci.
  - lint.
  - tests.
  - build.
- Staging:
  - manual deploy skeleton o documentar deploy manual Plesk.
  - no secrets reales.
- Production:
  - manual trigger skeleton o deploy manual documentado.
  - no auto-deploy a production sin aprobacion.
- Si SSH/deploy automatizado no esta decidido:
  - dejar placeholders y runbook manual.

Smoke tests:
- Crear checklist ejecutable:
  - `/api/v1/health`.
  - Home.
  - Catalogo.
  - PDP queso/no alcohol -> add Mi Tabla.
  - PDP vino -> WhatsApp only.
  - pickup submit no alcohol.
  - pickup alcohol 422 backend.
  - event reservation.
  - contact form.
  - newsletter.
  - cookie accept/reject/config.
  - legal pages.
  - admin login.
  - admin dashboard.
  - upload image if available.
  - sitemap.
  - robots.
  - 404.

Launch checklist T-7:
- Content real loaded or pending documented.
- Legal reviewed by lawyer or clearly pending/blocking.
- Cookie banner validated.
- GA4/Search Console/Meta Pixel configured.
- Schema validated.
- OG/Twitter preview.
- Favicon.
- 404.
- Robots/sitemap.
- Lighthouse.
- iPhone Safari.
- Instagram in-app browser.
- Android Chrome.
- WhatsApp links.
- Maps links.
- Backup restore test.
- Uptime monitor.
- DNS TTL 300s.
- Owner admin training.

Launch day T-0:
- Confirm backup before change.
- DNS cutover.
- HTTPS green.
- Smoke tests.
- Search Console inspect URL.
- Submit sitemap.
- Google Business Profile website link.
- Instagram bio @crudomov.
- Launch story/email if owner approves.
- Monitor logs/errors.
- Rollback ready.

Rollback:
- Documentar:
  - revert DNS if needed.
  - restore previous app build.
  - restore DB backup if migration issue.
  - disable pickup via config if critical order issue.
  - maintenance message if needed.
- Rollback decision triggers:
  - site down.
  - checkout/pickup broken.
  - alcohol guard broken.
  - admin inaccessible.
  - cookies/analytics illegal behavior.

Post-launch T+7:
- Review GA4 funnels.
- Search Console crawl/errors.
- Uptime/errors.
- owner retro.
- top 5 fixes.
- content gaps.
- first KPI snapshot:
  - pickup requests.
  - wine WhatsApp clicks.
  - event reservations.
  - newsletter subs.
  - maps clicks.

Prohibido en esta fase:
- No poner secretos en docs.
- No ejecutar deploy real sin aprobacion explicita.
- No usar production DB para pruebas destructivas.
- No ejecutar seeds dev en production.
- No marcar production ready si alcohol guard/cookies/admin auth fallan.
- No activar pagos online.
- No indexar staging.
- No automatizar production deploy sin decision owner.

Actualizacion del estado vivo:
Al terminar, actualiza solo la seccion `0.1 Estado vivo del proyecto` de `docs/V1/V1Tecnico.md`:
- `last_updated`
- `current_phase`: 15
- `current_phase_name`: "Launch, staging y production"
- `current_focus`: resumen real de staging, production, backups, monitoring, smoke tests, launch checklist y bloqueos
- `overall_status`: `REVIEW_READY` si runbooks/checklists/verificaciones estan listos; `IN_PROGRESS` si faltan decisiones; `BLOCKED` si faltan dominio/accesos/contenido/legal critico
- tabla de Fase 15 con implementado/falta/notas reales
- funcionalidades implementadas: anade solo launch readiness/staging/production docs reales
- quita pendientes criticos solo lo realmente completado
- registro de sesion con fecha y verificacion
- siguiente prompt recomendado: "Revision final de launch" o "Sincronizacion de estado vivo" segun estado
- checklist final: marca Plesk, Contabo, backups, CI, launch checklist, production solo si realmente verificado/documentado

Si cambias estado, infraestructura o launch checklist que afecte al roadmap visual, actualiza tambien `docs/V1/v1TecnicoVisual.html`.

Criterios de aceptacion:
- Runbook permite desplegar, verificar y restaurar.
- Staging queda definido y no indexa.
- Production queda definido sin exponer secrets.
- Plesk/Contabo documentados con pasos accionables.
- Backups y restore test documentados.
- Smoke tests definidos.
- Monitoring definido.
- Launch checklist T-7/T-0/T+7 lista.
- Rollback documentado.
- No hay secretos reales en docs/workflows.
- `npm run build`, `npm test` y checks disponibles pasan o bloqueos estan documentados.
- `docs/AGENTS_Javi.md` no se modifica.

Verificacion obligatoria:
- Ejecuta `npm run build`.
- Ejecuta `npm test`.
- Ejecuta `npm run lint` si existe.
- Ejecuta `npm run test:e2e` si existe y entorno disponible.
- Ejecuta `git status --short`.
- Revisa docs/workflows/env para confirmar que no hay secretos reales.
- Lista archivos creados/modificados.
- Reporta cualquier verificacion no ejecutada y el motivo real.

Respuesta final:
- Resumen de Fase 15.
- Staging/production/launch readiness preparado.
- Archivos creados/modificados.
- Verificacion ejecutada y resultado.
- Estado vivo actualizado o motivo si no se pudo.
- Bloqueos reales para launch.
- Siguiente prompt recomendado.
```

## 25. Prompts de revision por corte

Usar despues de cada 2-3 fases o antes de merge importante.

### Sincronizacion de estado vivo

Usar cuando no este claro por donde va el proyecto, despues de trabajar fuera de Opus, o antes de retomar una sesion tras varios dias.

```text
Usa el Prompt base minimo y fijo.

Sin implementar funcionalidades nuevas, sincroniza el estado vivo de `docs/V1/V1Tecnico.md` con el estado real del repositorio.

Tareas:
1. Lee `docs/V1/V1Tecnico.md`, especialmente la seccion `0.1 Estado vivo del proyecto`.
2. Inspecciona el repo:
   - estructura de carpetas
   - README y docs
   - server/
   - src/
   - infra/
   - .github/workflows/
   - package.json, scripts npm, migraciones SQL, validadores, tests
3. Detecta que fases estan realmente:
   - NOT_STARTED
   - IN_PROGRESS
   - BLOCKED
   - REVIEW_READY
   - DONE
4. No marques DONE nada que no tenga pruebas/build/verificacion documentada.
5. Actualiza solo:
   - `Estado actual resumido`
   - `Fases y progreso`
   - `Funcionalidades implementadas`
   - `Funcionalidades pendientes criticas de V1`
   - `Decisiones confirmadas`
   - `Bloqueos actuales`
   - `Pendientes de decision del owner`
   - `Registro de sesiones`
   - `Checklist final V1` si aplica
6. Si encuentras contradicciones entre codigo y documento, prioriza el estado real del codigo y deja nota.

Entrega:
- Resumen breve de la fase actual real.
- Lista de diferencias corregidas.
- Siguiente prompt recomendado para continuar.
```

### Revision de arquitectura

```text
Usa el Prompt base minimo y fijo.

Haz una revision critica de arquitectura del estado actual de CRUDO V1.

Busca:
- Desviaciones de `docs/V1/CRUDO_V1_Visual_Master_Plan.html`.
- Desviaciones de `docs/AGENTS_Javi.md`.
- Endpoints/rutas sin validacion centralizada.
- Reglas de validacion duplicadas entre frontend/backend sin justificacion.
- Entidades o tablas innecesarias de V2 metidas en V1.
- Riesgos de venta online de alcohol accidental.
- Falta de alcohol guard en backend.
- Complejidad excesiva para owner single-operator.
- Dependencias pesadas no justificadas.
- Secretos hardcodeados.
- Ausencia de tests en funcionalidades criticas.

Entrega:
- Findings por severidad con archivo/linea.
- Fixes concretos.
- Que corregiras ahora.
- Que queda como deuda aceptable.

Si encuentras problemas criticos, implementa las correcciones.
```

### Revision visual frontend

```text
Usa el Prompt base minimo y fijo.

Haz una revision visual y UX del frontend CRUDO V1.

Comprueba:
- Dark editorial gastronomy, no SaaS generico.
- Tokens exactos.
- No blanco puro, negro puro, azul, neon.
- H1/H2/H3 con Cormorant Garamond.
- Body Inter.
- Precios JetBrains Mono.
- Mobile-first.
- Tap targets >= 44x44.
- Sticky CTA no tapa footer/legal.
- Product cards con aspect-ratio fijo.
- Wine PDP solo WhatsApp.
- Cheese/no alcohol PDP con Mi Tabla.
- Formulario pickup con disclaimer de pago en tienda y 24h.
- Cookie banner con tres opciones equilibradas.
- Espanol visible correcto.
- Compatible con Google Translate.

Ejecuta capturas si Playwright esta configurado y corrige solapes, layout shifts o textos que no quepan.
```

### Revision seguridad/legal

```text
Usa el Prompt base minimo y fijo.

Haz una revision de seguridad, privacidad y cumplimiento para CRUDO V1.

Comprueba:
- No hay venta online de alcohol.
- No hay pago online.
- Backend rechaza alcohol en pickup.
- Cookies no esenciales bloqueadas hasta consentimiento.
- Consent log 24 meses.
- Admin JWT protege rutas.
- Passwords BCrypt.
- CORS limitado.
- Rate limiting en POST publicos.
- Honeypot/captcha o estrategia anti-spam.
- No secretos en repo.
- Legal pages existen.
- +18 y consumo responsable visible.
- Logs no imprimen PII innecesaria.
- Newsletter guarda consent_at e IP/source.

Implementa fixes criticos y deja lista de pendientes legales para abogado.
```

## 26. Definition of Done por feature

Cada fase o feature queda DONE solo si:

- Cumple el alcance V1.
- No introduce V2 salvo que sea estructura pasiva y justificada.
- El codigo respeta SRP y SOLID pragmatico.
- No hay secretos.
- Validadores actualizados antes de la ruta backend.
- Tests nuevos o actualizados.
- Backend: `npm run lint` y `npm test` pasan.
- Frontend: `npm run build` y tests pasan.
- scripts npm/MariaDB funciona si aplica.
- Docs actualizadas si hay cambio de comandos, env vars o arquitectura.
- `docs/V1/V1Tecnico.md` se actualiza en la seccion `0.1 Estado vivo del proyecto` con fase, implementado, pendiente, bloqueos, registro de sesion y siguiente prompt recomendado.
- El alcohol guard sigue cubierto por tests.
- La experiencia mobile no queda rota.
- Un staff engineer aprobaria la solucion.

## 27. Riesgos que Opus debe vigilar

- Meter Stripe/Redsys "porque es ecommerce": prohibido en V1.
- Permitir vino en Mi Tabla por reusar ProductCard: prohibido.
- Olvidar el bloqueo backend 422 y confiar solo en UI: prohibido.
- Convertir el admin en dashboard complejo: contrario al owner de 5 min/dia.
- Crear blog/CMS pesado: fuera de V1.
- Crear i18n completo: fuera de V1.
- Usar imagenes grandes sin pipeline: riesgo performance.
- Cargar GA4/Pixel antes del consentimiento: riesgo legal.
- Hacer SPA sin prerender de catalogo/PDP: riesgo SEO.
- Usar copy en imagenes: rompe Google Translate.
- Agregar dependencias grandes sin justificar.
- Ejecutar seeds de desarrollo en produccion Plesk.
- Depender de DNS/CDN/proxy/object storage externo como obligatorio cuando la decision actual es Plesk/Contabo.

## 28. Orden recomendado de ejecucion

1. Fase 0 - Preparacion.
2. Fase 1 - Backend scaffold.
3. Fase 2 - Modelo de datos.
4. Fase 3 - API publica.
5. Fase 4 - Mi Tabla backend y alcohol guard.
6. Fase 5 - Admin backend.
7. Fase 6 - scripts npm/MariaDB e infra Plesk/Contabo.
8. Fase 7 - Frontend scaffold/design system.
9. Fase 8 - Home/Catalogo/PDP.
10. Fase 9 - Mi Tabla frontend.
11. Fase 10 - Eventos/contacto/newsletter/sobre/mayoristas.
12. Fase 11 - Admin frontend.
13. Fase 12 - Legal/SEO/analytics/prerender.
14. Fase 13 - E2E/QA/performance.
15. Fase 14 - Contenido real.
16. Fase 15 - Launch.

Si solo hay un desarrollador, mantener backend hasta Fase 6 antes de construir frontend profundo. Si hay dos, backend Fases 1-5 y frontend Fases 7-8 pueden avanzar en paralelo tras cerrar validadores y responses iniciales.

## 29. Checklist final V1

- [ ] Home real con hero editorial, temporada, eventos, visit block.
- [ ] Catalogo filtrable.
- [ ] PDP producto.
- [ ] Vinos visibles con WhatsApp only.
- [ ] No alcohol con Mi Tabla.
- [ ] Backend 422 alcohol guard.
- [ ] Pickup flow sin pago online.
- [ ] Eventos y reservas.
- [ ] Contacto y Mayoristas.
- [ ] Newsletter Brevo/double opt-in.
- [ ] Admin JWT.
- [ ] Admin mobile <= 5 min/dia.
- [ ] Image upload local/Plesk adapter.
- [ ] Cookie banner AEPD.
- [ ] Legal pages.
- [ ] GA4, Search Console, Meta Pixel gated by consent.
- [ ] Events tracking.
- [ ] Schema.org Restaurant/Product/Event/FAQ.
- [ ] Sitemap/robots.
- [ ] Prerender catalogo/PDP.
- [ ] scripts npm/MariaDB.
- [ ] Plesk production configured.
- [ ] Contabo server ready.
- [ ] Backups.
- [ ] CI.
- [ ] Tests unit/integration/frontend/E2E.
- [ ] Lighthouse mobile >= 90.
- [ ] iPhone/Instagram browser tested.
- [ ] Launch checklist executed.



