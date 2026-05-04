# CRUDO - V1 Tecnico para Opus

Documento operativo para programar la V1 de CRUDO usando Claude Opus como agente de desarrollo.

Fuentes obligatorias:
- `docs/V1/CRUDO_V1_Visual_Master_Plan.html`
- `docs/AGENTS_Javi.md`

Este documento no sustituye a esas fuentes. Es una guia de ejecucion por fases con prompts copiables para que Opus implemente la web sin desviarse del alcance del V1.

## 0. Como usar este documento

1. Abre una sesion nueva de Opus por fase o subfase.
2. Pega siempre primero el **Prompt base obligatorio**.
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
last_updated: 2026-05-04
current_phase: 0
current_phase_name: "Preparacion, repo y contexto"
current_focus: "Documentacion tecnica V1 creada y organizada en docs/V1; todavia no se ha empezado a implementar codigo"
next_recommended_prompt: "Fase 0 - Preparacion, repo y contexto"
overall_status: "NOT_STARTED"
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
| 0 | Preparacion, repo y contexto | NOT_STARTED | `docs/V1/V1Tecnico.md`, `docs/V1/v1TecnicoVisual.html` y documentos V1 organizados en `docs/V1/` | Estructura repo de codigo, README, `.env.example`, docs base de implementacion | Sin bloqueos |
| 1 | Scaffold backend Spring Boot | NOT_STARTED | Nada | `api/`, Maven, OpenAPI inicial, profiles, tests smoke | Pendiente Fase 0 |
| 2 | Modelo de datos, Flyway y seed local | NOT_STARTED | Nada | Schema, entidades, repositories, seeds, tests | Pendiente Fase 1 |
| 3 | OpenAPI completo y servicios publicos | NOT_STARTED | Nada | Catalogo, campanas, eventos, inquiries, newsletter, consent, site config | Pendiente Fase 2 |
| 4 | Mi Tabla y alcohol guard | NOT_STARTED | Nada | Pickup backend, 422 alcohol, idempotency, notificaciones | Pendiente Fase 3 |
| 5 | Admin backend y seguridad JWT | NOT_STARTED | Nada | Auth, dashboard, CRUD admin, audit, storage | Pendiente Fase 4 |
| 6 | Docker Compose e infraestructura local | NOT_STARTED | Nada | Compose, Dockerfiles, Caddy, backup, CI | Puede avanzar tras backend scaffold |
| 7 | Scaffold frontend y design system | NOT_STARTED | Nada | Vite, rutas, tokens, layout, cookie banner base | Puede avanzar tras Fase 0 |
| 8 | Public frontend: Home, Catalogo y PDP | NOT_STARTED | Nada | Home, catalogo, PDP, vino WhatsApp-only, schema | Pendiente Fase 7 y API estable |
| 9 | Mi Tabla frontend y pickup flow | NOT_STARTED | Nada | Store, drawer, form, confirmacion, analytics | Pendiente Fase 8 y Fase 4 |
| 10 | Eventos, contacto, newsletter, sobre y mayoristas | NOT_STARTED | Nada | Rutas publicas secundarias y formularios | Pendiente Fase 3 y Fase 7 |
| 11 | Admin frontend movil | NOT_STARTED | Nada | Login, dashboard, CRUD UI, pedidos, consultas | Pendiente Fase 5 y Fase 7 |
| 12 | Legal, cookies, SEO, analytics y prerender | NOT_STARTED | Nada | Legal, consent, GA4/Pixel, sitemap, schema, prerender | Pendiente frontend publico |
| 13 | Testing E2E, accesibilidad, performance y QA | NOT_STARTED | Nada | Playwright, axe, Lighthouse, QA | Pendiente flujos principales |
| 14 | Contenido real, imagenes y carga inicial | NOT_STARTED | Nada | Productos, fotos, eventos, campana, copy | Bloqueado por contenido owner si no existe |
| 15 | Launch, staging y production | NOT_STARTED | Nada | Staging, production, monitoring, backups, checklist | Pendiente QA y dominio/infra |

### Funcionalidades implementadas

Actualizar esta lista al terminar cada sesion con codigo. Mantener bullets concretos y verificables.

- Ninguna funcionalidad de codigo implementada todavia.

### Funcionalidades pendientes criticas de V1

- Backend OpenAPI-first.
- Modelo de datos con `is_alcohol`.
- Alcohol guard backend con HTTP 422 en `POST /api/v1/pickup-orders`.
- Public frontend.
- `Mi Tabla`.
- Admin movil.
- Cookie consent AEPD.
- SEO/prerender.
- Analytics gated by consent.
- Docker/infra.
- Tests E2E.

### Decisiones confirmadas

- Stack V1: React + Vite, Spring Boot Java, PostgreSQL, Docker Compose.
- V1 sin pago online.
- V1 sin venta online de alcohol.
- Vino visible en catalogo/PDP, pero solo WhatsApp.
- `Mi Tabla` solo para no alcohol.
- Espanol como idioma primario; ingles via Google Translate.
- Admin disenado para owner single-operator, menos de 5 minutos al dia.
- `docs/AGENTS_Javi.md` no se modifica.

### Bloqueos actuales

- No hay codigo inicial todavia.
- Falta contenido real del owner: productos, precios, fotos, horarios, telefono, dominio, legal y eventos.

### Pendientes de decision del owner

- Dominio final (`crudo.es`, `crudo.world` u otro).
- Horarios exactos y cierres.
- Capacidad pickup diaria.
- SLA real de confirmacion.
- Telefono WhatsApp publico y telefono owner para notificaciones.
- Brevo confirmado o alternativa.
- Cookie provider: custom, Cookiebot, Iubenda u otro.
- Primeros 20-40 productos con precios y `is_alcohol`.
- Primeros 3 eventos.

### Registro de sesiones

Anadir una linea por sesion de trabajo. Formato recomendado:

```text
- 2026-05-04 | Fase docs | Creado V1Tecnico.md | Verificacion: lectura/estructura OK | Siguiente: Fase 0
```

Registro:

- 2026-05-04 | Fase docs | Creado V1Tecnico.md con fases y prompts para Opus | Verificacion: estructura revisada | Siguiente: Fase 0
- 2026-05-04 | Fase docs | Organizados documentos en `docs/` y V1 en `docs/V1/`; creado roadmap visual V1 | Verificacion: rutas revisadas | Siguiente: Fase 0

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

## 1. Reglas no negociables de V1

Estas reglas deben aparecer en todos los prompts importantes.

