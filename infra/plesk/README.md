# CRUDO V1 — Despliegue en Plesk / Contabo

Guía de infraestructura para el servidor de producción y staging.

---

## Servidor

- **Proveedor:** Contabo VPS
- **Panel de control:** Plesk
- **Sistema operativo:** Linux (Ubuntu 22.04 LTS recomendado)

---

## Dominio y SSL

1. Registrar dominio (pendiente — recomendación: `crudo.es`).
2. Apuntar DNS al IP del servidor Contabo.
3. En Plesk: **Websites & Domains** → añadir dominio → activar **Let's Encrypt** (SSL gratuito automático).
4. Crear subdominio `staging.crudo.es` para el entorno de pruebas.

---

## Node.js App en Plesk

1. En Plesk: **Node.js** → "Add Node.js App".
2. Configurar:
   - **Document root:** `/httpdocs` (o la carpeta raíz del proyecto)
   - **Application root:** `/httpdocs`
   - **Application startup file:** `server.js`
   - **Node.js version:** 20 LTS
3. Variables de entorno: añadir en la sección de Node.js app (nunca en archivos `.env`).
4. Comandos a ejecutar tras cada despliegue:

```bash
npm install --omit=dev
npm run build
# Plesk reinicia la app automáticamente si está configurado
```

---

## MariaDB en Plesk

1. En Plesk: **Databases** → "Add Database".
2. Crear base de datos `crudo` con usuario `crudo`.
3. Apuntar en `.env` (solo local; en Plesk usar variables de entorno del panel).
4. Para acceder via CLI:

```bash
mysql -u crudo -p crudo
```

---

## Variables de entorno en Plesk

**Nunca subir `.env` al servidor.** Configurar en el panel:

Plesk → Node.js → Environment variables:

```
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=crudo
DB_USER=crudo
DB_PASSWORD=<valor real>
JWT_SECRET=<valor real — mínimo 32 chars>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
COOKIE_SECRET=<valor real — mínimo 32 chars>
UPLOADS_DIR=uploads
MAX_UPLOAD_MB=8
OWNER_WHATSAPP=<número real>
OWNER_EMAIL=<email real>
VITE_API_BASE=/api/v1
... (resto de variables)
```

---

## Backups

### Base de datos

- En Plesk: **Backup Manager** → programar backup diario de base de datos.
- Retención recomendada: 14 días.
- Destino: almacenamiento remoto (FTP externo o Contabo Object Storage).

### Archivos (uploads)

- Incluidos en el backup de archivos de Plesk.
- La carpeta `uploads/` contiene las imágenes subidas por el admin.

### Backup manual

```bash
# Dump de base de datos
mysqldump -u crudo -p crudo > backup_$(date +%Y-%m-%d).sql

# Comprimir uploads
tar -czf uploads_$(date +%Y-%m-%d).tar.gz uploads/
```

---

## Proceso de despliegue

```bash
# En el servidor (via SSH o Plesk File Manager)
cd /httpdocs
git pull origin main
npm install --omit=dev
npm run db:migrate
npm run build
# Reiniciar app desde Plesk → Node.js → Restart App
```

---

## Notas de seguridad básicas

- Usar HTTPS siempre (Let's Encrypt vía Plesk).
- Nunca exponer el panel de Plesk en el puerto 8443 sin IP whitelist.
- Acceso SSH solo por clave pública (deshabilitar login por contraseña).
- Firewall Contabo: abrir solo puertos 80, 443 y 22.
- No almacenar secretos en el repositorio (ni en `.env` subidos).
- Revisar logs de acceso semanalmente desde Plesk → Logs.
