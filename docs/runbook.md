# CRUDO V1 — Runbook

Guía operativa para desarrollo local, despliegue y mantenimiento.
> Este runbook es inicial. Se completará a medida que se implementen las fases.

---

## 1. Desarrollo local

### Requisitos previos

- Node.js 20 LTS
- MariaDB 10.11 LTS (local o Docker)
- npm 10+

### Primeros pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/VincenzoCasha/ai-agency.git
cd ai-agency

# 2. Copiar variables de entorno
cp .env.example .env
# Editar .env con los valores reales de desarrollo local

# 3. Instalar dependencias (disponible desde Fase 1)
npm install

# 4. Arrancar base de datos local y ejecutar migraciones
npm run db:migrate
npm run db:seed   # datos de prueba

# 5. Arrancar en modo desarrollo (Vite + Express en paralelo)
npm run dev
# Frontend: http://localhost:5173
# API:      http://localhost:3000/api/v1
```

---

## 2. Variables de entorno

Copiar `.env.example` como `.env` y rellenar:

| Variable | Descripción | Obligatoria |
|----------|-------------|-------------|
| `NODE_ENV` | `development` / `production` | Sí |
| `PORT` | Puerto del servidor Express | Sí |
| `DB_*` | Credenciales MariaDB | Sí |
| `JWT_SECRET` | Mínimo 32 caracteres | Sí |
| `COOKIE_SECRET` | Mínimo 32 caracteres | Sí |
| `OWNER_WHATSAPP` | Número interno para notificaciones | Sí |
| `VITE_PUBLIC_WHATSAPP` | Número visible a clientes | Sí |
| `BREVO_API_KEY` | Email transaccional | Producción |
| `VITE_GA_ID` | Google Analytics 4 | Producción |
| `VITE_META_PIXEL` | Solo si existe Meta Business Manager | Opcional |
| `STRIPE_*` | V2 únicamente — no activar en V1 | No |

---

## 3. MariaDB local

### Opción A — instalación nativa

```bash
# macOS
brew install mariadb
brew services start mariadb

# En macOS, root usa autenticacion por unix socket por defecto: usa sudo.
sudo mysql -u root <<'SQL'
CREATE DATABASE IF NOT EXISTS crudo_dev  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS crudo_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'crudo'@'localhost' IDENTIFIED BY 'change_me';
GRANT ALL PRIVILEGES ON crudo_dev.*  TO 'crudo'@'localhost';
GRANT ALL PRIVILEGES ON crudo_test.* TO 'crudo'@'localhost';
FLUSH PRIVILEGES;
SQL
```

### Opción B — Docker

```bash
docker run -d \
  --name crudo-mariadb \
  -e MARIADB_ROOT_PASSWORD=root \
  -e MARIADB_DATABASE=crudo_dev \
  -e MARIADB_USER=crudo \
  -e MARIADB_PASSWORD=change_me \
  -p 3306:3306 \
  mariadb:10.11
# Crear adicionalmente la DB de test:
docker exec crudo-mariadb mysql -uroot -proot \
  -e "CREATE DATABASE IF NOT EXISTS crudo_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; \
      GRANT ALL PRIVILEGES ON crudo_test.* TO 'crudo'@'%'; FLUSH PRIVILEGES;"
```

---

## 4. Migraciones y seeds (Fase 2)

```bash
# Aplica las migraciones pendientes a la DB definida en .env (DB_NAME)
npm run db:migrate

# Aplica migraciones a la DB de test
DB_OVERRIDE=crudo_test NODE_ENV=test npm run db:migrate

# Carga el seed de desarrollo (aborta en NODE_ENV=production)
npm run db:seed

