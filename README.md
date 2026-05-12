# CRUDO V1

Tienda de quesos y cheese bar en el centro de Madrid. Este repositorio contiene la web comercial V1 de CRUDO QUESOS S.L.U.

**Objetivo de negocio:** generar ingresos recurrentes suficientes para contratar a una segunda persona (~2000 €/mes brutos + cargas en hostelería Madrid). El canal principal de promoción en V1 es el **queso to-go** (recogida en tienda), seguido de los eventos.

---

## Stack confirmado

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + Vite + Tailwind CSS + PostCSS + Autoprefixer |
| Backend | Node.js + Express (CommonJS) |
| Base de datos | MariaDB (paquete `mariadb`) |
| Servidor de producción | Contabo VPS gestionado con Plesk |
| Email | Brevo / nodemailer |
| Tests backend | Vitest / Jest + Supertest |
| Tests E2E | Playwright |

---

## Arquitectura de carpetas

```
crudo/
  package.json              # CommonJS
  server.js                 # Entry point: sirve API /api/v1 + static dist/
  vite.config.js
  tailwind.config.js
  postcss.config.js
  eslint.config.js
  index.html
  src/                      # Frontend React 19 + Vite
    main.jsx
    App.jsx
    pages/
    components/
    hooks/
    lib/
    styles/
  server/                   # Backend Express
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
  docs/
    discovery.md
    content-checklist.md
    owner-admin-guide.md
    runbook.md
  .github/workflows/
  .env.example
  .gitignore
```

---

## Comandos disponibles

### Requisitos locales

- Node.js 20 LTS
- MariaDB 10.11 LTS (local o Docker)
- npm 10+

### Desarrollo

```bash
# Backend Express + (placeholder) Vite client en paralelo
npm run dev

# Solo backend con nodemon
npm run dev:server
```

> El cliente Vite real se activa en **Fase 7**. Hasta entonces `npm run dev:client`
> imprime un mensaje informativo y `npm run dev` solo arranca el backend.

### Producción

```bash
# Build (placeholder hasta Fase 7; no genera dist/ falso)
npm run build

# Arrancar el servidor (sirve API + dist/ si existe; si no, solo API con aviso)
npm start
```

### Calidad

```bash
npm run lint        # ESLint
npm test            # Vitest (incluye tests con MariaDB de test)
npm run test:unit   # Solo tests sin DB (services + health)
npm run check       # lint + test combinados
```

### Base de datos

```bash
npm run db:migrate  # aplica migraciones pendientes (idempotente)
npm run db:seed     # carga seed de desarrollo (aborta en production)
npm run db:reset    # drop all + reaplicar migraciones (solo dev/test)
```

Para tests con MariaDB real, crear `crudo_test` (ver `docs/runbook.md` §3) y ejecutar
`DB_OVERRIDE=crudo_test NODE_ENV=test npm run db:migrate`.

### Infraestructura

```bash
npm run deploy:plesk:notes   # imprime guías de Plesk + checklist + backup
./infra/scripts/smoke.sh     # smoke post-deploy (BASE_URL configurable)
```

---

## Reglas críticas de V1

- **Sin pago online activo en V1.** El pago se realiza en CRUDO al recoger.
- **Sin venta online de alcohol.** Los vinos no son reservables digitalmente.
- Las tablas/cajas para llevar con maridaje de vino (blanco o tinto) redirigen a WhatsApp; solo la variante sin maridaje entra en *Mi Tabla*.
- *Mi Tabla* solo admite productos no alcohólicos. Implementado en Fase 4.
- El backend rechaza `POST /api/v1/pickup-orders` con **HTTP 422** RFC 7807 si algún ítem (producto o variante) tiene `is_alcohol=true`. La regla aplica también a carritos mixtos: si hay un solo ítem con alcohol, el pedido entero se rechaza y nada se persiste. Tests verde.
- Stripe existe solo como placeholder para V2; no hay flujo de pago activo en V1.
- No describir CRUDO como "wine bar" en copy público.

---

## Despliegue (Fase 6)

- **Servidor:** Contabo VPS · **Panel:** Plesk · **Producción:** dominio por confirmar · **Staging:** `staging.<dominio>` con `noindex` + basic-auth.
- Deploy **manual** vía SSH siguiendo [`infra/scripts/deploy-checklist.md`](infra/scripts/deploy-checklist.md).
- Configuración Plesk paso a paso en [`infra/plesk/README.md`](infra/plesk/README.md).
- Backups + restore test en [`infra/scripts/backup-notes.md`](infra/scripts/backup-notes.md).
- Smoke post-deploy: `BASE_URL=https://<dominio> ./infra/scripts/smoke.sh`.

### CI