- La V1 no es una landing. Es un sistema comercial para aumentar visitas, reservas de pickup, eventos y lista de email.
- Objetivo de negocio: generar ingresos recurrentes suficientes para contratar a una segunda persona en el bar.
- Operativa: CRUDO lo gestiona una sola persona. El admin debe poder usarse en movil en menos de 5 minutos al dia.
- Idioma visible del producto: espanol. Debe ser compatible con Google Translate: HTML semantico, `lang="es"`, texto no incrustado en imagenes, copy claro y sin expresiones dificiles de traducir.
- No hay pago online en V1.
- No hay venta online de alcohol en V1.
- El vino se muestra en catalogo y PDP, pero nunca se puede anadir a `Mi Tabla`.
- Todo producto con `is_alcohol=true` debe tener CTA principal de WhatsApp: `Preguntanos por WhatsApp`.
- El backend debe rechazar `POST /api/v1/pickup-orders` con HTTP 422 si algun item referencia un producto con `is_alcohol=true`.
- `Mi Tabla` solo admite productos no alcoholicos.
- El pago se realiza en CRUDO al recoger.
- El mensaje al usuario debe indicar confirmacion por WhatsApp en menos de 24 horas.
- Admin con JWT.
- Public site: Home, Catalogo, PDP, Eventos, Detalle de evento, Sobre CRUDO, Contacto, Mayoristas, Mi Tabla, Confirmacion, Aviso Legal, Privacidad, Cookies, Admin.
- Mobile-first real, probado en viewport tipo iPhone e Instagram in-app browser.
- Cookie banner AEPD: Aceptar, Rechazar, Configurar con peso visual equivalente; GA4 y Pixel solo tras consentimiento.
- Analytics: GA4, Search Console, Meta Pixel y eventos `select_item`, `pickup_request`, `wine_whatsapp_click`, `generate_lead`.
- SEO: prerender de catalogo y PDP, sitemap.xml, robots.txt, Open Graph, schema.org Restaurant/Product/Event/FAQ.
- Stack V1: React + Vite, Spring Boot Java, PostgreSQL, Docker Compose, Caddy, Cloudflare, R2/Bunny para imagenes, Brevo para newsletter.
- No Stripe, Redsys, cuentas de usuario, loyalty, reviews, app movil, stock realtime ni i18n completo en V1.

## 2. Reglas de ingenieria desde docs/AGENTS_Javi.md

Opus debe seguir estas reglas durante todo el proyecto.

- No modificar `docs/AGENTS_Javi.md`. Es contrato de solo lectura.
- Leer contexto antes de actuar: `docs/AGENTS_Javi.md`, `docs/V1/CRUDO_V1_Visual_Master_Plan.html`, README/docs si ya existen, arquitectura si existe, historial git si hace falta.
- Codigo, clases, variables, comentarios tecnicos inline y tests en ingles.
- Documentacion tecnica, README y guias en espanol.
- SQL con keywords en INGLES MAYUSCULAS e identificadores en `snake_case`.
- Java 21 LTS.
- Spring Boot 3.x estable.
- PostgreSQL 16.
- Maven wrapper incluido.
- Arquitectura backend por capas salvo que exista una arquitectura documentada distinta: Controller -> Service Interface -> Service Impl -> Repository -> Entity.
- API OpenAPI-first: definir `openapi.yml` antes de controllers, generar DTOs/interfaces, controllers implementan interfaces generadas.
- Flyway: `V1` a `V899` solo schema; seeds `V900+` en `db/migration/seed`, solo local/dev.
- MapStruct para mapeos, no ModelMapper.
- Sin secretos hardcodeados. Todo via variables de entorno y `.env.example`.
- Tests: backend JUnit 5, Mockito, AssertJ, Testcontainers; frontend Vitest, Testing Library, Zod, axe; E2E Playwright.
- Cobertura objetivo del contrato: >80% cuando aplique. El V1 minimo pide al menos 60% en paquetes `service` y `web`, pero se debe apuntar a 80%.
- Error handling con RFC 7807 `application/problem+json`.
- Antes de declarar DONE: type-check, lint, tests, build, Docker sin crash, docs actualizadas, sin secretos.

## 3. Stack y estructura objetivo

Estructura monorepo:

```text
crudo/
  api/                         # Spring Boot
    Dockerfile
    pom.xml
    src/main/resources/openapi/api.yml
    src/main/resources/db/migration/
    src/main/resources/db/migration/seed/
    src/main/java/com/crudo/...
    src/test/java/com/crudo/...
  web/                         # React + Vite
    Dockerfile
    package.json
    src/
  infra/
    docker-compose.yml
    caddy/Caddyfile
    scripts/backup.sh
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
- React 18
- Vite
- React Router
- TanStack Query
- Zustand para `Mi Tabla`
- Zod
- React Hook Form
- Framer Motion solo para reveals sutiles
- Lucide icons
- CSS modules + tokens CSS como preferencia
- Tailwind solo si Opus justifica que no rompe el lenguaje editorial

Backend recomendado:
- Java 21
- Spring Boot 3.x
- Spring Web
- Spring Data JPA
- Spring Security
- Flyway
- PostgreSQL driver
- MapStruct
- Springdoc/OpenAPI generator
- Bucket4j
- Resilience4j
- JJWT
- Testcontainers

Infra:
- Docker Compose local/staging/prod
- Caddy reverse proxy + HTTPS
- PostgreSQL 16
- Cloudflare DNS/CDN/WAF
- R2 o Bunny para imagenes
- Brevo newsletter y emails
- WhatsApp Business via Twilio/360dialog o adaptador simulable localmente

## 4. Modelo de datos V1

Tablas obligatorias:

- `product`: `id`, `slug`, `name`, `type` (`CHEESE`, `WINE`, `OTHER`), `is_alcohol`, `price_cents`, `vat_rate`, `short_desc`, `long_desc`, `producer`, `region`, `is_seasonal`, `is_featured`, `is_active`, `stock_status` (`IN_STOCK`, `LOW`, `OUT`), `created_at`, `updated_at`.
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
- `is_alcohol` es el campo critico de V1.
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
- `/admin/productos`
- `/admin/eventos`
- `/admin/campanas`
- `/admin/pedidos`
- `/admin/consultas`
- `/admin/configuracion`

## 7. Design tokens obligatorios

Crear `web/src/design-system/tokens.css` con estos tokens como fuente unica:

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

## 8. Prompt base obligatorio

Pega esto al inicio de cada sesion de Opus.

```text
Actua como agente senior full-stack para construir la V1 de CRUDO.

Antes de tocar codigo, lee y respeta estos archivos:
- docs/AGENTS_Javi.md
- docs/V1/CRUDO_V1_Visual_Master_Plan.html
- docs/V1/V1Tecnico.md
- README.md, docs/, ARCHITECTURE.md o contexto existente si existen

Reglas obligatorias:
- No modifiques docs/AGENTS_Javi.md.
- No inventes alcance fuera del V1.
- Documentacion en espanol; codigo, variables, clases, comentarios tecnicos y tests en ingles.
- Backend Java 21 + Spring Boot 3.x + PostgreSQL + Flyway + MapStruct.
- API OpenAPI-first: define/actualiza openapi.yml antes de implementar controllers. Controllers implementan interfaces generadas.
- Frontend React 18 + Vite, mobile-first, espanol, semantic HTML, compatible con Google Translate.
- No pagos online.
- No venta online de alcohol.
- Wine/products with is_alcohol=true are visible in catalog/PDP but cannot be added to Mi Tabla.
- POST /api/v1/pickup-orders must reject alcohol items with HTTP 422 and RFC 7807 problem detail.
- Admin must be phone-friendly and usable in <= 5 min/day by one owner.
- Secrets only via env vars and .env.example.
- Use Docker Compose for local execution.
- Add focused tests and run verification before DONE.

