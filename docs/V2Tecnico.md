# CRUDO - V2 Tecnico para Claude Code Opus

Documento operativo para implementar la V2 de CRUDO con Claude Code Opus.

Este documento SI es el plan tecnico por fases. No sustituye al contexto de V1,
pero lo aterriza para V2.

Fuentes obligatorias antes de cualquier fase:

- `docs/V2-recordatorio.md`
- `docs/V1/V1Tecnico.md`
- `docs/AGENTS_Javi.md`
- `README.md`
- Nuevo diseno Claude Design/Piscolabis:
  `C:\Users\Vincenzo\Downloads\Crudo by Piscolabis`

Regla principal: Opus NO debe implementar todas las fases del tiron. Debe hacer
una fase por sesion, verificarla, actualizar el estado vivo y parar.

---

## 0. Como usar este documento

1. Abrir una sesion nueva de Opus por fase o subfase.
2. Pegar primero el "Prompt base fijo V2".
3. Pegar despues el prompt de la fase que toque.
4. No avanzar a la siguiente fase si build, tests y criterios de aceptacion no
   estan verdes o si los bloqueos no estan documentados.
5. Si Opus propone cambiar alcance, meter pagos, vender alcohol online, crear un
   ecommerce completo o rehacer la arquitectura sin razon, debe justificarlo
   contra este documento, `V2-recordatorio.md` y `V1Tecnico.md`.
6. Si hay conflicto entre documentos:
   - primero seguridad/legal/no secretos;
   - despues este `V2Tecnico.md`;
   - despues `V2-recordatorio.md`;
   - despues estado real del codigo;
   - despues `V1Tecnico.md` como historico.
7. No modificar `docs/AGENTS_Javi.md`.

---

## 0.1 Estado vivo del proyecto V2

Opus debe leer y actualizar SOLO este bloque al cerrar cada fase con cambios
reales.

```yaml
project: CRUDO V2
state_version: 9
last_updated: 2026-06-05
current_phase: 8
current_phase_name: "SEO, legal, cookies y analytics"
current_focus: "Fase 8 ejecutada. Cookies/consent YA existian (consent.js modelo AEPD + CookieBanner accept/reject/configure; analytics consent-aware). Añadido: public/robots.txt (disallow /admin) + public/sitemap.xml (11 rutas, dominio crudomov.es a confirmar). Nuevo src/hooks/useSeo.js (sin react-helmet: title+description+canonical+OG+Twitter por ruta; SITE_URL via VITE_SITE_URL default crudomov.es) aplicado a Home/Seleccion/Eventos/EventDetail/Tablas/Merch/Contacto/Legal. index.html: OG por defecto + canonical + JSON-LD Store (LocalBusiness, NO wine bar, horarios reales). Nuevo EventJsonLd.jsx: schema.org/Event en detalle con offer (sin pago online). GA4 conectado en analytics.js: gtag se carga PEREZOSO solo si VITE_GA_ID existe Y hay consentimiento analytics (anonymize_ip, allow_google_signals=false, sin PII); si no hay ID, no-op. LegalPage: datos confirmados (CRUDO QUESOS S.L.U, CIF B-19953694, dir.) + aviso +18/no venta alcohol online/no pago online; marcado como pendiente de validacion legal del titular. Verificado: lint limpio, test:client 90/90, build OK, robots+sitemap copiados a dist. Pendiente owner: GA4 ID, decision Meta Pixel, validacion legal final, confirmar dominio .es vs .com. Fases previas: 0,2,3,4,5,6,7.\nNOTA Fase 7: panel admin mobile-first panel admin mobile-first sobre /api/v1/admin/**. /admin deja de ser placeholder (AdminEntryPage.jsx eliminado). Nuevos: src/lib/adminApi.js (axios base /api/v1/admin, Authorization Bearer, refresh automatico en 401 una vez, tokens en localStorage con riesgo XSS documentado), src/hooks/useAdminAuth.jsx (context login/logout/persistencia), components/admin/AdminShell.jsx (layout movil + bottom-nav 4 tabs, targets >=44px), components/admin/RequireAdmin.jsx (guard → redirige a /admin si no auth). Paginas: AdminLoginPage (email/password, contrato access_token/refresh_token/admin), AdminDashboardPage (pickups hoy, eventos proximos, consultas nuevas, alertas disponibilidad, pedidos nuevos), AdminProductsPage (lista + buscador + toggle disponibilidad IN_STOCK/LOW/OUT via PATCH /products/:id/stock, usa availability.js, wine guard VISIBLE 'Vino · solo WhatsApp'), AdminEventsPage (lista + estado publicado/oculto), AdminOrdersPage (lista + flujo de estado NEW→CONFIRMED→READY→PICKED_UP / CANCELLED via PATCH). Rutas anidadas /admin/* en routes.jsx (chunks admin 3-6KB separados, no afectan bundle publico). Verificado: lint limpio, test:client 90/90, build OK sin warning. Smoke admin en navegador PENDIENTE de validar por usuario (necesita backend+DB+seed). NO implementado en esta fase (cola Fase 7+): CRUD completo crear/editar producto y evento, subida de imagenes, consultas/newsletter UI, ajustes (pickup paused/capacidad). El admin actual cubre las acciones diarias criticas. Fases previas: 0,2,3,4,5,6.\nNOTA Fase 6: ejecutada. Hallazgo: el modelo YA era editorial Hallazgo: el modelo YA era editorial (no hay inventario por unidades en ningun sitio). DB usa stock_status enum (IN_STOCK/LOW/OUT) + is_active para ocultar; catalogo publico ya filtra is_active=1; validador admin acepta stock_status + is_active sin pedir cantidades; no hay texto 'stock' visible al cliente (solo identificadores de codigo). No hace falta migracion. Entregables: nuevo src/lib/availability.js como fuente unica de copy editorial (Disponible/Pocas unidades/Agotado + Oculto via is_active; tonos; OWNER_AVAILABILITY_OPTIONS para admin Fase 7). StockBadge refactorizado para usar availability.js (sin cambio de comportamiento). docs/owner-admin-guide.md: seccion reescrita 'Disponibilidad de un producto (no es inventario)' con tabla de 4 estados. Mi Tabla intacto (precios desde DB; alcohol guard backend sin tocar). Verificado: lint limpio, test:client 90/90, build OK; alcohol guard = tests server (necesitan DB, no ejecutados local pero backend no modificado). Fases previas: 0,2,3,4,5.\nNOTA Fase 5: ejecutada (alcance acotado a consumo de assets V2 + alineacion de componentes clave, sin reescritura total). Nuevo componente ResponsiveImage (src/components/ui/ResponsiveImage.jsx) que sirve WebP responsive del manifest v2Assets con srcSet/sizes y art-direction opcional (mobile distinto). Conectado en pantallas prioritarias: Hero home (picture art-directed: movil 4:5 / desktop 16:10, eager), TablasPage hero (tablas-hero), EventsPage hero (eventos-hero), ContactPage hero (lifestyle-bodegon), CategoryStrips home (3 strips → seleccion-hero/lifestyle-bodegon/eventos-hero con srcSet), EventDetail FALLBACK_HERO (eventos-hero), ProductCard fallbacks 1:1 (fallback-queso/fallback-maridaje con srcSet) + hover lift del diseño. Enlaces internos primarios apuntan a /seleccion (Home primaryHref + Hero default). ProductCard ya respetaba regla alcohol (vino→WhatsApp, no-alcohol→Añadir). Bundle: vendor-ui nuevo (cva+clsx+tailwind-merge 21KB) → index 479.57KB (gzip 131KB), warning eliminado. Test ProductCard actualizado a nuevos alt del manifest. Verificado: lint limpio, test:client 90/90, build OK sin warning. Smoke visual en navegador PENDIENTE de validar por usuario (npm run dev; backend necesita DB). Pendiente Fase 5 ampliada (futuro): alinear fino Footer/ContactPage layout/eyebrow-pill al mockup; no critico. Fases previas: 0,2,3,4.\nNOTA Fase 4: pipeline de imagenes con sharp (devDependency, solo build-time). Script idempotente scripts/build-images.mjs (npm run build:images) config-driven: 11 roles curados desde fotos alta-res ya en repo, recortados por ratio con gravedad attention (recorte inteligente del sujeto). Genera 27 WebP responsive en public/img/v2/: home-hero (16:10 768/1200/1800) + home-hero-mobile (4:5 480/768), seleccion-hero (16:9), tablas-hero (16:10), eventos-hero (16:9), evento-poster-telperion (3:4 480/768/1000), contacto-local (16:9), fallbacks 1:1 queso/maridaje/tabla (400/800), lifestyle-bodegon. Total v2 = 1.0MB (vs 12MB originales); mayor archivo 92KB (vs 3.3MB originales about/*.jpg). Manifest autogenerado src/lib/v2Assets.js con {alt, ratio, width, height, src, srcSet} por rol — listo para consumir en Fase 5 (aun NO referenciado por componentes). Originales V1 intactos (no se borra nada). Verificado: build:images OK, manifest valido (11 roles), lint limpio, test:client 90/90, build OK sin warning. Fases previas: 0 auditoria, 3 code splitting, 2 intake diseño (spec seccion 17)."
next_recommended_prompt: "Fase 9 - E2E/QA/performance (rinde mas con app+DB; parte avanzable) o Fase 1 - Plesk cuando haya acceso. Colas: alineacion fina Footer/Contact (Fase 5); CRUD completo + imagenes + ajustes admin (Fase 7). Fase 10 limpieza y Fase 11 launch al final."
historial_fases: "0 auditoria inicial (REVIEW_READY); 3 code splitting index 763→496KB (REVIEW_READY); 2 intake diseño spec seccion 17 (REVIEW_READY); 4 pipeline imagenes 27 WebP + manifest (REVIEW_READY). Pendientes heredados: admin frontend movil NO implementado (/admin placeholder); Plesk sin smoke; contenido real Annet; inconsistencia menor PUBLIC_INSTAGRAM crudoquesos vs crudomov anotada para Fase 5/8."
overall_status: "IN_PROGRESS"
```

