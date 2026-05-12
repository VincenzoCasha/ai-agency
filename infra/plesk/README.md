# CRUDO V1 — Despliegue en Plesk / Contabo

Guía operativa para staging y producción. **No ejecuta deploys automáticos**: documenta los pasos manuales que corre el owner desde Plesk + SSH.

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
| Producción | _pendiente_ (recomendado `crudo.es`) | Owner debe registrar y apuntar DNS al IP del VPS. |
| Staging | `staging.<dominio>` | Subdominio Plesk, **noindex + basic-auth** (ver §7). |

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
4. Tras un cambio de código:
   - File Manager: subir cambios o usar **Git** integrado de Plesk apuntando al repo.
   - Plesk → **Node.js** → **NPM Install** (instala según `package.json`).
   - Plesk → **Node.js** → **Run script: build** (cuando Fase 7 active el build Vite).
   - Plesk → **Node.js** → **Restart App**.

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

CORS_ALLOWED_ORIGINS=https://<dominio>
PUBLIC_BASE_URL=https://<dominio>

OWNER_WHATSAPP=<numero interno>
OWNER_EMAIL=<email owner>
PUBLIC_WHATSAPP=<numero publico>
PUBLIC_INSTAGRAM=https://www.instagram.com/crudoquesos
PUBLIC_GOOGLE_MAPS_URL=<url Google Maps de la tienda>

BREVO_API_KEY=<cuando se active Brevo real>
```

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
cd /var/www/vhosts/<domain>/httpdocs

# 1. Backup pre-deploy (DB + uploads) — desde Plesk Backup Manager
# 2. Actualizar codigo
git fetch origin
git checkout main
git pull --ff-only

# 3. Instalar dependencias
npm ci --omit=dev

# 4. Migraciones (idempotentes)
npm run db:migrate

# 5. Build frontend (cuando exista, Fase 7)
npm run build

# 6. Reiniciar Node app desde Plesk → Node.js → Restart App
#    (o por CLI: touch tmp/restart.txt si Plesk lo soporta)

# 7. Smoke (ver §9)
```

---

## 9. Smoke checklist post-deploy

Comprobar siempre tras cada deploy a producción y staging:

```bash
# Health
curl -fsS https://<dominio>/api/v1/health | jq .

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
npm ci --omit=dev
npm run build
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
