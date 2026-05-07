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

mysql -u root -e "
  CREATE DATABASE IF NOT EXISTS crudo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  CREATE USER IF NOT EXISTS 'crudo'@'localhost' IDENTIFIED BY 'change_me';
  GRANT ALL PRIVILEGES ON crudo.* TO 'crudo'@'localhost';
  FLUSH PRIVILEGES;
"
```

### Opción B — Docker

```bash
docker run -d \
  --name crudo-mariadb \
  -e MARIADB_ROOT_PASSWORD=root \
  -e MARIADB_DATABASE=crudo \
  -e MARIADB_USER=crudo \
  -e MARIADB_PASSWORD=change_me \
  -p 3306:3306 \
  mariadb:10.11
```

---

## 4. Migraciones y seeds

```bash
# Ejecutar todas las migraciones pendientes
npm run db:migrate

# Revertir última migración
npm run db:migrate:rollback

# Cargar datos de prueba locales
npm run db:seed
```

Los archivos SQL viven en `db/migrations/` (nombrados `V001__descripcion.sql`) y `db/seeds/`.

---

## 5. Build para producción

```bash
# Compilar frontend (genera dist/)
npm run build

# Arrancar servidor de producción (sirve dist/ + API Express)
npm start
```

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