### Hallazgos auditoria Fase 0 (2026-06-05)

- **Repo**: rama `main`, working tree limpio (solo worktrees `.claude/` sin trackear, inofensivos). HEAD `936eade`.
- **Env requeridas en produccion** (`server/config/env.js`): `JWT_SECRET`, `COOKIE_SECRET`, `DB_PASSWORD` (lanza error si faltan en prod). Otras relevantes: `DB_HOST/PORT/NAME/USER`, `JWT_EXPIRES_IN` (default 15m), `BREVO_API_KEY` (vacio), `OWNER_WHATSAPP/EMAIL`, `PUBLIC_WHATSAPP/INSTAGRAM/GOOGLE_MAPS_URL`.
- **Inconsistencia menor detectada**: `env.js` default `PUBLIC_INSTAGRAM=crudoquesos` pero el resto del proyecto (siteConfig fallback, Header, MerchPage) usa `crudomov`. No se corrige en Fase 0 (no tocar codigo); anotar para Fase 5/8.
- **Health/API**: `/api/v1/health` existe y esta montado. Smoke de produccion NO ejecutado (sin acceso a crudomov.es).
- **Admin backend**: 9 grupos de rutas montados bajo `/api/v1/admin` (auth, dashboard, products, events, campaigns, inquiries, pickup-orders, event-reservations, site-config). Admin frontend pendiente (Fase 7).
- **Diseño Claude Design**: accesible localmente (zip + extract). La ruta `C:\Users\Vincenzo\...` del doc es del compañero, no de esta maquina.
- **Bloqueos reales**: (1) Plesk/produccion sin verificar — owner configurando DB. (2) Contenido real de Annet pendiente (no bloquea codigo). (3) Acceso SSH a Contabo bloqueado anteriormente por Fail2Ban.

### Leyenda de estados

- `NOT_STARTED`: no empezada.
- `IN_PROGRESS`: en implementacion.
- `BLOCKED`: no se puede avanzar sin acceso, decision o contenido.
- `REVIEW_READY`: implementada y verificada tecnicamente.
- `DONE`: revisada y aceptada por humano.
- `DEFERRED`: aplazada explicitamente a V2.1/V3.

### Fases V2

| Fase | Nombre | Estado | Objetivo |
|------|--------|--------|----------|
| 0 | Preparacion V2 y auditoria inicial | REVIEW_READY | Sincronizar contexto, repo, Plesk, diseño y riesgos antes de tocar codigo. |
| 1 | Produccion/Plesk y deploy reproducible | NOT_STARTED | Verificar crudomov.es, env, DB, build, migraciones, SSL y smoke. |
| 2 | Intake del nuevo diseño Claude Design | REVIEW_READY | Extraer tokens, rutas, componentes y decisiones mobile-first del ZIP. |
| 3 | Arquitectura frontend V2 y code splitting | REVIEW_READY | Preparar rutas lazy, shell mobile-first y base para rediseño sin romper reglas. |
| 4 | Pipeline de imagenes y curacion de assets | REVIEW_READY | Usar fotos V1, generar WebP/thumbnails/srcset y mapear assets por seccion. |
| 5 | Frontend publico V2 mobile-first | REVIEW_READY | Implementar Home, Seleccion del mes, Eventos, Tablas/Cajas, Merch y Contacto con el nuevo diseño. (Base hecha: assets V2 + componentes clave alineados; alineacion fina Footer/Contact en cola.) |
| 6 | Modelo editorial V2: DB/API sin stock real | REVIEW_READY | Simplificar disponibilidad, contenido editable y reglas de productos/tablas. (Modelo ya editorial; centralizado copy en availability.js + doc owner.) |
| 7 | Admin movil V2 | REVIEW_READY | Construir UI admin mobile-first sobre backend existente. (Login+dashboard+productos/disponibilidad+eventos+pedidos hechos; CRUD completo/imagenes/ajustes en cola.) |
| 8 | SEO, legal, cookies y analytics | REVIEW_READY | Robots, sitemap, OG, JSON-LD, canonical, legal, cookies y medicion consent-aware. (Cookies ya existian; añadido SEO completo + GA4 gated + aviso legal +18.) |
| 9 | E2E, accesibilidad, performance y QA | NOT_STARTED | Playwright, Lighthouse, checks mobile y regresiones criticas. |
| 10 | Limpieza de codigo y repositorio | NOT_STARTED | Quitar codigo, assets y dependencias no usados con pruebas, sin romper V2 ni historial util. |
| 11 | Contenido final, demo data y launch readiness | NOT_STARTED | Cargar contenido/fallbacks, limpiar placeholders, checklist deploy y handoff. |