Workflow:
1. Read section `0.1 Estado vivo del proyecto` inside `docs/V1/V1Tecnico.md`.
2. Inspect current repo state and existing files.
3. Compare the real repo state against the estado vivo. If they differ, update the estado vivo or report the mismatch before implementing.
4. Summarize what already exists, what phase we are in, and what you will change.
5. Implement only the requested/current phase.
6. Add/update tests for the changed behavior.
7. Run relevant commands: format/lint/type-check/tests/build.
8. Update section `0.1 Estado vivo del proyecto` with phase status, implemented work, missing work, blockers, session log, next recommended prompt, and checklist items that are truly verified.
9. Report files changed, verification result, remaining risks, and next recommended phase.

Do not finish with only a plan unless blocked. Implement.
```

## 9. Fase 0 - Preparacion, repo y contexto

Objetivo: dejar el repo listo para programar sin ambiguedades.

Entregables:
- Estructura monorepo creada.
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
Usa el Prompt base obligatorio.

Implementa la Fase 0 de CRUDO V1: preparacion del repositorio y contexto operativo.

Tareas:
1. Audita el directorio actual y detecta si ya existe codigo, docs o configuracion.
2. Crea la estructura monorepo:
   - api/
   - web/
   - infra/
   - infra/caddy/
   - infra/scripts/
   - docs/
   - .github/workflows/
3. Crea o actualiza README.md con:
   - objetivo de CRUDO V1
   - stack
   - comandos locales previstos
   - estructura del repo
   - reglas criticas: no pago online, no venta online de alcohol, vino solo WhatsApp, Mi Tabla solo no alcohol
4. Crea .gitignore segun `docs/AGENTS_Javi.md`:
   - IDEs
   - node_modules, dist, build
   - target
   - .env
   - logs/cache
5. Crea .env.example con todas las variables previstas:
   - POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD
   - SPRING_PROFILES_ACTIVE
   - JWT_SECRET
   - CORS_ALLOWED_ORIGINS
   - STORAGE_ENDPOINT, STORAGE_BUCKET, STORAGE_KEY, STORAGE_SECRET
   - BREVO_API_KEY
   - OWNER_WHATSAPP
   - OWNER_EMAIL
   - VITE_API_BASE
   - VITE_GA_ID
   - VITE_META_PIXEL
   - VITE_PUBLIC_WHATSAPP
   - VITE_GOOGLE_MAPS_URL
6. Crea docs/discovery.md con las preguntas pendientes del V1:
   - baseline financiero
   - horario
   - capacidad pickup diaria
   - SLA realista
   - telefono owner
   - kill switch
   - lista final de 20-40 productos
   - categorias
   - logo
   - dominio
   - DNS
   - Google Business Profile
   - Meta Business Manager
   - legal/cookies
   - Brevo
   - 3 primeros eventos
7. Crea docs/content-checklist.md con fotos y copy necesarios:
   - hero 16:9 y 9:16
   - 20-40 producto 1:1 minimo 1600x1600
   - lifestyle 6-10
   - owner/interior 3-5
   - eventos 16:9
   - manifesto 200-300 palabras
   - descripciones cortas y largas por producto
8. Crea docs/runbook.md inicial:
   - local dev
   - staging
   - production
   - backups
   - restore
   - deploy manual
9. Crea docs/owner-admin-guide.md inicial orientado a movil y <= 5 min/dia.

Criterios de aceptacion:
- No hay secretos reales.
- Los docs estan en espanol.
- El alcance V1/V1.1/V2 queda claro.
- `docs/AGENTS_Javi.md` no se modifica.
- El repo queda listo para scaffold tecnico.

Verificacion:
- Lista archivos creados.
- Ejecuta git status.
```

## 10. Fase 1 - Scaffold backend Spring Boot

Objetivo: levantar API base con Java 21, OpenAPI-first, Flyway, PostgreSQL, Docker y profile local.

Entregables:
- `api/pom.xml`
- Maven wrapper
- Spring Boot app
- `api/src/main/resources/openapi/api.yml` inicial
- `application.yml`, `application-local.yml`, `application-prod.yml`
- Flyway base
- Health endpoint
- Dockerfile API
- Tests smoke

Prompt para Opus:

```text
Usa el Prompt base obligatorio.

Implementa la Fase 1: scaffold backend Spring Boot de CRUDO V1.

Stack obligatorio:
- Java 21
- Spring Boot 3.x
- Maven wrapper
- PostgreSQL
- Flyway
- Spring Web
- Spring Data JPA
- Spring Security
- Validation
- Springdoc/OpenAPI + openapi-generator-maven-plugin
- MapStruct
- JJWT
- Bucket4j
- Testcontainers
- JUnit 5, Mockito, AssertJ

Tareas:
1. Crea el proyecto Spring Boot dentro de api/.
2. Configura Maven wrapper.
3. Configura openapi-generator-maven-plugin:
   - inputSpec: src/main/resources/openapi/api.yml
   - generatorName: spring
   - interfaceOnly: true
   - useSpringBoot3: true
   - useTags: true
   - skipDefaultInterface: true
4. Crea openapi/api.yml minimo con:
   - health
   - products list/detail como placeholders
   - problem detail schema RFC 7807
5. Crea estructura de paquetes:
   - com.crudo.config
   - com.crudo.catalog
   - com.crudo.campaign
   - com.crudo.event
   - com.crudo.pickup
   - com.crudo.inquiry
   - com.crudo.newsletter
   - com.crudo.notification
   - com.crudo.auth
   - com.crudo.site
   - com.crudo.common.error
   - com.crudo.common.audit
   - com.crudo.common.slug
   - com.crudo.common.validation
6. Configura application-local.yml:
   - postgres local/docker
   - flyway locations con seed
   - seguridad local simple o desactivada para endpoints publicos
7. Configura application-prod.yml:
   - variables de entorno
   - sin seeds
8. Crea Flyway V1__initial_schema.sql solo con infraestructura minima si todavia no implementas entidades.
9. Crea endpoint health o usa actuator si lo anades y justificas.
10. Crea Dockerfile para api.
11. Crea tests smoke:
   - contexto Spring levanta
   - health responde

Criterios de aceptacion:
- `./mvnw test` pasa dentro de api.
- `./mvnw compile` genera fuentes OpenAPI sin errores.
- No hay secretos hardcodeados.
- El profile local funciona sin OAuth ni dependencias externas.
- No se implementa todavia logica de negocio fuera del scaffold.

Verificacion:
- Ejecuta `./mvnw test`.
- Ejecuta `./mvnw compile`.
- Reporta archivos cambiados y riesgos.
```

## 11. Fase 2 - Modelo de datos, Flyway y seed local

Objetivo: crear schema real V1 y datos de desarrollo suficientes.

Entregables:
- Entidades JPA
- Repositories
- Migrations Flyway
- Seeds V900+
- Tests repository con Testcontainers

Prompt para Opus:

```text
Usa el Prompt base obligatorio.

Implementa la Fase 2: modelo de datos V1 de CRUDO con Flyway y JPA.

Tareas:
1. Actualiza V1__initial_schema.sql con las tablas V1:
   - product
   - product_image
   - category
   - product_category
   - campaign
   - campaign_product
   - event
   - event_reservation
   - inquiry
   - pickup_order
   - pickup_order_item
   - newsletter_subscriber
   - admin_user
   - consent_log
   - audit_log
2. Usa constraints:
   - slugs unicos
   - FK con nombres claros
   - CHECK para enums cuando sea razonable
   - `price_cents`, `total_cents`, `unit_price_cents` enteros no negativos
   - `qty > 0`
   - timestamps `created_at`, `updated_at`
3. Crea entidades JPA en paquetes por dominio.
4. Crea repositories Spring Data.
5. Crea enums Java en ingles:
   - ProductType
   - StockStatus
   - ReservationStatus
   - InquiryType
   - WorkStatus/OrderStatus segun nombre elegido
   - AdminRole
6. Crea V900__seed_dev_data.sql en `db/migration/seed` con:
   - categorias de quesos y vinos
   - minimo 8 productos, incluyendo al menos 2 vinos con `is_alcohol=true`
   - minimo 4 productos `is_seasonal=true`
   - 1 campana activa
   - 2 eventos futuros
   - 1 admin user local con password documentada solo como hash de dev
7. Configura profile local para cargar seeds.
8. Configura profile prod para NO cargar seeds.
9. Anade repository tests con PostgreSQL Testcontainers:
   - unique slug
   - product categories
   - seed alcohol/non-alcohol visible
   - pickup_order_item puede referenciar producto, pero la validacion de alcohol se hara en servicio en fase posterior

Criterios de aceptacion:
- Flyway migra desde cero.
- Seeds solo cargan en local/dev.
- `is_alcohol` existe y esta testeado.
- No se guardan secretos reales.
- SQL sigue snake_case y keywords mayusculas.

Verificacion:
- Ejecuta `./mvnw test`.
- Si hay docker local disponible, ejecuta tests Testcontainers.
- Reporta cualquier test no ejecutado.
```

## 12. Fase 3 - OpenAPI completo y servicios publicos

Objetivo: implementar endpoints publicos de catalogo, campanas, eventos, inquiries, newsletter y site config.

Entregables:
- `openapi.yml` completo para endpoints publicos
- DTOs generados
- Services
- Controllers implementando interfaces generadas
- Mappers MapStruct
- Problem JSON
- Rate limiting
- Tests web/service

Prompt para Opus:

```text
Usa el Prompt base obligatorio.

Implementa la Fase 3: API publica de CRUDO V1.

Antes de escribir controllers, actualiza `api/src/main/resources/openapi/api.yml` con contratos para:
- GET /api/v1/products
- GET /api/v1/products/{slug}
- GET /api/v1/categories
- GET /api/v1/campaigns/active
- GET /api/v1/campaigns/{slug}
- GET /api/v1/events
- GET /api/v1/events/{slug}
- POST /api/v1/events/{slug}/reservations
- POST /api/v1/inquiries
- POST /api/v1/newsletter/subscribe
- POST /api/v1/consent
- GET /api/v1/site/config

Requisitos:
1. Public GET cache headers compatibles con CDN durante 5 minutos.
2. Paginacion `page`, `size` en productos.
3. Filtros producto:
   - type
   - category
   - seasonal
   - featured
   - q
4. Solo devolver entidades `is_active=true` en publicos.
5. Eventos publicos solo futuros y activos.
6. Reservation form:
   - name, email, phone, party_size 1-4, notes
   - rechaza evento lleno
   - si queda menos del 30%, exponer "pocas plazas" en response
7. Inquiries:
   - CONTACT, WHOLESALE
   - validar email o phone segun formulario
8. Newsletter:
   - guardar consent_at, ip/source/status
   - crear cliente Brevo con interfaz y adaptador local noop/mock si no hay API key
9. Consent:
   - no cookies no esenciales antes de consentimiento
   - guardar consent log 24 meses
10. Error handling:
   - RFC 7807
   - validaciones 400/422 segun corresponda
11. Rate limit:
   - 10 req/min/IP en POST publicos
12. Notificaciones:
   - emitir evento interno para inquiries y reservations
   - si proveedor externo no esta configurado, usar noop logger en local

Arquitectura:
- Controller -> Service Interface -> Service Impl -> Repository -> Entity.
- DTOs desde OpenAPI.
- MapStruct para mapeos.
- Nada de DTOs manuales si estan en OpenAPI.

Tests:
- Service tests para filtros, eventos llenos, newsletter y consent.
- Web tests para happy/unhappy paths.
- Rate limit test si es razonable.

Criterios de aceptacion:
- `./mvnw compile` genera OpenAPI.
- `./mvnw test` pasa.
- Public endpoints devuelven datos seed.
- No se implementa todavia pickup_order completo si queda para Fase 4, salvo contratos compartidos.
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
Usa el Prompt base obligatorio.

Implementa la Fase 4: Mi Tabla pickup inquiry flow en backend.

Esta es la regla mas importante:
- Vino/alcohol se puede ver, pero nunca reservar mediante Mi Tabla.
- Si cualquier line item referencia un producto con `is_alcohol=true`, `POST /api/v1/pickup-orders` debe responder HTTP 422 con RFC 7807.
- El frontend tambien lo ocultara, pero el backend es la defensa final.

Tareas:
1. Actualiza OpenAPI para POST /api/v1/pickup-orders:
   - request: name, email, phone, pickup_date, pickup_slot, notes, items[{product_id o product_slug, qty}]
   - response: order_id, status NEW, total_cents, confirmation_message
   - errores: 400 validation, 404 product, 409 idempotency conflict, 422 alcohol/stock/slot invalid
2. Implementa PickupService:
   - valida items no vacios
   - valida qty > 0
   - carga productos activos
   - rechaza productos alcoholicos con 422
   - rechaza OUT stock si aplica
   - calcula total_cents desde precios actuales, no desde cliente
   - valida fecha solo dias de apertura desde SiteConfig
   - valida slot en incrementos de 30 minutos
   - guarda pickup_order y pickup_order_item
   - status inicial NEW
3. Implementa Idempotency-Key:
   - evita dobles envios por retry/red
   - misma key + mismo payload devuelve misma respuesta
   - misma key + payload distinto devuelve 409
4. Implementa NotificationService:
   - owner WhatsApp ping para nuevo pickup
   - digest email end-of-day preparado como servicio invocable/scheduled
   - noop local si faltan credenciales
5. Implementa tests:
   - happy path con 2 quesos
   - total VAT-inclusive segun modelo acordado
   - wine/alcohol item -> 422 problem detail
   - mixed cheese + wine -> 422 y no persiste pedido
   - inactive product -> error
   - invalid pickup slot -> error
   - idempotency same payload -> same response
   - network retry scenario si aplica

Criterios de aceptacion:
- `POST /api/v1/pickup-orders` nunca acepta alcohol.
- Test explicito de alcohol guard verde.
- Mensaje de confirmacion indica pago en tienda y confirmacion por WhatsApp en menos de 24h.
- No se envia pago ni se integra Stripe/Redsys.
- `./mvnw test` pasa.
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
Usa el Prompt base obligatorio.

Implementa la Fase 5: backend admin y seguridad JWT.

Requisitos operativos:
- El owner es una sola persona.
- El admin debe soportar el ritmo diario:
  - manana <= 90s: ver pedidos de hoy, eventos de hoy, nuevas consultas, confirmar pedidos, marcar agotados.
  - servicio: cero admin obligatorio.
  - cierre <= 90s: marcar pedidos como PICKED_UP y revisar consultas.
  - semanal <= 10 min: campana, KPIs, nuevo evento.
- Cualquier flujo admin que requiera mas de 3 taps debe marcarse como riesgo.

Tareas:
1. Actualiza OpenAPI admin:
   - POST /admin/auth/login
   - POST /admin/auth/refresh
   - GET /admin/dashboard
   - CRUD /admin/products
   - POST /admin/products/{id}/images
   - CRUD /admin/events
   - CRUD /admin/campaigns
   - GET/PATCH /admin/inquiries
   - GET/PATCH /admin/pickup-orders
   - GET/PATCH /admin/event-reservations
   - GET/PUT /admin/site/config
   - GET /admin/kpis
2. Implementa Spring Security:
   - public paths abiertos
   - admin paths JWT
   - passwords hasheadas con BCrypt
   - CORS por env
   - CSRF segun API token strategy
3. Implementa AuthService y JwtService.
4. Implementa AdminDashboardService:
   - today's pickup orders
   - today's events
   - new inquiries
   - low/out stock products
   - quick KPI summary
5. Implementa CRUD productos:
   - incluye `is_alcohol`
   - type, producer, region, price, short/long desc, seasonal/featured, active, stock_status
   - audit `updated_by`
6. Implementa CRUD eventos y campanas.
7. Implementa status updates:
   - pickup: NEW, CONFIRMED, READY, PICKED_UP, CANCELLED
   - inquiries: NEW, IN_PROGRESS, DONE, SPAM si decides enum
   - reservations: NEW, CONFIRMED, CANCELLED
8. Implementa image upload con interfaz StorageService:
   - R2/S3 adapter
   - local noop/fake adapter
   - generar alt text por defecto: "{producer} {name}, {region}"
9. Tests:
   - admin endpoints rechazan no autenticado
   - login valido/invalido
   - CRUD product con is_alcohol
   - update stock one-tap endpoint o PATCH parcial
   - dashboard retorna datos principales

Criterios de aceptacion:
- Admin endpoints protegidos.
- Public endpoints siguen abiertos.
- No hay secretos.
- El CRUD de producto permite crear vino visible con `is_alcohol=true`.
- Audit field queda registrado.
- `./mvnw test` pasa.
```

