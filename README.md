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

## Comandos

> Los comandos siguientes se crearán en la Fase 1. Están documentados aquí como referencia.

```bash
# Desarrollo local (Vite + Express en paralelo)
npm run dev

# Build frontend para producción
npm run build

# Arrancar servidor de producción (sirve dist/ + API)
npm start

# Tests
npm test

# Linter
npm run lint

# Migraciones de base de datos
npm run db:migrate

# Seeds de datos locales
npm run db:seed
```

---

## Reglas críticas de V1

- **Sin pago online activo en V1.** El pago se realiza en CRUDO al recoger.
- **Sin venta online de alcohol.** Los vinos no son reservables digitalmente.
- Las tablas/cajas para llevar con maridaje de vino (blanco o tinto) redirigen a WhatsApp; solo la variante sin maridaje entra en *Mi Tabla*.
- *Mi Tabla* solo admite productos no alcohólicos.
- El backend rechaza `POST /api/v1/pickup-orders` con **HTTP 422** si algún ítem tiene `is_alcohol=true`.
- Stripe existe solo como placeholder para V2; no hay flujo de pago activo en V1.
- No describir CRUDO como "wine bar" en copy público.

---

## Despliegue previsto

- **Servidor:** Contabo VPS
- **Panel:** Plesk (dominio, SSL, Node.js app, MariaDB, backups)
- **Staging:** subdominio de Plesk (por configurar)
- **Producción:** dominio principal (por adquirir)

Ver `infra/plesk/README.md` para instrucciones detalladas.

---

## Estado de fases

Ver `docs/V1/V1Tecnico.md §0.1` para el estado vivo actualizado de cada fase.

> **Fase 0** (preparación, repo y contexto) → en progreso.
> **Fase 1** (scaffold monolito Node.js Express) → pendiente.