### Pendientes criticos heredados

- Admin frontend movil no implementado.
- Nuevo diseño Claude Design mobile-first no implementado.
- Pipeline de imagenes WebP/srcset pendiente.
- SEO/prerender/robots/sitemap/canonical/OG/JSON-LD pendientes o parciales.
- E2E/QA/performance pendientes.
- Limpieza de codigo/repositorio pendiente: quitar solo cosas no usadas y verificadas.
- Contenido real de Annet pendiente en varias partes.
- Merch real/URL final pendiente.
- Fotos especificas de producto 1:1, tablas/cajas y merch pendiente.
- Legal/Brevo/GA4 pendiente de owner.
- Produccion Plesk marcada como probablemente hecha, pero debe verificarse con
  smoke.

### Reglas no negociables heredadas

- No venta online de alcohol.
- No pago online integrado salvo decision explicita y validacion legal.
- Vinos y maridajes se gestionan por WhatsApp.
- Mi Tabla solo admite productos no alcoholicos.
- El backend debe seguir bloqueando alcohol con 422.
- No confiar solo en UI para reglas legales.
- CRUDO se comunica como tienda de quesos primero. No llamarlo "wine bar".
- Admin para owner single-operator: menos de 5 minutos al dia, movil primero.

---

## 1. Prompt base fijo V2

Copiar al inicio de cada sesion de Opus:

```text
Estas trabajando en CRUDO V2.

No implementes todas las fases del tiron. Implementa SOLO la fase que te pida en esta sesion.

Antes de tocar codigo:
1. Lee `docs/V2Tecnico.md`, especialmente `0.1 Estado vivo del proyecto V2`.
2. Lee `docs/V2-recordatorio.md`.
3. Lee `docs/V1/V1Tecnico.md` solo para entender estado heredado y reglas no negociables.
4. Lee `README.md`, `package.json`, rutas frontend, backend relevante y `git status --short`.
5. No modifiques `docs/AGENTS_Javi.md`.
6. No metas pago online ni venta online de alcohol.
7. No conviertas la web en ecommerce/ERP. V2 es visibilidad, promocion, reservas, takeaway y WhatsApp.
8. Respeta mobile-first y el nuevo diseno Claude Design/Piscolabis cuando toque frontend.
9. Si falta contenido de Annet, usa fallback editorial documentado y no bloquees el codigo salvo que sea imprescindible.
10. Al final ejecuta verificaciones razonables: lint, tests, build y smoke si aplica.
11. Actualiza solo el bloque `0.1 Estado vivo del proyecto V2` de `docs/V2Tecnico.md` con fase, estado, resumen, verificacion y siguiente prompt.

Entrega final:
- Que fase hiciste.
- Archivos modificados.
- Verificaciones ejecutadas y resultado.
- Bloqueos o pendientes reales.
- Siguiente fase recomendada.
```

---

## 2. Fase 0 - Preparacion V2 y auditoria inicial

Objetivo: no programar features nuevas. Confirmar estado real del repo, Plesk,
V1, V2-recordatorio y diseño Claude Design.

### Prompt para Opus

```text
Usa el Prompt base fijo V2.

Implementa SOLO la Fase 0: preparacion V2 y auditoria inicial.

Objetivo:
Sin crear funcionalidades nuevas, sincroniza el contexto real de CRUDO V2 para que las siguientes fases no empiecen con supuestos falsos.

Tareas:
1. Lee:
   - `docs/V2Tecnico.md`
   - `docs/V2-recordatorio.md`
   - `docs/V1/V1Tecnico.md` seccion 0.1 y reglas no negociables
   - `README.md`
   - `package.json`
   - `src/routes.jsx`
   - `src/components/layout/Header.jsx`
   - `src/pages/AdminEntryPage.jsx`
   - `server/app.js`
   - `server/config/env.js`
2. Revisa `git log --oneline -10` y `git status --short`.
3. Comprueba si existe localmente el diseño:
   `C:\Users\Vincenzo\Downloads\Crudo by Piscolabis`
   Si no tienes acceso, documenta el bloqueo.
4. Revisa rapidamente carpetas de fotos disponibles:
   - `docs/V1/Photos`
   - `docs/V1/Photos/Fotos Crudo Morning/Chosen ones`
   - `public/img`
5. No cambies codigo salvo que detectes docs inconsistentes menores.
6. Actualiza `docs/V2Tecnico.md` seccion 0.1 con:
   - estado real de fases
   - commits posteriores a V1Tecnico
   - bloqueos reales
   - siguiente fase recomendada

Criterios de aceptacion:
- Estado vivo V2 refleja el repo real.
- Queda claro que esta implementado y que no.
- Queda claro si el diseño Claude Design esta accesible.
- Queda claro si Plesk esta verificado o pendiente de smoke.

Verificacion:
- `git status --short`
- no hace falta `npm test` ni `npm run build` si no se toca codigo.
```

---

## 3. Fase 1 - Produccion/Plesk y deploy reproducible

Objetivo: dejar `crudomov.es` verificable y reproducible. Esta fase no debe
depender de rediseño ni contenido final.

### Prompt para Opus