## 15. Fase 6 - Docker Compose e infraestructura local

Objetivo: levantar localmente web, API y DB con un comando.

Entregables:
- `infra/docker-compose.yml`
- Dockerfile web
- Dockerfile api revisado
- Caddyfile local/prod base
- Scripts backup
- CI inicial

Prompt para Opus:

```text
Usa el Prompt base obligatorio.

Implementa la Fase 6: Docker e infraestructura local/staging base.

Tareas:
1. Crea `infra/docker-compose.yml` con:
   - db: postgres:16-alpine
   - api: build ./api
   - web: build ./web
   - caddy opcional para entorno production/staging
2. Configura puertos:
   - db 5432
   - api 8080
   - web 5173 en dev
3. Usa variables desde .env y documentalas en .env.example.
4. Crea Dockerfile api multi-stage si procede:
   - build con Maven
   - runtime JRE Java 21
5. Crea Dockerfile web:
   - dev o production segun estructura
   - build Vite
6. Crea `infra/caddy/Caddyfile`:
   - reverse proxy para API bajo /api/*
   - servir frontend
   - HTTPS production con dominio env/documentado
7. Crea `infra/scripts/backup.sh` documentado:
   - pg_dump
   - subida a R2 placeholder via env
   - retencion 30 dias
8. Crea GitHub Actions:
   - pr.yml: backend test, frontend test/build si existe, docker build si razonable
   - staging.yml skeleton manual o main
   - production.yml manual trigger skeleton
9. Actualiza README con comandos:
   - docker compose up
   - backend tests
   - frontend tests

Criterios de aceptacion:
- Un desarrollador puede arrancar local con Docker Compose.
- No hay secretos.
- Staging debe poder ser `noindex` y basic-auth gated en fases posteriores.
- Caddy y backups estan documentados aunque algunas credenciales sean placeholders.

Verificacion:
- Ejecuta los comandos disponibles.
- Si Docker no esta disponible, indica exactamente que no se pudo verificar.
```

## 16. Fase 7 - Scaffold frontend y design system

Objetivo: crear la app React/Vite con rutas, tokens, layout y sistema visual CRUDO.

Entregables:
- React/Vite funcionando
- Rutas
- Design tokens
- Componentes base
- Providers
- API client
- Analytics consent-aware

Prompt para Opus:

```text
Usa el Prompt base obligatorio.

Implementa la Fase 7: scaffold frontend React/Vite y design system editorial de CRUDO.

Stack:
- React 18
- Vite
- TypeScript
- React Router
- TanStack Query
- Zustand
- Zod
- React Hook Form
- Lucide icons
- Vitest + Testing Library
- Playwright preparado para fases posteriores

Tareas:
1. Crea la app en web/.
2. Configura TypeScript estricto.
3. Crea estructura:
   - src/app/routes.tsx
   - src/app/App.tsx
   - src/app/providers/
   - src/design-system/tokens.css
   - src/design-system/Button.tsx
   - src/design-system/Input.tsx
   - src/design-system/Select.tsx
   - src/design-system/Modal.tsx
   - src/design-system/Tag.tsx
   - src/design-system/Badge.tsx
   - src/components/layout/Header.tsx
   - src/components/layout/Footer.tsx
   - src/components/layout/StickyCTA.tsx
   - src/components/layout/CookieBanner.tsx
   - src/lib/api.ts
   - src/lib/analytics.ts
   - src/lib/schemaOrg.ts
   - src/styles/global.css
4. Implementa design tokens exactos de V1.
5. Carga fuentes:
   - Cormorant Garamond
   - Inter
   - JetBrains Mono
   con fallback correcto.
6. Implementa rutas placeholder:
   - /
   - /catalogo
   - /catalogo/quesos
   - /catalogo/vinos
   - /catalogo/temporada
   - /producto/:slug
   - /eventos
   - /eventos/:slug
   - /sobre-crudo
   - /contacto
   - /mayoristas
   - /mi-tabla
   - /mi-tabla/confirmacion
   - /aviso-legal
   - /privacidad
   - /cookies
   - /admin
7. Implementa Header:
   - logo CRUDO
   - nav minimo
   - iconos Instagram, WhatsApp, Maps con lucide si aplica
8. Implementa Footer:
   - direccion/hours placeholder desde site config
   - legal links
   - newsletter form placeholder
   - copy +18 y beber con moderacion
9. Implementa CookieBanner:
   - Aceptar/Rechazar/Configurar
   - peso visual equivalente
   - no dispara analytics antes de consentimiento
   - persiste consentimiento local y prepara POST /consent
10. Implementa analytics.ts:
   - funciones typed para `select_item`, `pickup_request`, `wine_whatsapp_click`, `generate_lead`
   - no-op si no hay consentimiento
11. Implementa componentes base con accesibilidad:
   - tap targets 44x44
   - focus ring visible
   - errores no solo color
12. Tests:
   - render App
   - CookieBanner consent behavior
   - Button/Input accessibility smoke

Criterios de aceptacion:
- `npm run build` pasa.
- `npm test` o equivalente pasa.
- Visualmente respeta dark editorial gastronomy.
- No usa blanco puro, negro puro, azul, neon o UI SaaS generica.
- No hay texto ingles visible salvo placeholders tecnicos no publicos.
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
Usa el Prompt base obligatorio.

Implementa la Fase 8: frontend publico para Home, Catalogo y PDP.

Pantallas:
- Home /
- Catalogo /catalogo
- Quesos /catalogo/quesos
- Vinos /catalogo/vinos
- Temporada /catalogo/temporada
- Producto /producto/:slug

Componentes:
- home/Hero
- home/SeasonalShowcase
- home/CategoryStrips
- home/EventsTeaser
- home/InstagramStrip
- home/VisitBlock
- catalog/CatalogToolbar
- catalog/ProductCard
- catalog/ProductGrid
- catalog/EmptyState
- product/ProductGallery
- product/ProductMeta
- product/ProductLongRead
- product/AddToTablaButton
- product/WineWhatsAppButton
- product/RelatedProducts

Reglas visuales:
1. Hero full-bleed:
   - 90vh mobile, 80vh desktop
   - foto real/placeholder local claramente sustituible
   - overlay `rgba(26,31,20,0.55)`
   - eyebrow `VINOS Y QUESOS · MADRID`
   - H1 Cormorant italic, max 6 palabras
   - CTAs: `Reservar mi tabla` y `Como llegar`
   - metadata: horas + abierto/cerrado
2. ProductCard:
   - imagen cuadrada
   - tag Temporada/Nuevo
   - producer + region como eyebrow
   - title Cormorant
   - tasting note
   - price en JetBrains Mono
   - hover sutil desktop
3. PDP:
   - desktop 2 columnas; mobile stacked
   - gallery izquierda; meta sticky derecha
   - story productor
   - pairings
4. Vino:
   - nunca mostrar `Anadir a mi tabla`
   - mostrar `Preguntanos por WhatsApp`
   - link `wa.me/+34...?text=Hola, me interesa el {nombre}. Lo teneis disponible?`
   - texto: `Los vinos se reservan y se pagan en CRUDO.`
   - track `wine_whatsapp_click`
5. No alcohol:
   - mostrar `Anadir a mi tabla`
   - actualizar estado Zustand
   - track select_item y add_to_tabla si decides nombre adicional

Datos:
- Usar TanStack Query contra API real.
- Si API no esta disponible en dev, usar mocks temporales claramente aislados en `src/lib/mockData.ts`, con TODO para retirar.

SEO:
- Cada pagina debe tener title/meta basicos.
- ProductPage debe generar schema.org Product.
- Home debe preparar schema.org Restaurant/FAQ.

Tests:
- ProductCard renderiza estado season/stock.
- ProductPage con `is_alcohol=true` muestra solo WhatsApp CTA.
- ProductPage con `is_alcohol=false` muestra AddToTabla.
- wine WhatsApp link incluye producto.
- No CLS evidente por imagenes: reservar dimensiones/aspect-ratio.

Criterios de aceptacion:
- `npm run build` pasa.
- Tests pasan.
- Vino no entra en Mi Tabla desde UI.
- Catalogo filtra por queso/vino/temporada.
- Mobile-first y accesible.
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
Usa el Prompt base obligatorio.

Implementa la Fase 9: Mi Tabla frontend y pickup inquiry flow.

Reglas:
- Mi Tabla solo admite productos no alcoholicos.
- Si por cualquier razon llega un producto `is_alcohol=true` al estado local, el sistema debe eliminarlo o bloquear submission con error claro.
- No hay pago online.
- Texto obligatorio: `Reserva tu tabla. El pago se realiza en CRUDO al recoger. Te confirmaremos por WhatsApp en menos de 24 horas.`

Tareas:
1. Implementa Zustand store `useTabla`:
   - addItem(product)
   - removeItem(productId)
   - updateQty(productId, qty)
   - clear()
   - total_cents calculado desde items
   - rechazar `is_alcohol=true`
   - persistir en localStorage de forma robusta
2. Implementa TablaDrawer:
   - desktop drawer derecha
   - mobile full-screen sheet
   - line items thumbnail/name/qty/price
   - `Quitar`
   - total
   - CTA `Reservar para recoger`
   - nota: `Para reservar vinos, escribenos por WhatsApp.`
3. Implementa `/mi-tabla`:
   - resumen
   - formulario
4. Implementa PickupForm:
   - name
   - email
   - phone
   - pickup_date
   - pickup_slot 30-min
   - notes
   - validation Zod
   - date restricted to opening days desde site config
   - retries una vez en error de red
   - usa Idempotency-Key
5. Implementa submission a POST /api/v1/pickup-orders.
6. Implementa `/mi-tabla/confirmacion`:
   - order ID
   - total
   - expectativa de confirmacion por WhatsApp en 24h
   - CTA a WhatsApp y Como llegar
   - newsletter opt-in block
7. Analytics:
   - `pickup_request` con contents y total
8. Tests:
   - add non-alcohol item
   - reject alcohol item
   - total updates
   - validation errors
   - successful submit
   - 422 alcohol from API displays safe error and does not claim success
   - network retry once

Criterios de aceptacion:
- No hay checkout ni pago.
- El usuario entiende que paga en tienda.
- UI y store impiden alcohol.
- Backend 422 se maneja correctamente.
- `npm run build` y tests pasan.
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
Usa el Prompt base obligatorio.

Implementa la Fase 10: Eventos, Contacto, Newsletter, Sobre CRUDO y Mayoristas.

Pantallas:
- /eventos
- /eventos/:slug
- /contacto
- /sobre-crudo
- /mayoristas

Componentes:
- events/EventCard
- events/EventDetail
- events/ReservationForm
- forms/ContactForm
- forms/WholesaleForm
- forms/NewsletterForm
- home/VisitBlock si no esta completo

Requisitos eventos:
1. /eventos lista eventos futuros activos ordenados por fecha.
2. /eventos/:slug muestra:
   - fecha, hora, precio, ubicacion
   - capacidad restante o `quedan pocas plazas` si <30%
   - formulario name/email/phone/party_size 1-4/notes
3. Si evento lleno, sustituye form por waitlist o mensaje segun API disponible.
4. On submit:
   - confirmation UI
   - email/notification via backend
   - admin lo ve como reservation NEW

Requisitos contacto:
- Form CONTACT: name, email, phone optional, message.
- CTAs visibles: WhatsApp, Como llegar, Instagram.
- Google Maps embed o link accesible.

Requisitos mayoristas:
- B2B/distribucion queso.
- Form WHOLESALE: business name, contact name, email, phone, message.
- Mantenerlo como lead, no ecommerce B2B.

Newsletter:
- Form en footer y paginas clave.
- Double opt-in via Brevo en backend.
- Consent timestamp + IP ya soportado.
- Track `generate_lead`.

Sobre CRUDO:
- Manifesto placeholder editable.
- Owner/space photos placeholder.
- Link a catalogo, eventos, contacto.

Tests:
- reservation form valid/invalid.
- contact form valid/invalid.
- newsletter consent flow.
- maps/whatsapp links correctos.

Criterios de aceptacion:
- Todas las rutas publicas V1 existen.
- Formularios tienen validacion cliente y servidor.
- CTAs funcionan en mobile.
- No se anade sistema nativo de reserva de mesas.
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
Usa el Prompt base obligatorio.

Implementa la Fase 11: frontend admin movil para owner de CRUDO.

Regla de diseno:
- No es un dashboard SaaS decorativo.
- Es una herramienta de servicio para una persona entre clientes.
- Cada accion diaria debe ser 1 tap o 1 form submission.
- Si un flujo supera 3 taps, simplificalo o documenta el riesgo.

Rutas:
- /admin
- /admin/productos
- /admin/productos/nuevo
- /admin/productos/:id
- /admin/eventos
- /admin/campanas
- /admin/pedidos
- /admin/consultas
- /admin/configuracion

Tareas:
1. Auth:
   - login email/password
   - guardar token de forma razonable
   - refresh si backend lo soporta
   - logout
   - protected routes
2. AdminShell:
   - mobile bottom nav o compact nav
   - botones grandes
   - estados de carga claros
3. Dashboard:
   - pedidos pickup de hoy
   - eventos de hoy
   - consultas nuevas
   - productos low/out stock
   - botones rapidos:
     - Confirmar pedido
     - Marcar READY
     - Marcar PICKED_UP
     - Marcar agotado
4. Productos:
   - list searchable
   - product editor
   - fields: name, type, is_alcohol, producer, region, price, descriptions, seasonal, featured, active, stock_status
   - image upload
   - save/publish state
   - creating wine sets `is_alcohol=true` and public PDP must use WhatsApp path
5. Eventos:
   - editor date/time, capacity, price, markdown desc, image, publish toggle
6. Campanas:
   - editor title/subtitle/body/active/products
7. Pedidos:
   - list by status/date
   - patch status
   - quick WhatsApp action with prefilled response
8. Consultas:
   - list contact/wholesale
   - status update
   - reply via email/WhatsApp link
9. Configuracion:
   - hours
   - address
   - public WhatsApp
   - kill switch placeholder si backend existe; si no, preparar issue V1.1

Tests:
- login flow.
- unauthenticated redirect.
- product editor creates wine with is_alcohol.
- dashboard actions call PATCH.
- mobile viewport smoke with Testing Library/Playwright if already configured.

Criterios de aceptacion:
- Owner puede hacer manana/cierre desde movil.
- No hay tablas densas inutilizables en mobile.
- Admin no rompe public site.
- `npm run build` y tests pasan.
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
Usa el Prompt base obligatorio.

Implementa la Fase 12: legal, cookies, SEO, analytics y prerender.

Legal:
1. Crea paginas:
   - /aviso-legal
   - /privacidad
   - /cookies
2. Usa copy placeholder claro en espanol con bloques que el abogado debe revisar.
3. Incluye aviso +18:
   - consumo responsable
   - prohibida venta a menores
   - recuerda que no hay venta online de alcohol

Cookies:
1. Cookie banner AEPD:
   - Aceptar
   - Rechazar
   - Configurar
   - peso visual equivalente
2. No cargues GA4/Pixel antes de consentimiento.
3. Implementa categorias:
   - necesarias
   - analiticas
   - marketing
4. POST /consent para log backend.
5. Pagina cookies lista proveedor, finalidad, duracion.

Analytics:
1. GA4 events:
   - select_item
   - pickup_request
   - wine_whatsapp_click
   - generate_lead
   - maps_click
   - whatsapp_click
2. Meta Pixel:
   - pageview tras consentimiento marketing
   - custom events tras consentimiento marketing
3. Consent Mode v2 si se implementa GA.

SEO:
1. HTML `lang="es"`.
2. Meta title/description por pagina.
3. Open Graph/Twitter cards por pagina.
4. Schema.org:
   - Restaurant en Home
   - Product en PDP
   - Event en event detail
   - FAQ en Home si hay FAQs
5. Sitemap.xml:
   - public routes
   - products active
   - events active
6. robots.txt:
   - production allow
   - staging noindex/bloqueo documentado
7. Prerender:
   - catalog pages
   - active PDPs
   - event pages
   - usa `vite-plugin-ssg` o step pequeno de prerender si encaja

Tests:
- analytics no dispara antes de consentimiento.
- aceptar dispara analytics.
- rechazar no dispara no esenciales.
- legal routes render.
- schema JSON-LD existe.
- sitemap incluye producto seed.

Criterios de aceptacion:
- Lighthouse SEO apunta a 100.
- No se cargan cookies no esenciales antes de consentimiento.
- Staging puede bloquearse/noindex.
- Espanol claro y traducible.
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
Usa el Prompt base obligatorio.

Implementa la Fase 13: test suite E2E, accesibilidad, performance y QA.

Backend tests minimos:
- Unit tests services:
  - price calc
  - slug generation
  - pickup validation
  - alcohol guard
- Repository tests con PostgreSQL Testcontainer.
- Web tests con happy/unhappy paths para POST endpoints.
- Security tests: admin endpoints reject unauthenticated.

Frontend tests minimos:
- ProductCard
- PickupForm
- ReservationForm
- CookieBanner
- Zod validation
- axe en Home, PDP y forms.

Playwright journeys obligatorios:
1. Home -> Catalogo -> cheese PDP -> add to tabla -> submit pickup -> confirmation.
2. Wine PDP -> Preguntanos por WhatsApp -> assert `wa.me/...` with prefilled text.
3. Event detail -> reserve seat -> confirmation.
4. Contact form submit.
5. Newsletter subscribe with double opt-in mocked.
6. Admin mobile: login -> create product with `is_alcohol=true` -> assert public catalog/PDP shows WhatsApp CTA and no Mi Tabla button.

Manual QA checklist:
- iPhone Safari.
- Instagram in-app browser.
- Android Chrome.
- iPad.
- Desktop Chrome/Safari/Firefox.
- Slow 3G.
- Broken network in all forms.
- Cookie consent flows.
- Lighthouse Home/Catalog/PDP >= 90.

Tareas:
1. Configura Playwright en web/.
2. Crea seed/test fixtures para E2E.
3. Crea tests E2E anteriores.
4. Configura axe si no existe.
5. Anade scripts:
   - npm run test
   - npm run test:e2e
   - npm run test:a11y si separado
   - npm run build
6. Anade script/doc para Lighthouse.
7. Actualiza docs/runbook.md con QA commands.
8. Corrige fallos que aparezcan.

Criterios de aceptacion:
- E2E criticos verdes o documentados si requieren servicios externos mockeados.
- Alcohol guard probado backend + frontend + E2E.
- Cookie consent probado.
- Admin mobile probado.
- Lighthouse objetivo documentado y comandos disponibles.
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
Usa el Prompt base obligatorio.

Implementa la Fase 14: carga de contenido real y preparacion visual.

Antes de editar:
- Revisa docs/content-checklist.md.
- Identifica que assets reales existen en el repo.
- Si faltan assets, usa placeholders claramente marcados y documenta lo pendiente.

Tareas:
1. Carga productos reales si hay CSV/JSON/docs:
   - name
   - slug
   - type
   - is_alcohol
   - price_cents
   - vat_rate
   - short_desc
   - long_desc
   - producer
   - region
   - seasonal/featured/active
   - stock_status
2. Si no hay CSV, crea plantilla `docs/product-import-template.csv`.
3. Optimiza imagenes:
   - product 1:1
   - hero 16:9 y 9:16
   - WebP/AVIF si el pipeline existe
   - alt text
4. Carga 3 eventos iniciales si datos disponibles; si no, crea placeholders no publicados.
5. Crea campana activa de temporada.
6. Ajusta Home con copy real:
   - H1 max 6 palabras
   - subtitle 1 frase
   - section eyebrows
7. Revisa que el copy sea espanol simple y Google-Translate-friendly.
8. Verifica que vino aparece en catalogo/PDP pero solo con WhatsApp.
9. Actualiza docs/content-checklist.md marcando completado/pendiente.

Criterios de aceptacion:
- Home no parece plantilla generica.
- Catalogo tiene productos suficientes.
- Imagenes no rompen performance.
- No hay texto ingles visible en public.
- Los placeholders pendientes estan documentados y no se confunden con contenido real.
```