- `.github/workflows/pr.yml` — lint + tests con MariaDB service en cada PR/push a `main`.
- `.github/workflows/staging.yml` y `production.yml` — skeletons manuales (deshabilitados con `if: false` hasta que el owner registre dominio + secrets SSH).

---

## API pública (Fase 3)

Todos los endpoints viven bajo `/api/v1`. GET públicos cachean 5 minutos
(`Cache-Control: public, max-age=300, stale-while-revalidate=60`); POST
públicos están limitados a 10 req/min/IP. Errores en formato RFC 7807
(`application/problem+json`).

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET    | `/api/v1/health` | Health + ping DB |
| GET    | `/api/v1/products` | Listado paginado con filtros (`type`, `category`, `seasonal`, `featured`, `is_alcohol`, `q`, `page`, `size`) |
| GET    | `/api/v1/products/:slug` | Detalle activo con categorías, imágenes y variantes |
| GET    | `/api/v1/categories` | Listado de categorías (`?type=CHEESE\|WINE\|TABLA\|OTHER`) |
| GET    | `/api/v1/campaigns/active` | Campaña activa actual + productos asociados (`{campaign: null}` si no hay) |
| GET    | `/api/v1/campaigns/:slug` | Campaña activa por slug |
| GET    | `/api/v1/events` | Eventos futuros activos con `seats_left`, `few_seats_left`, `is_full` |
| GET    | `/api/v1/events/:slug` | Detalle de evento |
| POST   | `/api/v1/events/:slug/reservations` | Crear reserva (`{name,email,phone,party_size 1-4,notes?}`) |
| POST   | `/api/v1/inquiries` | Consultas públicas (`type: CONTACT\|WHOLESALE\|EVENT`) |
| POST   | `/api/v1/newsletter/subscribe` | Suscripción newsletter (provider Brevo o noop) |
| POST   | `/api/v1/consent` | Registro AEPD (analytics/marketing/preferences, expira en 24m) |
| GET    | `/api/v1/site/config` | Config pública para frontend (datos fiscales, horario, SLA, flags) |
| POST   | `/api/v1/pickup-orders` | **Mi Tabla** — pickup sin pago online. Bloquea alcohol con HTTP 422. Soporta `Idempotency-Key`. |

## API admin (Fase 5)

Bajo `/api/v1/admin/**`, todos los endpoints requieren `Authorization: Bearer <access_token>` excepto `/auth/login` y `/auth/refresh`. Los públicos siguen abiertos sin auth. JWT firmado con `JWT_SECRET`, TTL access 15 min, refresh 7 d con persistencia + revocación.

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST   | `/admin/auth/login` | Email + password → access + refresh tokens. Rate limit 5/min/IP. |
| POST   | `/admin/auth/refresh` | Rota refresh; el viejo se revoca. |
| POST   | `/admin/auth/logout` | Revoca el refresh recibido. |
| GET    | `/admin/dashboard` | Bloques compactos: pickups hoy, próximos NEW, eventos, inquiries, alertas stock LOW/OUT, quick actions. |
| GET    | `/admin/kpis?period=today\|7d\|30d` | Pickup por status, revenue completado, ticket medio, reservas, newsletter, inquiries. |
| GET/POST/GET/PUT/DELETE | `/admin/products` (`+/:id`, `+/:id/stock`, `+/:id/images`) | CRUD productos, soft delete, patch stock one-tap, upload imagen multipart. **Wine forzado a `is_alcohol=true`**. |
| GET/POST/GET/PUT/DELETE | `/admin/events`, `/admin/campaigns` | CRUD con soft delete y validación de slug/fechas. Una sola campaña activa simultánea. |
| GET/PATCH | `/admin/pickup-orders`, `/admin/inquiries`, `/admin/event-reservations` | Listado paginado con filtros + status updates auditados. |
| GET/PUT | `/admin/site/config` | Kill switch `pickup_paused`, capacidad diaria, mensaje pickup. Solo claves whitelisted. |

**Auditoría**: cada acción admin escribe en `audit_log` con `actor_admin_user_id`, `action`, `entity_type`, `entity_id`, `payload_json` saneado (sin passwords ni tokens).

**Credencial admin local (solo desarrollo)**: `admin.local@example.test` / `change-me-local-only`. Documentada en `docs/runbook.md`.

Probar manualmente:

```bash
curl -s http://localhost:3000/api/v1/products?size=2 | jq
curl -s http://localhost:3000/api/v1/site/config | jq
curl -sX POST http://localhost:3000/api/v1/newsletter/subscribe \
  -H 'Content-Type: application/json' \
  -d '{"email":"hola@example.test","source":"home"}' | jq
```

## Estado de fases

Ver `docs/V1/V1Tecnico.md §0.1` para el estado vivo actualizado de cada fase.