```text
Usa el Prompt base fijo V2.

Implementa SOLO la Fase 1: produccion/Plesk y deploy reproducible.

Objetivo:
Verificar que crudomov.es funciona con la ultima version desplegada, que la app Node arranca, que el frontend build esta actualizado y que la API responde.

Contexto:
El owner cree que Plesk ya esta configurado. Tratalo como hecho pendiente de verificacion. No asumas que esta correcto sin smoke.

Tareas:
1. Revisa docs existentes:
   - `infra/plesk/README.md`
   - `infra/scripts/deploy-checklist.md`
   - `docs/runbook.md`
   - `.env.example`
2. Revisa `server/config/env.js` para variables obligatorias.
3. Verifica localmente:
   - `npm run build`
   - `npm run lint`
   - `npm test` si DB local esta disponible; si no, documenta por que.
4. Actualiza docs de deploy si estan desfasadas:
   - aclarar que en Plesk deben existir variables `DB_PASSWORD`, `JWT_SECRET`, `COOKIE_SECRET`.
   - aclarar que Git deploy no debe usar `nodenv`.
   - aclarar flujo correcto: pull -> npm install/ci -> build -> db:migrate -> restart.
   - aclarar si document root recomendado es `/httpdocs/dist` o app Node con `/httpdocs` + `server.js`, segun estado real.
5. Si tienes acceso a produccion o el usuario pega logs:
   - diagnostica errores 500/502.
   - no pegues secretos en docs.
6. No ejecutes comandos remotos destructivos.

Criterios de aceptacion:
- Hay checklist exacto para actualizar produccion.
- Variables requeridas quedan documentadas.
- El error `nodenv: command not found` queda documentado como cosa a eliminar.
- Smoke de produccion queda documentado como verde o pendiente.

Smoke esperado:
- `https://crudomov.es`
- `https://crudomov.es/api/v1/health`
- `https://crudomov.es/api/v1/site/config`
- `https://crudomov.es/api/v1/events?limit=3`
- assets de `/img/...`

Actualiza estado vivo V2:
- Fase 1 `REVIEW_READY` si build/docs/smoke estan listos.
- `BLOCKED` si falta acceso Plesk o logs.
```

---

## 4. Fase 2 - Intake del nuevo diseño Claude Design

Objetivo: convertir el ZIP/carpeta de Claude Design en una especificacion
tecnica concreta antes de tocar frontend.

### Prompt para Opus

```text
Usa el Prompt base fijo V2.

Implementa SOLO la Fase 2: intake del nuevo diseño Claude Design.

Objetivo:
Analizar el nuevo diseño mobile-first de `C:\Users\Vincenzo\Downloads\Crudo by Piscolabis` y convertirlo en un plan de implementacion frontend.

Antes de editar:
1. Localiza la carpeta/ZIP del diseño.
2. Inspecciona su estructura:
   - HTML/CSS/JS
   - React/JSX si existe
   - assets
   - tokens
   - screenshots o exports
3. Revisa tambien si ya existe copia en:
   - `docs/Crudo by Piscolabis.zip`
   - `docs/crudo_redesign_extract`
   - `docs/V1/Crudo Rediseño.html`

Entregables:
1. Crear o actualizar una seccion en `docs/V2Tecnico.md` con:
   - rutas del nuevo diseño
   - componentes detectados
   - tokens de color/tipo/espaciado
   - patrones mobile-first
   - assets necesarios
   - diferencias con V1 actual
   - decisiones de que se reutiliza y que se reemplaza
2. No copiar codigo del diseño sin entenderlo.
3. No implementar UI todavia salvo ajustes documentales.

Criterios de aceptacion:
- Hay mapa claro del diseño V2.
- Quedan listadas las pantallas a implementar.
- Queda claro que assets faltan o sobran.
- Queda claro si el diseño contradice reglas V1/V2.

Verificacion:
- `git status --short`
- No hace falta build si solo se documenta.
```

---

## 5. Fase 3 - Arquitectura frontend V2 y code splitting

Objetivo: preparar la app para V2 sin rediseñar todo aun. Reducir bundle y
crear base para rutas lazy/mobile-first.

### Prompt para Opus

```text
Usa el Prompt base fijo V2.

Implementa SOLO la Fase 3: arquitectura frontend V2 y code splitting.

Objetivo:
Preparar el frontend para el rediseño V2 con lazy loading por rutas, chunks separados y una estructura limpia para mobile-first.

Tareas:
1. Revisa:
   - `src/routes.jsx`
   - `src/App.jsx`
   - `src/components/layout/AppShell.jsx`
   - `src/components/layout/Header.jsx`
   - `src/components/layout/StickyCTA.jsx`
   - `src/styles/tokens.css`
   - `vite.config.mjs`
2. Implementa lazy loading de rutas con `React.lazy` + `Suspense`.
3. Separar en chunks al menos:
   - home/public core
   - producto detalle
   - eventos detalle
   - legal
   - merch
   - admin futuro
4. Crear loading states sobrios y mobile-first.
5. Mantener rutas existentes y aliases:
   - `/seleccion`
   - `/catalogo`
   - `/eventos`
   - `/tablas`
   - `/merch`
   - `/contacto`
6. No cambiar diseño visual profundo en esta fase.
7. Medir bundle antes/despues con `npm run build`.

Criterios de aceptacion:
- Build pasa.
- No se rompe navegacion.
- Bundle inicial baja o queda preparada la separacion.
- No desaparecen rutas existentes.

Verificacion obligatoria:
- `npm run lint`
- `npm run test:client`
- `npm run build`
- revisar warning de chunks >500KB y documentar resultado.
```

---

## 6. Fase 4 - Pipeline de imagenes y curacion de assets

Objetivo: usar las fotos existentes para que V2 no parezca demo, sin servir
originales pesados.

### Prompt para Opus

```text
Usa el Prompt base fijo V2.

Implementa SOLO la Fase 4: pipeline de imagenes y curacion de assets.

Objetivo:
Curar fotos existentes de `docs/V1/Photos` y generar assets optimizados para V2: WebP, thumbnails, versiones responsive y mapping por seccion.

Contexto:
No bloquear V2 por no tener fotos perfectas de producto. Usar fallback editorial con fotos actuales.

Tareas:
1. Revisar fotos fuente:
   - `docs/V1/Photos/Fotos Crudo Morning/Chosen ones`
   - `docs/V1/Photos/Fotos Crudo Noche`
   - `docs/V1/Photos/WhatsApp Image 2026-06-03 at 4.11.56 PM.jpeg`
   - `public/img`
2. Seleccionar assets para:
   - home hero desktop/mobile
   - seleccion del mes
   - tablas/cajas/fromelier
   - eventos
   - contacto/local
   - merch placeholder
   - fallback producto queso
   - fallback maridaje/vino
3. Crear pipeline con `sharp` o script equivalente.
   - Si agregas dependencia, justificar peso y uso.
   - Generar WebP.
   - Generar tamaños: 480, 768, 1200, 1800 cuando aplique.
   - Generar card 1:1 donde aplique.
   - Generar poster/evento 3:4 donde aplique.
4. Guardar outputs en `public/img/v2/...` o estructura equivalente.
5. Crear manifest simple de assets V2:
   - puede ser `src/lib/v2Assets.js` o JSON si encaja.
6. No borrar assets V1 sin confirmacion.

Criterios de aceptacion:
- No se sirven originales gigantes directamente.
- Hay assets suficientes para implementar frontend V2.
- Cada imagen publica tiene alt o uso decorativo claro.
- El pipeline se puede repetir.