# Reset destructivo: drop all tables + reaplicar migraciones (solo dev/test)
NODE_ENV=development npm run db:reset
```

Los archivos SQL viven en `db/migrations/` (nombrados `001_*.sql`, `002_*.sql`, ...).
La tabla `schema_migrations` registra cada archivo aplicado para no reaplicar.

### Credencial admin local (solo desarrollo)

El seed `db/seeds/dev-seed.js` crea un único `admin_user` ficticio:

| Campo | Valor |
|-------|-------|
| email | `admin.local@example.test` |
| password (claro, solo dev) | `change-me-local-only` |
| password_hash | bcrypt 10 rounds, generado en runtime |

**No usar en producción.** Esta credencial solo existe para que la Fase 5
(admin backend) pueda probar login en local sin contactar al owner.

### Producción

`npm run db:seed` y `npm run db:reset` abortan si `NODE_ENV=production`.
Producción nunca debe ejecutar el seed de desarrollo. Para datos reales se
usará el admin (Fase 5+) o scripts de carga inicial específicos (Fase 14).

---

## 4.bis API pública V1 (Fase 3)

Ver tabla en `README.md` para la lista completa. Notas operativas:

- **Cache:** GET públicos devuelven `Cache-Control: public, max-age=300, stale-while-revalidate=60`. Los CDN/Plesk pueden cachear sin coordinación adicional.
- **Rate limit:** POST públicos limitados a 10 req/min/IP (`express-rate-limit`). En `NODE_ENV=test` el limiter está deshabilitado.
- **RFC 7807:** todos los errores devuelven `application/problem+json` con `type`, `title`, `status`, `detail`, `instance` y opcionalmente `errors[]` (validación) o claves específicas (`code`, `seats_left`, …).
- **Notification provider:** noop en desarrollo/local; sustituible en fases posteriores. Nunca bloquea la respuesta.
- **Newsletter provider:** noop si no hay `BREVO_API_KEY`. Si la hay, se mantiene un placeholder hasta que se conecte el cliente real (la suscripción siempre se persiste en MariaDB).
- **Consent:** los hashes de IP y user agent usan SHA-256 con sal opcional desde `COOKIE_SECRET`. `expires_at` se fija a 24 meses.
- **Site config:** combina la tabla `site_config` (kill switch `pickup_paused`, `pickup_daily_capacity`) con env (`PUBLIC_WHATSAPP`, `PUBLIC_INSTAGRAM`, `PUBLIC_GOOGLE_MAPS_URL`) y constantes documentadas (datos fiscales, horario, SLA pickup).

### Mi Tabla — `POST /api/v1/pickup-orders` (Fase 4)

Contrato HTTP:

- **Headers**: `Content-Type: application/json`. `Idempotency-Key` opcional pero recomendado (24h TTL).
- **Body**: `name`, `email`, `phone`, `pickup_date` (YYYY-MM-DD), `pickup_slot` (HH:mm en bloques de 30 min), `notes?`, `items[]` (1–30) con `{product_id|product_slug, variant_id?|variant_slug?, qty 1-99}`.
- **El cliente NO envía precios**. Si llega `total_cents` o `unit_price_cents` el endpoint responde 422 `CLIENT_PRICES_NOT_ALLOWED`.

Respuestas:

- **201**: `{order_id, status: "NEW", total_cents, currency: "EUR", items, confirmation_message}`. El mensaje recuerda pago en CRUDO al recoger y confirmación por WhatsApp en menos de 24 h dentro del horario de apertura.
- **400**: payload mal formado (`Idempotency-Key` ignorada, no se persiste nada).
- **404**: `PRODUCT_NOT_FOUND` (algún producto no existe o está inactivo).
- **409**: `IDEMPOTENCY_KEY_CONFLICT` (misma key con payload distinto).
- **422**: `ALCOHOL_NOT_ALLOWED_IN_PICKUP` (con `type: https://crudo.es/problems/pickup-alcohol-not-allowed`), `PRODUCT_OUT_OF_STOCK`, `PICKUP_PAUSED`, `PICKUP_DATE_PAST`, `PICKUP_DATE_TOO_FAR` (>14 días), `INVALID_SLOT_FORMAT`, `PICKUP_SLOT_OUT_OF_HOURS`, `PICKUP_DAY_CLOSED`, `CLIENT_PRICES_NOT_ALLOWED`.

Reglas críticas (no negociables):

