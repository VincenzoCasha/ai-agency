# CRUDO V1 — Backups y restore

Estrategia mínima viable para V1. Producción se respalda **diariamente** con retención de **30 días**, destino externo. El restore se prueba trimestralmente en staging.

---

## 1. Qué se respalda

| Activo | Origen | Frecuencia | Retención |
|--------|--------|-----------|-----------|
| Base de datos MariaDB (`crudo`) | Plesk Backup Manager | Diaria | 30 días |
| `uploads/` (imágenes admin) | Plesk Backup Manager | Diaria | 30 días |
| Código de la app | Git (origin/main) | Por commit | ∞ (en GitHub) |
| `.env` (variables Plesk) | Gestor de passwords del owner | Manual al cambiar | n/a |
| Snapshot Contabo VPS | Panel Contabo | Semanal (si plan lo incluye) | 4 últimas |

> El código vive en GitHub. **El backup crítico es DB + uploads + `.env`**.

---

## 2. Plesk Backup Manager — programación

Plesk → **Tools & Settings** → **Backup Manager** → **Settings**:

- **Backup content**: User files and databases (incluye `httpdocs/uploads/`).
- **Schedule**: Daily a las 04:00 hora servidor (baja carga).
- **Retention**: 30 días.
- **Storage**: FTP externo *o* Contabo Object Storage. **Nunca** mantener backups solo en el mismo VPS.
- **Encryption**: activar passphrase (guardar en gestor de passwords del owner).

Plesk → **Backup Manager** → **Back Up** (manual antes de cada deploy de producción).

---

## 3. Backup manual desde SSH (apoyo, no sustituye Plesk)

```bash
# DB dump
mysqldump --single-transaction -u crudo -p crudo \
  > "backup-crudo-$(date -u +%Y%m%d-%H%M%S).sql"

# uploads tarball
tar -czf "backup-uploads-$(date -u +%Y%m%d-%H%M%S).tar.gz" uploads/

# Subir fuera del VPS (ejemplo con scp a host externo)
scp backup-*.sql backup-*.tar.gz user@external-host:/backups/crudo/
```

Borra los archivos locales tras subirlos: `rm backup-*.sql backup-*.tar.gz`.

---

## 4. Restore test trimestral (en staging)

**Obligatorio**: cada trimestre, restaurar el último backup en staging y verificar que la web vuelve a funcionar.

```bash
# 1. Descargar backup desde Plesk a un directorio temporal
ssh <user>@<host>
mkdir -p ~/restore-test && cd ~/restore-test
# (descargar el .sql y .tar.gz desde Plesk Backup Manager o storage externo)

# 2. Crear DB temporal y restaurar
mysql -u root -p -e "CREATE DATABASE crudo_restore_test CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p crudo_restore_test < backup-crudo-YYYYMMDD-HHMMSS.sql

# 3. Verificar conteo basico
mysql -u root -p crudo_restore_test -e "SELECT COUNT(*) AS products FROM product; SELECT COUNT(*) AS orders FROM pickup_order;"

# 4. Restaurar uploads en directorio aparte
tar -xzf backup-uploads-YYYYMMDD-HHMMSS.tar.gz -C /tmp/uploads-restore-test

# 5. Apuntar staging temporal a esta DB y verificar smoke
#    Plesk → Node.js (staging) → Environment variables → DB_NAME=crudo_restore_test
#    Restart App
curl -fsS https://staging.<dominio>/api/v1/health | jq .
curl -fsS "https://staging.<dominio>/api/v1/products?size=3" | jq '.items[0]'

# 6. Limpieza
mysql -u root -p -e "DROP DATABASE crudo_restore_test;"
rm -rf /tmp/uploads-restore-test ~/restore-test
# Volver staging a su DB normal
```

Documentar en log interno: fecha, duración del restore, cualquier inconsistencia detectada.

---

## 5. Recuperación ante desastre

Escenario: VPS Contabo perdido o comprometido.

1. **Provisionar nuevo VPS Contabo** y reinstalar Plesk con la misma cuenta.
2. **Restaurar dominio** y SSL Let's Encrypt.
3. **Restaurar `.env`** desde gestor de passwords del owner.
4. **Restaurar DB** desde backup Plesk (último diario).
5. **Restaurar `uploads/`** desde backup Plesk.
6. **Clonar código** desde GitHub: `git clone <repo> && cd <repo> && git checkout <tag-prod-actual>`.
7. **Variables Plesk** → reaplicar todas las del entorno.
8. **`npm ci --omit=dev && npm run db:migrate && npm run build`** (build cuando exista frontend).
9. **Restart Node.js app** desde Plesk.
10. Smoke completo (ver `infra/plesk/README.md` §9).

Tiempo objetivo de recuperación (RTO): **< 4 horas** desde detección.
Pérdida máxima de datos aceptable (RPO): **< 24 horas** (frecuencia del backup diario).

---

## 6. Reglas no negociables

- **Nunca** mantener backups solo en el VPS de producción.
- **Nunca** ejecutar `npm run db:seed` ni `npm run db:reset` en producción (los scripts abortan si `NODE_ENV=production`, pero la disciplina manual es la primera línea).
- **Nunca** versionar `.env`, `*.sql`, `*.tar.gz` en git.
- Cada cambio de password de admin / secretos JWT → forzar nuevo backup inmediato.
- Plesk Backup Manager con storage cifrado o FTP sobre TLS; jamás backups en HTTP plano.