Verificacion:
- `npm run build`
- revisar pesos de outputs.
- si hay tests de helpers, ejecutarlos.
```

---

## 7. Fase 5 - Frontend publico V2 mobile-first

Objetivo: implementar el nuevo diseño publico con la base Claude Design,
contenido editorial y flujos reales.

### Prompt para Opus

```text
Usa el Prompt base fijo V2.

Implementa SOLO la Fase 5: frontend publico V2 mobile-first.

Objetivo:
Rehacer la experiencia publica con el nuevo diseño Claude Design/Piscolabis, mobile-first, usando assets optimizados y manteniendo reglas de negocio.

Antes de editar:
1. Relee el resultado de Fase 2.
2. Revisa componentes actuales:
   - HomePage, CatalogPage, EventsPage, EventDetailPage, TablasPage, MerchPage, ContactPage
   - Header, Footer, StickyCTA
   - ProductCard, EventCard, TablaMaridajeSelector
3. Revisa assets V2 generados en Fase 4.

Pantallas obligatorias:
1. Home:
   - hero mobile-first
   - propuesta clara de CRUDO
   - CTA a Eventos / Seleccion del mes / WhatsApp segun diseño
   - ubicacion/hora/contacto
2. Seleccion del mes:
   - sustituye mentalmente "catalogo" por seleccion editorial
   - no parecer ecommerce pesado
   - quesos destacados con fotos fallback
   - CTA WhatsApp o Mi Tabla segun producto no alcoholico
3. Tablas/Cajas:
   - tabla 3/6/8
   - seleccion de Annet/fromelier
   - caja para pickup
   - maridajes con vino por WhatsApp
4. Eventos:
   - cards con cartel/foto cuando exista
   - fallback elegante si no hay cartel
   - copy de confirmacion por WhatsApp y link de pago manual
5. Merch:
   - si no hay URL/productos reales, placeholder bonito y honesto
   - no simular tienda si no existe
6. Contacto:
   - WhatsApp, Maps, email, Instagram
   - formulario si se mantiene
7. Legal/cookies:
   - no romper accesos existentes.

Reglas:
- No venta online de alcohol.
- No pago online integrado.
- Vinos/maridajes siempre WhatsApp.
- Textos visibles en español.
- Mobile-first real: probar 390x844 y desktop.
- No usar landing generica tipo SaaS.

Criterios de aceptacion:
- La web no parece demo.
- Navegacion simplificada funciona.
- Home y secciones principales tienen imagenes reales.
- Las rutas antiguas importantes redirigen o siguen funcionando.
- Vino nunca entra en Mi Tabla.
- Merch no promete compra si no hay merch real.

Verificacion obligatoria:
- `npm run lint`
- `npm run test:client`
- `npm run build`
- captura/smoke visual local en mobile y desktop si hay browser disponible.
```

---

## 8. Fase 6 - Modelo editorial V2: DB/API sin stock real

Objetivo: ajustar mentalidad y, solo si hace falta, datos/API para que no parezca
inventario real.

### Prompt para Opus

```text
Usa el Prompt base fijo V2.

Implementa SOLO la Fase 6: modelo editorial V2 sin stock real.

Objetivo:
Simplificar la base de datos y UI alrededor de disponibilidad editorial. La DB sigue existiendo, pero no debe obligar a Annet a llevar inventario exacto.

Antes de editar:
1. Revisa migraciones:
   - `db/migrations/001_create_core_schema.sql`
   - migraciones posteriores
2. Revisa repositorios/services de producto:
   - `server/repositories/product.repository.js`
   - `server/services/catalog.service.js`
   - `server/services/admin-product.service.js`
   - validators admin products
3. Revisa UI:
   - `StockBadge`
   - `ProductCard`
   - admin placeholder

Decision preferida:
- Reutilizar campos existentes si bastan:
  - `stock_status=IN_STOCK/LOW/OUT` como disponibilidad editorial.
  - `is_active=false` como oculto/no publicado.
- No crear inventario por unidades.
- No crear ERP.

Tareas:
1. Renombrar copy visible:
   - "stock" -> "disponibilidad"
   - "agotado" OK
   - "pocas unidades" OK si Annet lo quiere
   - "oculto/no publicado" via `is_active`
2. Si falta un estado editorial claro, proponer migracion minima.
3. Ajustar docs/API/admin para que owner entienda que no es inventario real.
4. Mantener tests de alcohol guard.
5. Mantener precios desde DB para Mi Tabla.

Criterios de aceptacion:
- El sistema no pide unidades exactas.
- Productos se pueden mostrar, marcar pocas unidades, agotado u ocultar.
- No se rompe API publica.
- No se rompe Mi Tabla.

Verificacion:
- `npm run lint`
- `npm test`
- `npm run build`
```

---

## 9. Fase 7 - Admin movil V2

Objetivo: construir el panel que falta para que Annet gestione la web desde
movil.

### Prompt para Opus

```text
Usa el Prompt base fijo V2.

Implementa SOLO la Fase 7: admin movil V2.

Objetivo:
Construir un admin mobile-first sobre los endpoints existentes `/api/v1/admin/**`, simple y usable en menos de 5 minutos al dia.

Contexto:
Backend admin ya existe. `/admin` ahora es placeholder.

Antes de editar:
1. Revisa:
   - `server/routes/admin-*.routes.js`
   - `server/controllers/admin-*.controller.js`
   - `server/services/admin-*.service.js`
   - validators admin
   - tests admin existentes
2. Revisa `docs/owner-admin-guide.md`.
3. Revisa reglas de disponibilidad editorial de Fase 6.

Pantallas admin minimas:
1. Login:
   - email/password
   - access/refresh token
   - errores claros
2. Dashboard:
   - pickups hoy/nuevos
   - eventos proximos
   - inquiries nuevas
   - alertas disponibilidad
   - quick actions
3. Seleccion del mes/productos:
   - listar
   - crear/editar basico
   - subir imagen
   - marcar disponible/pocas unidades/agotado/oculto
   - wine guard visible: WINE siempre alcohol
4. Eventos:
   - listar/crear/editar
   - cartel/foto
   - reservas
5. Pedidos/takeaway:
   - listar
   - cambiar estado
6. Consultas/newsletter:
   - ver y marcar atendido
7. Ajustes:
   - pickup paused
   - capacidad diaria
   - mensaje pickup

Reglas UX:
- Mobile-first de verdad.
- Botones grandes.
- No tablas densas en movil si no son usables.
- No pedir campos innecesarios.
- No meter graficas complejas.

Criterios de aceptacion:
- `/admin` deja de ser placeholder.
- Login funciona con backend real.
- Owner puede hacer acciones criticas desde movil.
- No se exponen tokens en localStorage si se decide alternativa mas segura; si se usa localStorage, documentar riesgo.
- Rutas admin protegidas.

