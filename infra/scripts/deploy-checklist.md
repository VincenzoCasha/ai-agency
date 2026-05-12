# CRUDO V1 — Checklist de despliegue manual

Siempre, antes y después de cada deploy a producción. Staging usa el mismo flujo pero sin requerir backup pre-deploy obligatorio.

---

## Antes del deploy

- [ ] PR mergeado a `main` con CI verde (`pr.yml`).
- [ ] Tag de versión creado en GitHub (`v0.X.Y`).
- [ ] Backup manual de DB + uploads desde Plesk Backup Manager.
- [ ] Verificar logs Plesk de la última hora limpios.
- [ ] Avisar al owner si la ventana de cambios afecta horario de servicio.

---

## Deploy (SSH al VPS)

```bash
ssh <user>@<host>
cd /var/www/vhosts/<domain>/httpdocs

# 1. Sincronizar codigo
git fetch origin
git checkout main
git pull --ff-only

# 2. Instalar dependencias (sin devDeps)
npm ci --omit=dev

# 3. Migraciones (idempotentes)
NODE_ENV=production npm run db:migrate
# Verificar salida: "aplicadas=N omitidas=M"

# 4. Build frontend (cuando Fase 7 exista)
NODE_ENV=production npm run build

# 5. Reiniciar app desde Plesk → Node.js → Restart App
#    (no hay comando CLI universal; algunos Plesk soportan: touch tmp/restart.txt)
```

---

## Smoke post-deploy

- [ ] `curl -fsS https://<dominio>/api/v1/health` devuelve `status: ok`.
- [ ] `curl -fsS "https://<dominio>/api/v1/products?size=2"` devuelve items.
- [ ] `curl -fsS https://<dominio>/api/v1/site/config` devuelve `legal_name`.
- [ ] Login admin funciona y devuelve `access_token`.
- [ ] `curl -fsS https://<dominio>/uploads/<imagen-real>` devuelve la imagen.
- [ ] (Cuando exista frontend) home `/` carga HTML con `<title>CRUDO</title>`.
- [ ] (Staging) `robots.txt` contiene `Disallow: /` y header `X-Robots-Tag: noindex, nofollow`.

---

## Si algo falla

1. **No tocar nada en caliente**.
2. Revisar logs: Plesk → **Logs** → Node.js stdout/stderr.
3. Reproducir el problema en local con la misma versión del tag.
4. Si es severo, ejecutar **rollback manual**:
   ```bash
   git reset --hard <commit-anterior-estable>
   npm ci --omit=dev
   npm run build
   # Restart App
   ```
5. Si la migración rompió el schema, restaurar DB desde el backup pre-deploy y luego rollback.
6. Documentar incidente en un issue de GitHub con: timestamps, comandos, logs relevantes (sin PII).

---

## Después del deploy

- [ ] Anotar fecha/hora/tag desplegado en log interno.
- [ ] Verificar Plesk Backup Manager corrió en las últimas 24 h.
- [ ] Comprobar Sentry/logs por errores nuevos en las primeras 30 min (cuando se active monitoring).
- [ ] Cerrar el tag en GitHub Releases con notas legibles para el owner.
