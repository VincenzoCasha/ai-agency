# CRUDO V2 — Despliegue en Plesk / Contabo

Guía operativa para staging y producción. **No ejecuta deploys automáticos**: documenta los pasos manuales que corre el owner desde Plesk + SSH.

> **Dominio de producción: `crudomov.es`** (canónico único; usado por canonical SEO,
> sitemap, OG y `VITE_SITE_URL`). Si existe `crudomov.com`, debe hacer 301 → `.es`.

---

## 1. Servidor y panel

| | Valor |
|---|---|
| Proveedor VPS | Contabo |
| OS recomendado | Ubuntu 22.04 LTS |
| Panel | Plesk Obsidian (última estable) |
| Node.js | 20 LTS (gestionado por Plesk) |
| MariaDB | 10.11 LTS (gestionado por Plesk) |

Plesk encapsula:
- DNS y SSL (Let's Encrypt automático).
- Reverse proxy hacia la app Node.
- Variables de entorno por dominio.
- Backups programados.
- File Manager + acceso SSH cuando se necesite.

---

## 2. Dominios

| Entorno | Dominio | Nota |
|---------|---------|------|
| Producción | `crudomov.es` | DNS (A/AAAA) apuntando al IP del VPS Contabo. |
| Staging | `staging.crudomov.es` | Subdominio Plesk, **noindex + basic-auth** (ver §7). |

Pasos al recibir el dominio:

1. Plesk → **Websites & Domains** → **Add Domain** → introducir el dominio.
2. Plesk → **SSL/TLS Certificates** → **Get free certificate from Let's Encrypt** (tickear `www.` y subdominios necesarios).
3. Forzar redirección HTTP→HTTPS en Plesk → **Hosting Settings**.

---

## 3. Node.js app en Plesk

1. Plesk → **Node.js** → **Add Node.js App** sobre el dominio.
2. Configurar:
   - **Document root** y **Application root**: `/httpdocs`.
   - **Startup file**: `server.js`.
   - **Node.js version**: 20 LTS.
   - **Application Mode**: `production`.
3. Plesk crea automáticamente un proxy a `127.0.0.1:<puerto interno>`. Mantener `PORT=3000` o el que asigne Plesk en variables de entorno.

> **Arquitectura de servido (importante):** la app Express (`server.js`) sirve
> TODO: la SPA construida en `dist/` (con fallback a `index.html` para rutas del
> router), los assets de `/uploads/*` y la API en `/api/*`. **No** hay que apuntar
> el document root a `/httpdocs/dist` ni configurar nginx para servir estáticos:
> el document root es `/httpdocs` y el startup es `server.js`. Si `dist/` no existe,
> el server arranca igual pero solo responde la API (no hay frontend) → hay que
> ejecutar `npm run build` (ver §8).

4. Tras un cambio de código, seguir el flujo completo de §8 (no basta con NPM
   Install). En Plesk: **Git pull** → **NPM Install** → **Run script: build** →
   **Restart App**.

> ⚠️ **El build necesita devDependencies.** `vite` y `sharp` están en
> `devDependencies`. Por eso el flujo de deploy hace `npm ci` **completo** (no
> `--omit=dev`) y, si se quiere adelgazar el runtime, `npm prune --omit=dev`
> DESPUÉS del build. Las imágenes WebP (`public/img/v2/`) ya están commiteadas,
> así que NO hace falta correr `npm run build:images` en el servidor (sharp solo
> se usa a build-time y de forma local/CI).

---

## 4. MariaDB en Plesk

1. Plesk → **Databases** → **Add Database**:
   - DB name: `crudo`.
   - User: `crudo` con password fuerte (no commitear).
2. Crear también `crudo_staging` para el subdominio de staging con un usuario distinto.
3. Apuntar las variables de entorno (`DB_NAME`, `DB_USER`, `DB_PASSWORD`) en cada Node.js app (producción y staging por separado).
4. Acceso CLI desde SSH:
   ```bash
   mysql -u crudo -p crudo
   ```
5. Aplicar migraciones tras cada deploy:
   ```bash
   cd /var/www/vhosts/<domain>/httpdocs
   npm run db:migrate
   ```

> **Nunca** ejecutar `npm run db:seed` en producción. El script aborta automáticamente si `NODE_ENV=production`, pero la disciplina manual es la primera línea.

---

## 5. Variables de entorno

En **Plesk → Node.js → Environment variables**. Nunca subir `.env` al servidor.

Mínimas obligatorias (ver `.env.example` para el set completo):

```
NODE_ENV=production
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=crudo
DB_USER=crudo
DB_PASSWORD=<password fuerte>

JWT_SECRET=<32+ chars aleatorios>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
COOKIE_SECRET=<32+ chars aleatorios>

UPLOADS_DIR=uploads
MAX_UPLOAD_MB=8

CORS_ALLOWED_ORIGINS=https://crudomov.es
PUBLIC_BASE_URL=https://crudomov.es

OWNER_WHATSAPP=<numero interno>
OWNER_EMAIL=<email owner>
PUBLIC_WHATSAPP=<numero publico>
PUBLIC_INSTAGRAM=https://www.instagram.com/crudomov
PUBLIC_GOOGLE_MAPS_URL=<url Google Maps de la tienda>

BREVO_API_KEY=<cuando se active Brevo real>
```

**Variables de build (Vite, leídas al ejecutar `npm run build`)** — deben estar
presentes en el entorno del proceso que hace el build:

```
VITE_API_BASE=/api/v1
VITE_SITE_URL=https://crudomov.es      # canonical/OG/sitemap
VITE_GA_ID=                            # GA4: vacío = analytics off (no-op)
```

> Las `VITE_*` se hornean en el bundle en build-time; cambiarlas exige re-build,
> no solo restart. `VITE_GA_ID` vacío deja Google Analytics desactivado (no
> carga gtag) — rellenar solo cuando el owner entregue el ID.

Generación de secretos seguros (en local, nunca pegar en git):

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

---

## 6. Persistencia de uploads

- La carpeta `uploads/` (raíz del proyecto) **debe sobrevivir entre deploys**.
- Si el deploy borra el directorio, mover `uploads/` fuera de la carpeta de la app y montar un symlink. Plesk respeta los enlaces simbólicos.
- Plesk → **Backup Manager**: incluir explícitamente `uploads/` en el backup diario.
- En Fase 14 se moverá a un volumen separado o a Contabo Object Storage si el volumen lo justifica.

---

## 7. Staging

Objetivo: réplica de producción para QA antes de cada release. **Nunca debe ser indexable ni accesible públicamente sin auth básica**.

1. Plesk → **Add Domain** → `staging.<dominio>`.
2. Crear su propia Node.js app con `NODE_ENV=production` y DB separada (`crudo_staging`).
3. Plesk → **Apache & nginx Settings** → añadir bajo *Additional directives*:
   ```
   add_header X-Robots-Tag "noindex, nofollow" always;
   ```
   Y servir `robots.txt` con `Disallow: /` desde `dist/` o desde un middleware Express en una fase futura.
4. Plesk → **Password Protected Directories** → proteger `/` con basic-auth para todo staging. Compartir credenciales solo con owner + colaboradores.
5. Documentar la URL y credenciales fuera de git (gestor de passwords del owner).

---

## 8. Proceso de deploy (manual, V1)

> Detallado paso a paso en [`infra/scripts/deploy-checklist.md`](../scripts/deploy-checklist.md). Resumen:

```bash
# Conectar al VPS via SSH (Plesk → Subscriptions → SSH access)
ssh <user>@<host>
cd /var/www/vhosts/crudomov.es/httpdocs

# 1. Backup pre-deploy (DB + uploads) — desde Plesk Backup Manager
# 2. Actualizar codigo
git fetch origin
git checkout main
git pull --ff-only

# 3. Instalar dependencias COMPLETAS (build necesita vite/sharp = devDeps)
npm ci

# 4. Migraciones (idempotentes)
NODE_ENV=production npm run db:migrate

# 5. Build frontend → genera dist/ (servido por Express)
NODE_ENV=production npm run build

# 6. (Opcional) adelgazar runtime quitando devDeps DESPUES del build
npm prune --omit=dev

# 7. Reiniciar Node app desde Plesk → Node.js → Restart App
#    (o por CLI: touch tmp/restart.txt si Plesk lo soporta)

# 8. Smoke (ver §9):  BASE_URL=https://crudomov.es ./infra/scripts/smoke.sh
```

> ⚠️ **NO usar `npm ci --omit=dev` antes del build.** `vite` y `sharp` son
> devDependencies; sin ellas `npm run build` falla con "vite: not found". El
> orden correcto es: `npm ci` (completo) → build → `npm prune --omit=dev`.
>
> ⚠️ **`nodenv: command not found`.** Si el deploy por Git de Plesk ejecuta un
> hook con `nodenv`, fallará: este proyecto NO usa nodenv (la versión de Node la
> gestiona Plesk → Node.js 20 LTS). Eliminar cualquier `.node-version`/hook que
> invoque `nodenv` del Git deploy de Plesk. Usar el Node de Plesk directamente.

---

## 9. Smoke checklist post-deploy

Comprobar siempre tras cada deploy a producción y staging. La forma rápida es
ejecutar el script: `BASE_URL=https://crudomov.es ./infra/scripts/smoke.sh`.
Manualmente:

```bash
# Health
curl -fsS https://crudomov.es/api/v1/health | jq .

# Catalogo publico
curl -fsS "https://<dominio>/api/v1/products?size=2" | jq '.items | length'

# Site config publica
curl -fsS https://<dominio>/api/v1/site/config | jq .legal_name

# Admin auth (con credencial real, sin loguear el token)
curl -fsS -X POST https://<dominio>/api/v1/admin/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"<admin email real>","password":"<password real>"}' \
  | jq '.admin'

# Static SPA (cuando exista dist/, devuelve HTML de index)
curl -sI https://<dominio>/ | head -1
```

Verificación visual (cuando exista frontend):
- [ ] Home responde y carga assets.
- [ ] Catálogo de quesos lista productos del seed/admin.
- [ ] Detalle de producto renderiza imágenes desde `/uploads/`.
- [ ] Mi Tabla bloquea variantes de vino (frontend) y backend devuelve 422.
- [ ] Cookie banner aparece (Fase 12).

Verificación staging:
- [ ] `robots.txt` devuelve `Disallow: /`.
- [ ] Header `X-Robots-Tag: noindex, nofollow`.
- [ ] Acceso requiere basic-auth.
- [ ] No aparece en Google `site:staging.<dominio>`.

---

## 10. Rollback manual

Si tras un deploy detectamos regresión:

```bash
cd /var/www/vhosts/<domain>/httpdocs
# Ver últimos 10 commits
git log --oneline -10
# Reset duro al commit estable previo
git reset --hard <commit-hash>
npm ci
npm run build
npm prune --omit=dev
# Reiniciar app desde Plesk
```

Si la migración rompe el schema:

1. Restaurar DB desde backup Plesk inmediatamente anterior.
2. Hacer rollback de código al tag previo.
3. Investigar la migración fallida en local antes de reintentar.

---

## 11. Backups

Ver [`infra/scripts/backup-notes.md`](../scripts/backup-notes.md) para el detalle completo (DB, uploads, `.env`, retención, restore test).

Resumen mínimo:
- Plesk Backup Manager: diario, retención 30 días, destino remoto (FTP externo o Contabo Object Storage).
- Restore test trimestral en staging.

---

## 12. Seguridad mínima

- HTTPS siempre (Let's Encrypt vía Plesk, renovación automática).
- Firewall Contabo: solo 80/443/22 abiertos. Plesk panel (8443) con IP whitelist.
- SSH solo con clave pública (`PasswordAuthentication no` en `/etc/ssh/sshd_config`).
- `JWT_SECRET` y `COOKIE_SECRET` rotados cada 6 meses o tras cualquier sospecha de compromiso.
- Plesk → **Web Application Firewall (ModSecurity)**: activar reglas OWASP CRS.
- Logs Plesk (Apache/nginx access + Node.js stdout): revisar semanalmente.
- Secretos nunca en commits ni en archivos `.env` del servidor (solo panel Plesk).