Verificacion:
- `npm run lint`
- `npm run test:client`
- `npm test` si DB disponible
- `npm run build`
- smoke manual admin local con seed si posible.
```

---

## 10. Fase 8 - SEO, legal, cookies y analytics

Objetivo: preparar indexacion, previews sociales y cumplimiento basico.

### Prompt para Opus

```text
Usa el Prompt base fijo V2.

Implementa SOLO la Fase 8: SEO, legal, cookies y analytics.

Objetivo:
Completar SEO basico y cumplimiento sin esperar a todo el contenido final de Annet.

Tareas SEO:
1. `robots.txt`
2. `sitemap.xml`
3. canonical URLs
4. title/description por ruta
5. Open Graph/Twitter cards por pagina
6. JSON-LD:
   - LocalBusiness/Store para CRUDO
   - Event para eventos
   - Product solo donde tenga sentido y sin ecommerce engañoso
7. No comunicar CRUDO como wine bar.

Tareas legal/cookies:
1. Revisar paginas:
   - Aviso legal
   - Privacidad
   - Cookies
2. Incluir datos confirmados:
   - CRUDO QUESOS S.L.U
   - CIF B-19953694
   - Calle Jose Ortega y Gasset 81, 28006 Madrid
3. Banner cookies:
   - aceptar/rechazar/configurar
   - no cargar analytics/marketing antes de consentimiento
4. Aviso +18 y no venta online de alcohol.

Analytics:
1. GA4 solo si `VITE_GA_ID` existe.
2. Meta Pixel solo si existe decision owner.
3. Eventos consent-aware:
   - whatsapp_click
   - wine_pairing_whatsapp_click
   - pickup_request
   - event_inquiry
   - generate_lead
4. No enviar PII.

Criterios de aceptacion:
- Home y rutas principales tienen metadata.
- Sitemap/robots existen.
- JSON-LD valido en estructura.
- Cookies no esenciales no cargan antes de consentimiento.
- Legal queda listo para revision owner, no marcado como validado legalmente si no lo esta.

Verificacion:
- `npm run lint`
- `npm run test:client`
- `npm run build`
- smoke de `/robots.txt` y `/sitemap.xml` si aplica.
```

---

## 11. Fase 9 - E2E, accesibilidad, performance y QA

Objetivo: asegurar que lo importante funciona antes de launch.

### Prompt para Opus

```text
Usa el Prompt base fijo V2.

Implementa SOLO la Fase 9: E2E, accesibilidad, performance y QA.

Objetivo:
Crear suite de verificacion para los flujos criticos de CRUDO V2.

Tareas:
1. Configurar Playwright si no existe.
2. Tests E2E minimos:
   - home carga
   - seleccion del mes carga
   - producto no alcohol -> Mi Tabla
   - pickup -> confirmacion
   - intento alcohol/variante vino no entra en Mi Tabla
   - tabla con maridaje -> WhatsApp
   - eventos -> reserva
   - contacto/newsletter
   - cookie banner aceptar/rechazar/configurar
   - rutas legales
   - admin login si Fase 7 esta lista
3. A11y basica:
   - headings
   - labels
   - focus visible
   - tap targets 44px
   - contraste razonable
4. Performance:
   - comprobar bundle
   - comprobar imagenes
   - Lighthouse mobile si disponible
5. QA manual:
   - Chrome
   - iPhone Safari si se puede
   - Instagram in-app browser si se puede

Criterios de aceptacion:
- Suite E2E cubre flujos de negocio.
- Alcohol guard cubierto frontend y backend.
- No hay solapes obvios mobile.
- Bundle e imagenes razonables.

Verificacion:
- `npm run lint`
- `npm test`
- `npm run build`
- `npm run test:e2e` o script equivalente creado.
```

---

## 12. Fase 10 - Limpieza de codigo y repositorio

Objetivo: reducir ruido del repo y codigo muerto, pero solo con cambios
demostrables y reversibles. Esta fase no debe convertirse en un refactor grande.

### Prompt para Opus

```text
Usa el Prompt base fijo V2.

Implementa SOLO la Fase 10: limpieza de codigo y repositorio.

Objetivo:
Limpiar el repositorio despues de tener V2 funcional y verificada, eliminando solo codigo, assets, dependencias, scripts o documentos claramente no usados. No rompas el codigo, no borres contexto util de V1/V2 y no hagas refactors esteticos grandes.

Regla principal:
Si no puedes demostrar que algo no se usa, NO lo borres. Anotalo como "candidato a revisar" en un informe.

Antes de editar:
1. Ejecuta auditoria de referencias con herramientas seguras:
   - `git status --short`
   - `rg --files`
   - `rg "nombre-del-archivo-o-export"` antes de borrar cada candidato
   - revisar imports/exports en frontend y backend
   - revisar `package.json` scripts y dependencias
2. Revisa especialmente:
   - `src`
   - `server`
   - `public/img`
   - `docs`
   - `tests`
   - `db`
   - `infra`
   - raiz del repo
3. No borres:
   - `docs/AGENTS_Javi.md`
   - `docs/V1/V1Tecnico.md`
   - `docs/V2Tecnico.md`
   - `docs/V2-recordatorio.md`
   - migraciones de DB ya aplicadas
   - archivos legales
   - fotos fuente de `docs/V1/Photos` salvo confirmacion humana
   - assets de marca/logo aunque parezcan duplicados, salvo que haya un reemplazo claro y aprobado
   - archivos modificados por el usuario en `git status` si no son claramente parte de esta fase

Tareas:
1. Crear o actualizar `docs/V2-cleanup-report.md` con:
   - que se reviso
   - que se borro y por que
   - evidencia de no uso
   - candidatos NO borrados por duda
   - verificaciones ejecutadas
2. Eliminar imports, componentes, helpers o paginas que ya no tengan ruta ni referencia.
3. Eliminar assets generados/duplicados solo si:
   - no estan referenciados en codigo, CSS, markdown publico, seed o docs de deploy
   - no son originales fuente importantes
4. Revisar dependencias:
   - quitar paquetes no usados solo si hay evidencia clara
   - no quitar dependencias usadas por scripts de build, tests, sharp/image pipeline, Playwright o deploy
5. Revisar scripts obsoletos:
   - eliminar o documentar scripts que ya no se puedan ejecutar
   - no romper comandos del README/deploy
6. Revisar docs:
   - quitar docs temporales solo si estan reemplazados por V2Tecnico/runbook y no contienen decisiones utiles
   - si un doc viejo tiene valor historico, mantenerlo o moverlo a una seccion clara en vez de borrarlo
7. Hacer cambios pequenos y verificables. No mezclar con features nuevas.

Criterios de aceptacion:
- Menos ruido en repo sin perder contexto critico.
- No se elimina nada usado por build, runtime, tests, deploy o docs clave.
- Hay informe de limpieza.
- Los candidatos dudosos quedan listados, no borrados.
- No hay cambios funcionales no intencionados.