## 24. Fase 15 - Launch, staging y production

Objetivo: desplegar con control, medicion y rollback.

Entregables:
- Staging
- Production manual deploy
- Caddy
- HTTPS
- Backups
- Monitoring
- Launch checklist

Prompt para Opus:

```text
Usa el Prompt base obligatorio.

Implementa la Fase 15: staging, production y launch readiness.

Tareas:
1. Revisa infra/ y docs/runbook.md.
2. Prepara staging:
   - staging.<domain>
   - basic-auth o acceso protegido
   - noindex
   - robots bloqueado
   - env staging
3. Prepara production:
   - <canonical-domain>
   - Cloudflare delante
   - Caddy auto HTTPS
   - env production
4. Backups:
   - nightly pg_dump
   - R2
   - retencion 30 dias
   - restore test documentado
5. Monitoring:
   - UptimeRobot o equivalente
   - Sentry si se incorpora
   - error notification channel
6. CI/CD:
   - PR: lint/test/build
   - staging: deploy main
   - production: manual trigger
7. Launch checklist pre T-7:
   - content loaded
   - legal reviewed
   - cookies validated
   - GA4/Search Console/Pixel
   - schema rich results
   - OG/Twitter
   - favicon
   - 404
   - robots
   - Lighthouse
   - real device iPhone/IG browser
   - WhatsApp
   - Maps
   - backups restore
   - uptime
   - DNS TTL 300s
8. Launch day:
   - DNS cutover
   - HTTPS green
   - smoke tests
   - Search Console inspect URL
   - Google Business Profile website link
   - Instagram bio @crudomov
   - launch email/story
   - owner trained
9. Post-launch T+7:
   - GA4 funnels
   - GSC crawl errors
   - owner retro
   - first fix-list

Criterios de aceptacion:
- Runbook permite desplegar y restaurar.
- Production no expone secrets.
- Staging no indexa.
- Smoke tests definidos.
- Launch checklist lista para ejecutar.
```