1. **Alcohol guard** — si producto o variante tienen `is_alcohol=true`, 422 inmediato. Carrito mixto se rechaza entero y no se persiste nada.
2. **Precios siempre desde DB** (`product.price_cents` o `product_variant.price_cents` cuando hay variante).
3. **Transacción** — `pickup_order` + `pickup_order_item` se crean en una transacción; si falla cualquier item se revierte todo.
4. **Notification** — `notifyNewPickupOrder` se llama tras commit; un fallo en notificar no rompe la respuesta.
5. **Kill switch** — si `site_config.pickup_paused = true`, todo POST devuelve 422 `PICKUP_PAUSED`.

Smoke con curl:

```bash
# Happy path (devuelve 201 con total calculado en server)
curl -X POST http://localhost:3000/api/v1/pickup-orders \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: test-1' \
  -d '{"name":"Maria","email":"m@x.test","phone":"+34600000000","pickup_date":"2026-05-10","pickup_slot":"18:00","items":[{"product_slug":"manchego-curado-12m","qty":1}]}'

# Alcohol guard (devuelve 422 con type pickup-alcohol-not-allowed)
curl -X POST http://localhost:3000/api/v1/pickup-orders \
  -H 'Content-Type: application/json' \
  -d '{"name":"X","email":"x@x.test","phone":"+34600000000","pickup_date":"2026-05-10","pickup_slot":"18:00","items":[{"product_slug":"vino-tinto-ribera-crianza","qty":1}]}'
```

### Admin backend (Fase 5)

Endpoints bajo `/api/v1/admin/**` requieren JWT. El flujo se diseñó con un objetivo comercial claro: que el responsable (V1: el owner; pronto un segundo camarero) gestione catálogo, pedidos y eventos con la mínima fricción posible para que cada hora extra que dedica a la sala se convierta en facturación.

**Variables de entorno requeridas** (definir en `.env` para desarrollo):

| Variable | Uso |
|----------|-----|
| `JWT_SECRET` | Firma access tokens (mín. 32 chars). |
| `JWT_EXPIRES_IN` | TTL access token (default `15m`). |
| `JWT_REFRESH_EXPIRES_IN` | TTL refresh token (default `7d`). |
| `COOKIE_SECRET` | Sal para hashes de IP/UA en consent y refresh (mín. 32 chars). |
| `UPLOADS_DIR` | Carpeta raíz para imágenes (default `uploads`; en tests `uploads/test`). |
| `MAX_UPLOAD_MB` | Límite por archivo (default `8`). |

**Credencial admin local** (solo desarrollo, definida en `db/seeds/dev-seed.js`):

| Campo | Valor |
|-------|-------|
| email | `admin.local@example.test` |
| password (claro) | `change-me-local-only` |

`admin_user.password_hash` siempre es bcrypt (10 rounds). En producción, el primer admin se crea via SQL/script de carga inicial; nunca se commitea password real.

**Smoke con curl**:

```bash
# Login
TOKEN=$(curl -sX POST http://localhost:3000/api/v1/admin/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin.local@example.test","password":"change-me-local-only"}' \
  | jq -r '.access_token')

# Dashboard
curl -sH "Authorization: Bearer $TOKEN" http://localhost:3000/api/v1/admin/dashboard | jq .

# KPIs ultimos 7 dias
curl -sH "Authorization: Bearer $TOKEN" 'http://localhost:3000/api/v1/admin/kpis?period=7d' | jq .

# Marcar producto como agotado (one-tap)
curl -sX PATCH -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"stock_status":"OUT"}' \
  http://localhost:3000/api/v1/admin/products/1/stock

# Pausar pickups (kill switch)
curl -sX PUT -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"pickup_paused":true}' \
  http://localhost:3000/api/v1/admin/site/config
```

**Reglas críticas admin**:

- **Wine guard**: crear/editar `type=WINE` con `is_alcohol=false` devuelve 422 `WINE_MUST_BE_ALCOHOL`. Si el campo no se envía, se fuerza a `true`.
- **Auditoría**: toda acción mutante (login success/fail, create/update/delete/stock_update/image add-delete, status updates de pickup/inquiry/reservation, site config update) se registra en `audit_log` con payload saneado (passwords/tokens redactados, strings >500 chars truncados).
- **Site config whitelist**: solo `pickup_paused`, `pickup_daily_capacity`, `pickup_open_message` son modificables vía `PUT /admin/site/config`. Cualquier otra clave devuelve 422 `CONFIG_KEY_NOT_ALLOWED`.
- **Uploads**: solo JPG/PNG/WebP, hasta `MAX_UPLOAD_MB`. Los archivos se guardan bajo `uploads/products/`; URL pública servida por Express estático en `/uploads/...`. En tests bajo `uploads/test/`.
- **Refresh rotation**: cada `/auth/refresh` revoca el token usado. Reuso de refresh viejo → 401 `REFRESH_TOKEN_REVOKED`.

---

## 5. Build para producción (Fase 6)

```bash
# Build frontend (placeholder honesto en V1; Fase 7 lo reemplaza por `vite build`)
npm run build

# Arrancar servidor (sirve API + dist/ si existe; si no, API con aviso en logs)
npm start
```

`server.js` arranca con cualquiera de estos dos casos:

- **Con `dist/index.html`**: monta express.static (assets `Cache-Control: max-age=30d`, `index.html` `max-age=0`) y un fallback SPA que NO intercepta `/api/*` ni `/uploads/*`.
- **Sin `dist/index.html`**: imprime `[crudo-api] AVISO: dist/index.html no encontrado…` y arranca solo la API. Esto permite operar el backend sin frontend (útil entre Fase 6 y Fase 7, o si un deploy se hace sin build).

Smoke post-arranque:

```bash
BASE_URL=http://localhost:3000 ./infra/scripts/smoke.sh
```

Verifica `/api/v1/health`, `/api/v1/products`, `/api/v1/site/config`, y que `/api/v1/admin/dashboard` sin token devuelve 401.

---

## 6. Despliegue en Plesk / Contabo

Ver `infra/plesk/README.md` para instrucciones detalladas.

Flujo resumido:

1. Subir código al servidor (git pull o FTP).
2. `npm install --omit=dev`
3. `npm run db:migrate`
4. `npm run build`
5. Reiniciar Node.js app desde Plesk.

---

## 7. Staging en Plesk

- Subdominio: `staging.crudo.es` (por configurar)
- Variables de entorno separadas del entorno de producción.
- Nunca usar datos reales de clientes en staging.

---

## 8. Producción en Plesk

- Dominio: pendiente de adquirir.
- SSL: Let's Encrypt gestionado por Plesk.
- Node.js app: startup file `server.js`.
- Variables de entorno: configuradas en el panel Plesk (no en archivos).

---

## 9. Backups Plesk / Contabo

- **Base de datos:** backup automático diario desde Plesk scheduler.
- **Uploads:** backup incluido en el backup de archivos de Plesk.
- **Frecuencia recomendada:** diaria con retención de 14 días.
- **Destino:** almacenamiento externo Contabo o FTP externo.

---

## 10. Restore manual

```bash
# Restaurar base de datos desde dump
mysql -u crudo -p crudo < backup_YYYY-MM-DD.sql

# Restaurar uploads
rsync -av backup/uploads/ uploads/
```

---

## 11. Rollback manual

```bash
# Revertir al commit anterior
git log --oneline -10
git checkout <commit-hash>
npm install --omit=dev
npm run build
# Reiniciar app en Plesk
```

---

## 12. Smoke test checklist post-despliegue

- [ ] `GET /api/v1/health` devuelve `200 OK`
- [ ] Home carga sin errores de consola
- [ ] Catálogo de quesos de temporada muestra productos
- [ ] Tablas y cajas para llevar carga
- [ ] Mi Tabla: añadir producto no alcohólico funciona
- [ ] Variante con maridaje de vino redirige a WhatsApp
- [ ] `POST /api/v1/pickup-orders` con item alcohólico devuelve `422`
- [ ] Formulario de contacto envía email al owner
- [ ] Newsletter subscribe funciona con doble opt-in
- [ ] Admin login con JWT funciona
- [ ] Cookie banner muestra y guarda preferencias
- [ ] `sitemap.xml` accesible
- [ ] HTTPS activo y sin mixed content