Verificacion obligatoria:
- `npm run lint`
- `npm run test:client`
- `npm test` si DB local esta disponible; si no, documentar bloqueo
- `npm run build`
- `git status --short`
- smoke local rapido de rutas principales si el servidor local esta disponible:
  - `/`
  - `/seleccion`
  - `/eventos`
  - `/tablas`
  - `/merch`
  - `/contacto`
  - `/admin` si Fase 7 esta lista

Actualiza estado vivo V2:
- Fase 10 `REVIEW_READY` si limpieza + verificaciones pasan.
- `BLOCKED` solo si hay demasiada incertidumbre o faltan permisos para verificar.
```

---

## 13. Fase 11 - Contenido final, demo data y launch readiness

Objetivo: dejar V2 lista para desplegar o para revision owner, sin placeholders
engañosos.

### Prompt para Opus

```text
Usa el Prompt base fijo V2.

Implementa SOLO la Fase 11: contenido final, demo data y launch readiness.

Objetivo:
Preparar CRUDO V2 para despliegue/revision final: contenido real donde exista, fallback honesto donde falte, deploy checklist y handoff.

Tareas contenido:
1. Revisar `docs/content-checklist.md` y actualizarlo.
2. Cargar o preparar demo data segura:
   - seleccion del mes
   - tablas/cajas/fromelier
   - eventos
   - merch placeholder
3. No ejecutar seed dev en produccion.
4. Documentar que falta de Annet:
   - URL merch
   - precios tablas/cajas
   - quesos reales
   - eventos futuros
   - GA4
   - Brevo
   - legal final
   - fotos producto 1:1

Tareas launch:
1. Revisar docs:
   - `docs/runbook.md`
   - `infra/plesk/README.md`
   - `infra/scripts/deploy-checklist.md`
   - `docs/owner-admin-guide.md`
2. Crear checklist final V2:
   - build
   - migraciones
   - env vars
   - SSL
   - smoke
   - backups
   - rollback
3. Smoke local y, si hay acceso, produccion.

Criterios de aceptacion:
- No quedan placeholders invisibles o engañosos.
- Lo pendiente de Annet esta documentado.
- Deploy esta documentado paso a paso.
- Owner puede revisar la web sin explicaciones tecnicas.