## 25. Prompts de revision por corte

Usar despues de cada 2-3 fases o antes de merge importante.

### Sincronizacion de estado vivo

Usar cuando no este claro por donde va el proyecto, despues de trabajar fuera de Opus, o antes de retomar una sesion tras varios dias.

```text
Usa el Prompt base obligatorio.

Sin implementar funcionalidades nuevas, sincroniza el estado vivo de `docs/V1/V1Tecnico.md` con el estado real del repositorio.

Tareas:
1. Lee `docs/V1/V1Tecnico.md`, especialmente la seccion `0.1 Estado vivo del proyecto`.
2. Inspecciona el repo:
   - estructura de carpetas
   - README y docs
   - api/
   - web/
   - infra/
   - .github/workflows/
   - package.json, pom.xml, docker-compose, migrations, OpenAPI, tests
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
Usa el Prompt base obligatorio.

Haz una revision critica de arquitectura del estado actual de CRUDO V1.

Busca:
- Desviaciones de `docs/V1/CRUDO_V1_Visual_Master_Plan.html`.
- Desviaciones de `docs/AGENTS_Javi.md`.
- Endpoints fuera de OpenAPI-first.
- DTOs manuales que deberian generarse.
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
Usa el Prompt base obligatorio.

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
Usa el Prompt base obligatorio.

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
- OpenAPI actualizado antes del backend.
- Tests nuevos o actualizados.
- Backend: `./mvnw test` pasa.
- Frontend: `npm run build` y tests pasan.
- Docker local funciona si aplica.
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
- Mezclar seeds con migraciones productivas.

## 28. Orden recomendado de ejecucion

1. Fase 0 - Preparacion.
2. Fase 1 - Backend scaffold.
3. Fase 2 - Modelo de datos.
4. Fase 3 - API publica.
5. Fase 4 - Mi Tabla backend y alcohol guard.
6. Fase 5 - Admin backend.
7. Fase 6 - Docker/infra local.
8. Fase 7 - Frontend scaffold/design system.
9. Fase 8 - Home/Catalogo/PDP.
10. Fase 9 - Mi Tabla frontend.
11. Fase 10 - Eventos/contacto/newsletter/sobre/mayoristas.
12. Fase 11 - Admin frontend.
13. Fase 12 - Legal/SEO/analytics/prerender.
14. Fase 13 - E2E/QA/performance.
15. Fase 14 - Contenido real.
16. Fase 15 - Launch.

Si solo hay un desarrollador, mantener backend hasta Fase 6 antes de construir frontend profundo. Si hay dos, backend Fases 1-5 y frontend Fases 7-8 pueden avanzar en paralelo tras cerrar OpenAPI inicial.

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
- [ ] Image upload R2/local adapter.
- [ ] Cookie banner AEPD.
- [ ] Legal pages.
- [ ] GA4, Search Console, Meta Pixel gated by consent.
- [ ] Events tracking.
- [ ] Schema.org Restaurant/Product/Event/FAQ.
- [ ] Sitemap/robots.
- [ ] Prerender catalogo/PDP.
- [ ] Docker Compose.
- [ ] Caddy production.
- [ ] Backups.
- [ ] CI.
- [ ] Tests unit/integration/frontend/E2E.
- [ ] Lighthouse mobile >= 90.
- [ ] iPhone/Instagram browser tested.
- [ ] Launch checklist executed.