Verificacion:
- `npm run lint`
- `npm test`
- `npm run build`
- `npm run test:e2e` si existe
- smoke local/produccion si hay acceso.
```

---

## 14. Definition of Done V2

Una fase queda `REVIEW_READY` solo si:

- Cumple su alcance sin adelantar fases grandes.
- Respeta no alcohol online/no pago online/no wine bar.
- Build pasa.
- Tests relevantes pasan o bloqueo queda documentado.
- Mobile-first revisado.
- No hay secretos en repo.
- Docs necesarias actualizadas.
- Estado vivo de `docs/V2Tecnico.md` actualizado.
- Si toca frontend visual, hay smoke/captura o verificacion visual razonable.
- Si toca backend/API, hay tests o smoke.

V2 completa queda lista para despliegue solo si:

- `crudomov.es` responde con ultima build.
- `/api/v1/health` responde correctamente.
- Home, Seleccion, Eventos, Tablas/Cajas, Merch, Contacto y legales cargan.
- Mi Tabla no acepta alcohol.
- Vinos/maridajes van por WhatsApp.
- Admin movil funciona o queda explicitamente fuera del launch.
- Imagenes optimizadas.
- SEO basico listo.
- Cookies/analytics consent-aware.
- E2E criticos pasan.
- Limpieza de codigo/repositorio hecha o candidatos pendientes documentados.
- Pendientes de Annet estan documentados y no bloquean si son contenido opcional.

---

## 15. Riesgos que Opus debe vigilar

- Rehacer todo de golpe y romper V1 funcional.
- Copiar el diseño Claude Design sin adaptarlo al sistema real.
- Meter inventario real cuando Annet no lo quiere.
- Hacer admin demasiado complejo.
- Reintroducir venta online de alcohol.
- Meter pago online por el texto de "link de pago".
- Servir fotos originales pesadas.
- Dejar `dist/` viejo en Plesk.
- Usar `.env` local en produccion.
- Dejar docs y codigo desincronizados.
- Borrar assets, docs historicos o migraciones utiles por una limpieza demasiado agresiva.
- Usar stock como si fuera ERP.
- Hacer SEO como restaurante/wine bar en vez de tienda de quesos.

---

## 16. Orden recomendado

1. Fase 0 - Preparacion V2 y auditoria inicial.
2. Fase 1 - Produccion/Plesk y deploy reproducible.
3. Fase 2 - Intake del nuevo diseño Claude Design.
4. Fase 3 - Arquitectura frontend V2 y code splitting.
5. Fase 4 - Pipeline de imagenes.
6. Fase 5 - Frontend publico V2.
7. Fase 6 - Modelo editorial DB/API.
8. Fase 7 - Admin movil.
9. Fase 8 - SEO/legal/cookies/analytics.
10. Fase 9 - E2E/QA/performance.
11. Fase 10 - Limpieza de codigo y repositorio.
12. Fase 11 - Contenido final y launch readiness.

Si hay prisa comercial:

- Primero Fase 1 si produccion no esta estable.
- Despues Fase 2 + Fase 4 para aterrizar diseño y fotos.
- Despues Fase 5 para que la web se vea V2.
- Admin movil puede ir despues si Annet acepta que cambios de contenido sigan
  siendo asistidos temporalmente.

---

## 17. Anexo - Spec de diseño V2 (intake Fase 2)

Resultado de la Fase 2: analisis del rediseño Claude Design/Piscolabis. Fuentes
inspeccionadas en el repo (la ruta Windows del compañero no es accesible aqui):

- `docs/Crudo by Piscolabis.zip` (44MB, proyecto Claude Design completo)
- `docs/crudo_redesign_extract/crudo-redesign.jsx` (rediseño VIGENTE, tema claro)
- `docs/crudo_redesign_extract/src/*.jsx` (exploracion ANTERIOR Phase 7, tema
  oscuro forest + Cormorant — DESCARTADA, no usar)
- `docs/V1/Crudo Rediseño.html` (CSS/tokens del sistema vigente)

IMPORTANTE: dentro del extract conviven dos diseños. El valido es
`crudo-redesign.jsx` (Cinzel + Barlow + bone cream). Los archivos `src/tokens.jsx`,
`src/shared.jsx`, `src/photo-brief.jsx` son de una fase previa con tema OSCURO y
Cormorant Garamond: NO son la referencia V2 y no deben implementarse.

### 17.1 Tokens (sistema vigente, ya en `src/styles/tokens.css`)

| Token diseño | HEX | Uso | Token repo actual |
|---|---|---|---|
| bone | #F6F1E4 | fondo pagina | --color-bg-primary |
| bone-soft | #EFE8D6 | fondo seccion alt | (añadir si hace falta) |
| blanco | #FFFFFF | cards | --color-bg-secondary |
| coral | #EE769C | CTA primario | --color-accent |
| coral-hover | #E55D88 | hover CTA | --color-accent-hover |
| coral-soft | #F6B6C8 | fondos suaves | --color-accent-soft |
| vino | #6C4050 | texto sec + bordes | --color-text-secondary / --color-vine |
| vino-line | rgba(108,64,80,0.18) | bordes card | --color-border |
| crema | #FEDB9A | highlights | --color-gold-soft |
| terracota | #A71E17 | eyebrows, RetroSign | --color-gold |
| petrol | #447A96 | info/badges | --color-petrol |
| tinta | #1A1F14 | texto principal | --color-text-primary |

Conclusion tokens: la paleta del diseño YA coincide con la del repo (aplicada en
Fase 10.5 + correccion tipografica). Solo faltaria, si se quiere fidelidad total,
añadir `--color-bg-secondary-soft: #EFE8D6` para fondos de seccion alternos.

### 17.2 Tipografia (ya aplicada en repo)

- **Cinzel** 700, uppercase, letter-spacing ~0.01em → titulares (.display / font-display)
- **Barlow** 300-600 → cuerpo y UI (font-body)
- **JetBrains Mono** → precios e IDs (.mono / font-mono)
- **Bagel Fat One** → SOLO usada en el mockup como proxy CSS del wordmark
  (`WordmarkInline`). DECISION: en produccion NO se usa; el logo es el PNG real
  `crudo-logo.png` (ya en Header). Bagel Fat One no se carga.

### 17.3 Componentes del diseño → mapeo a repo

| Componente diseño | Equivalente repo | Estado |
|---|---|---|
| Wordmark (PNG) | Header `<img crudo-logo.png>` | HECHO (Fase feedback V2) |
| WordmarkInline (Bagel) | — | DESCARTADO (se usa PNG) |
| EyebrowPill (terracota) | RetroSign / eyebrow | parcial; revisar estilo pill |
| EyebrowLine | clase .eyebrow | existe |
| Photo (ratio + src) | LifestylePhoto / img | existe |
| PriceMono | font-mono spans | existe |
| MobileNav (≡) | Header mobile drawer | existe (revisar mobile-first) |
| StickyMobileCTA | StickyCTA | existe; alinear a diseño (WhatsApp + Mi Tabla) |
| CheeseCard / CheeseCardLg | ProductCard | existe; alinear estilo card+tag |
| EventCard (poster 3:4 + date-box) | EventCard | HECHO (Fase feedback V2) |
| TablaSizeOption / CompactRadios | TablaMaridajeSelector | HECHO (fromelier + caja) |
| Field (form) | Input/Select/Textarea | existe |
| Footer | Footer | existe; alinear |

### 17.4 Pantallas a implementar en Fase 5 (mobile-first)

1. **Home** — hero bone con EyebrowPill + H1 Cinzel a 3 lineas + 2 CTA (Ver
   selección / Eventos) + foto; bloque Proximos eventos (2 cards); Quesos del mes
   (grid 2col); chips de categorias; bloque Visitanos con horario + mapa; sticky
   CTA. Desktop: hero 2 columnas (texto 1.05fr / foto 4:5).
2. **Selección del mes** (ex Catálogo) — eyebrow + H1 + intro fromelier; filtros
   chips scroll-x; grid 2col CheeseCard; CTA "te lo elegimos" (card crema) →
   WhatsApp. (HECHO copy en CatalogPage; falta estilo card/grid del diseño.)
3. **Eventos** — hero + agenda de EventCards (poster cuando exista, date-box
   fallback); bloque Privatizaciones (fondo coral-soft) con mailto + WhatsApp +
   copy confirmacion/pago. (HECHO base; alinear a estilo diseño.)
4. **Tablas/Cajas** — tamaño 3/6/8 + "O déjate sorprender" (Selección de Annet +
   Caja para llevar) por WhatsApp. (HECHO en TablaMaridajeSelector.)
5. **Merch** — placeholder honesto + CTA Instagram. (HECHO en MerchPage.)
6. **Contacto** — mapa hero + quick actions (WhatsApp/email) + card horario+
   direccion + formulario. (Existe ContactPage; alinear a estilo diseño.)

### 17.5 Assets necesarios vs disponibles

- Hero home/eventos: usar fotos `docs/V1/Photos` (Chosen ones / Noche) → pipeline
  Fase 4 (WebP + ratios 16:10, 4:5, 16:9).
- Cards queso 1:1: NO hay foto por queso; usar fallback editorial (Fase 4).
- Poster evento 3:4: existe `wine-tasting-telperion.jpg`; resto por evento, pendiente Annet.
- Logo: `public/img/brand/crudo-logo.png` ya presente.
- Mapa contacto: el diseño usa un SVG estilizado; en repo se usa enlace Google Maps
  real → mantener enlace real, el SVG es decorativo opcional.

### 17.6 Diferencias diseño vs V1 actual

- El mockup usa nav de 3 items (Eventos/Catálogo/Contacto) SIN Merch. El repo ya
  va por delante: 4 items con Merch + "Selección del mes". DECISION: mantener el
  nav del repo (4 items), es feedback posterior de Annet.
- El mockup llama la seccion "Catálogo"; el repo ya usa "Selección del mes". Mantener repo.
- El mockup tiene datos placeholder (precios, +34 6XX, hola@crudoquesos.es,
  @crudoquesos). Los datos reales del repo (crudomov) MANDAN.
- El mockup muestra "Añadir +" en CheeseCardLg: OJO regla — solo productos NO
  alcoholicos van a Mi Tabla; vinos siempre WhatsApp. El boton "Añadir" no debe
  aparecer en productos alcohol.

### 17.7 Conflictos con reglas V1/V2 a vigilar en Fase 5

- No poner "Añadir a Mi Tabla" en vinos/alcohol (mockup no lo distingue).
- No comunicar CRUDO como wine bar; el diseño ya lo trata como tienda de quesos (OK).
- "link de pago" en eventos = pago manual fuera de la web, no integrar pasarela.
- Instagram/WhatsApp/email del mockup son placeholder: usar datos reales del repo.

### 17.8 Decision reutilizar vs reemplazar

- **Reutilizar tal cual**: paleta, tipografia, EventCard, TablaMaridajeSelector,
  MerchPage, Button (incl. variante whatsapp), tokens.css.
- **Alinear estilo (Fase 5)**: ProductCard (card+tag+precio mono+grid 2col),
  Home (hero, secciones, sticky CTA), ContactPage (quick actions + card horario),
  Footer, eyebrow pill terracota.
- **Reemplazar/añadir**: fondos de seccion alternos (#EFE8D6), filtros chip
  scroll-x en Selección del mes, bloque "te lo elegimos" en Selección.
- **Descartar**: tema oscuro Phase 7, Cormorant Garamond, Bagel Fat One,
  WordmarkInline CSS, datos placeholder del mockup.
